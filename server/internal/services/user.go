package services

import (
	"errors"
	"fmt"
	"io"
	"kanban-api/internal/config"
	"kanban-api/internal/dto"
	"kanban-api/internal/utils"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserServices struct {
	cfg *config.Config
	db  *gorm.DB
}

func NewUserServices(cfg *config.Config, db *gorm.DB) *UserServices {
	return &UserServices{
		cfg: cfg,
		db:  db,
	}
}

func (s *UserServices) GetAllUsers() ([]dto.User, int, error) {
	var users []dto.User
	tx := s.db.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	result := tx.Find(&users)
	if result.Error != nil {
		tx.Rollback()
		return nil, http.StatusNotFound, fmt.Errorf("failed to get users: %v", result.Error)
	}

	if err := tx.Commit().Error; err != nil {
		return nil, http.StatusInternalServerError, fmt.Errorf("could not commit transaction: %w", err)
	}

	return users, http.StatusOK, nil
}

func (s *UserServices) GetUserByID(userID string) (dto.User, int, error) {
	var user dto.User

	err := s.db.Where("id = ?", userID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user, http.StatusNotFound, fmt.Errorf("could not find user with id: %s", userID)
		}
		return user, http.StatusInternalServerError, fmt.Errorf("error retrieving user: %v", err)
	}

	return user, http.StatusOK, nil
}

func (s *UserServices) UploadAvatar(w http.ResponseWriter, r *http.Request, userID string) (string, int, error) {
	file, header, err := r.FormFile("avatar")
	if err != nil {
		return "", http.StatusBadRequest, fmt.Errorf("invalid file upload")
	}
	defer file.Close()

	if err := utils.EnsureDirExists("uploads"); err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to ensure uploads directory exists: %w", err)
	}
	if err := utils.EnsureDirExists(filepath.Join("uploads", "avatars")); err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to ensure avatars directory exists: %w", err)
	}

	fileExt := filepath.Ext(header.Filename)
	if fileExt == "" {
		fileExt = ".jpg"
	}

	newId := uuid.New().String()
	filePath := filepath.Join("uploads", "avatars", userID+"-"+newId+fileExt)

	outFile, err := os.Create(filePath)
	if err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("unable to create the file for writing")
	}
	defer outFile.Close()

	if _, err := file.Seek(0, 0); err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("unable to seek file: %v", err)
	}
	if _, err := io.Copy(outFile, file); err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("unable to save file: %v", err)
	}

	return filePath, http.StatusOK, nil
}

func (s *UserServices) UpdatePassword(userID, OldPassword, NewPassword string) (map[string]string, int, error) {
	var user dto.User

	err := s.db.Where("id = ?", userID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return map[string]string{}, http.StatusNotFound, fmt.Errorf("could not find user with id: %s", userID)
		}
		return map[string]string{}, http.StatusInternalServerError, fmt.Errorf("error retrieving user: %v", err)
	}

	if user.Password != "" {
		if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(NewPassword)); err == nil {
			return map[string]string{}, http.StatusBadRequest, fmt.Errorf("new password cannot be the same as the current password")
		}

		if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(OldPassword)); err != nil {
			return map[string]string{}, http.StatusBadRequest, fmt.Errorf("incorrect old password")
		}
	}

	hashedPassword, err := utils.HashPassword(NewPassword)
	if err != nil {
		return map[string]string{}, http.StatusInternalServerError, fmt.Errorf("failed to hash password")
	}

	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	result := tx.Model(&user).Updates(map[string]interface{}{
		"password":     hashedPassword,
		"has_password": true,
	})
	if result.Error != nil {
		tx.Rollback()
		return map[string]string{}, http.StatusInternalServerError, result.Error
	}

	if err := tx.Commit().Error; err != nil {
		return map[string]string{}, http.StatusInternalServerError, fmt.Errorf("failed to commit transaction: %v", err)
	}

	return map[string]string{"message": "Password successfully updated"}, http.StatusOK, nil
}

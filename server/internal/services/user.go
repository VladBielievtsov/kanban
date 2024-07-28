package services

import (
	"errors"
	"fmt"
	"kanban-api/db"
	"kanban-api/internal/config"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserServices struct {
	cfg *config.Config
}

func NewUserServices(cfg *config.Config) *UserServices {
	return &UserServices{
		cfg: cfg,
	}
}

func (s *UserServices) RegisterByEmail(id uuid.UUID, email, avatarUrl, firstName, lastName, password string) (types.User, error) {
	var count int64
	if err := db.DB.Model(&types.User{}).Where("LOWER(email) = LOWER(?)", email).Count(&count).Error; err != nil {
		return types.User{}, fmt.Errorf("error checking existing user: %w", err)
	}

	if count > 0 {
		return types.User{}, fmt.Errorf("email already in use")
	}

	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return types.User{}, fmt.Errorf("failed to hash password")
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		return types.User{}, fmt.Errorf("could not begin transaction: %w", tx.Error)
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	user := types.User{
		ID:        &id,
		AvatarURL: avatarUrl,
		FirstName: strings.TrimSpace(firstName),
		LastName:  strings.TrimSpace(lastName),
		Password:  string(hashedPassword),
		Email:     strings.TrimSpace(strings.ToLower(email)),
	}

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return types.User{}, fmt.Errorf("could not create user: %w", err)
	}

	if err := tx.Commit().Error; err != nil {
		return types.User{}, fmt.Errorf("could not commit transaction: %w", err)
	}

	return user, nil
}

func (s *UserServices) LoginByEmail(email, password string) (types.LoginResponse, string, error) {
	var user types.User

	err := db.DB.Where("LOWER(email) = LOWER(?)", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return types.LoginResponse{}, "", fmt.Errorf("could not find user with email: %s", email)
		}
		return types.LoginResponse{}, "", fmt.Errorf("error retrieving user: %v", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return types.LoginResponse{}, "", fmt.Errorf("invalid password")
	}

	tokenByte := jwt.New(jwt.SigningMethodHS256)
	now := time.Now().UTC()
	claims := tokenByte.Claims.(jwt.MapClaims)

	claims["sub"] = user.ID
	claims["exp"] = now.Add(120 * time.Minute).Unix()
	claims["iat"] = now.Unix()
	claims["nbf"] = now.Unix()

	tokenString, err := tokenByte.SignedString([]byte(s.cfg.Application.JWTSecret))
	if err != nil {
		return types.LoginResponse{}, "", fmt.Errorf("generating JWT Token failed")
	}

	return types.LoginResponse{
		User: user,
		// Token: tokenString,
	}, tokenString, nil
}

func (s *UserServices) GetAllUsers() ([]types.User, error) {
	var users []types.User
	tx := db.DB.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	result := tx.Find(&users)
	if result.Error != nil {
		tx.Rollback()
		return nil, fmt.Errorf("failed to get users: %v", result.Error)
	}

	if err := tx.Commit().Error; err != nil {
		return nil, fmt.Errorf("could not commit transaction: %w", err)
	}

	return users, nil
}

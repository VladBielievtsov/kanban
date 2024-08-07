package services

import (
	"errors"
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/types"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AccountsServices struct {
	cfg *config.Config
	db  *gorm.DB
}

func NewAccountsServices(cfg *config.Config, db *gorm.DB) *AccountsServices {
	return &AccountsServices{
		cfg: cfg,
		db:  db,
	}
}

func (s *AccountsServices) GetConnectedAccountsByUserID(userID string) ([]types.ExternalLogin, error) {
	var externalLogin []types.ExternalLogin

	uid, err := uuid.Parse(userID)
	if err != nil {
		return externalLogin, err
	}

	err = s.db.Where("user_id = ?", uid).Find(&externalLogin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return externalLogin, errors.New("connected accounts not found for the given user ID")
		}
		return externalLogin, err
	}

	return externalLogin, nil
}

func (s *AccountsServices) UnlinkExternalLogin(userID, provider string) error {
	err := s.db.Where("user_id = ? AND provider = ?", userID, provider).Delete(&types.ExternalLogin{}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("external login not found")
		}
		return err
	}

	return nil
}

func (s *AccountsServices) LinkGithubAccount(userID string, userInfo types.GithubResponse) error {
	var externalLogin types.ExternalLogin
	var user types.User

	err := s.db.Where("provider = ? AND external_id = ?", "github", userInfo.ID).First(&externalLogin).Error
	if err == nil {
		return fmt.Errorf("github account already linked")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("failed to check if github account is already linked: %v", err)
	}

	err = s.db.Where("id = ?", userID).First(&user).Error
	if err != nil {
		return fmt.Errorf("failed to get user: %v", err)
	}

	newExternalLogin := types.ExternalLogin{
		ID:         uuid.New(),
		UserID:     *user.ID,
		UserName:   userInfo.Login,
		Provider:   "github",
		ExternalID: userInfo.ID,
	}
	err = s.db.Create(&newExternalLogin).Error
	if err != nil {
		return fmt.Errorf("failed to link account: %v", err)
	}

	return nil
}

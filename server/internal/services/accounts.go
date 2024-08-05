package services

import (
	"errors"
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

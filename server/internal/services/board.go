package services

import (
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/types"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BoardServices struct {
	cfg *config.Config
	db  *gorm.DB
}

func NewBoardServices(cfg *config.Config, db *gorm.DB) *BoardServices {
	return &BoardServices{
		cfg: cfg,
		db:  db,
	}
}

func (s *BoardServices) CreateBoard(userID *uuid.UUID) (types.Board, error) {
	board := types.Board{}
	id := uuid.New()

	board = types.Board{
		ID:          &id,
		UserID:      userID,
		Title:       "Untitled",
		Description: "",
		Icon:        "📑",
	}

	if err := s.db.Create(&board).Error; err != nil {
		return board, fmt.Errorf("failed to create a board: %v", err)
	}

	return board, nil
}

func (s *BoardServices) GetAll(userID *uuid.UUID) ([]types.Board, error) {
	boards := []types.Board{}

	if err := s.db.Where("user_id = ?", userID).Find(&boards).Error; err != nil {
		return boards, fmt.Errorf("failed to get a boards: %v", err)
	}

	return boards, nil
}

func (s *BoardServices) Delete(userID *uuid.UUID, boardID string) (string, error) {
	result := s.db.Where("user_id = ? AND id = ?", userID, boardID).Delete(&types.Board{})

	if result.Error != nil {
		return "", fmt.Errorf("failed to delete the board: %v", result.Error)
	}

	if result.RowsAffected == 0 {
		return "", fmt.Errorf("no board found with the specified ID for this user")
	}

	return "The board has been successfully delete", nil
}

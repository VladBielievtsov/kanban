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
		return board, fmt.Errorf("failed to create a board: %v", err.Error())
	}

	return board, nil
}

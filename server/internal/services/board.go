package services

import (
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/types"
	"net/http"
	"strings"

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
		Description: "Add description here",
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

func (s *BoardServices) GetByID(userID *uuid.UUID, boardID string) (types.Board, int, error) {
	board := types.Board{}

	result := s.db.Where("user_id = ? AND id = ?", userID, boardID).Preload("Sections", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at ASC")
	}).First(&board)
	if result.Error != nil {
		fmt.Println(result.Error)
		return board, http.StatusNotFound, fmt.Errorf("failed to find the board: %v", result.Error)
	}

	if result.RowsAffected == 0 {
		return board, http.StatusNotFound, fmt.Errorf("no board found with the specified ID for this user")
	}

	return board, http.StatusOK, nil
}

func (s *BoardServices) Update(userID *uuid.UUID, boardID string, req types.UpdateBoardBody) (types.Board, error) {
	board := types.Board{}

	result := s.db.Where("user_id = ? AND id = ?", userID, boardID).First(&board)
	if result.Error != nil {
		return board, fmt.Errorf("failed to find the board: %v", result.Error)
	}

	if result.RowsAffected == 0 {
		return board, fmt.Errorf("no board found with the specified ID for this user")
	}

	if strings.TrimSpace(req.Title) != "" {
		board.Title = req.Title
	}
	if strings.TrimSpace(req.Description) != "" {
		board.Description = req.Description
	}
	if strings.TrimSpace(req.Icon) != "" {
		board.Icon = req.Icon
	}

	if err := s.db.Save(&board).Error; err != nil {
		return board, fmt.Errorf("failed to update the board: %v", err)
	}

	return board, nil
}

package services

import (
	"errors"
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

func (s *BoardServices) Delete(userID *uuid.UUID, boardID string) (string, int, error) {
	tx := s.db.Begin()
	if tx.Error != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to start transaction: %v", tx.Error)
	}

	var board types.Board
	err := tx.Preload("Sections.Tasks").Where("id = ? AND user_id = ?", boardID, userID).First(&board).Error
	if err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", http.StatusNotFound, fmt.Errorf("board not found")
		}
		return "", http.StatusInternalServerError, fmt.Errorf("failed to find the board: %v", err)
	}

	for _, section := range board.Sections {
		taskResult := tx.Where("section_id = ?", section.ID).Delete(&types.Task{})
		if taskResult.Error != nil {
			tx.Rollback()
			return "", http.StatusInternalServerError, fmt.Errorf("failed to delete tasks for section %v: %v", section.ID, taskResult.Error)
		}
	}

	sectionResult := tx.Where("board_id = ?", boardID).Delete(&types.Section{})
	if sectionResult.Error != nil {
		tx.Rollback()
		return "", http.StatusInternalServerError, fmt.Errorf("failed to delete sections for the board: %v", sectionResult.Error)
	}

	boardResult := tx.Where("id = ? AND user_id = ?", boardID, userID).Delete(&types.Board{})
	if boardResult.Error != nil {
		tx.Rollback()
		return "", http.StatusInternalServerError, fmt.Errorf("failed to delete the board: %v", boardResult.Error)
	}

	if boardResult.RowsAffected == 0 {
		tx.Rollback()
		return "", http.StatusNotFound, fmt.Errorf("no board found with the specified ID for this user")
	}

	if err := tx.Commit().Error; err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to commit transaction: %v", err)
	}

	return boardID, http.StatusOK, nil
}

func (s *BoardServices) GetByID(userID *uuid.UUID, boardID string) (types.Board, int, error) {
	board := types.Board{}

	result := s.db.Where("user_id = ? AND id = ?", userID, boardID).Preload("Sections", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at ASC").Preload("Tasks", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at ASC")
		})
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

	if err := s.db.Where("user_id = ? AND id = ?", userID, boardID).First(&board).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return board, fmt.Errorf("no board found with the specified ID for this user")
		}
		return board, fmt.Errorf("failed to find the board: %v", err)
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

func (s *BoardServices) ToggleFavorite(userID *uuid.UUID, boardID string) (types.Board, int, error) {
	board := types.Board{}

	if err := s.db.Where("user_id = ? AND id = ?", userID, boardID).First(&board).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return board, http.StatusNotFound, fmt.Errorf("no board found with the specified ID for this user")
		}
		return board, http.StatusInternalServerError, fmt.Errorf("failed to find the board: %v", err)
	}

	board.Favorite = !board.Favorite

	if err := s.db.Save(&board).Error; err != nil {
		return board, http.StatusInternalServerError, fmt.Errorf("failed to update the board: %v", err)
	}

	return board, http.StatusOK, nil
}

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

type SectionServices struct {
	cfg *config.Config
	db  *gorm.DB
}

func NewSectionServices(cfg *config.Config, db *gorm.DB) *SectionServices {
	return &SectionServices{
		cfg: cfg,
		db:  db,
	}
}

func (s *SectionServices) Create(userID *uuid.UUID, boardID string) (types.Section, int, error) {
	section := types.Section{}
	id := uuid.New()

	boardUUID, err := uuid.Parse(boardID)
	if err != nil {
		return section, http.StatusBadRequest, fmt.Errorf("invalid board ID: %v", err)
	}

	section = types.Section{
		ID:      &id,
		Title:   "Untitled",
		UserID:  userID,
		BoardID: &boardUUID,
	}

	if err := s.db.Create(&section).Error; err != nil {
		return section, http.StatusInternalServerError, fmt.Errorf("failed to create a section: %v", err)
	}

	return section, http.StatusOK, nil
}

func (s *SectionServices) UpdateTitle(userID *uuid.UUID, sectionID string, req types.UpdateSectionBody) (types.Section, int, error) {
	section := types.Section{}

	result := s.db.Where("user_id = ? AND id = ?", userID, sectionID).First(&section)
	if result.Error != nil {
		return section, http.StatusNotFound, fmt.Errorf("failed to find the section: %v", result.Error)
	}

	if result.RowsAffected == 0 {
		return section, http.StatusNotFound, fmt.Errorf("no section found with the specified ID for this user")
	}

	if strings.TrimSpace(req.Title) != "" {
		section.Title = req.Title
	}

	if err := s.db.Save(&section).Error; err != nil {
		return section, http.StatusInternalServerError, fmt.Errorf("failed to update the sections: %v", err)
	}

	return section, http.StatusOK, nil
}

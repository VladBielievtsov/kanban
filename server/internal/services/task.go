package services

import (
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/types"
	"net/http"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TaskServices struct {
	cfg *config.Config
	db  *gorm.DB
}

func NewTaskServices(cfg *config.Config, db *gorm.DB) *TaskServices {
	return &TaskServices{
		cfg: cfg,
		db:  db,
	}
}

func (s *TaskServices) Create(userID uuid.UUID, sectionID string) (types.Task, int, error) {
	task := types.Task{}
	id := uuid.New()

	sectionUUID, err := uuid.Parse(sectionID)
	if err != nil {
		return task, http.StatusBadRequest, fmt.Errorf("invalid section ID: %v", err)
	}

	var tasksCount int64
	if err := s.db.Model(&types.Task{}).Where("section_id = ?", sectionID).Count(&tasksCount).Error; err != nil {
		return task, http.StatusNotFound, fmt.Errorf("failed to count tasks: %v", err)
	}

	task = types.Task{
		ID:        id,
		Title:     "Untitled",
		UserID:    userID,
		SectionID: sectionUUID,
		Content:   "",
		Position:  int(tasksCount),
	}

	if err := s.db.Create(&task).Error; err != nil {
		return task, http.StatusInternalServerError, fmt.Errorf("failed to create a task: %v", err)
	}

	return task, http.StatusOK, nil
}

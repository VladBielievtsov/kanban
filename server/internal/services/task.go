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

func (s *TaskServices) GetByID(taskID string) (types.Task, int, error) {
	task := types.Task{}

	if err := s.db.Where("id = ?", taskID).First(&task).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return task, http.StatusNotFound, fmt.Errorf("no task found with the specified ID")
		}
		return task, http.StatusNotFound, fmt.Errorf("failed to find the task: %v", err)
	}

	return task, http.StatusOK, nil
}

func (s *TaskServices) Update(userID *uuid.UUID, taskID string, req types.UpdateTaskBody) (types.Task, int, error) {
	task := types.Task{}

	if err := s.db.Where("user_id = ? AND id = ?", userID, taskID).First(&task).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return task, http.StatusNotFound, fmt.Errorf("no task found with the specified ID")
		}
		return task, http.StatusNotFound, fmt.Errorf("failed to find the task: %v", err)
	}

	if strings.TrimSpace(req.Title) != "" {
		task.Title = req.Title
	}

	if err := s.db.Save(&task).Error; err != nil {
		return task, http.StatusInternalServerError, fmt.Errorf("failed to update the task: %v", err)
	}

	return task, http.StatusOK, nil
}

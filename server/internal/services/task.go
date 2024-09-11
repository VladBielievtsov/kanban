package services

import (
	"errors"
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/dto"
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

func (s *TaskServices) Create(userID uuid.UUID, sectionID string) (dto.Task, int, error) {
	var task dto.Task
	id := uuid.New()

	sectionUUID, err := uuid.Parse(sectionID)
	if err != nil {
		return task, http.StatusBadRequest, fmt.Errorf("invalid section ID: %v", err)
	}

	var tasksCount int64
	if err := s.db.Model(&dto.Task{}).Where("section_id = ?", sectionID).Count(&tasksCount).Error; err != nil {
		return task, http.StatusNotFound, fmt.Errorf("failed to count tasks: %v", err)
	}

	task = dto.Task{
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

func (s *TaskServices) GetByID(taskID string) (dto.Task, int, error) {
	var task dto.Task

	if err := s.db.Where("id = ?", taskID).First(&task).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return task, http.StatusNotFound, fmt.Errorf("no task found with the specified ID")
		}
		return task, http.StatusNotFound, fmt.Errorf("failed to find the task: %v", err)
	}

	return task, http.StatusOK, nil
}

func (s *TaskServices) Update(userID *uuid.UUID, taskID string, req dto.UpdateTaskBody) (dto.Task, int, error) {
	task := dto.Task{}

	if err := s.db.Where("user_id = ? AND id = ?", userID, taskID).First(&task).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return task, http.StatusNotFound, fmt.Errorf("no task found with the specified ID")
		}
		return task, http.StatusNotFound, fmt.Errorf("failed to find the task: %v", err)
	}

	if strings.TrimSpace(req.Title) != "" {
		task.Title = req.Title
	}

	if strings.TrimSpace(req.Content) != "" {
		task.Content = req.Content
	}

	if err := s.db.Save(&task).Error; err != nil {
		return task, http.StatusInternalServerError, fmt.Errorf("failed to update the task: %v", err)
	}

	return task, http.StatusOK, nil
}

func (s *TaskServices) Delete(userID *uuid.UUID, taskID string) (string, int, error) {
	var currentTask dto.Task
	if err := s.db.Where("id = ? AND user_id = ?", taskID, userID).First(&currentTask).Error; err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to find task: %v", err)
	}

	tx := s.db.Begin()

	if err := tx.Where("id = ? AND user_id = ?", taskID, userID).Delete(&dto.Task{}).Error; err != nil {
		tx.Rollback()
		return "", http.StatusInternalServerError, fmt.Errorf("failed to delete task: %v", err)
	}

	var tasks []dto.Task
	if err := tx.Where("section_id = ?", currentTask.SectionID).Order("position").Find(&tasks).Error; err != nil {
		tx.Rollback()
		return "", http.StatusInternalServerError, fmt.Errorf("failed to find tasks in section: %v", err)
	}

	for index, task := range tasks {
		task.Position = index
		if err := tx.Save(&task).Error; err != nil {
			tx.Rollback()
			return "", http.StatusInternalServerError, fmt.Errorf("failed to update task position: %v", err)
		}
	}

	if err := tx.Commit().Error; err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to commit transaction: %v", err)
	}

	return taskID, http.StatusOK, nil
}

func (s *TaskServices) UpdatePosition(userID *uuid.UUID, taskID string, req dto.UpdateTaskPositionBody) (string, int, error) {
	var task dto.Task
	if err := s.db.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
		return "", http.StatusNotFound, fmt.Errorf("failed to find task: %v", err)
	}

	destinationSection, err := uuid.Parse(req.DestinationSectionID)
	if err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to parse destination_section_id")
	}

	sourceSection, err := uuid.Parse(req.SourceSectionID)
	if err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to parse source_section_id")
	}

	var section dto.Section
	if err := s.db.Where("id = ?", destinationSection).First(&section).Error; err != nil {
		return "", http.StatusNotFound, fmt.Errorf("destination section not found: %v", err)
	}

	tx := s.db.Begin()

	var tasks []dto.Task
	if err := tx.Where("section_id = ?", destinationSection).Order("position").Find(&tasks).Error; err != nil {
		tx.Rollback()
		return "", http.StatusInternalServerError, fmt.Errorf("failed to find tasks in section: %v", err)
	}

	if destinationSection == sourceSection {
		if task.Position < req.DestinationPosition {
			for _, t := range tasks {
				if t.Position > task.Position && t.Position <= req.DestinationPosition {
					t.Position--
					if err := tx.Save(&t).Error; err != nil {
						tx.Rollback()
						return "", http.StatusInternalServerError, fmt.Errorf("failed to update task position: %v", err)
					}
				}
			}
		} else if task.Position > req.DestinationPosition {
			for _, t := range tasks {
				if t.Position >= req.DestinationPosition && t.Position < task.Position {
					t.Position++
					if err := tx.Save(&t).Error; err != nil {
						tx.Rollback()
						return "", http.StatusInternalServerError, fmt.Errorf("failed to update task position: %v", err)
					}
				}
			}
		}
	} else {
		var prevSectionTasks []dto.Task
		if err := tx.Where("section_id = ?", sourceSection).Order("position").Find(&prevSectionTasks).Error; err != nil {
			tx.Rollback()
			return "", http.StatusInternalServerError, fmt.Errorf("failed to find tasks in previous section: %v", err)
		}

		for _, t := range prevSectionTasks {
			if t.Position > task.Position {
				t.Position--
				if err := tx.Save(&t).Error; err != nil {
					tx.Rollback()
					return "", http.StatusInternalServerError, fmt.Errorf("failed to update task position in previous section: %v", err)
				}
			}
		}

		for _, t := range tasks {
			if t.Position >= req.DestinationPosition {
				t.Position++
				if err := tx.Save(&t).Error; err != nil {
					tx.Rollback()
					return "", http.StatusInternalServerError, fmt.Errorf("failed to update task position: %v", err)
				}
			}
		}
	}

	task.SectionID = destinationSection
	task.Position = req.DestinationPosition

	if err := tx.Save(&task).Error; err != nil {
		tx.Rollback()
		return "", http.StatusInternalServerError, fmt.Errorf("failed to update the task: %v", err)
	}

	if err := tx.Commit().Error; err != nil {
		return "", http.StatusInternalServerError, fmt.Errorf("failed to commit transaction: %v", err)
	}

	return taskID, http.StatusOK, nil
}

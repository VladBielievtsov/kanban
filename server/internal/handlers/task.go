package handlers

import (
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func CreateTask(taskServices *services.TaskServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			utils.JSONResponse(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
			return
		}

		id, err := uuid.Parse(userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": "Invalid UUID: " + err.Error()})
			return
		}

		sectionID := chi.URLParam(r, "section-id")
		if sectionID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Section id is required"})
			return
		}

		task, status, err := taskServices.Create(id, sectionID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, task)
	}
}

func GetTaskByID(taskServices *services.TaskServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		taskID := chi.URLParam(r, "id")
		if taskID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Task id is required"})
			return
		}

		task, status, err := taskServices.GetByID(taskID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, task)
	}
}

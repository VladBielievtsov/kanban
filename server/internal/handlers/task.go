package handlers

import (
	"encoding/json"
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"log"
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

func UpdateTask(taskServices *services.TaskServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdateTaskBody
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Error decoding request body: %v", err)
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid request payload"})
			return
		}

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

		taskID := chi.URLParam(r, "id")
		if taskID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Task id is required"})
			return
		}

		task, status, err := taskServices.Update(&id, taskID, req)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, task)
	}
}

func DeleteTask(taskServices *services.TaskServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			utils.JSONResponse(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		}

		id, err := uuid.Parse(userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": "Invalid UUID: " + err.Error()})
			return
		}

		taskID := chi.URLParam(r, "id")
		if taskID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Task id is required"})
			return
		}

		result, status, err := taskServices.Delete(&id, taskID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, status, result)
	}
}

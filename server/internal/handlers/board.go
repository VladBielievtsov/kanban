package handlers

import (
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func CreateBoard(boardServices *services.BoardServices) http.HandlerFunc {
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

		board, err := boardServices.CreateBoard(&id)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, board)
	}
}

func GetAllBoards(boardServices *services.BoardServices) http.HandlerFunc {
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

		boards, err := boardServices.GetAll(&id)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, boards)
	}
}

func DeleteBoard(boardServices *services.BoardServices) http.HandlerFunc {
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

		boardID := chi.URLParam(r, "id")
		if boardID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Board id is required"})
			return
		}

		result, err := boardServices.Delete(&id, boardID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, result)
	}
}

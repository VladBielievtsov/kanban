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

		result, status, err := boardServices.Delete(&id, boardID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, result)
	}
}

func GetBoardByID(boardServices *services.BoardServices) http.HandlerFunc {
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

		board, status, err := boardServices.GetByID(&id, boardID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, board)
	}
}

func UpdateBoard(boardServices *services.BoardServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdateBoardBody
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Error decoding request body: %v", err)
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid request payload"})
			return
		}

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

		board, err := boardServices.Update(&id, boardID, req)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, board)
	}
}

func ToggleFavoriteBoard(boardServices *services.BoardServices) http.HandlerFunc {
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

		board, status, err := boardServices.ToggleFavorite(&id, boardID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, board)
	}
}

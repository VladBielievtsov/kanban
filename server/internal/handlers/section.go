package handlers

import (
	"encoding/json"
	"kanban-api/internal/dto"
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/utils"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func CreateSection(sectionServices *services.SectionServices) http.HandlerFunc {
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

		boardID := chi.URLParam(r, "board-id")
		if boardID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Board id is required"})
			return
		}

		section, status, err := sectionServices.Create(&id, boardID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, section)
	}
}

func UpdateSectionTitle(sectionServices *services.SectionServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.UpdateSectionBody
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

		sectionID := chi.URLParam(r, "section-id")
		if sectionID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Section id is required"})
			return
		}

		section, status, err := sectionServices.UpdateTitle(&id, sectionID, req)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, section)
	}
}

func DeleteSection(sectionServices *services.SectionServices) http.HandlerFunc {
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

		sectionID := chi.URLParam(r, "section-id")
		if sectionID == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Section id is required"})
			return
		}

		result, status, err := sectionServices.Delete(&id, sectionID)
		if err != nil {
			utils.JSONResponse(w, status, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, status, result)
	}
}

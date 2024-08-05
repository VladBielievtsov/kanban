package handlers

import (
	"encoding/json"
	"fmt"
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"log"
	"net/http"
	"os"
	"strings"

	"gorm.io/gorm"
)

func GetAllUsers(userServices *services.UserServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		users, err := userServices.GetAllUsers()
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, users)
	}
}

func UpdateAvatar(db *gorm.DB, userServices *services.UserServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		user, err := userServices.GetUserByID(userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		url, err := userServices.UploadAvatar(w, r, userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		oldAvatar := user.AvatarURL
		user.AvatarURL = url

		if err := db.Save(&user).Error; err != nil {
			if err := os.Remove(url); err != nil {
				fmt.Println("Failed to remove new avatar:", err)
			}
			utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Failed to update avatar"})
			return
		}

		if oldAvatar != "" && oldAvatar != url {
			if err := os.Remove(oldAvatar); err != nil {
				fmt.Println("Failed to remove old avatar:", err)
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]string{"avatarURL": url})
	}
}

func ChangeName(db *gorm.DB, userServices *services.UserServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.ChangeNameBody
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Error decoding request body: %v", err)
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid request payload"})
			return
		}

		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		user, err := userServices.GetUserByID(userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		user.FirstName = strings.TrimSpace(req.FirstName)
		user.LastName = strings.TrimSpace(req.LastName)

		if err := db.Save(&user).Error; err != nil {
			utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "Failed to update user"})
			return
		}

		utils.JSONResponse(w, http.StatusOK, user)
	}
}

func UpdatePassword(userServices *services.UserServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var req types.ChangePasswordBody
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Error decoding request body: %v", err)
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid request payload"})
			return
		}

		result, err := userServices.UpdatePassword(userID, req.OldPassword, req.NewPassword)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}
		utils.JSONResponse(w, http.StatusOK, result)
	}
}

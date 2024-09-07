package handlers

import (
	"kanban-api/internal/config"
	"kanban-api/internal/dto"
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func FindConnectedAccounts(accountsServices *services.AccountsServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		accounts, err := accountsServices.GetConnectedAccountsByUserID(userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, dto.FilterConnectedAccount(accounts))
	}
}

func UnlinkExternalLogin(userServices *services.UserServices, accountsServices *services.AccountsServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserContextKey).(string)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		provider := chi.URLParam(r, "provider")

		if provider == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Provider is required"})
			return
		}

		user, err := userServices.GetUserByID(userID)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		if !user.HasPassword {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "You can't remove external login, cuz you don't have password"})
			return
		}

		err = accountsServices.UnlinkExternalLogin(userID, provider)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		utils.JSONResponse(w, http.StatusOK, map[string]string{"message": provider + " has been unlinked"})
	}
}

func LinkExternalLogin(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		provider := chi.URLParam(r, "provider")

		if provider == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Provider is required"})
			return
		}

		if provider == "github" {
			githubOauthConfig := GetGithubOauthConfig(cfg)
			url := githubOauthConfig.AuthCodeURL("link")
			http.Redirect(w, r, url, http.StatusTemporaryRedirect)
			return
		}

		utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Unsupported provider"})
	}
}

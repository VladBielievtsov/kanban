package handlers

import (
	"encoding/json"
	"kanban-api/internal/config"
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

func GetGithubOauthConfig(cfg *config.Config) *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  "http://" + cfg.Application.Address + cfg.OAuth.RedirectURL,
		Endpoint:     github.Endpoint,
	}
}

func GithubLogin(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		githubOauthConfig := GetGithubOauthConfig(cfg)
		url := githubOauthConfig.AuthCodeURL("login")
		http.Redirect(w, r, url, http.StatusTemporaryRedirect)
	}
}

func GitHubCallback(cfg *config.Config, authServices *services.AuthServices, accountsServices *services.AccountsServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		githubOauthConfig := GetGithubOauthConfig(cfg)
		state := r.URL.Query().Get("state")

		if state == "" {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "State is missing"})
			return
		}

		userInfo, err := authServices.GetGithubUser(w, r, githubOauthConfig)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		switch state {
		case "login":
			_, token, err := authServices.AuthByGithub(userInfo)
			if err != nil {
				utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
				return
			}

			http.SetCookie(w, &http.Cookie{
				Name:     "auth_token",
				Value:    token,
				Expires:  time.Now().UTC().Add(120 * time.Minute),
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteLaxMode,
				Path:     "/",
			})

			http.Redirect(w, r, cfg.Application.Client, http.StatusFound)
		case "link":
			userID := middlewares.GetUserIdFromCookie(w, r, cfg.Application.JwtSecret)

			err = accountsServices.LinkGithubAccount(userID, userInfo)
			if err != nil {
				utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
				return
			}

			http.Redirect(w, r, cfg.Application.Client+"/profile", http.StatusFound)
		default:
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid flow"})
		}
	}
}

func GetMe(userServices *services.UserServices) http.HandlerFunc {
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

		utils.JSONResponse(w, http.StatusOK, types.FilterUser(user))
	}
}

func Login(authServices *services.AuthServices) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.LoginBody
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Error decoding request body: %v", err)
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid request payload"})
			return
		}

		var errors []string

		if strings.TrimSpace(req.Email) == "" {
			errors = append(errors, "email is required")
		}
		if strings.TrimSpace(req.Password) == "" {
			errors = append(errors, "password is required")
		}

		if len(errors) > 0 {
			utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": strings.Join(errors, ", ")})
			return
		}

		user, token, err := authServices.LoginByEmail(req.Email, req.Password)
		if err != nil {
			utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "auth_token",
			Value:    token,
			Expires:  time.Now().UTC().Add(120 * time.Minute),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
			Path:     "/",
		})

		utils.JSONResponse(w, http.StatusOK, types.FilterUser(user))
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})

	utils.JSONResponse(w, http.StatusOK, map[string]string{"message": "You have been logged out"})
}

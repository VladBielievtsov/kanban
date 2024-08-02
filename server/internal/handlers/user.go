package handlers

import (
	"encoding/json"
	"fmt"
	"kanban-api/db"
	"kanban-api/internal/middleware"
	"kanban-api/internal/services"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var avatarService *services.AvatarServices
var userServices *services.UserServices

var (
	githubOauthConfig = &oauth2.Config{
		ClientID:     "",
		ClientSecret: "",
		RedirectURL:  "http://localhost:4000/auth/callback",
		Endpoint:     github.Endpoint,
	}
	oauthStateString = "random-string"
)

func UserRegisterRoutes(r chi.Router, us *services.UserServices, as *services.AvatarServices) {
	userServices = us
	avatarService = as
	r.Post("/register", Register)
	r.Post("/login", Login)
	r.Get("/users", GetAllUsers)
	r.Get("/github/login", GithubLogin)
	r.Get("/auth/callback", GitHubCallback)
	r.Group(func(r chi.Router) {
		r.Use(middleware.AuthMiddleware("SECTER"))
		r.Get("/me", GetMe)
		r.Post("/logout", Logout)
		r.Put("/user/{id}/avatar", UpdateAvatar)
	})
}

func Register(w http.ResponseWriter, r *http.Request) {
	var req types.RegisterBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request body: %v", err)
		utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": "Invalid request payload"})
		return
	}

	var errors []string

	if strings.TrimSpace(req.Email) == "" {
		errors = append(errors, "email is required")
	}
	if strings.TrimSpace(req.FirstName) == "" {
		errors = append(errors, "first name is required")
	}
	if strings.TrimSpace(req.LastName) == "" {
		errors = append(errors, "last name is required")
	}
	if strings.TrimSpace(req.Password) == "" {
		errors = append(errors, "password is required")
	}

	if len(errors) > 0 {
		utils.JSONResponse(w, http.StatusBadRequest, map[string]string{"message": strings.Join(errors, ", ")})
		return
	}

	id := uuid.New()

	filename, err := avatarService.GenerateAvatar(req.FirstName, id.String())
	if err != nil {
		log.Printf("Error generating avatar: %v", err)
		utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	user, err := userServices.RegisterByEmail(
		id,
		req.Email,
		filename,
		req.FirstName,
		req.LastName,
		req.Password,
	)

	if err != nil {
		if errRemove := os.Remove(filename); errRemove != nil {
			log.Printf("Failed to remove avatar file: %v", errRemove)
		}
		utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	utils.JSONResponse(w, http.StatusOK, user)
}

func Login(w http.ResponseWriter, r *http.Request) {
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

	user, token, err := userServices.LoginByEmail(req.Email, req.Password)
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

	utils.JSONResponse(w, http.StatusOK, user)
}

// Github

func GithubLogin(w http.ResponseWriter, r *http.Request) {
	url := githubOauthConfig.AuthCodeURL(oauthStateString)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func GitHubCallback(w http.ResponseWriter, r *http.Request) {
	userInfo, err := userServices.GetGithubUser(w, r, githubOauthConfig, oauthStateString)
	if err != nil {
		utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	_, token, err := userServices.AuthByGithub(userInfo)
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

	http.Redirect(w, r, os.Getenv("FRONTEND"), http.StatusFound)
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

func GetMe(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserContextKey).(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := userServices.GetUserByID(userID)
	if err != nil {
		utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	utils.JSONResponse(w, http.StatusOK, types.LoginResponse{User: user})
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := userServices.GetAllUsers()
	if err != nil {
		utils.JSONResponse(w, http.StatusInternalServerError, map[string]string{"message": err.Error()})
		return
	}

	utils.JSONResponse(w, http.StatusOK, users)
}

func UpdateAvatar(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
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

	if err := db.DB.Save(&user).Error; err != nil {
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

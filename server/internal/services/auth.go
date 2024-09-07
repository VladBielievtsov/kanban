package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/dto"
	"kanban-api/internal/utils"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type AuthServices struct {
	cfg *config.Config
	db  *gorm.DB
}

func NewAuthServices(cfg *config.Config, db *gorm.DB) *AuthServices {
	return &AuthServices{
		cfg: cfg,
		db:  db,
	}
}

func (s *AuthServices) GetGithubUser(w http.ResponseWriter, r *http.Request, githubOauthConfig *oauth2.Config) (dto.GithubResponse, error) {

	errorRes := r.URL.Query().Has("error")
	if errorRes {
		err := r.URL.Query().Get("error")
		http.Redirect(w, r, s.cfg.Application.Client+"/login?error="+err, http.StatusTemporaryRedirect)
	}

	code := r.URL.Query().Get("code")
	token, err := githubOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return dto.GithubResponse{}, err
	}

	client := oauth2.NewClient(context.Background(), oauth2.StaticTokenSource(token))
	response, err := client.Get("https://api.github.com/user")
	if err != nil {
		return dto.GithubResponse{}, err
	}
	defer response.Body.Close()

	var userInfo dto.GithubResponse

	if err := json.NewDecoder(response.Body).Decode(&userInfo); err != nil {
		return dto.GithubResponse{}, err
	}

	return userInfo, nil
}

func (s *AuthServices) AuthByGithub(githubResponse dto.GithubResponse) (dto.UserResponse, string, error) {
	var externalLogin dto.ExternalLogin
	var user dto.User

	err := s.db.Where("provider = ? AND external_id = ?", "github", githubResponse.ID).First(&externalLogin).Error
	if err == nil {
		err := s.db.Where("id = ?", externalLogin.UserID).First(&user).Error
		if err != nil {
			return dto.UserResponse{}, "", fmt.Errorf("failed to get users: %v", err)
		}
		externalLogin.UserName = githubResponse.Login
		err = s.db.Save(&externalLogin).Error
		if err != nil {
			return dto.UserResponse{}, "", fmt.Errorf("failed to get users: %v", err)
		}
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		err := s.db.Where("email = ?", githubResponse.Email).First(&user).Error
		if err == nil {
			newExternalLogin := dto.ExternalLogin{
				ID:         uuid.New(),
				UserID:     *user.ID,
				UserName:   githubResponse.Login,
				Provider:   "github",
				ExternalID: githubResponse.ID,
			}
			s.db.Create(&newExternalLogin)
		} else if errors.Is(err, gorm.ErrRecordNotFound) {
			newUserID := uuid.New()
			newUser := dto.User{
				ID:        &newUserID,
				Email:     githubResponse.Email,
				AvatarURL: githubResponse.AvatarURL,
				FirstName: githubResponse.Login,
				LastName:  "",
				Password:  "",
			}
			s.db.Create(&newUser)
			newExternalLogin := dto.ExternalLogin{
				ID:         uuid.New(),
				UserID:     *newUser.ID,
				UserName:   githubResponse.Login,
				Provider:   "github",
				ExternalID: githubResponse.ID,
			}
			s.db.Create(&newExternalLogin)
			user = newUser
		} else {
			return dto.UserResponse{}, "", fmt.Errorf("failed to find or create user: %w", err)
		}
	} else {
		return dto.UserResponse{}, "", fmt.Errorf("failed to auth: %v", err)
	}

	token, err := utils.GenerateToken(user, s.cfg.Application.JwtSecret)
	if err != nil {
		return dto.UserResponse{}, "", err
	}

	return dto.FilterUser(user), token, nil
}

func (s *AuthServices) LoginByEmail(email, password string) (dto.User, string, error) {
	var user dto.User

	err := s.db.Where("LOWER(email) = LOWER(?)", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user, "", fmt.Errorf("could not find user with email: %s", email)
		}
		return user, "", fmt.Errorf("error retrieving user: %v", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return user, "", fmt.Errorf("invalid password")
	}

	tokenByte := jwt.New(jwt.SigningMethodHS256)
	now := time.Now().UTC()
	claims := tokenByte.Claims.(jwt.MapClaims)

	claims["sub"] = user.ID
	claims["exp"] = now.Add(120 * time.Minute).Unix()
	claims["iat"] = now.Unix()
	claims["nbf"] = now.Unix()

	tokenString, err := tokenByte.SignedString([]byte(s.cfg.Application.JwtSecret))
	if err != nil {
		return user, "", fmt.Errorf("generating JWT Token failed")
	}

	return user, tokenString, nil
}

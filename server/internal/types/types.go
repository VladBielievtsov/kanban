package types

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID          *uuid.UUID `gorm:"type:uuid;not null;primaryKey" json:"id"`
	Password    string     `gorm:"varchar(255);not null" json:"password"`
	HasPassword bool       `gorm:"not null;default:false" json:"has_password"`
	AvatarURL   string     `gorm:"type:varchar(255);not null" json:"avatar_url"`
	FirstName   string     `gorm:"type:varchar(255);not null" json:"first_name"`
	LastName    string     `gorm:"type:varchar(255);not null" json:"last_name"`
	Email       string     `gorm:"type:varchar(255);unique;not null" json:"email"`
	CreatedAt   *time.Time `gorm:"not null;default:now()" json:"createdAt"`
	UpdatedAt   *time.Time `gorm:"not null;default:now()" json:"updatedAt"`

	Boards []Board `gorm:"foreignKey:UserID" json:"boards"`
}

type UserResponse struct {
	ID          *uuid.UUID `json:"id"`
	AvatarURL   string     `json:"avatar_url"`
	FirstName   string     `json:"first_name"`
	LastName    string     `json:"last_name"`
	Email       string     `json:"email"`
	HasPassword bool       `json:"has_password"`
	CreatedAt   *time.Time `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
}

func FilterUser(user User) UserResponse {
	return UserResponse{
		ID:          user.ID,
		AvatarURL:   user.AvatarURL,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Email:       user.Email,
		HasPassword: user.HasPassword,
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
	}
}

type RegisterBody struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	AvatarURL string `json:"avatar_url"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type LoginBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type GithubResponse struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar_url"`
}

type ExternalLogin struct {
	ID         uuid.UUID `gorm:"type:uuid;not null;primaryKey" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	UserName   string    `gorm:"type:varchar(255);not null" json:"user_name"`
	Provider   string    `gorm:"type:varchar(255);not null" json:"provider"`
	ExternalID int64     `gorm:"not null" json:"external_id"`
}

type ConnectedAccountResponse struct {
	ID       uuid.UUID `json:"id"`
	UserName string    `json:"user_name"`
	Provider string    ` json:"provider"`
}

type RemoveExternalLoginRequest struct {
	Provider string `json:"provider"`
}

func FilterConnectedAccount(externalLogins []ExternalLogin) []ConnectedAccountResponse {
	var connectedAccounts []ConnectedAccountResponse

	for _, externalLogin := range externalLogins {
		connectedAccount := ConnectedAccountResponse{
			ID:       externalLogin.ID,
			UserName: externalLogin.UserName,
			Provider: externalLogin.Provider,
		}
		connectedAccounts = append(connectedAccounts, connectedAccount)
	}

	return connectedAccounts
}

type ChangeNameBody struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type ChangePasswordBody struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"password"`
}

// Board

type Board struct {
	ID          *uuid.UUID `gorm:"type:uuid;not null;primaryKey" json:"id"`
	Title       string     `gorm:"varchar(255);not null" json:"title"`
	UserID      *uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Icon        string     `gorm:"varchar(255);not null" json:"icon"`
	Description string     `gorm:"varchar(255);not null" json:"description"`
	CreatedAt   time.Time  `gorm:"not null;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time  `gorm:"not null;autoUpdateTime" json:"updatedAt"`
}

type UpdateBoardBody struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

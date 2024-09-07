package dto

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
	CreatedAt   *time.Time `gorm:"not null;autoCreateTime" json:"createdAt"`
	UpdatedAt   *time.Time `gorm:"not null;autoUpdateTime" json:"updatedAt"`

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

type ChangeNameBody struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type ChangePasswordBody struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"password"`
}

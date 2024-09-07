package dto

import (
	"time"

	"github.com/google/uuid"
)

type Board struct {
	ID          *uuid.UUID `gorm:"type:uuid;not null;primaryKey" json:"id"`
	Title       string     `gorm:"varchar(255);not null" json:"title"`
	UserID      *uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Icon        string     `gorm:"varchar(255);not null" json:"icon"`
	Favorite    bool       `gorm:"default:false;not null" json:"favorite"`
	Description string     `gorm:"varchar(255);not null" json:"description"`
	Sections    []Section  `gorm:"foreignKey:BoardID" json:"sections"`
	CreatedAt   time.Time  `gorm:"not null;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time  `gorm:"not null;autoUpdateTime" json:"updatedAt"`
}

type UpdateBoardBody struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

package dto

import (
	"time"

	"github.com/google/uuid"
)

type Section struct {
	ID        *uuid.UUID `gorm:"type:uuid;not null;primaryKey" json:"id"`
	Title     string     `gorm:"varchar(255);not null" json:"title"`
	UserID    *uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	BoardID   *uuid.UUID `gorm:"type:uuid;not null" json:"board_id"`
	Tasks     []Task     `gorm:"foreignKey:SectionID" json:"tasks"`
	CreatedAt time.Time  `gorm:"not null;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time  `gorm:"not null;autoUpdateTime" json:"updatedAt"`
}

type UpdateSectionBody struct {
	Title string `json:"title"`
}

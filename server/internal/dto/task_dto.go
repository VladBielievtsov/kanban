package dto

import (
	"time"

	"github.com/google/uuid"
)

type Task struct {
	ID        uuid.UUID `gorm:"type:uuid;not null;primaryKey" json:"id"`
	Title     string    `gorm:"varchar(255);not null" json:"title"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	SectionID uuid.UUID `gorm:"type:uuid;not null" json:"section_id"`
	Content   string    `gorm:"type:text" json:"content"`
	Position  int       `gorm:"type:int;not null" json:"position"`
	CreatedAt time.Time `gorm:"not null;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"not null;autoUpdateTime" json:"updatedAt"`
}

type UpdateTaskBody struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type UpdateTaskPositionBody struct {
	SourceSectionID      string `json:"source_section_id"`
	DestinationSectionID string `json:"destination_section_id"`
	DestinationPosition  int    `json:"destination_position"`
}

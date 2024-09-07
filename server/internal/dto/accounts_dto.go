package dto

import "github.com/google/uuid"

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

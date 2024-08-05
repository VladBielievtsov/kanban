package handlers

import (
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"net/http"
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

		utils.JSONResponse(w, http.StatusOK, types.FilterConnectedAccount(accounts))
	}
}

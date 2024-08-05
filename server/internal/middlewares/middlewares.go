package middlewares

import (
	"context"
	"kanban-api/internal/utils"
	"net/http"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type contextKey string

const UserContextKey contextKey = "user"

func AuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			tokenCookie, err := r.Cookie("auth_token")
			if err != nil {
				utils.JSONResponse(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
				return
			}

			token, err := jwt.ParseWithClaims(tokenCookie.Value, &jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				utils.JSONResponse(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
				return
			}

			claims, ok := token.Claims.(*jwt.MapClaims)
			if !ok || !token.Valid {
				utils.JSONResponse(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
				return
			}

			userID, err := uuid.Parse((*claims)["sub"].(string))
			if err != nil {
				utils.JSONResponse(w, http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, userID.String())
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

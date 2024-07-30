package middleware

import (
	"context"
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
				http.Error(w, "Unauthorized 1", http.StatusUnauthorized)
				return
			}

			token, err := jwt.ParseWithClaims(tokenCookie.Value, &jwt.MapClaims{}, func(t *jwt.Token) (interface{}, error) {
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "Unauthorized 2", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(*jwt.MapClaims)
			if !ok || !token.Valid {
				http.Error(w, "Unauthorized 3", http.StatusUnauthorized)
				return
			}

			userID, err := uuid.Parse((*claims)["sub"].(string))
			if err != nil {
				http.Error(w, "Unauthorized 4", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserContextKey, userID.String())
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

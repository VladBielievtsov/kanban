package main

import (
	"kanban-api/db"
	"kanban-api/internal/config"
	"kanban-api/internal/handlers"
	"kanban-api/internal/services"
	"kanban-api/internal/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	cfg, err := config.New()
	if err != nil {
		utils.ErrorHandler(err)
	}

	if err := db.ConnectDatabase(); err != nil {
		utils.ErrorHandler(err)
	}
	db.Migrate()

	avatarService := services.NewAvatarServices()
	userServices := services.NewUserServices(cfg)

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// corsHandler := cors.New(cors.Options{
	// 	AllowedOrigins:   []string{"http://localhost:3000"},
	// 	AllowedMethods:   []string{"GET", "POST", "DELETE", "PUT"},
	// 	AllowedHeaders:   []string{"*"},
	// 	AllowCredentials: false,
	// })

	// r.Use(corsHandler.Handler)

	fs := http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads")))
	r.Handle("/uploads/*", fs)

	handlers.UserRegisterRoutes(r, userServices, avatarService)

	http.ListenAndServe(":"+cfg.Application.Port, r)
}

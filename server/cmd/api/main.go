package main

import (
	"fmt"
	"kanban-api/database"
	"kanban-api/internal/config"
	"kanban-api/internal/handlers"
	"kanban-api/internal/middlewares"
	"kanban-api/internal/services"
	"kanban-api/internal/utils"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	pwd, err := os.Getwd()
	utils.ErrorHandler(err)

	cfg, err := config.New(filepath.Join(pwd, "config"))
	utils.ErrorHandler(err)

	db, err := database.ConnectDatabase()
	utils.ErrorHandler(err)
	database.Migrate(db)

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.Application.Client},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	})

	r.Use(corsHandler.Handler)

	fs := http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads")))
	r.Handle("/uploads/*", fs)

	//SERVICES
	userServices := services.NewUserServices(cfg, db)
	authServices := services.NewAuthServices(cfg, db)
	accountsServices := services.NewAccountsServices(cfg, db)
	boardServices := services.NewBoardServices(cfg, db)
	sectionServices := services.NewSectionServices(cfg, db)
	taskServices := services.NewTaskServices(cfg, db)

	// AUTH
	r.Post("/login", handlers.Login(authServices))
	r.Get("/github/login", handlers.GithubLogin(cfg))
	r.Get("/auth/callback", handlers.GitHubCallback(cfg, authServices, accountsServices))
	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware(cfg.Application.JwtSecret))
		r.Get("/me", handlers.GetMe(userServices))
		r.Post("/logout", handlers.Logout)
	})

	//USER

	r.Get("/users", handlers.GetAllUsers(userServices))
	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware(cfg.Application.JwtSecret))
		r.Put("/user/avatar", handlers.UpdateAvatar(db, userServices))
		r.Put("/user/edit", handlers.ChangeName(db, userServices))
		r.Put("/user/password", handlers.UpdatePassword(userServices))
	})

	// ACCOUNTS

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware(cfg.Application.JwtSecret))
		r.Get("/user/accounts", handlers.FindConnectedAccounts(accountsServices))
		r.Delete("/user/accounts/{provider}", handlers.UnlinkExternalLogin(userServices, accountsServices))
		r.Get("/user/link/{provider}", handlers.LinkExternalLogin(cfg))
	})

	// BOARD

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware(cfg.Application.JwtSecret))
		r.Post("/board", handlers.CreateBoard(boardServices))
		r.Get("/boards", handlers.GetAllBoards(boardServices))
		r.Delete("/board/{id}", handlers.DeleteBoard(boardServices))
		r.Get("/board/{id}", handlers.GetBoardByID(boardServices))
		r.Patch("/board/{id}", handlers.UpdateBoard(boardServices))
		r.Patch("/board/{id}/favorite", handlers.ToggleFavoriteBoard(boardServices))
	})

	// SECTION

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware(cfg.Application.JwtSecret))
		r.Post("/section/{board-id}", handlers.CreateSection(sectionServices))
		r.Patch("/section/{section-id}", handlers.UpdateSectionTitle(sectionServices))
		r.Delete("/section/{section-id}", handlers.DeleteSection(sectionServices))
	})

	// TASK

	r.Group(func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware(cfg.Application.JwtSecret))
		r.Post("/task/{section-id}", handlers.CreateTask(taskServices))
		r.Get("/task/{id}", handlers.GetTaskByID(taskServices))
		r.Patch("/task/{id}", handlers.UpdateTask(taskServices))
		r.Delete("/task/{id}", handlers.DeleteTask(taskServices))
	})

	err = http.ListenAndServe(":"+cfg.Application.Port, r)
	if err != nil {
		fmt.Println("Server failed to start:", err)
	}
}

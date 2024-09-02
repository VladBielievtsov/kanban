package database

import (
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/types"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectDatabase() (*gorm.DB, error) {
	cfg := config.GetConfig()

	host := cfg.Db.Host
	port := cfg.Db.Port
	name := cfg.Db.Name
	user := cfg.Db.User
	password := cfg.Db.Password
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, name, port)

	var err error
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connetc to the Database: %v", err)
	}
	log.Println("🚀 Connected Successfully to the Database")

	return db, nil
}

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(&types.User{}, &types.ExternalLogin{}, &types.Board{}, &types.Section{})
	if err != nil {
		return fmt.Errorf("failed to migrate database: %v", err)
	}

	log.Println("Database migrated successfully")
	return nil
}

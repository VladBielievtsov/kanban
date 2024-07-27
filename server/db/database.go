package db

import (
	"fmt"
	"kanban-api/internal/config"
	"kanban-api/internal/types"
	"kanban-api/internal/utils"
	"log"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() error {
	cfg := config.GetConfig()

	host := cfg.Db.Host
	port := cfg.Db.Port
	name := cfg.Db.Name
	user := cfg.Db.User
	password := cfg.Db.Password
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, name, port)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connetc to the Database: %v", err)
	}
	log.Println("🚀 Connected Successfully to the Database")

	createDefaultUser()

	return nil
}

func Migrate() error {
	err := DB.AutoMigrate(&types.User{})
	if err != nil {
		return fmt.Errorf("failed to migrate database: %v", err)
	}

	log.Println("Database migrated successfully")
	return nil
}

func createDefaultUser() {

	var count int64
	DB.Model(&types.User{}).Count(&count)

	if count == 0 {
		hashedPassword, err := utils.HashPassword("password")
		if err != nil {
			utils.ErrorHandler(err)
		}

		id := uuid.New()
		defaultUser := types.User{
			ID:        &id,
			Password:  hashedPassword,
			FirstName: "FirstName",
			LastName:  "LastName",
			Email:     "mail@mail.com",
			AvatarURL: "/uploads/default/avatar.png",
		}
		result := DB.FirstOrCreate(&types.User{}, defaultUser)
		if result.Error != nil {
			utils.ErrorHandler(err)
		}
		fmt.Println("Default user created successfully!")
		fmt.Println("====================")
		fmt.Println("Email: mail@mail.com")
		fmt.Println("Password: password")
		fmt.Println("====================")
	}
}

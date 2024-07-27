package config

import (
	"fmt"
	"kanban-api/internal/utils"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Application applicationConf
	Db          DbEnv
}

type applicationConf struct {
	Port      string
	Domain    string
	JWTSecret string
}

type DbEnv struct {
	Host     string
	Port     string
	Name     string
	User     string
	Password string
}

var cfg *Config

func New() (*Config, error) {
	err := godotenv.Load(".env")
	utils.ErrorHandler(err)

	dbHost := os.Getenv("POSTGRES_HOST")
	dbPort := os.Getenv("POSTGRES_PORT")
	dbName := os.Getenv("POSTGRES_DB")
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")

	if dbName == "" || dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" {
		return nil, fmt.Errorf("some environment variables are missing")
	}

	cfg = &Config{
		Db: DbEnv{
			Host:     dbHost,
			Port:     dbPort,
			Name:     dbName,
			User:     dbUser,
			Password: dbPassword,
		},
		Application: applicationConf{
			Port:      os.Getenv("APP_PORT"),
			Domain:    os.Getenv("APP_DOMAIN"),
			JWTSecret: os.Getenv("JWT_SECTER"),
		},
	}

	return cfg, nil
}

func GetConfig() *Config {
	if cfg == nil {
		log.Panic("Config not initialized. Call New() before GetConfig()")
	}
	return cfg
}

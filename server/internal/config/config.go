package config

import (
	"kanban-api/internal/utils"
	"log"
	"path/filepath"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Application applicationConf
	Db          dbConf
	OAuth       oauthConf
}

type applicationConf struct {
	Env        string `yaml:"env" env-default:"local"`
	HTTPServer `yaml:"http_server"`
	Client     string `yaml:"client" env-default:"http://localhost:3000"`
	JwtSecret  string `yaml:"jwt_secret" env-default:"SECRET"`
}

type HTTPServer struct {
	Address     string        `yaml:"address" env-default:"localhost:4000"`
	Port        string        `yaml:"port" env-default:"4000"`
	Timeout     time.Duration `yaml:"timeout" env-default:"4s"`
	IdleTimeout time.Duration `yaml:"idle_timeout" env-default:"60s"`
}

type dbConf struct {
	Host     string `yaml:"postgres_host" env-default:"localhost"`
	Port     string `yaml:"postgres_port" env-default:"5432"`
	Name     string `yaml:"postgres_db" env-default:"kanban"`
	User     string `yaml:"postgres_user" env-default:"postgres"`
	Password string `yaml:"postgres_password" env-default:"password"`
}

type oauthConf struct {
	RedirectURL string `yaml:"redirect_url" env-default:"/auth/callback"`
	OauthState  string `yaml:"oauth_state" env-default:"random-string"`
}

var cfg *Config

func New(configsDir string) (*Config, error) {
	err := godotenv.Load()
	utils.ErrorHandler(err)

	var app applicationConf
	var db dbConf
	var oauth oauthConf

	if err := cleanenv.ReadConfig(filepath.Join(configsDir, "application.yaml"), &app); err != nil {
		return nil, err
	}

	if err := cleanenv.ReadConfig(filepath.Join(configsDir, "database.yaml"), &db); err != nil {
		return nil, err
	}

	if err := cleanenv.ReadConfig(filepath.Join(configsDir, "oauth.yaml"), &oauth); err != nil {
		return nil, err
	}

	cfg = &Config{
		Application: app,
		Db:          db,
		OAuth:       oauth,
	}

	return cfg, nil
}

func GetConfig() *Config {
	if cfg == nil {
		log.Panic("Config not initialized. Call New() before GetConfig()")
	}
	return cfg
}

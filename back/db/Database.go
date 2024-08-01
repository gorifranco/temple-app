package db

import (
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
	"sync"
	"temple-app/models"
	"temple-app/services"
)

var (
	db   *gorm.DB
	once sync.Once
)

func InitializeDB() {
	once.Do(func() {
		var err error

		err = godotenv.Load()
		if err != nil {
			log.Fatalf("Error loading .env file")
		}

		dsn := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASS") +
			"@tcp(" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + ")/" +
			os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"

		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("failed to connect to database: %v", err)
		}

/* 		err = db.AutoMigrate(
			&models.TipusUsuari{}, &models.Usuari{}, &models.Sala{}, &models.UsuarisSala{}, &models.Reserva{}, &models.SolicitudUnio{},
		) */

/* 		if err != nil {
			log.Fatalf("failed to auto-migrate: %v", err)
		} */

		err = GetDB().Where("Nom = ?", "Admin").First(&models.Usuari{}).Error

		if err == nil {
			InsertData()
		}
	})
}
func GetDB() *gorm.DB {
	if db == nil {
		InitializeDB()
	}
	return db
}

func InsertData() error {
	// Insertar tipos de usuarios
	tipos := []models.TipusUsuari{
		{Nom: "Administrador"},
		{Nom: "Basic"},
	}
	GetDB().Create(&tipos)

	cpass, err := services.EncryptPassword("1234")
	if err != nil {
		return err
	}

	adminUser := models.Usuari{
		Nom:           "Admin",
		TipusUsuariID: 1,
		Password:      cpass,
	}

	db.Create(&adminUser)

	return nil
}

package test

import (
	"log"
	"os"
	"sync"

	"temple-app/models"
	"temple-app/services"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db   *gorm.DB
	once sync.Once
)

func InitializeDBTest() {
	once.Do(func() {
		var err error

		dsn := os.Getenv("DB_USER_TEST") + ":" + os.Getenv("DB_PASS_TEST") +
			"@tcp(" + os.Getenv("DB_HOST_TEST") + ":" + os.Getenv("DB_PORT_TEST") + ")/" +
			os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"

		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("failed to connect to database: %v", err)
		}

		if err != nil {
			log.Fatalf("failed to connect to database: %v", err)
		}
		err = db.AutoMigrate(
			&models.TipusUsuari{}, &models.Usuari{}, &models.Sala{}, &models.UsuarisSala{}, &models.Reserva{}, &models.SolicitudUnio{},
		)

		if err != nil {
			log.Fatalf("failed to auto-migrate: %v", err)
		}
		err = GetDBTest().Where("Nom = ?", "Admin").First(&models.TipusUsuari{}).Error

		if err != nil {
			InsertDataTest()
		}
	})
}

func GetDBTest() *gorm.DB {
	if db == nil {
		InitializeDBTest()
	}
	return db
}

func InsertDataTest() error {
	// Insertar tipos de usuarios
	tipos := []models.TipusUsuari{
		{Nom: "Administrador"},
		{Nom: "Basic"},
	}
	db.Create(&tipos)

	// Insertar usuario administrador
	cpass, err := services.EncryptPassword("1234")
	if err != nil {
		return err
	}

	adminUser := models.Usuari{
		Nom:           "Admin",
		TipusUsuariID: 1,
		Password:      cpass, // Asumiendo que tienes una función `encryptPassword` definida
	}

	db.Create(&adminUser)

	return nil
}

package test

import (
	"log"
	"os"
	"sync"
	"temple-app/models"
	"temple-app/services"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

//go run gotest.tools/gotestsum@latest --format testname ./test

var (
	db   *gorm.DB
	once sync.Once
)

func InitializeDBTest() {
	once.Do(func() {
		var err error

		err = godotenv.Load("../.env")
		if err != nil {
			log.Fatalf("Error loading .env file")
		}

		dsn := os.Getenv("DB_USER_TEST") + ":" + os.Getenv("DB_PASS_TEST") +
			"@tcp(" + os.Getenv("DB_HOST_TEST") + ":" + os.Getenv("DB_PORT_TEST") + ")/" +
			os.Getenv("DB_NAME_TEST") + "?charset=utf8mb4&parseTime=True&loc=Local"

		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Silent),
		})

		if err != nil {
			log.Fatalf("failed to connect to database: %v", err)
		}
/* 
				err = db.AutoMigrate(
		   			&models.Usuari{}, &models.TipusUsuari{}, &models.Sala{}, &models.UsuarisSala{}, &models.Reserva{}, &models.SolicitudUnioSala{},
		   			&models.Exercici{}, &models.Rutina{}, &models.ExerciciRutina{}, &models.SolicitudUnioEntrenador{}, &models.UsuariResultatExercici{},
		   			&models.UsuariRutina{}, &models.HorarisEntrenador{}, &models.ConfiguracioEntrenador{},
		   		)

		   		if err != nil {
		   			log.Fatalf("failed to auto-migrate: %v", err)
		   		}

		   		if err = GetDBTest().Where("Nom = ?", "Admin").First(&models.Usuari{}).Error; err != nil {
		   			InsertData()
		   		} */

	})
}
func GetDBTest() *gorm.DB {
	if db == nil {
		InitializeDBTest()
	}
	return db
}

func InsertData() error {
	// Insertar tipos de usuarios
	tipos := []models.TipusUsuari{
		{Nom: "Administrador"},
		{Nom: "Basic"},
		{Nom: "Entrenador"},
		{Nom: "Fictici"},
	}
	GetDBTest().Create(&tipos)

	cpass, err := services.EncryptPassword("1234")
	if err != nil {
		return err
	}

	adminUser := models.Usuari{
		Nom:           "Admin",
		Email:         "admin@temple.com",
		TipusUsuariID: 1,
		Password:      cpass,
	}

	basicUser := models.Usuari{
		Nom:           "Basic",
		Email:         "basic@temple.com",
		TipusUsuariID: 2,
		Password:      cpass,
	}

	entrenadorUser := models.Usuari{
		Nom:           "Entrenador",
		Email:         "entrenador@temple.com",
		TipusUsuariID: 3,
		Password:      cpass,
	}

	configEntrenador := models.ConfiguracioEntrenador{
		DuracioSessions:     60,
		MaxAlumnesPerSessio: 4,
		EntrenadorID:        3,
	}

	db.Create(&adminUser)
	db.Create(&basicUser)
	db.Create(&entrenadorUser)

	db.Create(&configEntrenador)

	return nil
}

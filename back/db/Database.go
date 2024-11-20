package db

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

func InitializeDB() {
	once.Do(func() {
		var err error

		dsn := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASS") +
			"@tcp(" + os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT") + ")/" +
			os.Getenv("DB_NAME") + "?charset=utf8mb4&parseTime=True&loc=Local"

		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("failed to connect to database: %v", err)
		}

		err = db.AutoMigrate(
			&models.Usuari{}, &models.TipusUsuari{}, &models.Sala{}, &models.UsuarisSala{}, &models.Reserva{}, &models.SolicitudUnioSala{},
			&models.Exercici{}, &models.Rutina{}, &models.ExerciciRutina{}, &models.SolicitudUnioEntrenador{}, &models.UsuariResultatExercici{},
			&models.UsuariRutina{}, &models.HorarisEntrenador{}, &models.ConfiguracioEntrenador{},
		)

		if err != nil {
			log.Fatalf("failed to auto-migrate: %v", err)
		}

		err = GetDB().Where("Nom = ?", "Admin").First(&models.Usuari{}).Error

		if err != nil {
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
		{Nom: "Entrenador"},
		{Nom: "Fictici"},
	}
	GetDB().Create(&tipos)

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
		EntrenadorID: 3,
	}


	db.Create(&adminUser)
	db.Create(&basicUser)
	db.Create(&entrenadorUser)

	db.Create(&configEntrenador)

	db.Create(&models.Exercici{Nom: "Press de banca"})
	db.Create(&models.Exercici{Nom: "Sentadilla"})
	db.Create(&models.Exercici{Nom: "Peso muerto"})
	db.Create(&models.Exercici{Nom: "Press militar"})
	db.Create(&models.Exercici{Nom: "Dominadas"})
	db.Create(&models.Exercici{Nom: "Remo con barra"})
	db.Create(&models.Exercici{Nom: "Press inclinado"})
	db.Create(&models.Exercici{Nom: "Fondos en paralelas"})
	db.Create(&models.Exercici{Nom: "Curl de bíceps con barra"})
	db.Create(&models.Exercici{Nom: "Extensión de tríceps en polea"})
	db.Create(&models.Exercici{Nom: "Elevaciones laterales"})
	db.Create(&models.Exercici{Nom: "Elevación de gemelos"})
	db.Create(&models.Exercici{Nom: "Flexiones"})
	db.Create(&models.Exercici{Nom: "Plancha abdominal"})
	db.Create(&models.Exercici{Nom: "Zancadas"})
	db.Create(&models.Exercici{Nom: "Hip thrust"})
	db.Create(&models.Exercici{Nom: "Press Arnold"})
	db.Create(&models.Exercici{Nom: "Encogimientos de hombros"})
	db.Create(&models.Exercici{Nom: "Jalón al pecho"})
	db.Create(&models.Exercici{Nom: "Crunch abdominal"})

	return nil
}

package test

import (
        "log"
        "sync"

        "temple-app/models"
        "gorm.io/gorm"
        "gorm.io/gorm/logger"
		"gorm.io/driver/mysql"
)

var (
        db   *gorm.DB
        once sync.Once
)

func InitializeDBTest() {
        once.Do(func() {
                var err error

                dsn := "host=127.0.0.1 user=postgres password=NLe26MLC@cArfzt dbname=db1_test port=5432 sslmode=require TimeZone=UTC"

                db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
                        Logger: logger.Default.LogMode(logger.Silent),
                })
                if err != nil {
                        log.Fatalf("failed to connect to database: %v", err)
                }
                err = db.AutoMigrate(
                        &models.Festa{}, &models.Imatge{}, &models.Sala{},
                        &models.TipusUsuari{}, &models.Ubicacio{}, &models.Usuari{},
                        &models.Artista{}, &models.Estil{}, &models.Barriada{}, &models.Missatge{},
                        
                )

                if err != nil {
                        log.Fatalf("failed to auto-migrate: %v", err)
                }

                var admin models.Usuari
		result := db.Where("nom = ?", "Admin").First(&admin)
		if result.Error != nil && result.Error == gorm.ErrRecordNotFound {
			insertDataTest(db)
		}
        })
}

func GetDBTest() *gorm.DB {
        if db == nil {
                InitializeDBTest()
        }
        return db
}

func insertDataTest(db *gorm.DB) error {
        // Insertar tipos de usuarios
        tipos := []models.TipusUsuari{
            {Nom: "Administrador"},
            {Nom: "Basic"},
        }
        db.Create(&tipos)


        // Insertar usuario administrador
        cpass, err := encryptPassword("1234")
        if err != nil {
            return err
        }
    
        adminUser := models.Usuari{
            Nom:           "Admin",
            Email:         "admin@example.com",
            TipusUsuariID: 1,
            Password:      cpass, // Asumiendo que tienes una función `encryptPassword` definida
        }

        db.Create(&adminUser)
    
        return nil
    }
    

    func encryptPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}
    
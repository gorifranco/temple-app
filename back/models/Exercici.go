package models

import (
	"gorm.io/gorm"
)

type Exercici struct {
	gorm.Model
	Nom            string           `gorm:"not null;"`
	RutinaID       uint             `gorm:"not null;"`
	ExerciciRutina []ExerciciRutina `gorm:"many2many:exercici_rutina;"`
}

type ExerciciInput struct {
	Nom string `json:"nom"`
}

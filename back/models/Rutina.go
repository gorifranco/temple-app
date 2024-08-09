package models

import (
	"gorm.io/gorm"
)

type Rutina struct {
	gorm.Model
	Nom            string           `gorm:"not null;"`
	EntrenadorID   uint             `gorm:"not null;"`
	Exercicis      []Exercici       `gorm:"many2many:exercici_rutina;"`
	ExerciciRutina []ExerciciRutina `gorm:"foreignKey:RutinaID"`
	DiesDuracio    int              `gorm:"not null"`
	Cicles         int              `gorm:"not null"`
}

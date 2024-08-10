package models

import (
	"gorm.io/gorm"
)

type Rutina struct {
	gorm.Model
	Nom            string `gorm:"not null;"`
	EntrenadorID   uint   `gorm:"not null;"`
	Descripcio     string
	Exercicis      []Exercici       `gorm:"many2many:exercici_rutina;"`
	ExerciciRutina []ExerciciRutina `gorm:"foreignKey:RutinaID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	DiesDuracio    int              `gorm:"not null"`
	Cicles         int              `gorm:"not null"`
}

type RutinaInput struct {
	Nom        string `json:"nom"`
	Descripcio string `json:"descripcio"`
}

package models

import (
	"gorm.io/gorm"
)

type Rutina struct {
	gorm.Model
	Nom             string `gorm:"not null;"`
	EntrenadorID    uint   `gorm:"not null;"`
	Descripcio      string
	ExercicisRutina []ExerciciRutina `gorm:"foreignKey:RutinaID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	DiesDuracio     int              `gorm:"not null"`
	Cicles          int              `gorm:"not null"`
	Publica         bool             `gorm:"not null:default:false"`
}

func (Rutina) TableName() string {
	return "rutines"
}

type RutinaInput struct {
	Nom         string                `json:"nom"`
	Descripcio  string                `json:"descripcio"`
	Exercicis   []ExerciciRutinaInput `json:"exercicis"`
	Cicles      int                   `json:"cicles"`
	DiesDuracio int                   `json:"diesDuracio"`
}

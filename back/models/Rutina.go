package models

import (
	"gorm.io/gorm"
)

type Rutina struct {
	gorm.Model
	Nom             string `gorm:"not null;"`
	EntrenadorID    uint   `gorm:"not null;"`
	Descripcio      string
	ExercicisRutina []ExerciciRutina `gorm:"foreignKey:RutinaID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;table:exercicis_rutina"`
	DiesDuracio     uint              `gorm:"not null"`
	Cicles          uint              `gorm:"not null"`
	Publica         bool             `gorm:"not null:default:false"`
}

func (Rutina) TableName() string {
	return "rutines"
}

type RutinaInput struct {
	Nom         string                `json:"nom"`
	Descripcio  string                `json:"descripcio"`
	Exercicis   []ExerciciRutinaInput `json:"exercicis"`
	Cicles      uint                   `json:"cicles"`
	DiesDuracio uint                   `json:"diesDuracio"`
}

type RutinaResponse struct {
	ID           uint                     `json:"id"`
	Nom          string                   `json:"nom"`
	Cicles       uint                      `json:"cicles"`
	DiesDuracio  uint                      `json:"diesDuracio"`
	Exercicis    []ExerciciRutinaResponse `json:"exercicis"`
	EntrenadorID uint                     `json:"entrenadorID"`
}

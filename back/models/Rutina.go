package models

import (
	"gorm.io/gorm"
)

type RutinaBase struct {
	Nom         string `gorm:"not null json:nom"`
	Descripcio  string `json:"descripcio"`
	Cicles      uint   `gorm:"not null json:cicles"`
	DiesDuracio uint   `gorm:"not null json:diesDuracio"`
	Publica     bool   `gorm:"not null:default:false"`
}

type Rutina struct {
	RutinaBase
	gorm.Model
	EntrenadorID    uint             `gorm:"not null;"`
	ExercicisRutina []ExerciciRutina `gorm:"foreignKey:RutinaID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;table:exercicis_rutina"`
}

func (Rutina) TableName() string {
	return "rutines"
}

type RutinaInput struct {
	RutinaBase
	Exercicis []ExerciciRutinaInput `json:"exercicis"`
}

type RutinaResponse struct {
	RutinaBase
	ID        uint                     `json:"id"`
	Exercicis []ExerciciRutinaResponse `json:"exercicis"`
}

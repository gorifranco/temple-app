package models

import (
	"gorm.io/gorm"
)

type Exercici struct {
	gorm.Model
	Nom             string           `gorm:"not null;"`
	ExercicisRutina []ExerciciRutina `gorm:"foreignKey:ExerciciID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type ExerciciInput struct {
	Nom string `json:"nom"`
}

type ExerciciResponse struct {
	ID   uint   `json:"id"`
	Nom  string `json:"nom"`
}

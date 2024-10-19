package models

import (
	"gorm.io/gorm"
)

// Exercici es una estructura que representa un exercici en la base de datos.
// swagger:model Exercici
type Exercici struct {
	// ID es el identificador único del exercici.
	// example: 10
	gorm.Model
	// Nom es el nombre del exercici.
	// required: true
	// example: Extensión de tríceps en polea
	Nom             string           `gorm:"not null;"`
	// ExercicisRutina es una lista de rutinas que utilizan este exercici.
	ExercicisRutina []ExerciciRutina `gorm:"foreignKey:ExerciciID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type ExerciciInput struct {
	// Nom es el nombre del exercici.
	// required: true
	// example: Extensión de tríceps en polea
	Nom string `json:"nom"`
}

type ExerciciResponse struct {
	ID   uint   `json:"id"`
	Nom  string `json:"nom"`
}

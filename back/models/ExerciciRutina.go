package models

import (
	"gorm.io/gorm"
)

type ExerciciRutina struct {
	gorm.Model
	RutinaID    uint `gorm:"not null"`
	ExerciciID  uint `gorm:"not null"`
	Ordre       int  `gorm:"not null"`
	NumSeries   int  `gorm:"not null"`
	NumRepes    int  `gorm:"not null"`
	Cicle       int  `gorm:"not null"`
}

type ExerciciRutinaInput struct {
	RutinaID    uint `json:"rutina_id"`
	ExerciciID  uint `json:"exercici_id"`
	Ordre       int  `json:"orden"`
	NumSeries   int  `json:"num_series"`
	NumRepes    int  `json:"num_repes"`
	Cicle       int  `json:"cicle"`
}

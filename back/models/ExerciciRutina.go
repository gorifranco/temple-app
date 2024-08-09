package models

import (
	"gorm.io/gorm"
)

type ExerciciRutina struct {
	gorm.Model
	RutinaID    uint `gorm:"not null"`
	ExerciciID  uint `gorm:"not null"`
	Orden       int  `gorm:"not null"`
	NumSeries   int  `gorm:"not null"`
	NumRepes    int  `gorm:"not null"`
	Cicle       int  `gorm:"not null"`
}

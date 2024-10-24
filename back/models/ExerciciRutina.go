package models

import (
	"gorm.io/gorm"
)

type ExerciciRutina struct {
	gorm.Model
	RutinaID      uint `gorm:"not null"`
	ExerciciID    uint `gorm:"not null"`
	Exercici      Exercici
	Ordre         uint `gorm:"not null"`
	NumSeries     uint `gorm:"not null"`
	NumRepes      uint `gorm:"not null"`
	Cicle         uint `gorm:"not null"`
	PercentatgeRM uint
	DiaRutina     uint `gorm:"not null"`
}

func (ExerciciRutina) TableName() string {
	return "exercicis_rutina"
}

type ExerciciRutinaInput struct {
	ExerciciID    uint `json:"exerciciID"`
	Ordre         uint  `json:"ordre"`
	NumSeries     uint  `json:"numSeries"`
	NumRepes      uint  `json:"numRepes"`
	Cicle         uint  `json:"cicle"`
	PercentatgeRM uint  `json:"percentatgeRM"`
	DiaRutina     uint  `json:"diaRutina"`
}

type ExerciciRutinaResponse struct {
	ID            uint   `json:"id"`
	Nom           string `json:"nom"`
	Ordre         uint    `json:"ordre"`
	NumSeries     uint    `json:"numSeries"`
	NumRepes      uint    `json:"numRepes"`
	Cicle         uint    `json:"cicle"`
	PercentatgeRM uint    `json:"percentatgeRM"`
	DiaRutina     uint    `json:"diaRutina"`
	ExerciciID    uint   `json:"exerciciID"`
}

package models

import (
	"gorm.io/gorm"
)

type ExerciciRutinaBase struct {
	RutinaID      uint `gorm:"not null" json:"rutinaID"`
	ExerciciID    uint `gorm:"not null" json:"exerciciID"`
	Ordre         uint `gorm:"not null" json:"ordre"`
	NumSeries     uint `gorm:"not null" json:"numSeries"`
	NumRepes      uint `gorm:"not null" json:"numRepes"`
	Cicle         uint `gorm:"not null" json:"cicle"`
	PercentatgeRM uint `json:"percentatgeRM"`
	DiaRutina     uint `gorm:"not null" json:"diaRutina"`
}

type ExerciciRutina struct {
	gorm.Model
	Exercici      Exercici
	ExerciciRutinaBase
}

func (ExerciciRutina) TableName() string {
	return "exercicis_rutina"
}

type ExerciciRutinaInput struct {
	ExerciciRutinaBase
}

type ExerciciRutinaUpdateInput struct {
	ID            uint `json:"id"`
	ExerciciRutinaBase
}

type ExerciciRutinaResponse struct {
	ID            uint   `json:"id"`
	Nom           string `json:"nom"`
	ExerciciRutinaBase
}

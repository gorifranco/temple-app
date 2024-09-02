package models

import (
	"gorm.io/gorm"
)

type ExerciciRutina struct {
	gorm.Model
	RutinaID      uint `gorm:"not null"`
	ExerciciID    uint `gorm:"not null"`
	Ordre         int  `gorm:"not null"`
	NumSeries     int  `gorm:"not null"`
	NumRepes      int  `gorm:"not null"`
	Cicle         int  `gorm:"not null"`
	PercentatgeRM int
	DiaRutina     int `gorm:"not null"`
}

func (ExerciciRutina) TableName() string {
	return "exercicis_rutina"
}


type ExerciciRutinaInput struct {
	ExerciciID    uint `json:"exerciciID"`
	Ordre         int  `json:"ordre"`
	NumSeries     int  `json:"numSeries"`
	NumRepes      int  `json:"numRepes"`
	Cicle         int  `json:"cicle"`
	PercentatgeRM int  `json:"percentatgeRM"`
	DiaRutina     int  `json:"diaRutina"`
}

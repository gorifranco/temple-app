package models

import (
	"gorm.io/gorm"
	"time"
)

type HorarisEntrenador struct {
	gorm.Model
	EntrenadorID uint
	DiaSetmana   int       `gorm:"not null;check:dia_setmana >= 0 AND dia_setmana <= 6"`
	Desde        time.Time `gorm:"not null"`
	Fins         time.Time `gorm:"not null"`
}

func (HorarisEntrenador) TableName() string {
	return "horaris_entrenador"
}

type HorarisEntrenadorInput struct {
	DiaSetmana int    `json:"diaSetmana"`
	Desde      string `json:"desde"`
	Fins       string `json:"fins"`
}

type HorarisEntrenadorResponse struct {
	ID          uint   `json:"ID"`
	DiaSetmana  uint   `json:"diaSetmana"`
	Desde       string `json:"desde"`
	Fins        string `json:"fins"`
}
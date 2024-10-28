package models

import (
	"gorm.io/gorm"
)

type ConfiguracioEntrenador struct {
	gorm.Model
	EntrenadorID        uint
	DuracioSessions     uint   `gorm:"not null;default:60"`
	MaxAlumnesPerSessio uint   `gorm:"not null;default:0"`
}

func (ConfiguracioEntrenador) TableName() string {
	return "configuracio_entrenador"
}

type ConfiguracioEntrenadorInput struct {
	DuracioSessions     uint `json:"duracioSessions"`
	MaxAlumnesPerSessio uint `json:"maxAlumnesPerSessio"`
}

type ConfiguracioEntrenadorResponse struct {
	DuracioSessions     uint   `json:"DuracioSessions"`
	MaxAlumnesPerSessio uint   `json:"MaxAlumnesPerSessio"`
	Horaris             []HorariResponse `json:"Horaris"`
}

type HorariResponse struct {
	ID          uint   `json:"ID"`
	DiaSetmana  uint    `json:"DiaSetmana"`
	Desde       string `json:"Desde"`
	Fins        string `json:"Fins"`
}

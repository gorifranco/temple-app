package models

import (
	"gorm.io/gorm"
	"time"
)

type UsuariRutina struct {
	gorm.Model
	UsuariID         uint      `gorm:"primaryKey"`
	RutinaID         uint      `gorm:"primaryKey"`
	DataInici        time.Time `gorm:"primaryKey"`
	DataFinalitzacio time.Time `gorm:"primaryKey;default:null"`
	DiaActual        int       `gorm:"not null;default:1"`
}

func (UsuariRutina) TableName() string {
	return "usuari_rutina"
}

type UsuariRutinaInput struct {
	AlumneID uint `json:"alumneID"`
	RutinaID uint `json:"rutinaID"`
}

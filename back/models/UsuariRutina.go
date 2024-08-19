package models

import (
	"gorm.io/gorm"
	"time"
)

type UsuariRutina struct {
	gorm.Model
	UsuariID        uint      `gorm:"primaryKey"`
	RutinaID        uint      `gorm:"primaryKey"`
	DataIniciRutina time.Time `gorm:"primaryKey"`
	Acabada         bool      `gorm:"primaryKey;default:false"`
	DiaActual       int       `gorm:"not null;default:1"`
}

func (UsuariRutina) TableName() string {
	return "usuari_rutina"
}

package models

import (
	"gorm.io/gorm"
)

// Festa representa una fiesta en la base de datos
type Usuari struct {
	gorm.Model
	Nom           string 
	Telefon       string
	TipusUsuari   TipusUsuari 	`gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` //1 = administrador, 2 = basic
	TipusUsuariID uint        	`gorm:"default:2"`
	Password      string      	`gorm:"not null;"`
}

func (Usuari) TableName() string {
	return "usuaris"
}
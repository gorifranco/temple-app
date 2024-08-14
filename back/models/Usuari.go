package models

import (
	"gorm.io/gorm"
)

// Festa representa una fiesta en la base de datos
type Usuari struct {
	gorm.Model
	Nom                      string
	Telefon                  string
	Email                    string      `gorm:"not null;uniqueIndex;unique"`
	TipusUsuari              TipusUsuari `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` //1 = administrador, 2 = basic
	TipusUsuariID            uint        `gorm:"default:2"`
	Password                 string      `gorm:"not null;"`
	Sales                    []Sala      `gorm:"many2many:usuari_sala;"`
	SalesAdministrades       []Sala      `gorm:"foreignKey:AdminID"`
	Reserves                 []Reserva   `gorm:"many2many:reserves;"`
	CodiEntrenador           string
	EntrenadorID             *uint                     `gorm:"index"`
	Entrenador               *Usuari                   `gorm:"foreignKey:EntrenadorID"`
	Alumnes                  []Usuari                  `gorm:"foreignKey:EntrenadorID"`
	SolicitudsUnioEntrenador []SolicitudUnioEntrenador `gorm:"foreignKey:EntrenadorID"`
}

func (Usuari) TableName() string {
	return "usuaris"
}

type UsuariInput struct {
	Nom           string `json:"nom"`
	Password      string `json:"password"`
	TipusUsuariID uint   `json:"tipusUsuariID"`
}

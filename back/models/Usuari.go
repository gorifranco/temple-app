package models

import (
	"gorm.io/gorm"
)

// Festa representa una fiesta en la base de datos
type Usuari struct {
	gorm.Model
	Nom                      string
	Telefon                  string
	Email                    string      `gorm:"index"`
	TipusUsuari              TipusUsuari `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` //1 = administrador, 2 = basic , 3 = entrenador, 4 = fictici
	TipusUsuariID            uint        `gorm:"default:2"`
	Password                 string      `gorm:"not null;"`
	Verificat                bool        `gorm:"not null;default:false"`
	Sales                    []Sala      `gorm:"many2many:usuari_sala;"`
	SalesAdministrades       []Sala      `gorm:"foreignKey:AdminID"`
	Reserves                 []Reserva   `gorm:"many2many:reserves;"`
	CodiEntrenador           string
	EntrenadorID             *uint                     `gorm:"index"`
	Entrenador               *Usuari                   `gorm:"foreignKey:EntrenadorID"`
	Alumnes                  []Usuari                  `gorm:"foreignKey:EntrenadorID"`
	SolicitudsUnioEntrenador []SolicitudUnioEntrenador `gorm:"foreignKey:EntrenadorID"`
	ConfiguracioEntrenador   ConfiguracioEntrenador    `gorm:"foreignKey:EntrenadorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	HorarisEntrenador        []HorarisEntrenador       `gorm:"foreignKey:EntrenadorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func (Usuari) TableName() string {
	return "usuaris"
}

type UsuariInput struct {
	Nom           string `json:"nom"`
	Password      string `json:"password"`
	TipusUsuariID uint   `json:"tipusUsuariID"`
}

type UsuariFicticiInput struct {
	Nom string
}

type AlumneResponse struct {
	ID                    uint                             `json:"id"`
	Nom                   string                           `json:"nom"`
	TipusUsuari           string                           `json:"tipusUsuari"`
	Reserves              []ReservaResponse                `json:"reserves"`
	RutinaActual          uint                             `json:"rutinaActual"`
	ResultatsRutinaActual []UsuariResultatExerciciResponse `json:"resultatsRutinaActual"`
	DiaRutrinaActual      uint                             `json:"diaRutrinaActual"`
}

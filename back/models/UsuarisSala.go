package models

type UsuarisSala struct {
	UsuariID          uint `gorm:"primaryKey"`
	SalaID            uint `gorm:"primaryKey"`
	EntrenosSetmanals uint
}

func (UsuarisSala) TableName() string {
	return "usuari_sala"
}

type SolicitudInput struct {
	SalaID   uint `json:"sala_id"`
}

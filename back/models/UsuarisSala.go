package models

type UsuarisSala struct {
	UsuariID          uint `gorm:"primaryKey"`
	SalaID            uint `gorm:"primaryKey"`
	EntrenosSetmanals uint
}

func (UsuarisSala) TableName() string {
	return "usuari_sala"
}
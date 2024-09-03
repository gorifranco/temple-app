package handlers

import (
	"fmt"
	"net/http"
	"temple-app/auth"
	"temple-app/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RutinaResposta struct {
	ID          uint                     `json:"ID"`
	Nom         string                   `json:"Nom"`
	Exercicis   []ExerciciRutinaResposta `json:"Exercicis"`
	Cicles      int                      `json:"Cicles"`
	DiesDuracio int                      `json:"DiesDuracio"`
}

type ExerciciRutinaResposta struct {
	ID            uint   `json:"ID"`
	Nom           string `json:"Nom"`
	Ordre         int    `json:"Ordre"`
	NumSeries     int    `json:"NumSeries"`
	NumRepes      int    `json:"NumRepes"`
	Cicle         int    `json:"Cicle"`
	PercentatgeRM int    `json:"PercentatgeRM"`
	DiaRutina     int    `json:"DiaRutina"`
}

func (h *Handler) IndexRutina(c *gin.Context) {
	var rutinas []models.Rutina
	h.DB.Find(&rutinas)

	c.JSON(http.StatusOK, gin.H{"data": rutinas})
}

func (h *Handler) CreateRutina(c *gin.Context) {
	var input models.RutinaInput
	var err error
	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var rutina models.Rutina

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		// Crear la rutina
		rutina = models.Rutina{
			Nom:          input.Nom,
			Descripcio:   input.Descripcio,
			EntrenadorID: c.MustGet("id").(uint),
			Cicles:       input.Cicles,
			DiesDuracio:  input.DiesDuracio,
		}

		if err := tx.Create(&rutina).Error; err != nil {
			return err
		}

		fmt.Println(input.Exercicis)

		// Crear los ejercicios asociados a la rutina
		for _, exercici := range input.Exercicis {
			ex := models.ExerciciRutina{
				RutinaID:      rutina.ID,
				NumRepes:      exercici.NumRepes,
				NumSeries:     exercici.NumSeries,
				Cicle:         exercici.Cicle,
				PercentatgeRM: exercici.PercentatgeRM,
				DiaRutina:     exercici.DiaRutina,
				ExerciciID:    exercici.ExerciciID,
			}

			if err := tx.Create(&ex).Error; err != nil {
				return err
			}
		}

		// Si todo fue bien, retornar nil para confirmar la transacción
		return nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create rutina or exercicis", "details": err.Error()})
		return
	}

	// Si la transacción fue exitosa, cargar la rutina creada con los ejercicios
	var createdRutina models.Rutina
	if err := h.DB.Preload("ExercicisRutina").First(&createdRutina, rutina.ID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to load created rutina"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": createdRutina})
}
func (h Handler) UpdateRutina(c *gin.Context) {
	var rutina models.Rutina
	if err := h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
	}

	var input models.RutinaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedRutina := models.Rutina{Nom: input.Nom, Descripcio: input.Descripcio}

	h.DB.Model(&rutina).Updates(&updatedRutina)

	var uu models.Rutina
	h.DB.Preload("Exercicis").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, gin.H{"data": uu})
}

func (h *Handler) DeleteRutina(c *gin.Context) {
    // Iniciar una transacción
    err := h.DB.Transaction(func(tx *gorm.DB) error {
        var rutina models.Rutina
        if err := tx.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
            return err // Esto provocará un rollback automático
        }

        // Eliminar los ejercicios asociados
        if err := tx.Where("rutina_id = ?", rutina.ID).Delete(&models.ExerciciRutina{}).Error; err != nil {
            return err // Esto también provocará un rollback si falla
        }

        // Eliminar la rutina
        if err := tx.Delete(&rutina).Error; err != nil {
            return err // Rollback si falla
        }

        return nil // Si todo va bien, la transacción se compromete automáticamente
    })

    // Manejo de errores fuera de la transacción
    if err != nil {
        c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete rutina and related exercises"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": "success"})
}


func (h *Handler) RutinesEntrenador(c *gin.Context) {
	var rutines []models.Rutina
	h.DB.Find(&rutines).Where("entrenador_id = ?", auth.GetUsuari(c))

	query := `SELECT exercici_id as ID, ex.nom as nom, ordre as ordre, num_series as numSeries, num_repes as numRepes, cicle as cicle,
    percentatge_rm as percentatgeRM, dia_rutina as diaRutina FROM exercicis_rutina e 
    INNER JOIN exercicis ex ON ex.id = e.exercici_id 
    WHERE e.rutina_id = ? AND e.deleted_at IS NULL`

	var rutinesResposta []RutinaResposta

	for _, rutina := range rutines {
		var ex []ExerciciRutinaResposta
		rows, err := h.DB.Raw(query, rutina.ID).Rows()
		if err != nil {
			fmt.Println("Error executing query:", err)
			continue
		}
		defer rows.Close()

		for rows.Next() {
			var exercici ExerciciRutinaResposta
			err := rows.Scan(&exercici.ID, &exercici.Nom, &exercici.Ordre, &exercici.NumSeries, &exercici.NumRepes,
				&exercici.Cicle, &exercici.PercentatgeRM, &exercici.DiaRutina)
			if err != nil {
				fmt.Println("Error scanning row:", err)
				continue
			}

			ex = append(ex, exercici)
		}

		rutinesResposta = append(rutinesResposta, RutinaResposta{
			ID:          rutina.ID,
			Nom:         rutina.Nom,
			Cicles:      rutina.Cicles,
			DiesDuracio: rutina.DiesDuracio,
			Exercicis:   ex,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": rutinesResposta})
}

func (h *Handler) RutinesPubliques(c *gin.Context) {
	var rutines []models.Rutina

	h.DB.Find(&rutines).Where("publica = ?", true).Preload("Exercicis")

	c.JSON(http.StatusOK, gin.H{"data": rutines})
}

func (h *Handler) CanviarVisibilitat(c *gin.Context) {
	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	if rutina.EntrenadorID != auth.GetUsuari(c) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	rutina.Publica = !rutina.Publica

	err = h.DB.Model(&rutina).Update("publica", rutina.Publica).Error

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update rutina"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rutina})
}

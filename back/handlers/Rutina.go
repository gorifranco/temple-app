package handlers

import (
	"fmt"
	"net/http"
	"temple-app/models"
	"time"

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
	ExerciciID    uint   `json:"ExerciciID"`
	Nom           string `json:"Nom"`
	Ordre         int    `json:"Ordre"`
	NumSeries     int    `json:"NumSeries"`
	NumRepes      int    `json:"NumRepes"`
	Cicle         int    `json:"Cicle"`
	PercentatgeRM int    `json:"PercentatgeRM"`
	DiaRutina     int    `json:"DiaRutina"`
}


// @Summary Get all rutines
// @Description Retrieves all the rutines from the database.
// @Tags Rutines
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RutinaResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines [get]
func (h *Handler) IndexRutina(c *gin.Context) {
	var rutinas []models.Rutina
	h.DB.Find(&rutinas)

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rutinas})
}


// @Summary Create a new rutine
// @Description Creates a new rutine in the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body models.RutinaInput true "Rutine to create"
// @Success 200 {object} models.SuccessResponse{data=models.RutinaResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 409 {object} models.ErrorResponse "Conflict"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines [post]
func (h *Handler) CreateRutina(c *gin.Context) {
	var input models.RutinaInput
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	var rutina models.Rutina

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		// Create the routine
		rutina = models.Rutina{
			Nom:          input.Nom,
			Descripcio:   input.Descripcio,
			EntrenadorID: c.MustGet("user").(models.Usuari).ID,
			Cicles:       input.Cicles,
			DiesDuracio:  input.DiesDuracio,
		}

		if err := tx.Create(&rutina).Error; err != nil {
			return err
		}

		// Create the exercises associated with the routine
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

			if err = tx.Create(&ex).Error; err != nil {
				return err
			}
		}

		// If everything went well, return nil to confirm the transaction
		return nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	// If the transaction was successful, load the created routine with the exercises
	var createdRutina models.Rutina
	if err = h.DB.Preload("ExercicisRutina").First(&createdRutina, rutina.ID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to load created rutina"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: createdRutina})
}


// @Summary Update a rutine
// @Description Updates a rutine in the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the rutine to update"
// @Param input body models.RutinaInput true "Rutine to update"
// @Success 200 {object} models.SuccessResponse{data=models.RutinaResponse}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/{id} [put]
func (h Handler) UpdateRutina(c *gin.Context) {
	var rutina models.Rutina
	var err error

	// Retrieve the rutine from the database
	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
	}

	var input models.RutinaInput

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	// Update the rutine in the database
	updatedRutina := models.Rutina{Nom: input.Nom, Descripcio: input.Descripcio}

	if err = h.DB.Model(&rutina).Updates(&updatedRutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update rutina"})
		return
	}

	var uu models.Rutina
	h.DB.Preload("Exercicis").First(&uu, c.Param("id"))

	c.JSON(http.StatusOK, models.SuccessResponse{Data: uu})
}


// @Summary Delete a rutine
// @Description Deletes a rutine from the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the rutine to delete"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/{id} [delete]
func (h *Handler) DeleteRutina(c *gin.Context) {

	//Starts a new transaction
	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var rutina models.Rutina
		var err error

		if err = tx.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
			return err
		}

		// Delete the exercises associated with the routine
		if err = tx.Where("rutina_id = ?", rutina.ID).Delete(&models.ExerciciRutina{}).Error; err != nil {
			return err
		}

		// Delete the routine
		if err = tx.Delete(&rutina).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to delete rutina and related exercises"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "success"})
}


// @Summary Get all rutines of an entrenador
// @Description Retrieves all the rutines of an entrenador from the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RutinaResponse}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/rutinesEntrenador [get]
func (h *Handler) RutinesEntrenador(c *gin.Context) {
	var rutines []models.Rutina


	//Retrieves all the rutines of the trainer
	h.DB.Find(&rutines).Where("entrenador_id = ?", c.MustGet("user").(models.Usuari).ID)

	query := `SELECT e.id as ID, e.exercici_id as exerciciID, ex.nom as nom, ordre as ordre, num_series as numSeries, num_repes as numRepes, cicle as cicle,
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
			err := rows.Scan(&exercici.ID, &exercici.ExerciciID, &exercici.Nom, &exercici.Ordre, &exercici.NumSeries, &exercici.NumRepes,
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

	if rutina.EntrenadorID != c.MustGet("user").(models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	rutina.Publica = !rutina.Publica

	if err = h.DB.Model(&rutina).Update("publica", rutina.Publica).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update rutina"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rutina})
}

func (h *Handler) AcabarRutina(c *gin.Context) {

	type inputStruct struct {
		UsuariID uint `json:"usuariID"`
	}
	var input inputStruct
	var rutina models.UsuariRutina
	var user models.Usuari
	var err error

	if err = c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err = h.DB.Where("id = ?", input.UsuariID).First(&user).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	if user.EntrenadorID != nil && *user.EntrenadorID != c.MustGet("id").(uint) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err = h.DB.Where("usuari_id = ? and data_finalitzacio is null", user.ID).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}

	var now = time.Now()

	rutina.DataFinalitzacio = &now
	h.DB.Save(&rutina)

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) AssignarRutina(c *gin.Context) {
	var rutina models.Rutina
	var alumne models.Usuari
	var err error

	var input models.UsuariRutinaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if err = h.DB.Where("id = ?", input.RutinaID).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	if err = h.DB.Where("id = ?", input.AlumneID).First(&alumne).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	if rutina.EntrenadorID != c.MustGet("user").(models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}


	//Ends the current user's routine before starting a new one
	var r models.UsuariRutina
	if err = h.DB.Where("data_finalitzacio is null and usuari_id = ?", alumne.ID).First(&r).Error; err != nil {
		var now = time.Now()
		r.DataFinalitzacio = &now
		h.DB.Save(&r)
	}

	var nova = models.UsuariRutina{UsuariID: alumne.ID, RutinaID: rutina.ID, DataInici: time.Now()}

	if err = h.DB.Create(&nova).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create new user rutina"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}

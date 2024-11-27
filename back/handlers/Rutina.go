package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"temple-app/models"
	"temple-app/validators"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// @Summary Get all rutines
// @Description Retrieves all the rutines from the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RutinaResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/admin/rutines [get]
func (h *Handler) IndexRutina(c *gin.Context) {
	var rutines []models.Rutina
	h.DB.Find(&rutines)

	// Map the results to the response type
	var rutinesResponse []models.RutinaResponse
	for _, rutina := range rutines {
		tmp := models.RutinaResponse{
			RutinaBase: models.RutinaBase{
				Nom:         rutina.Nom,
				Cicles:      rutina.Cicles,
				DiesDuracio: rutina.DiesDuracio,
				Descripcio:  rutina.Descripcio,
				Publica:     rutina.Publica,
			},
			ID:        rutina.ID,
		}
		if err := h.DB.Table("exercicis_rutina").Where("rutina_id = ? and deleted_at is null", rutina.ID).Scan(&tmp.Exercicis).Error; err != nil {
			fmt.Println(err)
		}
		rutinesResponse = append(rutinesResponse, tmp)
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rutinesResponse})
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

	if errs := validators.RutinaValidator(&input, h.DB); len(errs) > 0 {
		v, err := json.Marshal(errs)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Datos incorrectos"})
		}
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: v})
		return
	}
	var rutina models.Rutina

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		// Create the routine
		rutina = models.Rutina{
			RutinaBase: models.RutinaBase{
				Nom:         input.Nom,
				Cicles:      input.Cicles,
				DiesDuracio: input.DiesDuracio,
				Descripcio:  input.Descripcio,
				Publica:     false,
			},
			EntrenadorID: c.MustGet("user").(*models.Usuari).ID,
		}

		if err := tx.Create(&rutina).Error; err != nil {
			return err
		}

		// Create the exercises associated with the routine
		for _, exercici := range input.Exercicis {
			ex := models.ExerciciRutina{
				ExerciciRutinaBase: models.ExerciciRutinaBase{
					RutinaID:      rutina.ID,
					NumRepes:      exercici.NumRepes,
					NumSeries:     exercici.NumSeries,
					Cicle:         exercici.Cicle,
					PercentatgeRM: exercici.PercentatgeRM,
					DiaRutina:     exercici.DiaRutina,
					ExerciciID:    exercici.ExerciciID,
				},
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
	var createdRutina models.RutinaResponse
	if err = h.DB.Table("rutines").Select("id, nom, dies_duracio, cicles, entrenadorID").Where("id = ?", rutina.ID).Scan(&createdRutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to load created rutina"})
		return
	}
	h.DB.Table("exercicis_rutina").Where("rutina_id = ? and deleted_at is not null", rutina.ID).Scan(&createdRutina.Exercicis)

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

	if errs := validators.RutinaValidator(&input, h.DB); len(errs) > 0 {
		v, err := json.Marshal(errs)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Datos incorrectos"})
		}
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: v})
		return
	}

	err = h.DB.Transaction(func(tx *gorm.DB) error {

		if err = tx.Model(&rutina).Updates(models.Rutina{
			RutinaBase: models.RutinaBase{
				Nom:         input.Nom,
				Cicles:      input.Cicles,
				DiesDuracio: input.DiesDuracio,
				Descripcio:  input.Descripcio,
				Publica:     input.Publica,
			},
			EntrenadorID: c.MustGet("user").(*models.Usuari).ID,
		}).Error; err != nil {
			fmt.Printf("Error al actualizar la rutina: %v\n", err)
			return err
		}

		exercicis := make([]models.ExerciciRutina, len(input.Exercicis))
		for i, exercici := range input.Exercicis {
			exercicis[i] = models.ExerciciRutina{
				ExerciciRutinaBase: models.ExerciciRutinaBase{
					RutinaID:      rutina.ID,
					NumRepes:      exercici.NumRepes,
					NumSeries:     exercici.NumSeries,
					Cicle:         exercici.Cicle,
					PercentatgeRM: exercici.PercentatgeRM,
					DiaRutina:     exercici.DiaRutina,
					ExerciciID:    exercici.ExerciciID,
				},
			}
			fmt.Print("ExerciciID: ", exercici.ExerciciID)
		}

		if err := tx.Model(&rutina).Association("ExercicisRutina").Unscoped().Replace(&exercicis); err != nil {
			fmt.Printf("Error al actualizar la rutina: %v\n", err)
			return err
		}

		/* 		// Obtener los IDs de los ejercicios en el input
		   		inputExerciciIDs := make([]uint, len(input.Exercicis))
		   		for i, exercici := range input.Exercicis {
		   			inputExerciciIDs[i] = exercici.ExerciciID
		   		}

		   		// Eliminar los ejercicios que no están en el nuevo input
		   		if err := tx.Where("rutina_id = ? AND exercici_id NOT IN ?", rutina.ID, inputExerciciIDs).Delete(&models.ExerciciRutina{}).Error; err != nil {
		   			fmt.Printf("Error al eliminar ejercicios: %v\n", err)
		   			return err
		   		}
		   		fmt.Print("a3")
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

		   			// Realizar un upsert para cada ejercicio
		   			if err := tx.Where("rutina_id = ? AND exercici_id = ?", rutina.ID, exercici.ExerciciID).
		   				Assign(ex).
		   				FirstOrCreate(&ex).Error; err != nil {
		   					fmt.Printf("Error al actualizar ejercicio: %v\n", err)
		   				return err
		   			}
		   		} */

		return nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update rutina"})
		return
	}

	var updatedRutina models.Rutina
	if err = h.DB.Preload("ExercicisRutina").First(&updatedRutina, rutina.ID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to load updated rutina"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: updatedRutina})
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
	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}
	if c.MustGet("user").(*models.Usuari).TipusUsuari.Nom != "Administrador" && rutina.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	//Starts a new transaction
	err = h.DB.Transaction(func(tx *gorm.DB) error {

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

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
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
	h.DB.Where("entrenador_id = ? and deleted_at is null", c.MustGet("user").(*models.Usuari).ID).Find(&rutines)

	query := `SELECT e.id as ID, e.exercici_id as exerciciID, ex.nom as nom, ordre as ordre, num_series as numSeries, num_repes as numRepes, cicle as cicle,
    percentatge_rm as percentatgeRM, dia_rutina as diaRutina FROM exercicis_rutina e 
    INNER JOIN exercicis ex ON ex.id = e.exercici_id 
    WHERE e.rutina_id = ? AND e.deleted_at IS NULL`

	var rutinesResposta []models.RutinaResponse

	for _, rutina := range rutines {
		var ex []models.ExerciciRutinaResponse
		rows, err := h.DB.Raw(query, rutina.ID).Rows()
		if err != nil {
			fmt.Println("Error executing query:", err)
			continue
		}
		defer rows.Close()

		for rows.Next() {
			var exercici models.ExerciciRutinaResponse
			err := rows.Scan(&exercici.ID, &exercici.ExerciciID, &exercici.Nom, &exercici.Ordre, &exercici.NumSeries, &exercici.NumRepes,
				&exercici.Cicle, &exercici.PercentatgeRM, &exercici.DiaRutina)
			if err != nil {
				fmt.Println("Error scanning row:", err)
				continue
			}

			ex = append(ex, exercici)
		}

		rutinesResposta = append(rutinesResposta, models.RutinaResponse{
			RutinaBase: models.RutinaBase{
				Nom:         rutina.Nom,
				Cicles:      rutina.Cicles,
				DiesDuracio: rutina.DiesDuracio,
				Descripcio:  rutina.Descripcio,
				Publica:     rutina.Publica,
			},
			Exercicis: ex,
			ID:        rutina.ID,
		})
	}

	if rutinesResposta == nil {
		rutinesResposta = []models.RutinaResponse{}
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rutinesResposta})
}

// @Summary Get all public rutines
// @Description Retrieves all the public rutines from the database.
// @Tags Rutines
// @Accept json
// @Produce json
// @Success 200 {object} models.SuccessResponse{data=[]models.RutinaResponse}
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/rutinesPubliques [get]
func (h *Handler) RutinesPubliques(c *gin.Context) {
	var rutines []models.Rutina

	h.DB.Find(&rutines).Where("publica = ?", true).Preload("Exercicis")

	c.JSON(http.StatusOK, models.SuccessResponse{Data: rutines})
}

// @Summary Change the visibility of a rutine
// @Description Changes the visibility of a rutine in the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "ID of the rutine to change the visibility"
// @Success 200 {object} models.SuccessResponse{data=models.Rutina}
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/{id}/canviarVisibilitat [put]
func (h *Handler) CanviarVisibilitat(c *gin.Context) {
	var rutina models.Rutina
	var err error

	if err = h.DB.Where("id = ?", c.Param("id")).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	if rutina.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
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

// @Summary Assign a rutine to an alumne
// @Description Assigns a rutine to an alumne in the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body models.UsuariRutinaInput true "Alumne to assign the rutine to"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/assignarRutina [post]
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
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	if user.EntrenadorID == nil || *user.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	if err = h.DB.Where("usuari_id = ? and data_finalitzacio is null", input.UsuariID).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	var now = time.Now()

	if err = h.DB.Model(&rutina).Select("DataFinalitzacio").Updates(models.UsuariRutina{DataFinalitzacio: &now}).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to update rutina"})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Data: "success"})
}

// @Summary Assign a rutine to an alumne
// @Description Assigns a rutine to an alumne in the database.
// @Tags Rutines
// @Security Bearer
// @Accept json
// @Produce json
// @Param input body models.UsuariRutinaInput true "Alumne to assign the rutine to"
// @Success 200 {object} models.SuccessResponse{data=string}
// @Failure 400 {object} models.ErrorResponse "Bad request"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /api/rutines/assignarRutina [post]
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

	if rutina.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
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

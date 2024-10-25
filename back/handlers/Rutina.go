package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sort"
	"temple-app/models"
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
			ID:           rutina.ID,
			Nom:          rutina.Nom,
			DiesDuracio:  rutina.DiesDuracio,
			Cicles:       rutina.Cicles,
			EntrenadorID: rutina.EntrenadorID,
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
	if errs := h.RutinaValidator(&input); len(errs) > 0 {
		v, err := json.Marshal(errs)
		if err != nil{
			c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: "Datos incorrectos"})
		}
		c.AbortWithStatusJSON(http.StatusBadRequest, models.ErrorResponse{Error: v})
		return
	}

	var rutina models.Rutina

	err = h.DB.Transaction(func(tx *gorm.DB) error {
		// Create the routine
		rutina = models.Rutina{
			Nom:          input.Nom,
			Descripcio:   input.Descripcio,
			EntrenadorID: c.MustGet("user").(*models.Usuari).ID,
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
			ID:           rutina.ID,
			Nom:          rutina.Nom,
			Cicles:       rutina.Cicles,
			DiesDuracio:  rutina.DiesDuracio,
			EntrenadorID: rutina.EntrenadorID,
			Exercicis:    ex,
		})
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

	if user.EntrenadorID != nil && *user.EntrenadorID != c.MustGet("user").(*models.Usuari).ID {
		c.AbortWithStatusJSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Unauthorized"})
		return
	}

	if err = h.DB.Where("usuari_id = ? and data_finalitzacio is null", user.ID).First(&rutina).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, models.ErrorResponse{Error: "record not found"})
		return
	}

	var now = time.Now()

	rutina.DataFinalitzacio = &now
	if err = h.DB.Save(&rutina).Error; err != nil {
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

func (h *Handler) RutinaValidator(rutina *models.RutinaInput) []error {
	var errs []error

	if rutina.Nom == "" {
		errs = append(errs, errors.New("nom no pot ser buit"))
	}
	if rutina.Cicles <= 0 {
		errs = append(errs, errors.New("cicles no pot estar buit"))
	}
	if rutina.DiesDuracio <= 0 {
		errs = append(errs, errors.New("DiesDuracio no pot estar buit"))
	}
	if rutina.DiesDuracio > 7 {
		errs = append(errs, errors.New("DiesDuracio no pot ser superior a 7"))
	}
	if len(rutina.Exercicis) == 0 {
		errs = append(errs, errors.New("exercicis no pot estar buit"))
	}

	//IDs of the exercises
	var ids []uint
	if err := h.DB.Table("exercicis").Where("deleted_at IS NULL").Pluck("id", &ids).Error; err != nil {
		errs = append(errs, fmt.Errorf("error al recuperar IDs de exercicis: %v", err))
	}

	// Convert the slice to a map for faster lookups
	exerciseIDMap := make(map[uint]bool)
	for _, id := range ids {
		exerciseIDMap[id] = true
	}

	// Initializa the map of ordres
	ordres := make(map[uint][]uint)

	// Validates every exercise
	for _, exercici := range rutina.Exercicis {
		if !exerciseIDMap[exercici.ExerciciID] {
			errs = append(errs, errors.New("exercici no existeix"))
		}
		if exercici.NumRepes <= 0 {
			errs = append(errs, errors.New("NumRepes no pot estar buit"))
		}
		if exercici.Cicle <= 0 {
			errs = append(errs, errors.New("cicle no pot estar buit"))
		}
		if exercici.Cicle > rutina.Cicles {
			errs = append(errs, errors.New("cicle de l'exercici no coincideix amb els cicles de la rutina"))
		}

		// Guardar el ordre en el mapa de ordres
		ordres[exercici.Cicle] = append(ordres[exercici.Cicle], uint(exercici.Ordre))
	}

	// Validar que los ordres sean consecutivos en cada cicle
	for _, ordresCicle := range ordres {
		if len(ordresCicle) > 1 {
			sort.Slice(ordresCicle, func(i, j int) bool {
				return ordresCicle[i] < ordresCicle[j]
			})
			for i := 1; i < len(ordresCicle); i++ {
				if ordresCicle[i] != ordresCicle[i-1]+1 {
					errs = append(errs, errors.New("els ordres no estan consecutius"))
				}
			}
		}
	}

	return errs
}

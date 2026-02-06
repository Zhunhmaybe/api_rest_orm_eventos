const { Router } = require('express')
const router = Router()

const { createEvento, updateEvento, deleteEvento, getEventos, getEventosById, asignarParticipante,
    getSalasConEventos,
    getEventoConParticipantes,
    getSalasEventosDeParticipante,
} = require('../controllers/evento-controller')

const {
    getSalas, createSala, updateSala, deleteSala
} = require('../controllers/sala-controller')

const {
    getParticipantes, createParticipante, updateParticipante, deleteParticipante
} = require('../controllers/participante-controller')

router.get('/', (req, res) => { res.send('Bienvenidos a mi API de BLOGS') })
//

router.post('/evento', createEvento)
router.put('/evento', updateEvento)
router.delete('/evento', deleteEvento)
router.get('/eventos', getEventos)
router.get('/evento/:id', getEventosById)

router.post('/evento/participante', asignarParticipante)
router.delete('/evento/participante', deleteParticipante)

router.get('/salas-eventos', getSalasConEventos)
router.get('/evento-participantes', getEventoConParticipantes)
router.get('/participante-eventos', getSalasEventosDeParticipante)

// Salas Routes
router.get('/salas', getSalas)
router.post('/sala', createSala)
router.put('/sala', updateSala)
router.delete('/sala', deleteSala)

// Participantes Routes
router.get('/participantes', getParticipantes)
router.post('/participante', createParticipante)
router.put('/participante', updateParticipante)
router.delete('/participante', deleteParticipante)

module.exports = router




const {Router} = require('express')
const router = Router()

const {createEvento, updateEvento, deleteEvento, getEventos, getEventosById,asignarParticipante,
    deleteParticipante,
    getSalasConEventos,
    getEventoConParticipantes,
    getSalasEventosDeParticipante,
} = require('../controllers/evento-controller')

router.get('/', (req, res)=>{res.send('Bienvenidos a mi API de BLOGS')})
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


// router.get('/pizzas', getPizzas)

// router.get('/pizzas/:id', getPizzasById)

module.exports = router
    



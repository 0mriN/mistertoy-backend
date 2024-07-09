import path from 'path';
import express from 'express'
import cors from 'cors'
import { toyService } from './services/toy.service.js';



const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}
app.use(cors(corsOptions))


app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/toy', (req, res) => {
    console.log('get list')
    const filterBy = {
        name: req.query.name || '',
        price: +req.query.price || 0,
    }
    toyService.query(filterBy)
        .then((toy) => {
            res.send(toy)
        })
        .catch((err) => {
            res.status(400).send('Cannot get toys')
        })
})


app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then((toy) => {
            res.send(toy)
        })
        .catch((err) => {
            res.status(400).send('Cannot get toy')
        })
})

app.post('/api/toy', (req, res) => {
    const toy = {
        name: req.body.name,
        price: +req.body.price,
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            res.status(400).send('Cannot save toy')
        })

})

app.put('/api/toy', (req, res) => {
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        price: +req.body.price,
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch((err) => {
            res.status(400).send('Cannot save toy')
        })

})

app.delete('/api/toy/:toyId', (req, res) => {
    const { carId: toyId } = req.params
    toyService.remove(toyId)
        .then(() => {
            res.send('Removed!')
        })
        .catch((err) => {
            res.status(400).send('Cannot remove car')
        })

})

const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)

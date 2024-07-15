import path,{ dirname } from 'path';
import express from 'express'
import cors from 'cors'
// import { toyService } from './services/toy.service.js';
import cookieParser from 'cookie-parser';
import { logger } from './services/logger.service.js';
import { toyRoutes } from './api/toy/toy.routes.js';
import { userRoutes } from './api/user/user.routes.js';
import { authRoutes } from './api/auth/auth.routes.js';
import { toyService } from './api/toy/toy.service.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
logger.info('server.js loaded...')
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

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)

// app.get('/api/toy', (req, res) => {
//     const { filterBy = {}, sortBy = {}, pageIdx } = req.query
//     toyService.query(filterBy, sortBy, pageIdx)
//       .then(toys => {
//         res.send(toys)
//       })
//       .catch(err => {
//         loggerService.error('Cannot load toys', err)
//         res.status(400).send('Cannot load toys')
//       })
//   })
// app.get('/api/toy', (req, res) => {
//     console.log('hello');
//     const filterBy = {
//         name: req.query.name || '',
//         price: +req.query.price || 0,
//     }
//     toyService.query(filterBy)
//         .then((toy) => {
//             console.log('toy:', toy);
//             res.send(toy)
//         })
//         .catch((err) => {
//             res.status(400).send('Cannot get toys')
//         })
// })


// app.get('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.getById(toyId)
//         .then((toy) => {
//             res.send(toy)
//         })
//         .catch((err) => {
//             res.status(400).send('Cannot get toy')
//         })
// })

// app.post('/api/toy', (req, res) => {
//     const toy = {
//         name: req.body.name,
//         price: +req.body.price,
//         labels: req.body.labels,
//     }
//     toyService.save(toy)
//         .then((savedToy) => {
//             res.send(savedToy)
//         })
//         .catch((err) => {
//             res.status(400).send('Cannot save toy')
//             console.log('err:', err);
//         })

// })

// app.put('/api/toy', (req, res) => {
//     const toy = {
//         _id: req.body._id,
//         name: req.body.name,
//         price: +req.body.price,
//     }
//     toyService.save(toy)
//         .then((savedToy) => {
//             res.send(savedToy)
//         })
//         .catch((err) => {
//             res.status(400).send('Cannot save toy')
//         })

// })

// app.delete('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.remove(toyId)
//         .then(() => {
//             res.send('Removed!')
//         })
//         .catch((err) => {
//             res.status(400).send('Cannot remove toy')
//             console.log('err:', err);
//         })

// })

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = 3030
app.listen(PORT, () =>
    console.log(`Server listening on port http://127.0.0.1:${PORT}/`)
)

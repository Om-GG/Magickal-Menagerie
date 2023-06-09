import express from 'express'
import path from 'path'

import petInteractionRoutes from './routes/petInteractions'
import { join } from 'node:path'

import speciesRoutes from './routes/species'
import petRoutes from './routes/pet'
import userRoutes from './routes/user'
import profilesRoutes from './routes/profiles'
import walletRoutes from './routes/wallet'
import otherPetRoutes from './routes/otherPet'

const server = express()

server.use(express.json())
server.use(express.static(path.join(__dirname, 'public')))

server.use('/api/v1/petInteraction', petInteractionRoutes)
server.use('/api/v1/species', speciesRoutes)
server.use('/api/v1/pet', petRoutes)
server.use('/api/v1/adduser', userRoutes)
server.use('/api/v1/profiles', profilesRoutes)
server.use('/api/v1/wallet', walletRoutes)
server.use('/api/v1/otherPet', otherPetRoutes)

server.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'))
})

export default server

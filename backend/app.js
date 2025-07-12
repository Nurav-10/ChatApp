import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)

const io = new Server(server, {
   cors: {
      origin: '*',
      methods: ['GET', 'POST']
   }
})

app.use(cors())

app.get('/', (req, res) => {
   res.json({
      message: 'Hello',
      success: true
   })
})
const generateRoomId=(id1,id2)=>{
   return [id1,id2].sort().join('-')
}

io.on('connection', (socket) => {
   console.log('welcome to the chat services app')

   socket.on('PrivateRoom',({userId,peerId})=>{
      const roomId=generateRoomId(userId,peerId)
      socket.join(roomId)
      socket.data.userId=userId
      console.log(`${userId} joined the room ${roomId}`)
   }),

   socket.on('PrivateMessage',({senderId,receiverId,data})=>{
      const roomId=generateRoomId(senderId,receiverId)

      io.to(roomId).emit('newPrivateMessage',{senderId,data})
   })
})


const port = 5000

server.listen(port, () => {
   console.log(`Server is listening on PORT ${port}`)
})
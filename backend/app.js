import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import AuthRoute from './routes/authRoute.js'
import uploadImage from './routes/uploadImage.js'
import UserList from './routes/userListRoute.js'
import MessageRoute from './routes/messageRoute.js'
import Message from './models/messageModel.js'

const app = express()
const server = createServer(app)

const io = new Server(server, {
   transports: ['websocket'],
   cors: {
      origin: '*',
      methods: ['GET', 'POST']
   }
})

app.use(cors())
app.use(express.json())
app.use('/api/auth', AuthRoute)
app.use('/api', uploadImage)
app.use('/api/list', UserList)
app.use('/api/chats', MessageRoute)

app.get('/', (req, res) => {
   res.json({
      message: 'Hello',
      success: true
   })
})

//non persistent Chats.
const socketMap = new Map()
const privateChats = new Map()
const privateRoom = new Map()

io.on('connection', (socket) => {

   //admin join.
   socket.on('join-admin', ({ name, roomId }) => {
      const roomExist = Array.from(privateRoom.values()).some((user) => user.roomId === roomId && user.admin === true)
      if (roomExist) {
         socket.emit('error', { msg: `Room ${roomId} already Exist` })
         return
      }
      else {
         privateRoom.set(name, { socketId: socket.id, roomId, admin: true })
         socket.join(roomId)
         console.log(privateRoom)
      }
      const userOnlineInRoom = Array.from(privateRoom, ([name, user]) => ({
         name,
         roomId: user.roomId,
         socketId: user.socketId,
         admin: user.admin
      })).filter((user) => user.roomId === roomId)


      io.to(roomId).emit('online', ({ privateUserList: userOnlineInRoom }))
      io.to(roomId).emit('welcome', ({ msg: `Welcome ${name} to the Room ${roomId}` }))


   })

   socket.on('join-private', ({ name, roomId }) => {


      //check if room exist.
      const existRoom = Array.from(privateRoom.values()).some((user) => user.roomId === roomId)
      if (!existRoom) {
         socket.emit('error', { msg: `Room ${roomId} doesn't Exist` })
         return
      }
      const existingUser = privateRoom.get(name)

      if (existingUser && existingUser.roomId === roomId) {
         console.log(`${name} already exists in room ${roomId}`);
         socket.emit("error-message", {
            msg: `${name} already exists in room ${roomId}`,
         });
         return;
      }

      else {
         privateRoom.set(name, { socketId: socket.id, roomId, admin: false });
         socket.join(roomId);
      }



      // console.log(`${name} join the room ${roomId} and socketId ${socket.id}`)

      const userOnlineInRoom = Array.from(privateRoom, ([name, user]) => ({
         name,
         roomId: user.roomId,
         socketId: user.socketId,
         admin: user.admin
      })).filter((user) => user.roomId === roomId)


      io.to(roomId).emit('online', ({ privateUserList: userOnlineInRoom }))
      io.to(roomId).emit('welcome', ({ msg: `Welcome ${name} to the Room ${roomId}` }))
      console.log(privateRoom)
   })

   //admin removing the users.
   socket.on("kick-user", ({ socketId,roomId,admin,name }) => {

      const isAdmin = Array.from(privateRoom.values()).some(
         (u) => u.socketId === socket.id && admin
      );

      if (!isAdmin) return;

      socket.to(socketId).emit("removed",({msg:`${name} is removed by the admin`}))
      
      const targetSocket = io.sockets.sockets.get(socketId);
      if (targetSocket) targetSocket.disconnect(true);
      
      const userOnlineInRoom = Array.from(privateRoom, ([name, user]) => ({
         name,
         roomId: user.roomId,
         socketId: user.socketId,
         admin: user.admin
      })).filter((user) => user.roomId === roomId)

      console.log(userOnlineInRoom)
      io.to(userOnlineInRoom[0].roomId).emit("online", { privateUserList: userOnlineInRoom });
   });

   socket.on('new-message', ({ name, message }) => {
      // console.log(name,message)
      io.to(message.roomId).emit('receiveMessage', ({ name, message }))
      console.log(name, message)
   })

   socket.on('join-room', ({ senderId }) => {
      if (socketMap[senderId]) {
         socket.emit('error-message', `${senderId} already exists Please enter different username`)
         return
      }
      socketMap[senderId] = socket.id
      // console.log(`${senderId} joined the chat`)
   })


   socket.on('newMessage', ({ senderId, receiverId, message }) => {
      const receiverSocketId = socketMap[receiverId]
      const senderSocketId = socketMap[senderId]

      // console.log(`${senderId} message to ${receiverId}: ${message}`)

      if (receiverSocketId) {
         io.to(receiverSocketId).emit('handleMessage', { senderId, message })
         io.to(senderSocketId).emit('handleMessage', { senderId, message });
      }
      else
         io.emit('general', `${receiverId} is connected to the chat`)

   })


   socket.on('register', (userId) => {
      if (privateChats.get(userId))
         return
      privateChats.set(userId, socket.id)
      console.log(`user with ${userId} connected`)

      io.emit('online', ({ onlineUser: Array.from(privateChats.keys()) }))

   })

   socket.on('PersistentChats', async ({ senderId, receiverId, message }) => {
      //save private messages to the db.
      const newMessage = new Message({
         senderId,
         receiverId,
         message: message.message
      })
      const response = await newMessage.save()

      if (response)
         console.log('Message saved', response)
      else
         console.log('Message Not saved')
      const receiverSocketId = privateChats.get(receiverId)
      if (receiverSocketId)
         io.to(receiverSocketId).emit('receiverMessage', message)
      else
         console.log('not connected')
   })


   socket.on('disconnect', () => {
      for (const [userId, sockId] of privateChats.entries()) {
         if (sockId === socket.id) {
            privateChats.delete(userId)
            socket.emit('online', ({ onlineUser: Array.from(privateChats.keys()) }))
         }
      }

      for (const [userId, sockId] of socketMap.entries()) {
         if (sockId === socket.id) {
            socketMap.delete(userId)
         }
         console.log(`${userId} leave the chats`)
      }


      for (const [name, User] of privateRoom) {
         const leaveUser = name
         if (User.socketId === socket.id) {
            console.log(`${name} disconnected`);
            privateRoom.delete(name);

            const userOnlineInRoom = Array.from(privateRoom, ([name, user]) => ({
               name,
               roomId: user.roomId,
               socketId: user.socketId
            })).filter((user) => user.roomId === User.roomId)
            io.to(User.roomId).emit('end', ({ msg: `${leaveUser} left the chat room ${User.roomId}` }))
            io.to(User.roomId).emit('online', ({ privateUserList: userOnlineInRoom }))
         }
      }
   })
})


const port = 5000


server.listen(port, () => {
   console.log(`Server is listening on PORT ${port}`)
})
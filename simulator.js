const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const qualisys = require('./qualisys.js')
const app = express()
const simulator = http.Server(app)
const io = socketio(simulator)

const mocap = true


if (mocap) {
  qualisys(io)
}

app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

simulator.listen(80, '0.0.0.0', () => {
  console.log('listening on default')
})

// simulator.listen(8080, '127.0.0.1', () => {
//   console.log('listening on 8080')
// })

io.on('connection', (socket) => {
  console.log('socket connected')
  let flag = 0;
  let round_radius = 15;
  let step_size = 1;

  let x = 0;
  let y = 2;
  let z = round_radius;

  let euler1 = 0;
  let euler2 = 0;
  let euler3 = 0;

  if (!mocap) {
    setInterval(() => {
      io.sockets.emit('frame',  {x,y,z,euler1,euler2,euler3})

      if (flag == 0)
      {
        x = x + step_size;
        z = z - step_size;
      }

      if (x == round_radius && z == 0)
      {
        flag = 1;
      }

      if (flag == 1)
      {
        x = x - step_size;
        z = z - step_size;
      }

      if (x == 0 && z == -round_radius)
      {
        flag = 2;
      }

      if (flag == 2)
      {
        x = x - step_size;
        z = z + step_size;
      }

      if (x == -round_radius && z == 0)
      {
        flag = 3;
      }

      if (flag == 3)
      {
        x = x + step_size;
        z = z + step_size;
      }

      if (x == 0 && z == round_radius)
      {
        flag = 0;
      }

      // euler1 = euler1 + 1;
      euler2 = euler2 + 6;
      // euler3 = euler3 + 0.5;

    }, 180)
  }

  socket.on('click', (data) => {
    console.log(data)
  })

  socket.on('teleport', (data) => {
    console.log(data)
    socket.broadcast.emit('teleport', data)
  })

  socket.on('move', (data) => {
    console.log(data)
  })
})

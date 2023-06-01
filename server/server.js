const express = require('express');
const app = express();
const app2 = express();
const server = require("http").createServer(app);
const server2 = require("http").createServer(app2);
// const io = require('socket.io')(server);
// const io2 = require('socket.io')(server2);
const mongoose = require('mongoose');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { disconnect } = require("process");
app.use(express.json());
app2.use(express.json());
app2.use('/public', express.static(path.join(__dirname,'../src/jsForWebsockets')));

const io = require('socket.io')(server, {
  pingTimeout: 1000, // how many ms without a pong packet to consider the connection closed
  pingInterval: 1000, 
});
const io2 = require('socket.io')(server2, {
  pingTimeout: 1000, // how many ms without a pong packet to consider the connection closed
  pingInterval: 1000, 
});

// const io = socketIO(server, {
//   pingTimeout: 1000, // how many ms without a pong packet to consider the connection closed
//   pingInterval: 3000, // how many ms before sending a new ping packet
// });


const { SocketAddress } = require('net');
const anonNames = require('./anonNames.js');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users.js');

dotenv.config();



mongoose.connect(process.env.MONGO_URI).then(console.log('mongodb connected'));

app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);

// temp storage to store tasks
var storage = [[], [], [], []];
var storageObj = {};

// anon names storage object
const anonNamesObj = {};
// anon names storage array for frontend
let anonNamesArr = [];

// generate unique anon name from anonNames
const generateUniqueAnonName = () => {
  let isUnique = false;
  let anonName;

  while (!isUnique) {
    // generate a random anonName
    anonName = anonNames[Math.floor(Math.random() * anonNames.length)];

    // check if the generated anonName is already assigned
    let isNameAssigned = false;
    for (const assignedAnonName of Object.values(anonNamesObj)) {
      if (assignedAnonName === anonName) {
        isNameAssigned = true;
        break;
      }
    }

    // exit loop if name has not already been assigned
    if (!isNameAssigned) {
      isUnique = true;
    }
  }

  return anonName;
};


app.use('/', express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => res.sendFile(__dirname, '../dist/index.html'));
app2.get('/excalibur', (req, res) => {
  res.sendFile(path.join(__dirname, "../src/excalibur.html"));
});

io.on('connection', (socket) => {
  // Create anonName upon client connection and store anonName in anonNamesObj
  let anonName;
  // Check if anonName is already assigned for the current socket.id
  if (anonNamesObj.hasOwnProperty(socket.id)) {
    anonName = anonNamesObj[socket.id];
  } else {
    // Generate a random anon name for the current socket.id
    anonName = generateUniqueAnonName();
    // Store anonName in anonNameObj
    anonNamesObj[socket.id] = anonName;
    // Store anonName in anonNameArr
    anonNamesArr.push(anonName);
    console.log(socket.id, anonName)
  }

  // client logs in
  socket.on('logged-in', (googleUser) => {
    anonNamesObj[socket.id] = googleUser;
    io.emit('updating-name', anonNamesObj);
  });

  // client logs off
  socket.on('logged-out', (newName) => {
    anonNamesObj[socket.id] = newName;
    io.emit('updating-name', anonNamesObj);
  });

  // send the tasks saved on this server to the client
  socket.emit('load-tasks', storage);
  // emit current online users to frontend
  io.emit('user-connected', anonNamesObj);

  // client disconnection
  socket.on('disconnect', () => {
    anonNamesArr = anonNamesArr.filter((e) => e !== anonNamesObj[socket.id]);

    const disconnectedUser = anonNamesObj[socket.id];
    delete anonNamesObj[socket.id];
    // emit current online users to frontend
    // io.emit('user-disconnected', socket.id);
  });



 
  socket.on('card-move', (uuid, num) => {
      taskIndex = storage[storageObj[uuid].arrayIndex].findIndex((task) => task.uuid === uuid);
      let cacheObj = storage[storageObj[uuid].arrayIndex].splice(taskIndex, 1)[0];
      storageObj[uuid].arrayIndex = num;
      storage[num].push(cacheObj);
      isStorageChanged = true;
  });

////////////////////////////For Excalibur///////////////////////////////
////////////////////////////////////////////////////////////////////////
  socket.on('clickColor', (string)=>{
    io2.emit('clickColorReturn', string);
  });
  socket.on('EraserColor', (str, num) => {
    io2.emit('EraserColorReturn', str, num);
  })
////////////////////////////For Excalibur///////////////////////////////
////////////////////////////////////////////////////////////////////////

  socket.on('add-task-comment', (content, uuid) => {    
      taskIndex = storage[storageObj[uuid].arrayIndex].findIndex((task) => task.uuid === uuid);

      storage[storageObj[uuid].arrayIndex][taskIndex].comments.push(content);
      isStorageChanged = true;
  })


  // Listener for the 'greeting-from-client'
  socket.on('add-task', (content) => {
    // Assign a unique id for the task
    const uuid = uuidv4();
    //store it to the first index of storage (TO DO column)
    let cacheObj = {
      author: anonNamesObj[socket.id],
      content,
      comments: [],
      uuid: uuid,
      arrayIndex: 0,
      reviewedBy: '',
    };
    storage[0].push(cacheObj);
    storageObj[uuid] = cacheObj;
    isStorageChanged = true;
  });

  //Listener for 'delete-message'
  socket.on('delete-task', (uuid) => {
    // update the storage when delete is fired
    storage = storage.map((column) =>
      column.filter((task) => task.uuid !== uuid)
    );
    io.emit('delete-task', uuid);
  });

});


////////////////////////////////////////////////////////////////////////
let serverUpdate = setInterval(mainUpdate, 1000/60);
var isStorageChanged = false;

function mainUpdate(){ // 更新 玩家 資訊 Updating the storage information
  if(isStorageChanged === true){ // 如果玩家player 資料有變動才廣播更新
      io.emit('playersDataUpdate', storage);
      isStorageChanged = false;
  }
}
////////////////////////////////////////////////////////////////////////
////////////////////////////For Excalibur///////////////////////////////
io2.on('connection', (socket) => {
  console.log('Drawer connected!');
  socket.on('draw000', (obj)=>{
    io2.emit('draw000Return', obj);
  })
  socket.on('draw001', (obj)=>{
    io2.emit('draw001Return', obj);
  })
});
////////////////////////////For Excalibur///////////////////////////////
////////////////////////////////////////////////////////////////////////
server.listen(3000, () => console.log('The server is running at port 3000'));
server2.listen(3351, () => console.log('The server is running at port 3351'));
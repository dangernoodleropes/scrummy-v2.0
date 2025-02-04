const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { SocketAddress } = require('net');
const anonNames = require('./anonNames.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users.js');

dotenv.config();

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
  pingTimeout: 1000, // how many ms without a pong packet to consider the connection closed
  pingInterval: 3000, // how many ms before sending a new ping packet
});

mongoose.connect(process.env.MONGO_URI).then(console.log('mongodb connected'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);

// temp storage to store tasks
let storage = [[], [], [], []];

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

// Serve static files in the /dist folder
app.use('/', express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => res.sendFile(__dirname, '../dist/index.html'));

// SocketIO listeners
// socket refers to the client
// io refers this server
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
    io.emit('user-disconnected', socket.id);
    // console.log(
    //   `A client has disconnected ${socket.id} with UPDATED anonNamesList`,
    //   anonNamesObj
    // );
    // console.log(
    //   `A client has disconnected ${socket.id} with UPDATED anonNamesArr`,
    //   anonNamesArr
    // );
  });

  // Listener for the 'greeting-from-client'
  socket.on('add-task', (content) => {
    // Assign a unique id for the task
    const uuid = uuidv4();

    //store it to the first index of storage (TO DO column)
    storage[0].push({
      author: anonNamesObj[socket.id],
      content,
      comments: [],
      uuid: uuid,
    });
    io.emit('add-task', {
      author: anonNamesObj[socket.id],
      content,
      comments: [],
      uuid: uuid,
    });
  });

  //Listener for 'delete-message'
  socket.on('delete-task', (uuid) => {
    // update the storage when delete is fired
    storage = storage.map((column) =>
      column.filter((task) => task.uuid !== uuid)
    );
    io.emit('delete-task', uuid);
  });

  //Listener for 'next'
  socket.on('move-task-right', (uuid) => {
    let foundTask = null;
    let foundColumnIndex;
    // find the task with the matching UUID and its current column index
    for (let i = 0; i < storage.length; i++) {
      // store current column
      const column = storage[i];
      // store index if uuid is found
      const taskIndex = column.findIndex((task) => task.uuid === uuid);

      // if match was found and in the 2nd to last column (COMPLETE)...
      if (taskIndex !== -1 && i === storage.length - 2) {
        // remove the task at the specified index from the column array
        foundTask = column.splice(taskIndex, 1)[0];
        // create a current reviewer in storage
        foundTask.reviewedBy = anonNamesObj[socket.id];
        foundColumnIndex = i;
        break;
      }
      // if match was found and not in the last column...
      else if (taskIndex !== -1 && i !== storage.length - 1) {
        // remove the task at the specified index from the column array
        foundTask = column.splice(taskIndex, 1)[0];
        foundColumnIndex = i;
        break;
      }
    }
    if (foundTask !== null) {
      // push foundTask into next column in storage
      storage[foundColumnIndex + 1].push(foundTask);
    }
    io.emit('move-task-right', { uuid, reviewerId: socket.id });
  });

  //Listener for 'previous'
  socket.on('move-task-left', (uuid) => {
    let foundTask = null;
    let foundColumnIndex;
    // find the task with the matching UUID and its current column index
    for (let i = 0; i < storage.length; i++) {
      // store current column
      const column = storage[i];
      // store index if uuid is found
      const taskIndex = column.findIndex((task) => task.uuid === uuid);

      // if match was found and in the last column (REVIEWED)...
      if (taskIndex !== -1 && i == storage.length - 1) {
        // remove the task at the specified index from the column array
        foundTask = column.splice(taskIndex, 1)[0];
        // delete the reviewer
        delete foundTask.reviewedBy;
        foundColumnIndex = i;
        break;
      }
      // if match was found and not in the first column...store result and column index
      else if (taskIndex !== -1 && i !== 0) {
        // remove the task at the specified index from the column array
        foundTask = column.splice(taskIndex, 1)[0];
        foundColumnIndex = i;
        break;
      }
    }
    if (foundTask !== null) {
      // push foundTask into previous column in storage
      storage[foundColumnIndex - 1].push(foundTask);
    }
    io.emit('move-task-left', uuid);
  });

  // create listener for 'add-comment'
  socket.on('add-task-comment', (content, uuid) => {

  // loop through storage to search for uuid
    // if matches
      //update comment prop with content 
    // task = {
        // name: string
        // uuid: #
        // content: task 
        // comments : [] <---- add content here
  // }
  // loop through storage -> [ [{task}], {task2}], [{task3}], [], []]

      for (let i = 0; i < storage.length; i++){
        //storage[0] === [{task}], {task2}]
        // loop through storage[i]
        for (let j = 0; j < storage[i].length; j++){
          if (storage[i][j].uuid === uuid){
            storage[i][j].comments.push(content);
          }
        }
        
        // should be no more nested arrays; check if task.uuid === uuid ar

      }
      io.emit('add-task-comment', {uuid, content});

  })
});

server.listen(3000, () => console.log('The server is running at port 3000'));

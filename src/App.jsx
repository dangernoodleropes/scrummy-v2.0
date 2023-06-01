import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import OnlineUsers from './components/OnlineUsers';
import CreateCard from './components/CreateCard';
import Column from './components/Column';
import styled from 'styled-components';
import DrawBar from './components/DrawBar';
import { ColorButtonRed, ColorButtonBlack, ColorButtonBlue, ColorButtonGreen, ColorButtonYellow, ColorButtonPurple, Earser } from './components/ColorButton';
import Login from './components/Login';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  background-color: #ffffff;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.05) 0.1em,
      transparent 0.1em
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0.1em, transparent 0.1em);
  background-size: 0.7em 0.7em;
  border-bottom: 2px solid black;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: 'Abril Fatface', cursive;
  font-size: 2.2rem;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const ProjectButton = styled.button`
  cursor: pointer;
  background-color: #61dbdb  ;
  text-align: center;
  height: 2.5rem;
  border-radius: 2rem;
  border: 1px solid black;
  box-shadow: 2px 2px black;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;
  transform: translate(-2px, -2px);
  &:hover {
    transform: translate(0, 0);
    box-shadow: 0px 0px;
  }
`

const HEADERS = ['To Do', 'In Progress', 'Complete', 'Reviewed'];

const App = () => {
  var [tasks, setTasks] = useState([[], [], [], []]);
  const [allUsers, setAllUsers] = useState({});
  const [user, setUser] = useState();


 //useEffect hook is used to define  a side effect that will be executed after the component renders  
  useEffect(() => {
    function storageUpdate(storage){
      setTasks ((tasks) => {
        tasks = storage;
        return tasks;
      })
      console.log(tasks);
    }

    //function used to handle data loaded on tasks 
    function onLoadTasks(tasks) {
      console.log('ON LOAD TASKS');
      console.log(tasks);
      setTasks(() => tasks);
    }
    //function used to handle the event when a user connected to a socket 
    //when a user is connected, it updates allUsers state with usersObj
    function onUserConnected(usersObj) {
      console.log('usersObj', usersObj)
      setAllUsers(usersObj);
      setUser(usersObj[socket.id]);
    }

    //function used to handle the event when a user disconnects from a socket
    //when a user is disconnected, it removes the user associated with the socketID and updates the allUsers state bt the modified object 
    function onUserDisconnected(socketId) {
      setAllUsers((allUsers) => {
        delete allUsers[socketId];
        return allUsers;
      });
    }

    function onUpdateName(usersObj) {
      setAllUsers(usersObj)
    }

    function onAddTask(newTask) {
      setTasks((tasks) => {
        const newTasks = structuredClone(tasks);
        newTasks[0].push(newTask);
        console.log('newTasks',newTask[0])
        return newTasks;
      });
    }

    //function used to handle the event when a task is deleted based on UUID 
    //creates a deep copy of 'tasks' and filtered out the tasks with UUID from each column and updates the 'tasks' state 
    function onDeleteTask(uuid) {
      setTasks((tasks) => {
        let newTasks = structuredClone(tasks);
        return newTasks.map((column) =>
          column.filter((task) => task.uuid !== uuid)
        );
      });
    }


    // function onMoveTaskLeft(uuid) {
    //   setTasks((tasks) => {
    //     let newTasks = structuredClone(tasks);
    //     let foundTask = null;
    //     let foundColumnIndex;
    //     // find the task with the matching UUID and its current column index
    //     for (let i = 0; i < newTasks.length; i++) {
    //       // store current column
    //       const column = newTasks[i];
    //       // store index if uuid is found
    //       const taskIndex = column.findIndex((task) => task.uuid === uuid);

    //       // if match was found and in the last column (REVIEWED)...
    //       if (taskIndex !== -1 && i == newTasks.length - 1) {
    //         // remove the task at the specified index from the column array
    //         foundTask = column.splice(taskIndex, 1)[0];
    //         // delete the reviewer
    //         delete foundTask.reviewedBy;
    //         foundColumnIndex = i;
    //         break;
    //       }
    //       // if match was found and not in the first column...store result and column index
    //       else if (taskIndex !== -1 && i !== 0) {
    //         // remove the task at the specified index from the column array
    //         foundTask = column.splice(taskIndex, 1)[0];
    //         foundColumnIndex = i;
    //         break;
    //       }
    //     }
    //     if (foundTask !== null) {
    //       // push foundTask into previous column in storage
    //       newTasks[foundColumnIndex - 1].push(foundTask);
    //     }
    //     return newTasks;
    //   });
    // }


    // function onMoveTaskRight({ uuid, reviewerId }) {
    //   setTasks((tasks) => {
    //     let newTasks = structuredClone(tasks);
    //     let foundTask = null;
    //     let foundColumnIndex;
    //     // find the task with the matching UUID and its current column index
    //     for (let i = 0; i < newTasks.length; i++) {
    //       // store current column
    //       const column = newTasks[i];
    //       // store index if uuid is found
    //       const taskIndex = column.findIndex((task) => task.uuid === uuid);

    //       // if match was found and in the 2nd to last column (COMPLETE)...
    //       if (taskIndex !== -1 && i === newTasks.length - 2) {
    //         // remove the task at the specified index from the column array
    //         foundTask = column.splice(taskIndex, 1)[0];
    //         // create a current reviewer in storage
    //         console.log('##### REVIEWED BY ######');
    //         console.log(reviewerId);
    //         foundTask.reviewedBy = allUsers[reviewerId];
    //         foundColumnIndex = i;
    //         break;
    //       }
    //       // if match was found and not in the last column...
    //       else if (taskIndex !== -1 && i !== newTasks.length - 1) {
    //         // remove the task at the specified index from the column array
    //         foundTask = column.splice(taskIndex, 1)[0];
    //         foundColumnIndex = i;
    //         break;
    //       }
    //     }
    //     if (foundTask !== null) {
    //       // push foundTask into next column in storage
    //       newTasks[foundColumnIndex + 1].push(foundTask);
    //     }
    //     return newTasks;
    //   });
    // }



    // TODO:create function onAddComment, used to handle when new comment is added

    // function onAddComment({uuid, content}) {
    //   setTasks((tasks) => {
    //     let newTasks = structuredClone(tasks);
    //     for (let i = 0; i < newTasks.length; i++){
    //       for (let j = 0; j < newTasks[i].length; j++){
    //         if (newTasks[i][j].uuid === uuid){
    //           newTasks[i][j].comments.push(content);
    //         }
    //       }
    //     }
    //     return newTasks;
    //   });
    // }
  


    // Register event listeners
    socket.on('load-tasks', onLoadTasks);
    socket.on('user-connected', onUserConnected);
    socket.on('user-disconnected', onUserDisconnected);
    socket.on('add-task', onAddTask);
    socket.on('delete-task', onDeleteTask);
    socket.on('playersDataUpdate', storageUpdate);
    socket.on('updating-name', onUpdateName);
    // socket.on('add-task-comment', onAddComment);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('load-tasks', onLoadTasks);
      socket.off('user-connected', onUserConnected);
      socket.off('user-disconnected', onUserDisconnected);
      socket.off('add-task', onAddTask);
      socket.off('delete-task', onDeleteTask);
      socket.off('updating-name', onUpdateName);
      // socket.off('add-task-comment', onAddComment);
    };
  }, [allUsers]);

  // function handleColorSelect(){
  //   socket.emit('colorClick!', colorClick);
  // }





  function handleAddTask(content) {
    socket.emit('add-task', content);
  }

  function handleDeleteTask(uuid) {
    socket.emit('delete-task', uuid);
  }

  // function handleMoveTaskLeft(uuid) {
  //   socket.emit('move-task-left', uuid);
  // }

  // function handleMoveTaskRight(uuid) {
  //   socket.emit('move-task-right', uuid);
  // }

  // TODO:add func handleAddComment
  function handleAddComment(content, uuid) {
    socket.emit('add-task-comment', content, uuid);
  }

  function handleDeleteComment(uuid, commentid) {
    socket.emit('delete-comment', uuid, commentid)
  }

  function handleProject(id) {
    // fill logic here: 
  }


  return (
    <main>
      <Header>
        <Container>
          <div style = {{ display: 'flex', alignItems: 'center' }}>
            <Title>Scrummy</Title>
            <ProjectButton style = {{margin: '0px 0px 0px 15px', fontSize: '1rem', width: '10rem'}} onClick={handleProject(socket.id)}> 
              Save Project
          </ProjectButton>
          </div>
          
            <div style = {{ display: 'flex', alignItems: 'center' }}>
              <CreateCard handleAddTask={handleAddTask} /> <ColorButtonRed /><ColorButtonBlack /><ColorButtonBlue /><ColorButtonGreen /><ColorButtonYellow /><ColorButtonPurple /><Earser />
            </div>

          {/* on click: invoke project handler, passing in socket.id or user */}

        </Container>
        <Login user={user} setUser={setUser}/>
        <OnlineUsers onlineUsers={Object.values(allUsers)} user={user} />
      </Header>
      <Board>
        {tasks.map((columnTasks, i) => (
          <Column
            key={`col_${i}`}
            header={HEADERS[i]}
            columnInd = {i}
            columnTasks={columnTasks}
            handleDeleteTask={handleDeleteTask}
            // handleMoveTaskLeft={handleMoveTaskLeft}
            // handleMoveTaskRight={handleMoveTaskRight}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
            disableLeft={i === 0}
            disableRight={i === tasks.length - 1}
          />
        ))}
      </Board>
          <DrawBar />
    </main>
  );
};

export default App;

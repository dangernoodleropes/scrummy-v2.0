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
  var [assignee, setAssignee] = useState([]);


 //useEffect hook is used to define  a side effect that will be executed after the component renders  
  useEffect(() => {

    function updateOnlineUser (arr){        
      setAssignee((assignee) => {
        assignee = arr;
        return assignee; 
      })
    }

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

    // Register event listeners
    socket.on('load-tasks', onLoadTasks);
    socket.on('user-connected', onUserConnected);
    socket.on('user-disconnected', onUserDisconnected);
    socket.on('add-task', onAddTask);
    socket.on('delete-task', onDeleteTask);
    socket.on('playersDataUpdate', storageUpdate);
    socket.on('updating-name', onUpdateName);
    socket.on('aaa3', updateOnlineUser);

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('load-tasks', onLoadTasks);
      socket.off('user-connected', onUserConnected);
      socket.off('user-disconnected', onUserDisconnected);
      socket.off('add-task', onAddTask);
      socket.off('delete-task', onDeleteTask);
      socket.off('updating-name', onUpdateName);
      socket.off('aaa3', updateOnlineUser);
    };
  }, [allUsers]);

  function handleAddTask(content) {
    socket.emit('add-task', content);
  }

  function handleDeleteTask(uuid) {
    socket.emit('delete-task', uuid);
  }

  // TODO:add func handleAddComment
  function handleAddComment(content, uuid) {
    socket.emit('add-task-comment', content, uuid);
  }

  function handleDeleteComment(uuid, commentid) {
    socket.emit('delete-comment', uuid, commentid)
  }

  function handleSubmitAssignee(){
    e.preventDefault();
    socket.emit('KahlieNeedArray');
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
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
            handleSubmitAssignee={handleSubmitAssignee}
            assignee={assignee}
            // handleOptionChange={handleOptionChange}
          />
        ))}
      </Board>
          <DrawBar />
    </main>
  );
};

export default App;

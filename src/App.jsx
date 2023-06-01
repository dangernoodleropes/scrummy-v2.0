import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import OnlineUsers from './components/OnlineUsers';
import CreateCard from './components/CreateCard';
import Column from './components/Column';
import styled from 'styled-components';
import DrawBar from './components/DrawBar';
import { ColorButtonRed, ColorButtonBlack, ColorButtonBlue, ColorButtonGreen, ColorButtonYellow, ColorButtonPurple, Earser } from './components/ColorButton';

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

const HEADERS = ['To Do', 'In Progress', 'Complete', 'Reviewed'];

const App = () => {
  var [tasks, setTasks] = useState([[], [], [], []]);
  const [allUsers, setAllUsers] = useState({});
  const [user, setUser] = useState();



  useEffect(() => {
    function storageUpdate(storage){
      setTasks ((tasks) => {
        tasks = storage;
        return tasks;
      })
      console.log(tasks);
    }

    function onLoadTasks(tasks) {
      console.log('ON LOAD TASKS');
      console.log(tasks);
      setTasks(() => tasks);
    }

    function onUserConnected(usersObj) {
      setAllUsers(usersObj);
      setUser(usersObj[socket.id]);
    }

    function onUserDisconnected(socketId) {
      setAllUsers((allUsers) => {
        delete allUsers[socketId];
        return allUsers;
      });
    }

    function onAddTask(newTask) {
      setTasks((tasks) => {
        const newTasks = structuredClone(tasks);
        newTasks[0].push(newTask);
        return newTasks;
      });
    }

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

    // Clean up the event listeners when the component unmounts
    // (prevents duplicate event registration)
    return () => {
      socket.off('load-tasks', onLoadTasks);
      socket.off('user-connected', onUserConnected);
      socket.off('user-disconnected', onUserDisconnected);
      socket.off('add-task', onAddTask);
      socket.off('delete-task', onDeleteTask);

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

  return (
    <main>
      <Header>
        <Container>
          <Title>Scrummy</Title>
            <div style = {{ display: 'flex', alignItems: 'center' }}>
              <CreateCard handleAddTask={handleAddTask} /> <ColorButtonRed /><ColorButtonBlack /><ColorButtonBlue /><ColorButtonGreen /><ColorButtonYellow /><ColorButtonPurple /><Earser />
            </div>
        </Container>
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

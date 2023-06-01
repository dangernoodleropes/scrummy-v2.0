import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';

const Card = styled.div`
  border: 2px solid black;
  background-color: white;
  box-shadow: 5px 5px black;
  margin: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.05) 0.1em,
      transparent 0.1em
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0.1em, transparent 0.1em);
  background-size: 0.7em 0.7em;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  cursor: pointer;
  border: 1px solid black;
  background-color: #a6faff;
  box-shadow: 2px 2px black;
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;
  transform: translate(-2px, -2px);
  &:hover:not([disabled]) {
    transform: translate(0px, 0px);
    box-shadow: 0px 0px;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #d1d5db;
  }
`;

const DeleteButton = styled.button`
  cursor: pointer;
  color: #777777;
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  margin-left: auto;
  transition: color 150ms;
  &:hover {
    color: red;
  }
`;

const Name = styled.span`
  font-family: 'Abril Fatface', cursive;
  font-size: 1rem;
`;

const TaskCard = ({
  uuid,
  author,
  content,
  reviewedBy,
  handleDeleteTask,
}) => {

  const [dragging, setDragging] = useState(false);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const windowWidth = window.innerWidth;    

  useEffect(() => {
    var newX;
    var newY;

    const handleMouseMove = (event) => {
      if (!dragging) return;
      ///////waiting for fixing the minus width/2////////
      const newXghost = event.clientX - 0.12*window.innerWidth;
      const newYghost = event.clientY - 60;
      newX = event.clientX
      newY = event.clientY
      console.log({ x: newX, y: newY })
      setGhostPosition({ x: newXghost, y: newYghost });
    };

    const handleMouseUp = () => {
      setDragging(false);
      if(newX > 0.75*window.innerWidth){
        socket.emit('card-move', uuid, 3);
      }
      else if(newX > 0.5*window.innerWidth && newX <= 0.75*window.innerWidth){
        socket.emit('card-move', uuid, 2);
      }
      else if(newX > 0.25*window.innerWidth && newX <= 0.5*window.innerWidth){
        socket.emit('card-move', uuid, 1);
      }
      else if(newX <= 0.25*window.innerWidth){
        socket.emit('card-move', uuid, 0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleMouseDown = (event) => {
    setDragging(true);
  };
  
  return (
    <>
    {dragging && (
      <Card
        style={{
          left: ghostPosition.x,
          top: ghostPosition.y,
          cursor: 'grabbing',
          position: 'fixed',
          opacity: 0.6,
          width: 0.24*window.innerWidth
        }}
      >
        <span>{content}</span>
        <div>
          <span>author:&nbsp;</span>
          <Name>{author}</Name>
        </div>
  
        {reviewedBy && (
          <div>
            <span>reviewed by:&nbsp;</span>
            <Name>{reviewedBy}</Name>
          </div>
        )}
        <ButtonContainer>
          <DeleteButton>
            delete
          </DeleteButton>
        </ButtonContainer>
      </Card>
    )}
    <Card style={{
      cursor: dragging ? 'grabbing' : 'grab'
      }}  
      onMouseDown={(event)=>handleMouseDown(event, uuid)}
    >
      <span>{content}</span>
      <div>
        <span>author:&nbsp;</span>
        <Name>{author}</Name>
      </div>

      {reviewedBy && (
        <div>
          <span>reviewed by:&nbsp;</span>
          <Name>{reviewedBy}</Name>
        </div>
      )}

      <ButtonContainer>
        <DeleteButton onClick={() => handleDeleteTask(uuid)}>
          delete
        </DeleteButton>
      </ButtonContainer>
    </Card>
    </>
  );
};

export default TaskCard;

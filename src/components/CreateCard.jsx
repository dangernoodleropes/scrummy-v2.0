import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  border: 1px solid black;
  border-radius: 2rem;
  color: black;
  font-size: 1rem;
  padding: 0.5rem 2rem 0.5rem 1rem;
`;

const Button = styled.button`
  margin-left: -25px;
  cursor: pointer;
  background-color: #fea6f6;
  text-align: center;
  font-size: 2rem;
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
`;

const CreateCard = ({ handleAddTask }) => {
  const [input, setInput] = useState('');


  const handleSubmit = () => {
    const content = input.trim();
    if (!content) return;
    handleAddTask(content);
    setInput('');
  };



  return (
    <Container>
      <Input
        type="text"
        placeholder="add a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />

      <Button onClick={handleSubmit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
        >
          <path d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z" />
        </svg>
      </Button>
    </Container>
  );
};

export default CreateCard;

import React, { useState } from 'react';
import TaskCard from './TaskCard';
import styled from 'styled-components';

const Header = styled.div`
  font-family: 'Abril Fatface', cursive;
  text-align: center;
  font-size: 2.2rem;
`;

const Column = ({
  header,
  columnTasks,
  handleDeleteTask,
}) => {
  return (
    <div>
      <Header>{header}</Header>
      <div>
        {columnTasks.map((task) => (
          <TaskCard
            key={task.uuid}
            {...task}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;

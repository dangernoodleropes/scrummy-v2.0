import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserList = styled.ul`
  list-style-type: none;
  display: flex;
`;

const UserIcon = styled.li`
  user-select: none;
  font-family: 'Abril Fatface', cursive;
  font-size: 2.2rem;
  background-color: #a8a6ff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid black;
  box-shadow: 2px 2px black;

  margin-left: -10px; /* overlap the icons */

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 150ms;
  transform: translate(-2px, -2px);
  &:hover {
    transform: translate(-3px, -5px);
    box-shadow: 0 0 black;
  }
`;

const User = styled.span`
  font-family: 'Abril Fatface', cursive;
  font-size: 1.5rem;
`;

const OnlineUsers = ({ onlineUsers, user }) => {
  const [hoveredUser, setHoveredUser] = useState(user);

  useEffect(() => {
    setHoveredUser(user);
  }, [user]);

  return (
    <Container>
      <User>{hoveredUser}</User>
      <UserList>
        {onlineUsers.map((name, i) => {
          return (
            <UserIcon
              key={`${name}_${i}`}
              onMouseEnter={() => setHoveredUser(name)}
              onMouseLeave={() => setHoveredUser(user)}
              style={{ backgroundColor: name === user ? '#FFA500' : '' }}
            >
              {name[0].toUpperCase()}
            </UserIcon>
          );
        })}
      </UserList>
    </Container>
  );
};

export default OnlineUsers;

import React, {useState} from 'react';
import styled from 'styled-components';


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

//TODO: add css styling 
const Comments = styled.input`

`

//TODO: add css styling 
const TaskForm = styled.form``;



//TODO: add css styling 
const Dropdown = styled.select``;

const Name = styled.span`
  font-family: 'Abril Fatface', cursive;
  font-size: 1rem;
`;




const TaskCard = ({
  uuid,
  author,
  content,
  comments,
  reviewedBy,
  allUsers,
  handleDeleteTask,
  handleMoveTaskLeft,
  handleMoveTaskRight,
  handleAddComment,
  disableLeft = false,
  disableRight = false,
}) => {
//useState to set comments for task form

const [text, setText] = useState('');
const [assignee, setAssignee] = useState('');

let anonNames = [
  'alligator',
  'anteater',
  'armadillo',
  'auroch',
  'axolotl',
  'badger',
  'bat',
  'bear',
  'beaver',
  'blobfish',
  'buffalo',
  'camel',
  'chameleon',
  'cheetah',
  'chipmunk',
  'chinchilla',
  'chupacabra',
  'cormorant',
  'coyote',
  'crow',
  'dingo',
  'dinosaur',
  'dog',
  'dolphin',
  'dragon',
  'duck',
  'octopus',
  'elephant',
  'ferret',
  'fox',
  'frog',
  'giraffe',
  'goose',
  'gopher',
  'grizzly',
  'hamster',
  'hedgehog',
  'hippo',
  'hyena',
  'jackal',
  'jackalope',
  'ibex',
  'ifrit',
  'iguana',
  'kangaroo',
  'kiwi',
  'koala',
  'kraken',
  'lemur',
  'leopard',
  'liger',
  'lion',
  'llama',
  'manatee',
  'mink',
  'monkey',
  'moose',
  'narwhal',
  'nyan cat',
  'orangutan',
  'otter',
  'panda',
  'penguin',
  'platypus',
  'python',
  'pumpkin',
  'quagga',
  'quokka',
  'rabbit',
  'raccoon',
  'rhino',
  'sheep',
  'shrew',
  'skunk',
  'squirrel',
  'tiger',
  'turtle',
  'unicorn',
  'walrus',
  'wolf',
  'wolverine',
  'wombat',
];

const handleSubmit = e => {
  e.preventDefault();
  const content = text.trim();
  if(!content) return;
  // invocation for function/socket connection in App.jsx
  handleAddComment(content, uuid);
  setText('');
}

//TODO: create handleSubmit for assignnee

const handleSubmitAssignee = e => {
  e.preventDefault();
}

const handleOptionChange = (e) => {
  setAssignee(e.target.value);
};


  return (
<Card>
      <span>{content}</span>
      <div>
        <span>Author:&nbsp;</span>
        <Name>{author}</Name>
        </div>
        <ul>
        <span>Task Notes: </span>
          {comments.map((point, i) => {
            return (
              <li key={i}>
                {point}
              </li>
            );
          })}
        </ul>

        <TaskForm onSubmit={handleSubmit}>
          <Comments
            type="text"
            placeholder="add task notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit(e);
            }}
          />
          <button type="submit">Save</button>
        </TaskForm>

        <TaskForm onSubmit={handleSubmitAssignee}>
      <div>
        <label htmlFor="allusers-dropdown">Assignee:</label>
        <Dropdown id="allusers-dropdown" value={assignee} onChange={handleOptionChange}>
          <option value="">Select</option>
          {anonNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </Dropdown>
      </div>
      <button type="submit">Save</button>
    </TaskForm>


      {reviewedBy && (
        <div>
          <span>reviewed by:&nbsp;</span>
          <Name>{reviewedBy}</Name>
        </div>
      )}

      <ButtonContainer>
        <Button disabled={disableLeft} onClick={() => handleMoveTaskLeft(uuid)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M360-200 80-480l280-280 42 42-208 208h686v60H194l208 208-42 42Z" />
          </svg>
        </Button>
        <Button
          disabled={disableRight}
          onClick={() => handleMoveTaskRight(uuid)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="m600-200-42-42 208-208H80v-60h686L558-718l42-42 280 280-280 280Z" />
          </svg>
        </Button>
        <DeleteButton onClick={() => handleDeleteTask(uuid)}>
          delete
        </DeleteButton>
      </ButtonContainer>
    </Card>
  );
};

export default TaskCard;

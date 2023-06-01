import { useState } from "react";
import React from "react";
import anonNames from "../../server/anonNames";

const SaveProject = (props) => {

  const [value, setValue] = useState("");

  const {tasks, user} = props;

  console.log(tasks);
  console.log(user);

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const handleClick = (e) => {
    e.preventDefault();
    setValue('');
    if (!anonNames.includes(user)) {
      fetch('/projects', {
      method: 'POST',
      headers:  {'Content-Type': 'application/json'},
      body: JSON.stringify({user, tasks, value})
      }
      ).then(() => console.log('saved')); 
    }
  }

  return (
    <>
    <input value={value} onChange={handleChange} placeholder="Name Project"></input>
    <button onClick={handleClick}>
      Save Project
    </button>
    </>
  )

} 

export default SaveProject;
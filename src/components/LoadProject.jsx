import React from "react";
import { useState } from "react";
import anonNames from "../../server/anonNames";

const LoadProject = (props) => {
  const {user, setTasks} = props;
    const [value, setValue] = useState("");
    const handleChange = (e) => {
    setValue(e.target.value);
  }

  const handleClick = (e) => {
    e.preventDefault();
    setValue('');
    if (!anonNames.includes(user)) {
      fetch(`/projects/${user}/${value}`, {
      method: 'GET',
      headers:  {'Content-Type': 'application/json'},
      })
      .then((res) => res.json())
      .then((project) => {
      console.log('here');
      console.log(project);
      setTasks(project.tasks)})
    }
  }

  return (
    <>
        <input value={value} onChange={handleChange} placeholder="Load Project"></input>
            <button onClick={handleClick}>
      Load Project
    </button>
    </>
  )
}

export default LoadProject;
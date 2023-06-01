import React from "react";
import { useState } from "react";

const seeProjects = (props) => {
  const {user} = props;
  const [projectList, setProjectList] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    fetch(`/projects/${user}`, {
      method: 'GET',
      headers:  {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
    .then(projects => {
    setProjectList(projects);
    })
  }

  return (
    <>
      <button onClick={handleClick}>See Projects</button>
      {projectList.length > 0 ? (
        <ul>
          {projectList.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      ) : (
        <p></p>
      )}
    </>
  );
}

export default seeProjects;
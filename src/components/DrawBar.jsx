import React, { useState } from 'react';
import { socket } from '../socket';

const DrawBar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    socket.io
  };

  return (
    <div>
        <div
        className="ClickBar"
        style={{
            position: 'fixed',
            bottom: '5px',
            right: '50%',
            transform: 'translateX(50%)',
            backgroundColor: 'rgba(150, 220, 255, 0.5)',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '10px',
            zIndex: '2999999',
            width: '80%',
            height: expanded ? '80%' : '30px',
            transition: 'height 0.3s ease',

        }}
        onClick={handleClick}
        >
        <span style = {{      
            marginTop: '3px',  
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'rgba(60, 130, 180, 1)'}}>Excalibur Draw~!</span>   
        </div>
        
        <div
            className="ChatPop"
            style={{
            height: expanded ? '76%' : '0px',
            backgroundColor: 'rgba(150, 220, 255, 0.5)',
            zIndex: '3999999',
            position: 'fixed',
            bottom: '5px',
            borderRadius: '10px',
            right: '50%',
            transform: 'translateX(50%)',
            padding: '0px',
            transition: 'height 0.3s ease',
            width: '80%',
            overflow: 'hidden',
            }} 
        ><iframe style = {{borderRadius: '10px', 
                           border: '0px',
                           transition: 'height 0.3s ease',
                           overflow: 'hidden',
                           width: '100%',
                           height: expanded ? '100%' : '0px',
                           }} src="http://localhost:3351/excalibur" title="Draw Window" /></div>

    </div>
  );
};

export default DrawBar;
import React, { useState } from 'react';
import { socket } from '../socket';

const ColorButtonRed = () => {
    function clickHandlerRed(){
        socket.emit('clickColor', 'rgba(255, 0, 0, 0.8)');
    }
    return (
        <div>
            <button 
            onClick={clickHandlerRed}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                margin: "0px 5px 0px 15px",
                cursor: 'pointer'
            }}>
            </button>
        </div>
    )
}

const ColorButtonBlack = () => {
    function clickHandlerBlack(){
        socket.emit('clickColor', 'rgba(0, 0, 0, 0.8)');
    }
    return (
        <div>
            <button 
            onClick={clickHandlerBlack}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                margin: "0px 5px 0px 5px",
                cursor: 'pointer'
            }}>
            </button>
        </div>
    )
}

const ColorButtonBlue = () => {
    function clickHandlerBlue(){
        socket.emit('clickColor', 'rgba(0, 0, 255, 0.8)');
    }
    return (
        <div>
            <button 
            onClick={clickHandlerBlue}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(0, 0, 255, 0.8)',
                margin: "0px 5px 0px 5px",
                cursor: 'pointer'
            }}>
            </button>
        </div>
    )
}

const ColorButtonGreen = () => {
    function clickHandlerGreen(){
        socket.emit('clickColor', 'rgba(0, 225, 0, 0.8)');
    }
    return (
        <div>
            <button 
            onClick={clickHandlerGreen}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(0, 225, 0, 0.8)',
                margin: "0px 5px 0px 5px",
                cursor: 'pointer'
            }}>
            </button>
        </div>
    )
}

const ColorButtonYellow = () => {
    function clickHandlerYellow(){
        socket.emit('clickColor', 'rgba(225, 225, 0, 0.8)');
    }
    return (
        <div>
            <button 
            onClick={clickHandlerYellow}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(225, 225, 0, 0.8)',
                margin: "0px 5px 0px 5px",
                cursor: 'pointer'
            }}>
            </button>
        </div>
    )
}

const ColorButtonPurple = () => {
    function clickHandlerPurple(){
        socket.emit('clickColor', 'rgba(225, 0, 225, 0.8)');
    }
    return (
        <div>
            <button 
            onClick={clickHandlerPurple}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(225, 0, 225, 0.8)',
                margin: "0px 5px 0px 5px",
                cursor: 'pointer'
            }}>
            </button>
        </div>
    )
}

const Earser = () => {
    function clickHandlerEarser(){
        socket.emit('EraserColor', 'rgba(255, 255, 255, 1)', 50);
    }
    return (
        <div>
            <button 
            onClick={clickHandlerEarser}
            style = {{
                width: 0.02 * window.innerWidth,
                height: 0.02 * window.innerWidth,
                border: 'solid 2px rgba(0, 0, 0, 1)',
                borderRadius: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                margin: "0px 5px 0px 5px",
                cursor: 'pointer',
                fontSize: '8px'
            }}>Eraser
            </button>
        </div>
    )
}

export { ColorButtonRed, ColorButtonBlack, ColorButtonBlue, ColorButtonGreen, ColorButtonYellow, ColorButtonPurple, Earser };
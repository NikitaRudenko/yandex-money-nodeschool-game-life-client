'use strict';

//
// YOUR CODE GOES HERE...
//
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░
// ░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░
// ░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░
// ░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░
// ░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░
// ░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░
// ░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░
// ░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░
// ░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░
// ░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░
// ░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░
// ░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//
// Nyan cat lies here...
//

let socket = {};
let game = {};

App.onToken = (token) => {
    socket = new WebSocket(`ws://localhost:8080?token=${token}`);
    addSocketHandlers(socket);
}

function addSocketHandlers(socket) {
    socket.onopen = e => {
        console.log('Connection opened');
    };

    socket.onmessage = e => {
        try {
            const data = JSON.parse(e.data);
            handleMessage(data);
        } catch (err) {
            console.log(`invalid data: ${err}`);
        }
    };

    socket.onerror = e => {
        console.log(`Something went wrong there: ${e.data}`)
    };

    socket.onclose = e => {
        var wasClean = e.wasClean;
        console.log(`Close wasClean: ${wasClean}`);
    }
}

function handleMessage(msg) {
    if (!msg || !msg.type || !msg.data) throw new Error('Invalid data');

    switch (msg.type) {
        case 'INITIALIZE':
            init( msg.data);
            break;
        case 'UPDATE_STATE':
            updateState(msg.data);
            break;
        default:
            throw new Error('this type of message not recognized');
    }
}

function init({
    user,
    settings,
    state
}) {
    game = new LifeGame(user, settings);
    game.init();
    game.send = send;
    game.setState(state)
}

function updateState(state) {
    game.setState(state);
}

function send(data) {
    const dataObj = {
        type: 'ADD_POINT',
        data: data
    };
    socket.send(JSON.stringify(dataObj));
}
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

/**
 * LifeGame instance
 * @type {LifeGame}
 */
let Game;

/**
 * Main handler function
 * @param  {string} token
 * @return {void}
 */
const onTokenHandler = token => {
  const ws = new WebSocket(`ws://ws.rudenko.tech/life/api?token=${token}`);

  ws.onopen = () => {
    console.info('Connection created');
  };

  ws.onerror = err => {
    console.error('Websocket err', err);
  };

  ws.onmessage = event => {
    const message = JSON.parse(event.data);

    switch(message.type){
      case 'INITIALIZE':
        Game = new LifeGame(message.data.user, message.data.settings);
        Game.init();
        Game.send = data => {
          const newState = JSON.stringify({ type: 'ADD_POINT', data });
          console.log('Send state', data.affectedPoints);
          ws.send(newState);
        };
        break;
      case 'UPDATE_STATE':
        Game.setState(message.data);
        break;
    }

    console.log('Message recivied', message);
  };

  ws.onclose = () => {
    console.info('Connection closed');
  }

}

/**
 * Override handler method
 */
App.onToken = onTokenHandler;

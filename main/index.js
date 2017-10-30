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
 * @override Обработчик подтверждения токена
 * @param  {String} token
 * @return {void}
 */
App.onToken = token => {
  const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

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
        Game.send = data => {
          const newState = JSON.stringify({ type: 'ADD_POINT', data });
          ws.send(newState);
        };
        Game.init();
        break;
      case 'UPDATE_STATE':
        Game.setState(message.data.fields);
        App.vue.$refs.app.players = message.data.players;
        break;
    }

    console.log('Message recivied', message);
  };

  ws.onclose = () => {
    console.info('Connection closed');
  }

}

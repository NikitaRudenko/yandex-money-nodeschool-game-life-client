'use strict';

let ws, game;

App.onToken = (token) => {
  ws = new WebSocket(`ws://ws.rudenko.tech/life/api/?token=${token}`);

  ws.onopen = () => {
    console.log('connected')
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    dataHandler(data);
  };

  ws.onerror = (e) => {
    throw new Error('Something wrong:', e);
  };

  ws.onclose = () => {
    console.log('connection closed');
  }
};

function dataHandler(message) {
  switch (message.type) {
    case 'INITIALIZE':
      initGame(message.data);
      break;
    case 'UPDATE_STATE':
      update(message.data);
      break;
    default:
      throw new Error(`Wrong message type: ${message.type}`);
      break;
  }
};

function initGame({ user, settings, state }) {
  game = new LifeGame(user, settings);
  game.init();
  game.setState(state);
  game.send = (data) =>{
    ws.send(
      JSON.stringify({
        type: 'ADD_POINT',
        data
      })
    );
  };
}

function update(data) {
  game.setState(data);
}
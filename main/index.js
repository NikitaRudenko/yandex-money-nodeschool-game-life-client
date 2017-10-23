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

let ws = null;
let game = null;

App.onToken = (token) => {
	ws = new WebSocket(`ws://ws.rudenko.tech/life/api?token=${token}`);
	addHandlers(ws);
};

function addHandlers(ws) {
	ws.onopen = e => {
		console.log(e, 'open');
	};

	ws.onmessage = e => {
		const data = JSON.parse(e.data);
		processResp(data);
	};

	ws.onerror = e => {
		console.log(`Error occured: ${e}`);
	};

	ws.onclose = e => {
		const wasClean = e.wasClean;
		console.log(`closing was clean: ${wasClean}`);
	};
}

function processResp({type, data}) {
	switch (type) {
		case 'INITIALIZE':
			initGame(data);
			break;
		case 'UPDATE_STATE':
			update(data);
			break;
		default:
			console.log(`Undefined message type - ${type} with data - ${data}`);
			break;
	}
}

function initGame({state, settings, user}) {
	game = new LifeGame(user, settings);
	game.init();
	game.setState(state);
	game.send = send;
}

function update(data) {
	game.setState(data);
}

function send(data) {
	const result = JSON.stringify({
		type: 'ADD_POINT',
		data
	});

	ws.send(result);
}


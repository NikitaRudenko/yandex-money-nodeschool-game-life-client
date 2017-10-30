'use strict';

App.onToken = token => {
	if (!token) return;

	let game = null;

	const socket = new io('ws://localhost:3000', {
		path: '/',
		transports: ['websocket'],
		query: {token}
	});

	socket.on('connect', msg => {
		console.info('connection created');
	});

	socket.on('message', msg => {
		const {type, data} = parse(msg);

		if (type === 'UPDATE_STATE') {
			game.setState(data);
			return;
		}

		if (type === 'INITIALIZE') {
			const {user, settings, state} = data;
			game = new LifeGame(user, settings);
			game.init();
			game.setState(state);
			game.send = data => {
				socket.send(JSON.stringify({
					type: 'ADD_POINT', data
				}));
			};
			return;
		}

		console.warn('unexpected message type: ', type, data);
	});

	socket.on('error', e => {
		App.alertReload({
			title: 'Error :(',
			text: 'Connection error. <br> The page will be reloaded.'
		});
	});

	socket.on('close', _ => {
		App.alertReload({
			title: 'Game over',
			text: 'Connection was closed. <br> The page will be reloaded.'
		});
	});
};

function parse (data) {
	return JSON.parse(data);
}

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


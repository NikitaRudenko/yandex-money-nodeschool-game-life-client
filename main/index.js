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

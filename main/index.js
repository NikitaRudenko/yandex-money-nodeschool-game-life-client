/**
 * Connect to server and send token
 * @param {String} token
 * @returns {WebSocket}
 */
const connect = (token) => {
    return new WebSocket(`ws://ws.rudenko.tech/life/api?token=${token}`);
};

/**
 * Add events listeners
 * @param {WebSocket} socket
 */
const setupListeners = (socket) => {
    socket.addEventListener('open', () => {
        console.log('Connected to server!')
    });

    socket.addEventListener('message', (event) => {
        console.log('event:', event);
    });

    socket.addEventListener('error', (event) => {
        console.log('Error:', event);
    });

    socket.addEventListener('Close', () => {
        console.log('Connection closed!');
    });
};

/**
 * Init app
 * @param {String} token
 */
const init = (token) => {
    console.log('token:', token);

    const socket = connect(token);

    setupListeners(socket);
};

App.onToken = init;
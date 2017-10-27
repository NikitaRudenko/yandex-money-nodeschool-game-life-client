/**
 * Creates a new Network class
 * @class
 */
class Network {
    /**
     * Constructor
     */
    constructor(token) {
        this.token = token;
        this.connect = this.connect.bind(this);
        this.setupListeners = this.setupListeners.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.init = this.init.bind(this);

        this.init();
    }

    /**
     * Connect to server and send token
     */
    connect() {
        this.socket = new WebSocket(`ws://ws.rudenko.tech/life/api?token=${this.token}`);
    }

    /**
     * Add events listeners
     */
    setupListeners() {
        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('close', this.onClose);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
    }

    /**
     * Handle open event
     */
    onOpen() {
        console.log('Connected to server!')
    }

    /**
     * Handle close event
     * @param {Object} event
     */
    onClose(event) {
        if (event.wasClean) {
            console.log('Connection closed!');
        } else {
            console.log('Connection closed with error! Trying to reconnect!');

            this.init();
        }
    }

    /**
     * Handle message event
     * @param {Object} event
     */
    onMessage(event) {
        console.log('event:', event);
    }

    /**
     * Handle error event
     * @param {Object} error
     */
    onError(error) {
        console.log('Error:', error.message);
    }

    /**
     * Init app
     */
    init() {
        this.connect();
        this.setupListeners();
    }
}

App.onToken = (token) => (new Network(token));
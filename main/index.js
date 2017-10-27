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
        this.initialize = this.initialize.bind(this);
        this.update = this.update.bind(this);
        this.send = this.send.bind(this);
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
        const data = JSON.parse(event.data);
        const type = data.type;

        switch(type) {
            case 'INITIALIZE':
                this.initialize(data);
                break;

            case 'UPDATE_STATE':
                this.update(data);
                break;

            default:
                this.update(data);
        }
    }

    /**
     * Handle error event
     * @param {Object} error
     */
    onError(error) {
        console.log('Error:', error.message);
    }

    /**
     * Initialize game
     * @param {Object} data
     */
    initialize(data) {
        const gameData = data.data;
        const user = gameData.user;
        const settings = gameData.settings;
        const state = gameData.state;

        this.game = new LifeGame(user, settings);
        this.game.init();
        this.game.setState(state);
        this.game.send = this.send;
    }

    /**
     * Update game state
     * @param {Object} data
     */
    update(data) {
        if (!this.game) {return false;}

        const state = data.data;

        this.game.setState(state);
    }

    /**
     * Send state to server
     */
    send(data) {
        const message = {
            type: 'ADD_POINT',
            data: data
        };

        this.socket.send(JSON.stringify(message));
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
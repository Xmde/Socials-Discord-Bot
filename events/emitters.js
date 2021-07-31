const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const notifEmitter = new MyEmitter();

exports.notifEmitter = notifEmitter;

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const videoEmitter = new MyEmitter();

exports.videoEmitter = videoEmitter;
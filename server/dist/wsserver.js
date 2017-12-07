'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WsServer = function () {
    function WsServer() {
        _classCallCheck(this, WsServer);

        this.app = (0, _express2.default)();
        this.http = _http2.default.Server(this.app);
        this.io = (0, _socket2.default)(this.http);
    }

    _createClass(WsServer, [{
        key: 'doit',
        value: function doit() {
            this.configure();
            this.listen();
        }
    }, {
        key: 'configure',
        value: function configure() {
            var outerthis = this;

            this.io.on('connection', function (socket) {
                console.log('USER CONNECTED');
                //this.io.emit('message', {type:'new-message', text: 'Hallo vong Server her'});

                //socket.on('add-message', (message) => {
                //   outerthis.io.emit('message', {type:'new-message', text: 'have a reply!'});
                // });
            });
        }
    }, {
        key: 'notifyChanged',
        value: function notifyChanged(senderparam) {
            this.io.emit('message', { type: 'new-message', text: 'PLAYLISTCHANGED', sender: senderparam });
        }
    }, {
        key: 'notifyVolumeChanged',
        value: function notifyVolumeChanged() {
            this.io.emit('message', { type: 'new-message', text: 'VOLUMECHANGED' });
        }
    }, {
        key: 'listen',
        value: function listen() {
            this.http.listen(3001, function () {
                console.log('ws server horstet auf 3001');
            });
        }
    }]);

    return WsServer;
}();

exports.default = WsServer;
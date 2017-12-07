'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import multer from 'multer';


var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _squeezenode = require('squeezenode');

var _squeezenode2 = _interopRequireDefault(_squeezenode);

var _jayson = require('jayson');

var _jayson2 = _interopRequireDefault(_jayson);

var _wsserver = require('./wsserver');

var _wsserver2 = _interopRequireDefault(_wsserver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
    function Server() {
        _classCallCheck(this, Server);

        this.app = (0, _express2.default)();
        this.fs = _fs2.default;
        this.serverUrl = 'http://192.168.42.1';
        //this.squeeze = new SqueezeServer('http://localhost', 9000);
        this.squeeze = new _squeezenode2.default(this.serverUrl, 9000);
        //this.masterPlayer = this.squeeze.getPlayers(this.extractMasterPlayer);
        this.dataFile = _path2.default.join(__dirname, '../data.json');
        this.configreMasterAndSlave(this);
        this.wsserver = new _wsserver2.default();
    }

    _createClass(Server, [{
        key: 'notifychange',
        value: function notifychange(sender) {
            this.wsserver.notifyChanged(sender);
        }
    }, {
        key: 'notifyVolumeChange',
        value: function notifyVolumeChange() {
            this.wsserver.notifyVolumeChanged();
        }
    }, {
        key: 'resetServerAndPlayers',
        value: function resetServerAndPlayers() {
            this.squeeze = new _squeezenode2.default(this.serverUrl, 9000);
            this.configreMasterAndSlave(this);
        }
    }, {
        key: 'configureApp',
        value: function configureApp() {
            this.app.set('port', process.env.PORT || 3000);
            // this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
            this.app.use(_bodyParser2.default.json());
            this.app.use(_bodyParser2.default.urlencoded({ extended: true }));
        }
    }, {
        key: 'configureCORS',
        value: function configureCORS() {
            // Additional middleware which will set headers that we need on each request.
            this.app.use(function (req, res, next) {
                // Set permissive CORS header - this allows this server to be used only as
                // an API server in conjunction with something like webpack-dev-server.
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

                // Disable caching so we'll always get the latest comments.
                res.setHeader('Cache-Control', 'no-cache');
                next();
            });
        }
    }, {
        key: 'extractMasterPlayer',
        value: function extractMasterPlayer(reply) {
            console.log(reply);
            return reply.result[0];
        }
    }, {
        key: 'configreMasterAndSlave',
        value: function configreMasterAndSlave(outerthis) {
            this.squeeze.getPlayers(function (sqeezeResult) {
                console.info(sqeezeResult);
                if (sqeezeResult != null && (sqeezeResult.ok == 'true' || sqeezeResult.ok == true)) {
                    // Antwort sinnvoll
                    var arrayLength = sqeezeResult.result.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if (sqeezeResult.result[i].name == 'raspberrypi') {
                            outerthis.masterplayerid = sqeezeResult.result[i].playerid;
                        }
                        if (sqeezeResult.result[i].name == 'Beere_2') {
                            outerthis.slaveplayerId = sqeezeResult.result[i].playerid;;
                        }
                    }
                }
            });
        }
    }, {
        key: 'getMasterPlayer',
        value: function getMasterPlayer() {
            var realPlayer;
            if (this.masterplayerid == null) {
                realPlayer = this.squeeze.players['00:00:00:00:00:00'];
                if (realPlayer == undefined) {
                    console.warn('scheisse');
                }
            } else {
                realPlayer = this.squeeze.players[this.masterplayerid];
            }
            return realPlayer;
        }
    }, {
        key: 'getSlavePlayer',
        value: function getSlavePlayer() {
            //var realPlayer = this.squeeze.players['bc:5f:f4:4a:c7:28'];

            var realPlayer;

            if (this.slaveplayerId == null) {
                realPlayer = this.squeeze.players['f4:f2:6d:0e:c2:a1'];
            } else {
                realPlayer = this.squeeze.players[this.slaveplayerId];
            }

            //var realPlayer = this.squeeze.players['f4:f2:6d:0e:c2:a1'];
            return realPlayer;
        }
    }, {
        key: 'formatResultForPlayer',
        value: function formatResultForPlayer(player) {
            var stringified = JSON.stringify(player);
            if (stringified != null) {
                stringified = stringified.replace(/mixer volume/g, 'mixer_volume');
                stringified = stringified.replace(/playlist shuffle/g, 'playlist_shuffle');
                stringified = stringified.replace(/playlist repeat/g, 'playlist_repeat');
                stringified = stringified.replace(/playlist mode/g, 'playlist_mode');
            }
            return stringified;
        }
    }, {
        key: 'configureRoutes',
        value: function configureRoutes() {
            var _this = this;

            var outerThis = this;

            this.app.get('/api/server/status', function (req, res) {
                var realPlayer = _this.getMasterPlayer();

                var ok = { "online": "true" };
                var stringified = JSON.stringify(ok);
                res.json(JSON.parse(stringified));
            });

            this.app.get('/api/music/syncgroups/get', function (req, res) {
                _this.squeeze.getSyncGroups(function (sqeezeResult) {
                    console.dir(sqeezeResult);
                    if (sqeezeResult != null && sqeezeResult.result != null) {
                        var stringified = JSON.stringify(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    }
                });
            });

            this.app.get('/api/music/players/get', function (req, res) {
                _this.squeeze.getPlayers(function (sqeezeResult) {
                    console.info(sqeezeResult);
                    if (sqeezeResult != null && (sqeezeResult.ok == 'true' || sqeezeResult.ok == true)) {
                        // Antwort sinnvoll
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    }
                });
            });

            this.app.get('/api/music/reset', function (req, res) {
                _this.resetServerAndPlayers();
                res.json(JSON.parse(JSON.stringify('ok')));
            });

            this.app.get('/api/music/players/count/get', function (req, res) {
                _this.squeeze.getPlayerCount(function (sqeezeResult) {
                    console.dir(sqeezeResult);
                    if (sqeezeResult != null && sqeezeResult.result != null) {
                        var stringified = JSON.stringify(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    }
                });
            });

            this.app.get('/api/music/status', function (req, res) {
                var realPlayer = _this.getMasterPlayer();
                if (realPlayer == null) {
                    res.statusCode = 500;
                } else {
                    realPlayer.getStatus(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    });
                };
            });

            this.app.get('/api/music/get/masterplayer', function (req, res) {
                var realPlayer = _this.getMasterPlayer();
                if (realPlayer == null) {
                    //doof
                } else {
                    realPlayer.getStatus(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    });
                }
            });

            this.app.get('/api/music/get/slaveplayer', function (req, res) {
                var realPlayer = _this.getSlavePlayer();
                if (realPlayer == null) {
                    var response = '';
                    response = JSON.stringify(response);
                    res.json(JSON.parse(response));
                } else {
                    realPlayer.getStatus(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    });
                }
            });

            this.app.get('/api/music/get/playlists', function (req, res) {
                _this.squeeze.request("", ["playlists", "0", "100"], function (sqeezeResult) {
                    if (sqeezeResult != null && sqeezeResult.result != null) {
                        var stringified = JSON.stringify(sqeezeResult.result);
                        //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    }
                });
            });

            this.app.get('/api/music/playlist', function (req, res) {
                var realPlayer = _this.getMasterPlayer();

                realPlayer.getPlaylist(0, 10, function (sqeezeResult) {
                    //console.dir(sqeezeResult);
                    var stringified = JSON.stringify(sqeezeResult.result);
                    if (stringified != null) {
                        stringified = stringified.replace(/playlist index/g, 'playlist_index');
                        res.json(JSON.parse(stringified));
                    } else {
                        var response = '';
                        response = JSON.stringify(response);
                        res.json(JSON.parse(response));
                    }
                });
            });

            this.app.get('/api/music/get/playlist/:from/:to', function (req, res) {
                var realPlayer = _this.getMasterPlayer();
                var from = req.params.from;
                var to = req.params.to;

                realPlayer.getPlaylist(from, to, function (sqeezeResult) {
                    //console.dir(sqeezeResult);
                    var stringified = JSON.stringify(sqeezeResult.result);
                    if (stringified != null) {
                        stringified = stringified.replace(/playlist index/g, 'playlist_index');
                        res.json(JSON.parse(stringified));
                    } else {
                        var response = '';
                        response = JSON.stringify(response);
                        res.json(JSON.parse(response));
                    }
                });
            });

            this.app.get('/api/music/command/:cmdid/:sender', function (req, res) {

                //console.log(req.params.cmdid);

                var command = req.params.cmdid;
                var sender = req.params.sender;

                var realPlayer = _this.getMasterPlayer();

                if (command == 'playrandom') {
                    realPlayer.playRandom('tracks', function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                        outerThis.notifychange(sender);
                    });
                }

                if (command == 'play') {
                    realPlayer.play(function (sqeezeResult) {
                        // Warum auch immer - bekloppt... hier wird falsches objekt zurückgegeben. Daher status neu holen
                        realPlayer.getStatus(function (sqeezeResult2) {
                            var stringified = outerThis.formatResultForPlayer(sqeezeResult2.result);
                            res.json(JSON.parse(stringified));
                            outerThis.notifychange(sender);
                        });
                    });
                }

                if (command == 'pause') {
                    realPlayer.pause(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                        outerThis.notifychange(sender);
                    });
                }

                if (command == 'next') {
                    realPlayer.next(function (sqeezeResult) {
                        realPlayer.getStatus(function (sqeezeResult2) {
                            var stringified = outerThis.formatResultForPlayer(sqeezeResult2.result);
                            res.json(JSON.parse(stringified));
                            outerThis.notifychange(sender);
                        });
                    });
                }

                if (command == 'prev') {
                    realPlayer.previous(function (sqeezeResult) {
                        realPlayer.getStatus(function (sqeezeResult2) {
                            var stringified = outerThis.formatResultForPlayer(sqeezeResult2.result);
                            res.json(JSON.parse(stringified));
                            outerThis.notifychange(sender);
                        });
                    });
                }

                //this.sqeezePlayer.getPlaylist(0,10,this.getPlayList);

                _this.fs.readFile(_this.dataFile, function (err, data) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    //res.json(JSON.parse(data));
                });
            });

            this.app.get('/api/music/search/artist/:cmdid', function (req, res) {
                var command = req.params.cmdid;
                _this.squeeze.request("", ["artists", 0, 1, "search:" + command], function (sqeezeResult) {
                    var stringified = JSON.stringify(sqeezeResult.result);
                    //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                });
            });

            this.app.get('/api/music/search/song/:cmdid', function (req, res) {
                var command = req.params.cmdid;
                _this.squeeze.request("", ["songs", 0, 100, "search:" + command + ""], function (sqeezeResult) {
                    var stringified = JSON.stringify(sqeezeResult.result);
                    //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                });
            });

            this.app.get('/api/music/search/detai/song/:from/:to/:query', function (req, res) {
                var from = req.params.from;
                var to = req.params.to;
                var query = req.params.query;
                _this.squeeze.request("", ["songs", from, to, "search:" + query + ""], function (sqeezeResult) {
                    var stringified = JSON.stringify(sqeezeResult.result);
                    //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                });
            });

            this.app.get('/api/music/set/masterplayer/volume/:cmdid', function (req, res) {
                var command = req.params.cmdid;
                var realPlayer = _this.getMasterPlayer();

                realPlayer.setVolume(command, function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                    outerThis.notifyVolumeChange();
                });
            });

            this.app.get('/api/music/set/masterplayer/play/:playlistId', function (req, res) {
                var command = req.params.playlistId;
                var realPlayer = _this.getMasterPlayer();

                realPlayer.playIndex(command, function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                    outerThis.notifychange();
                });
            });

            this.app.get('/api/music/set/masterplayer/addtoplaylist/:trackid', function (req, res) {
                var trackid = req.params.trackid;
                var realPlayer = _this.getMasterPlayer();

                _this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:insert", "track_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                    outerThis.notifychange();
                });
            });

            this.app.get('/api/music/set/masterplayer/startenow/:trackid', function (req, res) {
                var trackid = req.params.trackid;
                var realPlayer = _this.getMasterPlayer();

                _this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:load", "track_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                    outerThis.notifychange();
                });
            });

            this.app.get('/api/music/set/masterplayer/addplaylist/:playlistid', function (req, res) {
                var playlistid = req.params.trackid;
                var realPlayer = _this.getMasterPlayer();

                _this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:insert", "playlist_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                    outerThis.notifychange();
                });
            });

            this.app.get('/api/music/set/masterplayer/startplaylistnow/:trackid', function (req, res) {
                var trackid = req.params.trackid;
                var realPlayer = _this.getMasterPlayer();

                _this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:load", "playlist_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                    outerThis.notifychange();
                });
            });

            this.app.get('/api/music/set/slaveplayer/volume/:cmdid', function (req, res) {
                var command = req.params.cmdid;
                var realPlayer = _this.getSlavePlayer();

                realPlayer.setVolume(command, function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                });
            });
        }
    }, {
        key: 'listen',
        value: function listen(port) {
            this.app.listen(port, function () {
                console.log('Server started: http://localhost:' + port + '/');
            });
        }
    }, {
        key: 'run',
        value: function run() {
            this.configureApp();
            this.configureCORS();
            this.configureRoutes();
            this.listen(this.app.get('port'));
            this.wsserver.doit();
        }
    }]);

    return Server;
}();

exports.default = Server;
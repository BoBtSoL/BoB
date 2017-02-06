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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
    function Server() {
        _classCallCheck(this, Server);

        this.app = (0, _express2.default)();
        this.fs = _fs2.default;
        this.squeeze = new _squeezenode2.default('http://localhost', 9000);
        //this.masterPlayer = this.squeeze.getPlayers(this.extractMasterPlayer);
        this.dataFile = _path2.default.join(__dirname, '../data.json');
    }

    _createClass(Server, [{
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
        key: 'getMasterPlayer',
        value: function getMasterPlayer() {
            var realPlayer = this.squeeze.players['bc:5f:f4:4a:c7:28'];
            return realPlayer;
        }
    }, {
        key: 'getSlavePlayer',
        value: function getSlavePlayer() {
            var realPlayer = this.squeeze.players['bc:5f:f4:4a:c7:28'];
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

            this.app.get('/api/music/status', function (req, res) {
                var realPlayer = _this.getMasterPlayer();

                realPlayer.getStatus(function (sqeezeResult) {
                    console.dir(sqeezeResult);
                    var stringified = JSON.stringify(sqeezeResult.result);
                    stringified = stringified.replace(/mixer volume/g, 'mixer_volume');
                    stringified = stringified.replace(/playlist shuffle/g, 'playlist_shuffle');
                    stringified = stringified.replace(/playlist repeat/g, 'playlist_repeat');
                    stringified = stringified.replace(/playlist mode/g, 'playlist_mode');
                    res.json(JSON.parse(stringified));
                });

                //var realPlayer = this.squeeze.players['bc:5f:f4:4a:c7:28'];
            });

            this.app.get('/api/music/get/masterplayer', function (req, res) {

                var realPlayer = _this.getMasterPlayer();
                var funcFormat = _this.formatResultForPlayer;

                realPlayer.getStatus(function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                });
            });

            this.app.get('/api/music/get/slaveplayer', function (req, res) {

                var realPlayer = _this.getSlavePlayer();
                realPlayer.getStatus(function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                });
            });

            this.app.get('/api/music/playlist', function (req, res) {
                var realPlayer = _this.getMasterPlayer();

                realPlayer.getPlaylist(0, 10, function (sqeezeResult) {
                    console.dir(sqeezeResult);
                    var stringified = JSON.stringify(sqeezeResult.result);
                    if (stringified != null) {
                        stringified = stringified.replace(/playlist index/g, 'playlist_index');
                        res.json(JSON.parse(stringified));
                    }
                });
            });

            this.app.get('/api/music/command/:cmdid', function (req, res) {

                console.log(req.params.cmdid);

                var command = req.params.cmdid;

                var realPlayer = _this.getMasterPlayer();

                if (command == 'playrandom') {
                    realPlayer.playRandom('tracks', function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    });
                }

                if (command == 'play') {
                    realPlayer.play(function (sqeezeResult) {
                        // Warum auch immer - bekloppt... hier wird falsches objekt zurückgegeben. Daher status neu holen
                        realPlayer.getStatus(function (sqeezeResult2) {
                            var stringified = outerThis.formatResultForPlayer(sqeezeResult2.result);
                            res.json(JSON.parse(stringified));
                        });
                    });
                }

                if (command == 'pause') {
                    realPlayer.pause(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    });
                }

                if (command == 'next') {
                    realPlayer.next(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
                    });
                }

                if (command == 'prev') {
                    realPlayer.previous(function (sqeezeResult) {
                        var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                        res.json(JSON.parse(stringified));
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

            this.app.get('/api/music/set/masterplayer/volume/:cmdid', function (req, res) {
                var command = req.params.cmdid;
                var realPlayer = _this.getMasterPlayer();

                realPlayer.setVolume(command, function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
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

            this.app.put('/api/comments/:id', function (req, res) {
                _this.fs.readFile(_this.dataFile, function (err, data) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    var comments = JSON.parse(data);
                    var idIndex = 0;
                    var findCommentById = comments.filter(function (comment) {
                        if (comment.id == req.params.id) {
                            idIndex = comments.indexOf(comment);
                            return comment;
                        }
                    });
                    findCommentById[0].text = req.body.text;
                    findCommentById[0].author = req.body.author;

                    comments.splice(idIndex, 1, findCommentById[0]);
                    _this.fs.writeFile(_this.dataFile, JSON.stringify(comments, null, 4), function (err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        res.json(comments);
                    });
                });
            });

            this.app.post('/api/comments', function (req, res) {
                _this.fs.readFile(_this.dataFile, function (err, data) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    var comments = JSON.parse(data);

                    var newComment = {
                        id: Date.now(),
                        author: req.body.author,
                        text: req.body.text
                    };

                    comments.push(newComment);
                    _this.fs.writeFile(_this.dataFile, JSON.stringify(comments, null, 4), function (err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }

                        _this.twilioClient.messages.create({
                            body: 'Message from ' + req.body.author + '. Content: ' + req.body.text,
                            to: process.env.TWILIO_TO,
                            from: process.env.TWILIO_FROM
                            // mediaUrl: 'http://www.yourserver.com/someimage.png'
                        }, function (err, data) {
                            if (err) {
                                console.error('Could not notify administrator');
                                console.error(err);
                            } else {
                                console.log('Administrator notified');
                            }
                        });
                        res.json(comments);
                    });
                });
            });

            this.app.put('/api/comments/:id', function (req, res) {
                _this.fs.readFile(_this.dataFile, function (err, data) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    var comments = JSON.parse(data);
                    var idIndex = 0;
                    var findCommentById = comments.filter(function (comment) {
                        if (comment.id == req.params.id) {
                            idIndex = comments.indexOf(comment);
                            return comment;
                        }
                    });
                    findCommentById[0].text = req.body.text;
                    findCommentById[0].author = req.body.author;

                    comments.splice(idIndex, 1, findCommentById[0]);
                    _this.fs.writeFile(_this.dataFile, JSON.stringify(comments, null, 4), function (err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        res.json(comments);
                    });
                });
            });
            this.app.delete('/api/comments/:id', function (req, res) {
                _this.fs.readFile(_this.dataFile, function (err, data) {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    var comments = JSON.parse(data);
                    var idIndex = null;
                    var findCommentById = comments.filter(function (comment) {
                        if (comment.id == req.params.id) {
                            idIndex = comments.indexOf(comment);
                            return comment;
                        }
                    });

                    if (idIndex >= 0) {
                        comments.splice(idIndex, 1);
                    }

                    _this.fs.writeFile(_this.dataFile, JSON.stringify(comments, null, 4), function (err) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        res.json(comments);
                    });
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
        }
    }]);

    return Server;
}();

exports.default = Server;
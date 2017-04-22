import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
// import multer from 'multer';
import SqueezeServer from 'squeezenode';
import Jayson from 'jayson';

class Server {


    constructor() {
        this.app = express();
        this.fs = fs;
        this.serverUrl = 'http://192.168.42.1';
        //this.squeeze = new SqueezeServer('http://localhost', 9000);
        this.squeeze = new SqueezeServer(this.serverUrl, 9000);
        //this.masterPlayer = this.squeeze.getPlayers(this.extractMasterPlayer);
        this.dataFile = path.join(__dirname, '../data.json');
        this.configreMasterAndSlave(this);
    }


    resetServerAndPlayers() {
        this.squeeze = new SqueezeServer(this.serverUrl, 9000);
        this.configreMasterAndSlave(this);
    }

    configureApp() {
        this.app.set('port', (process.env.PORT || 3000));
        // this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    configureCORS() {
        // Additional middleware which will set headers that we need on each request.
        this.app.use((req, res, next) => {
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

    extractMasterPlayer(reply) {
        console.log(reply);
        return reply.result[0];
    }

    configreMasterAndSlave(outerthis) {
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

    getMasterPlayer() {
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

    getSlavePlayer() {
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

    formatResultForPlayer(player) {
        var stringified = JSON.stringify(player);
        if (stringified != null) {
            stringified = stringified.replace(/mixer volume/g, 'mixer_volume');
            stringified = stringified.replace(/playlist shuffle/g, 'playlist_shuffle');
            stringified = stringified.replace(/playlist repeat/g, 'playlist_repeat');
            stringified = stringified.replace(/playlist mode/g, 'playlist_mode');
        }
        return stringified;
    }

    configureRoutes() {
        var outerThis = this;

        this.app.get('/api/server/status', (req, res) => {
            var realPlayer = this.getMasterPlayer();

            var ok = { "online": "true" };
            var stringified = JSON.stringify(ok);
            res.json(JSON.parse(stringified));
        });

        this.app.get('/api/music/syncgroups/get', (req, res) => {
            this.squeeze.getSyncGroups(function (sqeezeResult) {
                console.dir(sqeezeResult);
                if (sqeezeResult != null && sqeezeResult.result != null) {
                    var stringified = JSON.stringify(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                }
            });
        });


        this.app.get('/api/music/players/get', (req, res) => {
            this.squeeze.getPlayers(function (sqeezeResult) {
                console.info(sqeezeResult);
                if (sqeezeResult != null && (sqeezeResult.ok == 'true' || sqeezeResult.ok == true)) {
                    // Antwort sinnvoll
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                }
            });
        });

        this.app.get('/api/music/reset', (req, res) => {
            this.resetServerAndPlayers();
            res.json(JSON.parse(JSON.stringify('ok')));
        });

        this.app.get('/api/music/players/count/get', (req, res) => {
            this.squeeze.getPlayerCount(function (sqeezeResult) {
                console.dir(sqeezeResult);
                if (sqeezeResult != null && sqeezeResult.result != null) {
                    var stringified = JSON.stringify(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                }
            });
        });


        this.app.get('/api/music/status', (req, res) => {
            var realPlayer = this.getMasterPlayer();
            realPlayer.getStatus(function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            })

        });

        this.app.get('/api/music/get/masterplayer', (req, res) => {
            var realPlayer = this.getMasterPlayer();
            if (realPlayer == null) {
                //doof
            } else {
                realPlayer.getStatus(function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                })
            }
        });

        this.app.get('/api/music/get/slaveplayer', (req, res) => {
            var realPlayer = this.getSlavePlayer();
            if (realPlayer == null) {
                //doof
            } else {
                realPlayer.getStatus(function (sqeezeResult) {
                    var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                    res.json(JSON.parse(stringified));
                })
            }
        });

        this.app.get('/api/music/get/playlists', (req, res) => {
            this.squeeze.request("", ["playlists", "0", "100"], function (sqeezeResult) {
                var stringified = JSON.stringify(sqeezeResult.result);
                //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });


        this.app.get('/api/music/playlist', (req, res) => {
            var realPlayer = this.getMasterPlayer();

            realPlayer.getPlaylist(0, 10, function (sqeezeResult) {
                console.dir(sqeezeResult);
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

        this.app.get('/api/music/get/playlist/:from/:to', (req, res) => {
            var realPlayer = this.getMasterPlayer();
            var from = req.params.from;
            var to = req.params.to;

            realPlayer.getPlaylist(from, to, function (sqeezeResult) {
                console.dir(sqeezeResult);
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

        this.app.get('/api/music/command/:cmdid', (req, res) => {

            console.log(req.params.cmdid);

            var command = req.params.cmdid;

            var realPlayer = this.getMasterPlayer();

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

            this.fs.readFile(this.dataFile, (err, data) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                //res.json(JSON.parse(data));
            });
        });


        this.app.get('/api/music/search/artist/:cmdid', (req, res) => {
            var command = req.params.cmdid;
            this.squeeze.request("", ["artists", 0, 1, "search:" + command], function (sqeezeResult) {
                var stringified = JSON.stringify(sqeezeResult.result);
                //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });

        this.app.get('/api/music/search/song/:cmdid', (req, res) => {
            var command = req.params.cmdid;
            this.squeeze.request("", ["songs", 0, 100, "search:" + command + ""], function (sqeezeResult) {
                var stringified = JSON.stringify(sqeezeResult.result);
                //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });

        this.app.get('/api/music/search/detai/song/:from/:to/:query', (req, res) => {
            var from = req.params.from;
            var to = req.params.to;
            var query = req.params.query;
            this.squeeze.request("", ["songs", from, to, "search:" + query + ""], function (sqeezeResult) {
                var stringified = JSON.stringify(sqeezeResult.result);
                //var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });


        this.app.get('/api/music/set/masterplayer/volume/:cmdid', (req, res) => {
            var command = req.params.cmdid;
            var realPlayer = this.getMasterPlayer();

            realPlayer.setVolume(command, function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });
        });

        this.app.get('/api/music/set/masterplayer/play/:playlistId', (req, res) => {
            var command = req.params.playlistId;
            var realPlayer = this.getMasterPlayer();

            realPlayer.playIndex(command, function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });
        });

        this.app.get('/api/music/set/masterplayer/addtoplaylist/:trackid', (req, res) => {
            var trackid = req.params.trackid;
            var realPlayer = this.getMasterPlayer();

            this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:insert", "track_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });

        this.app.get('/api/music/set/masterplayer/startenow/:trackid', (req, res) => {
            var trackid = req.params.trackid;
            var realPlayer = this.getMasterPlayer();

            this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:load", "track_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });

        this.app.get('/api/music/set/masterplayer/addplaylist/:playlistid', (req, res) => {
            var playlistid = req.params.trackid;
            var realPlayer = this.getMasterPlayer();

            this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:insert", "playlist_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });

        this.app.get('/api/music/set/masterplayer/startplaylistnow/:trackid', (req, res) => {
            var trackid = req.params.trackid;
            var realPlayer = this.getMasterPlayer();

            this.squeeze.request(realPlayer.playerId, ["playlistcontrol", "cmd:load", "playlist_id:" + trackid, "play_index:0"], function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });

        });


        this.app.get('/api/music/set/slaveplayer/volume/:cmdid', (req, res) => {
            var command = req.params.cmdid;
            var realPlayer = this.getSlavePlayer();

            realPlayer.setVolume(command, function (sqeezeResult) {
                var stringified = outerThis.formatResultForPlayer(sqeezeResult.result);
                res.json(JSON.parse(stringified));
            });
        });
    }

    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server started: http://localhost:${port}/`);
        });
    }

    run() {
        this.configureApp();
        this.configureCORS();
        this.configureRoutes();
        this.listen(this.app.get('port'));
    }
}

export default Server;

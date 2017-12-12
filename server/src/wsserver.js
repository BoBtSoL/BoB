import Server from './server';
import express from 'express';
import http from 'http';
import io from 'socket.io';

class WsServer {
    
    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        this.io = io(this.http);
    }

    doit(){
        this.configure();
        this.listen();
    }

    configure(){
        var outerthis = this;
       
        this.io.on('connection', (socket) => {
            console.log('USER CONNECTED');
            //this.io.emit('message', {type:'new-message', text: 'Hallo vong Server her'});

            //socket.on('add-message', (message) => {
             //   outerthis.io.emit('message', {type:'new-message', text: 'have a reply!'});
             // });
        });
    }

    notifyChanged(senderparam){
        this.io.emit('message', {type:'new-message', text: 'PLAYLISTCHANGED', sender: senderparam})
    }

    notifyVolumeChanged(){
        this.io.emit('message', {type:'new-message', text: 'VOLUMECHANGED'});
    }

    notifySlaveVolumeChanged(){
        this.io.emit('message', {type:'new-message', text: 'SLAVEVOLUMECHANGED'});
    }

    listen() {
        this.http.listen(3001, () => {
            console.log(`ws server horstet auf 3001`);
        });
    }
}

export default WsServer;
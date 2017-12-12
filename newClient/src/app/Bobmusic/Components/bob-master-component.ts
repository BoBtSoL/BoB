// Imports
import { Component, OnInit } from '@angular/core';
import { MusicService } from '../Services/music.service';
import { Subscription } from 'rxjs/Subscription';
import { Message } from '../Model/message';

@Component({
    selector: 'bob-master-component',
    templateUrl: './bob-master-component.html',
})
export class BobMasterComponent implements OnInit {

    masterPlayerId: string;
    slavePlayerId: string;
    subscription: Subscription;
    connection;


    constructor(
        private musicService: MusicService
    ) { }

    ngOnInit() {

        // WS-Connection:
        this.connection = this.musicService.getMessages().subscribe(message => {
            console.warn('message recieved, before casting');
            const localMessage = <Message>message;
            console.warn('message is: ' + localMessage.text);

            if (localMessage.text != null) {
                if (localMessage.text === 'VOLUMECHANGED') {
                    this.musicService.masterVolumeChanged('VOLUMECHANGED');
                } else if (localMessage.text === 'SLAVEVOLUMECHANGED') {
                    this.musicService.slaveVolumeChanged('SLAVEVOLUMECHANGED');

                } else if (localMessage.text === 'PLAYLISTCHANGED') {
                    this.musicService.getStatus2().then(serverstatus => {
                        this.musicService.playerStatusChanged(serverstatus);
                    });
                }
            }


        });
    }

}

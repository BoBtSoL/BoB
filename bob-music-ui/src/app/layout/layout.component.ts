import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Message } from '../model/Message';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public rest: RestService) { }

  connection;

  ngOnInit() {

    // WS-Connection:
    this.connection = this.rest.getMessages().subscribe(message => {
      console.warn('message recieved, before casting');
      const localMessage = <Message>message;
      console.warn('message is: ' + localMessage.text);

      if (localMessage.text != null) {
        if (localMessage.text === 'VOLUMECHANGED') {
          this.rest.masterVolumeChanged('VOLUMECHANGED');
        } else if (localMessage.text === 'SLAVEVOLUMECHANGED') {
          this.rest.slaveVolumeChanged('SLAVEVOLUMECHANGED');
        } else if (localMessage.text === 'PLAYLISTCHANGED') {
          this.rest.getStatus().subscribe((playerStatus) => {
            this.rest.playerStatusChanged(playerStatus);
          });
        }
      }
    });
  }

}

// Imports
import { Component } from '@angular/core';

@Component({
    selector: 'bob-master-component',
    template: `
            <div>
                <h2 style="text-align: center;">BoB Music Control</h2>
            </div>
             <div class="row">
                <div class="col-sm-1 col-md-1"></div>
                <div class="col-sm-10 col-md-10">
                    <md-tab-group>
                        <md-tab label="Main">
                            <div class="row">
                                <div class="col-sm-2 col-md-2"><bob-volume-component [isMaster]=true></bob-volume-component></div>
                                 <div class="col-sm-8 col-md-8"><appbobmain></appbobmain></div>
                                 <div class="col-sm-2 col-md-2"><bob-volume-slave-component [isMaster]=false></bob-volume-slave-component></div>
                              </div>
                        </md-tab>
                     <md-tab label="Settings"> bald...</md-tab>
                   </md-tab-group>
                </div>
                <div class="col-sm-1 col-md-1">

             </div>
          

    `,
})
export class BobMasterComponent {

    masterPlayerId: string;
    slavePlayerId: string;

}

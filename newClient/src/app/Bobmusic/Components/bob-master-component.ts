// Imports
import { Component } from '@angular/core';

@Component({
    selector: 'bob-master-component',
    template: `

        <div class="jumbo2">
            <div class="container">
                        <div>
                <h2 style="text-align: center;">BoB Music Control</h2>
            </div>
             <div class="row">
                <div class="col"></div>
                <div class="col col-sm-12 col-md-12 col-lg-12">
                    <md-tab-group>
                        <md-tab label="Main">

                            <div class="row">
                                <div class="col"><bob-volume-component [isMaster]=true></bob-volume-component></div>
                                 <div class="col-sm-8 col-md-8"><appbobmain></appbobmain></div>
                                 <div class="col"><bob-volume-slave-component [isMaster]=false></bob-volume-slave-component></div>
                              </div>
                        </md-tab>
                     <md-tab label="Suche"><bob-search-component></bob-search-component></md-tab>
                     <md-tab label="Einstellungen"> <bob-settings-component></bob-settings-component></md-tab>
                   </md-tab-group>
                </div>
                <div class="col">

             </div>
             </div>
             </div>
          

    `,
})
export class BobMasterComponent {

    masterPlayerId: string;
    slavePlayerId: string;

}

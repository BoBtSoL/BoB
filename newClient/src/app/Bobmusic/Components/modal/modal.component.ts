// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
    selector: 'bob-modal',
    template: `
    <div (click)="onContainerClicked($event)" class="modal fade modal-center" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
         [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
            <div class="modal-dialog">
           
                <div class="card card-middle">
                <div class="modal-header card-header">
                    <ng-content select=".app-modal-header"></ng-content>
                </div>
                <div class="modal-body card-block">
                    <ng-content select=".app-modal-body"></ng-content>
                </div>
                <div class="modal-footer card-footer">
                    <ng-content select=".app-modal-footer"></ng-content>
                </div>
                </div>
      </div>
    </div>
    `
})
export class BobModalComponent {

    public visible = false;
    public visibleAnimate = false;

    public show(): void {
        this.visible = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }
    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }

    public onContainerClicked(event: MouseEvent): void {
        if ((<HTMLElement>event.target).classList.contains('modal')) {
            this.hide();
        }
    }
}
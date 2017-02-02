/* * * ./app/comments/components/index.ts * * */
// Imports
import { Component } from '@angular/core';
import { EmitterService } from '../../emitter.service';

@Component({
    selector: 'comment-widget',
    template: `
    <div class="row">
        <div class="col-sm-1 col-md-2">left</div>
        <div class="col-sm-10 col-md-6"><info-form></info-form></div>
        <div class="col-sm-1 col-md-2">right</div>
    </div>
        <div>
           
            <!-- <comment-form [listId]="listId" [editId]="editId"></comment-form> -->
            <!-- <comment-list [listId]="listId" [editId]="editId"></comment-list> -->
            
        </div>
    `,
})
export class CommentComponent {
    // Event tracking properties
    private listId = 'COMMENT_COMPONENT_LIST';
    private editId = 'COMMENT_COMPONENT_EDIT';
}

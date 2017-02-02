/* * * ./app/comments/components/comment-box.component.ts * * */
// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
//import { Comment } from '../model/comment'
import { Songinfo } from '../model/songinfo';
import { EmitterService } from '../../emitter.service';
import { CommentService } from '../services/comment.service';

// Component decorator
@Component({
    selector: 'comment-box',
    template: `

  <div class="col-sm-4">
    <div class="card">
        <div class="card-block">
        <h4 class="card-title">{{comment.title}}</h4>
        <p class="card-text">{{comment.genre}} small card.</p>
        </div>
        <div class="card-footer">
        <small class="text-muted">Last updated 3 mins ago
            <button class="btn btn-info" (click)="editComment()"><span class="glyphicon glyphicon-edit"></span></button>
        </small>
        </div>
    </div>
  </div>
    

    `
    // No providers here because they are passed down from the parent component
})
// Component class
export class CommentBoxComponent {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;
    @Input() editId: string;
    
    // Constructor
    constructor(
        private commentService: CommentService
    ) { }


    editComment() {
        // Emit edit event
        EmitterService.get(this.editId).emit(this.comment);
    }

    deleteComment(id: string) {
        // Call removeComment() from CommentService to delete comment
        this.commentService.removeComment(id).subscribe(
            comments => {
                // Emit list event
                EmitterService.get(this.listId).emit(comments);
            },
            err => {
                // Log errors if any
                console.log(err);
            });
    }
}

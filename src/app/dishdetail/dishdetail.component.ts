import { Component, Input, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from "../services/dish.service";
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish?: Dish;
  dishIds?: string[];
  prev?: string | null;
  next?: string | null;
  commentForm?: FormGroup;
  errMess? : string;

  @ViewChild("fform") commentFormDirective: any;


  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject ('BaseURL') public baseURL:string) {
    this.createForm();
  }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
       errmess => this.errMess = <any> errmess );

  }
  setPrevNext(dishId: string): void {
    const index = this.dishIds?.indexOf(dishId);

    this.prev = this.dishIds![(this.dishIds!.length + index! - 1) % this.dishIds!.length];

    this.next = this.dishIds![(this.dishIds!.length + index! + 1) % this.dishIds!.length];

  }

  goBack(): void {
    this.location.back();
  }

  createForm(): void {
    this.commentForm = this.fb.group({
      author: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: [5, [Validators.required]],
      comment: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],

    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any): void {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(): void {
    let comment = this.commentForm?.value;
    comment.date=new Date().toISOString();
    this.dish!.comments.push(comment);


    console.log(this.commentForm);
    this.commentFormDirective.resetForm();
    this.commentForm?.reset({
      author: "",
      rating: 5,
      comment: "",
    });

  }
  formErrors: any = {
    "author": "",
    "rating": "",
    "comment": "",
  };
  validationMessages: any = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    },
    'Rating': {
      'required': 'Rating is required.',

    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 5 characters long.',
      'maxlength': 'Comment cannot be more than 1000 characters long.'
    },


  };



}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserService, AuthenticationService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser: User;
  users = [];
  editNameForm: FormGroup; //FINELLI: added the new editNameForm
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllUsers();
    //FINELLI: added the new editNameForm to on init
    this.editNameForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editNameForm.controls; }
  
  
  deleteUser(id: number) {
    this.userService.delete(id)
        .pipe(first())
        .subscribe(() => this.loadAllUsers());
  }



  //FINELLI: _show_ the name edit fields
  //when you click "edit name"
  showEditUserNameFields(user: any) {
    user.edit = true;
  }
  //FINELLI: _hide_ the name edit fields
  //when you click "cancel"
  hideEditUserNameFields(user: any) {
      user.edit = false;  
  }
  //FINELLI: this is the submit function when you save a new first or last name
  updateUserName(user: any, id: number, e: any) {
    e.preventDefault();
    this.submitted = true;//TODO: do I need this?

    //stop here if form fields are invalid (i.e. blank first name or last name)
    if (this.editNameForm.invalid) {
      return;
    }
    //call the user edit service and pass in the id and the form values
    this.userService.edit(id, this.editNameForm.value)
      .pipe(first())
      .subscribe(() => this.loadAllUsers());
  }


  private loadAllUsers() {
    this.userService.getAll()
        .pipe(first())
        .subscribe(users => this.users = users);
  }

}

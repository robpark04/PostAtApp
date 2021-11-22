import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  userId: any;
  userDetails: any;
  editUserForm: FormGroup = new FormGroup({});
  dataLoaded: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataLoaded = false;
    this.activatedRoute.params.subscribe((data) => {
      this.userId = data.id;
    });

    if (this.userId !== '') {
      this.userService
        .viewUser(this.userId)
        .toPromise()
        .then((data) => {
          this.userDetails = data;
          Object.assign(this.userDetails, data);

          this.editUserForm = this.formBuilder.group({
            name: new FormControl(this.userDetails.name),
            username: new FormControl(this.userDetails.username),
            email: new FormControl(this.userDetails.email),
            address: new FormGroup({
              street: new FormControl(this.userDetails.address.street),
              suite: new FormControl(this.userDetails.address.suite),
              city: new FormControl(this.userDetails.address.city),
              zipcode: new FormControl(this.userDetails.address.zipcode),
              geo: new FormGroup({
                lat: new FormControl(this.userDetails.address.geo['lat']),
                lng: new FormControl(this.userDetails.address.geo['lng']),
              }),
            }),
            phone: new FormControl(this.userDetails.phone),
            website: new FormControl(this.userDetails.website),
            company: new FormGroup({
              name: new FormControl(this.userDetails.company['name']),
              catchPhrase: new FormControl(
                this.userDetails.company['catchPhrase']
              ),
              bs: new FormControl(this.userDetails.company['bs']),
            }),
          });
          this.dataLoaded = true;
        });
    }
  }

  updateUser() {
    this.userService.updateUser(this.userId , this.editUserForm.value).subscribe(
      (data) => {
        this._snackBar.open('User has been successfully updated ');
      },
      (err) => {
        this._snackBar.open("User couldn't be updated");
      }
    );
  }
}

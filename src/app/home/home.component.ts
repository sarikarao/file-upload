import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  userData: any;
  value = "";

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      course: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(4)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required, this.endDateValidator('startDate')]],
      university: ['', [Validators.required]]
    });
  }

  get course() {
    return this.registerForm?.get("course")
  }

  get startDate() {
    return this.registerForm?.get("startDate")
  }

  get endDate() {
    return this.registerForm?.get("endDate")
  }

  get university() {
    return this.registerForm?.get("university")
  }

  ngAfterViewInit() {
  }

  onSubmit() {

  }

  endDateValidator(startDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      const startDateControl = control.parent?.get(startDate)?.value ? moment(control.parent.get(startDate)?.value, "") : null;
      const endDateControl = control.value ? moment(control.value, "") : null;

      return startDateControl && endDateControl && startDateControl.isAfter(endDateControl) ? {endDateLimit: true} : null;
    };
  }
}

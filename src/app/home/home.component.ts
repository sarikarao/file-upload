import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import * as moment from "moment";
import {PdfSaveService} from "../service/pdf-save.service";
import {Register} from "../model/register";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  submitted = false;

  userData: any;
  successSubmission = false;
  errorSubmission = false;

  constructor(private fb: FormBuilder, private pdfSaveService: PdfSaveService) {
  }

  ngOnDestroy(): void {
    this.clearForm();
  }

  clearForm(): void {
    this.successSubmission = false;
    this.errorSubmission = false;
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
    return this.registerForm?.get("course");
  }

  get startDate() {
    return this.registerForm?.get("startDate");
  }

  get endDate() {
    return this.registerForm?.get("endDate");
  }

  get university() {
    return this.registerForm?.get("university");
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm?.valid) {
      const register: Register = {
        course: this.course?.value,
        startDate: moment(this.startDate?.value).format("MMDDYYYY"),
        endDate: this.endDate?.value,
        university: this.university?.value
      };
      console.log("Form in ")
      this.pdfSaveService.saveToPdf(register).subscribe((response: any) => {
        console.log("Received Response", response, response.response);
        if (response?.response === "Success") {
          console.log("Received Success Response", response);
          this.successSubmission = true;
        } else if (response?.response === "Failure") {
          console.log("Received Failure Response", response);
          this.errorSubmission = true;
        }

      });
    }
  }

  endDateValidator(startDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      const startDateControl = control.parent?.get(startDate)?.value ? moment(control.parent.get(startDate)?.value) : null;
      const endDateControl = control.value ? moment(control.value) : null;

      console.log(control, startDateControl, endDateControl);

      return startDateControl && endDateControl && startDateControl.isAfter(endDateControl) ? {endDateLimit: true} : null;
    };
  }

}

import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {PdfSaveService} from "../service/pdf-save.service";
import {Register} from "../model/register";
import * as moment from "moment";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

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
    this.submitted = false;
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      course: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(4)]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required, this.endDateValidator('startDate')]],
      university: ['', [Validators.required]],
      file: [null,[]],
      fileSource: ['', [Validators.required]]
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

  get file() {
    return this.registerForm?.get("file");
  }

  get fileSource() {
    return this.registerForm?.get("fileSource");
  }

  onSubmit() : void{
    this.submitted = true;
    console.log(this.registerForm?.valid, this.registerForm);
    if (this.registerForm?.valid) {
      const formData = new FormData();
      const register: Register = {
        course: this.course?.value,
        startDate: moment(this.startDate?.value).format("MMDDYYYY"),
        endDate: this.endDate?.value,
        university: this.university?.value
      };

      formData.append('file', this.fileSource?.value);

      console.log(formData);
      /*
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

       */
    }
  }

  endDateValidator(startDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      const startDateControl = control.parent?.get(startDate)?.value ? moment(control.parent.get(startDate)?.value) : null;
      const endDateControl = control.value ? moment(control.value) : null;

      return startDateControl && endDateControl && startDateControl.isAfter(endDateControl) ? {endDateLimit: true} : null;
    };
  }

  onFileChange(event: any) {

    console.log("event : ", event);

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.patchValue({
        fileSource: file
      });
    }
  }
}

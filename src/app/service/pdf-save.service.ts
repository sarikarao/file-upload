import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Register} from "../model/register";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PdfSaveService {

  constructor(private http: HttpClient) {
  }

  saveToPdf(registerForm: Register): Observable<any> {
    console.log("Sending request to backend to save file", registerForm)
    return this.http.post("http://10.0.0.237:8080/saveAsPdf", registerForm);
  }

  uploadForm(registerForm: Register): Observable<any> {
    console.log("Sending request to backend to save file")
    return this.http.post("http://10.0.0.237:8080/uploadPdf", registerForm);
  }
}

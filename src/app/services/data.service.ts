import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { identityService } from './identity.service';




// Implementing a Retry-Circuit breaker policy
// is pending to do for the SPA app
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient, private securityService: identityService) { }

  get(url: string, params?: any): Observable<any> {
        let options = { };
        this.setHeaders(options);

        return this.http.get(url, options)
            .pipe(
                // retry(3), // retry a failed request up to 3 times
              map((res: any) => {

                    return res;
                }),
                catchError(this.handleError)
            );
    }

  postWithId(url: string, data: any, params?: any): Observable<any> {
        return this.doPost(url, data, true, params);
    }

  post(url: string, data: any, params?: any): Observable<any> {
        return this.doPost(url, data, false, params);
    }

    putWithId(url: string, data: any, params?: any): Observable<any> {
      return this.doPut(url, data, true, params);
  }
    put(url: string, data: any, params?: any): Observable<any> {
        return this.doPut(url, data, false, params);
    }

  private doPost(url: string, data: any, needId: boolean, params?: any): Observable<any> {
        let options = { };
        this.setHeaders(options, needId);

        return this.http.post(url, data, options)
            .pipe(
              map((res: any) => {

                    return res;
                }),
                catchError(this.handleError)
            );
    }


  downloadFile(url: string, data: any): any {

    var HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/pdf',
        'authorization': 'Bearer ' + this.securityService.GetToken()
      }),
      'responseType': 'blob' as 'blob'
    }
    return this.http.post(url, data, HTTPOptions)
      .pipe(
        map((result: any) => {
          return result;
        }),
        catchError(this.handleErrorblob)


      );
  }


  downloadFileExcel(url: string, data: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': 'Bearer ' + this.securityService.GetToken()
      }),
      responseType: 'blob' as 'blob'
    };
    return this.http.post(url,data, httpOptions);
  }

  //fetch(url, {
  //  method: 'POST',
  //  headers: this.headers()
  //      })
  //          .then(response => response.blob())
  //.then(blob => URL.createObjectURL(blob))
  //.then(url => {
  //  var link = document.createElement("a");
  //  link.setAttribute("href", url);
  //  link.setAttribute("download", "test.docx");
  //  link.style.display = "none";
  //  document.body.appendChild(link);
  //  link.click();
  //  document.body.removeChild(link);
  //});


  //PostC(url: string, data: any): any {

  //  var HTTPOptions = {
  //    'responseType': 'text' as 'json'
  //  }
  //  return this.http.post(url, data, HTTPOptions)
  //    .pipe(
  //      map((result: any) => {
  //        return result;
  //      }),
  //      catchError(this.handleErrorblob)


  //    );
  //}

  private handleErrorblob(err: HttpErrorResponse) {
    return throwError(err);

  }

  delete(url: string, params?: any) {
    let options = {};
    this.setHeaders(options);
    return this.http.delete(url, options)
        .pipe(
          map((result: any) => {
            return result;
          }),
          catchError(this.handleError)


        );
    }

  private handleError(error: any) {
   // console.log(error);
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('Client side network error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            if (error.error != null && error.error.errors !=null  && error.error.errors.DomainValidations)
              console.error('Backend - ' +
                `status: ${error.status}, ` +
                `statusText: ${error.statusText}, ` +
                `message: ${error.error.errors.DomainValidations[0]}`);
              else
                console.error(error);
        }

    if (error.error != null && error.error.errors !=null  && error.error.errors.DomainValidations!=null)
      return throwError({ status: error.status, statusText: error.statusText, message: error.error.errors.DomainValidations[0] });
    if (error.error != null)
      return throwError({ status: error.status, statusText: error.statusText, message: error.error });
    else
    return throwError({ status: error.status, statusText: error.statusText, message: "Une erreur technique est survenue veuillez réessayer dans quelques instants" });
    }

  private doPut(url: string, data: any, needId: boolean, params?: any): Observable<any> {
        let options = { };
        this.setHeaders(options, needId);

        return this.http.put(url, data, options)
            .pipe(
              map((res: any) => {
                    return res;
                }),
                catchError(this.handleError)
            );
    }

    private setHeaders(options: any, needId?: boolean){
        if (needId && this.securityService) {
            options["headers"] = new HttpHeaders()
                .append('authorization', 'Bearer ' + this.securityService.GetToken())
                .append('x-requestid', Guid.newGuid());
        }
        else if (this.securityService) {
            options["headers"] = new HttpHeaders()
                .append('authorization', 'Bearer ' + this.securityService.GetToken());
        }
    }

  postFile(url: string, fileList: File[], ticket: string): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append(i.toString(), fileList[i], fileList[i].name);
    }
    formData.append('access_token', this.securityService.GetToken());
    formData.append('ticket', ticket);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }

  postDemandePorta(url: string, fileList: File[], demandePorta: any): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append(i.toString(), fileList[i], fileList[i].name);
    }
    formData.append('access_token', this.securityService.GetToken());
    formData.append('demandePorta', demandePorta);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postFileModelFacture(url: string, headerFile : File, logoFile: File, footerFile: File, pagePubFile : File
    , modelFacture: string): Observable<any> {
    const formData: FormData = new FormData();

    if (headerFile != null) formData.append("HEADER", headerFile, headerFile.name);
    if (logoFile != null) formData.append("LOGO", logoFile, logoFile.name);
    if (footerFile != null) formData.append("FOOTER", footerFile, footerFile.name);
    if (pagePubFile != null) formData.append("PAGEPUB", pagePubFile, pagePubFile.name);

    formData.append('access_token', this.securityService.GetToken());
    formData.append('modelFacture', modelFacture);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }


  postFileModelMail(url: string, footerFile: File, modelMail: string): Observable<any> {
    const formData: FormData = new FormData();

    if (footerFile != null) formData.append("FOOTER", footerFile, footerFile.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('modelMail', modelMail);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postFileCommunication(url: string, pjFile: File, communication:string): Observable<any> {
    const formData: FormData = new FormData();

    if (pjFile != null) formData.append("PJcommunication", pjFile, pjFile.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('communication', communication);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postFilesCommunication(url: string, pjFile: File[], footerFile: File, communication: any): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < pjFile.length; i++) {
      formData.append('PJ', pjFile[i], pjFile[i].name);
    }
    if (footerFile != null) formData.append('FOOTER', footerFile, footerFile.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('communication', communication);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postFileFooterCommunication(url: string, footerFile: File, communication: string): Observable<any> {
    const formData: FormData = new FormData();

    if (footerFile != null) formData.append("FOOTER", footerFile, footerFile.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('communication', communication);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postFileFooterModelCommunication(url: string, footerFile: File, modelCommunication: string): Observable<any> {
    const formData: FormData = new FormData();

    if (footerFile != null) formData.append("FOOTER", footerFile, footerFile.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('modelCommunication', modelCommunication);

    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postFileMailTemplate(url: string, footerFile: File, mailTemplate: string): Observable<any> {
    const formData: FormData = new FormData();

    if (footerFile != null) formData.append("FOOTER", footerFile, footerFile.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('mailTemplate', mailTemplate);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postLogoFile(url: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    if (file != null && file != undefined)
      formData.append("LOGO", file, file.name);
    formData.append('access_token', this.securityService.GetToken());

    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }
  postUserLogoFile(url: string, file: File, user: string): Observable<any> {
    const formData: FormData = new FormData();
    if (file != null && file != undefined)
      formData.append("LOGO", file, file.name);
    formData.append('access_token', this.securityService.GetToken());
    formData.append('user', user);


    let options = {};
    this.setHeaders(options);
    options["observe"] = 'events';
    options["reportProgress"] = true;
    return this.http
      .post(url, formData, options);
  }

  downloadPDF(url: string) {
    var HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/pdf',
        'authorization': 'Bearer ' + this.securityService.GetToken()
      }),
      'responseType': 'blob' as 'blob'
    }

    return this.http.post(url, {} , HTTPOptions).pipe(
      map((res: any) => {
        return new Blob([res], { type: 'application/pdf' });
      })
    );
  }

}
export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { NavigationService } from './navigation-service.service';

@Injectable({ providedIn: 'root' })
export class identityService {

  public Authenticated: boolean = false;
  public currentUser: any;
  private currentUserSubject = new Subject<any>();
  public authenticationChallenge$: Observable<any> = this.currentUserSubject.asObservable();

  IsShowLogoPhenix() {

    return window.location.host.indexOf("phenix") >= 0;
  }
  constructor(private http: HttpClient, private storageService: StorageService, private navigationService: NavigationService)
  {
    let token = storageService.retrieve('user_token');
    let tokenworking = storageService.retrieve('working_token');
    if (token && tokenworking ) this.currentUser = this.getDataFromToken(token);
    if (this.currentUser && this.Authenticated == false ) { this.Authenticated = true; this.currentUserSubject.next(this.currentUser);}

  }
  get IsIgnorePrixPlanche() {
    return true; // this.currentUser.function == "Admin" || this.currentUser.function == "Manager" ;
  }


  login(username: string, password: string) {

        return this.http.post<any>(`${environment.TeamsApiUrl}/Auth/authenticate`, { username, password })
            .pipe(map(token => {
                const access_token = token.access_token;
              this.currentUser = this.getDataFromToken(access_token);
              if (this.currentUser.function == "ExtranetClient") {
                this.currentUser = null;
                return "";//Observable.throw("");
              }
              this.storageService.store('user_token', token.access_token);
              this.storageService.store('working_token', token.working_token);
              this.storageService.store('partenaireLogoPath', this.currentUser.partenaireLogoPath);
              this.Authenticated = true;
              this.currentUserSubject.next(this.currentUser);

              return this.currentUser;

            }));
  }

  loginConfirmationToken(access_token: string, working_token:string) {

    if (access_token == undefined) { this.logout; }
    else {
      this.currentUser = this.getDataFromToken(access_token);
      this.storageService.store('user_token', access_token);
      this.storageService.store('working_token', working_token);
      this.storageService.store('partenaireLogoPath', this.currentUser.partenaireLogoPath);
      this.Authenticated = true;
      this.currentUserSubject.next(this.currentUser);
    }
  }

    logout() {
      this.storageService.remove('user_token');
      this.storageService.remove('working_token');
      this.storageService.remove('partenaireLogoPath');
      this.navigationService.setTabIndex(0);
      this.Authenticated = false;
      this.currentUser = null;
      this.currentUserSubject.next(null);
    }

    private urlBase64Decode(str: string) {
      let output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
          case 0:
              break;
          case 2:
              output += '==';
              break;
          case 3:
              output += '=';
              break;
          default:
              throw 'Illegal base64url string!';
      }

      return decodeURIComponent(escape(window.atob(output)));
  }
  public GetToken(): any {
    return this.storageService.retrieve('user_token');
  }

  public GetWorkingToken(): any {
    return this.storageService.retrieve('working_token');
  }
  private getDataFromToken(token: any) {
    let data = {};
    if (typeof token !== 'undefined') {
        const encoded = token.split('.')[1];
        data = JSON.parse(this.urlBase64Decode(encoded));
    }
    return data;
  }

  public CheckAccessRight(funct: string): boolean {

    if (this.currentUser.function == "NetcomRoot") return true;
    if (this.currentUser.function == "Admin" || this.currentUser.function == "UserAdmin") {
      //if ((Boolean)(this.currentUser.isLimitAcces)) return this.currentUser[funct] == funct;
      if ((Boolean)(this.currentUser.isLimitAcces)) return this.currentUser[funct] == "1";
      else return true;
    }
    else
      //return this.currentUser[funct] == funct;
      return this.currentUser[funct] == "1";
  }

}

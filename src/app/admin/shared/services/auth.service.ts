import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError, Subject} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {tap, catchError} from 'rxjs/operators';
import { User, FbAuthResponse } from 'src/app/shared/intrerfaces';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$:Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-otken-expires'));
    if(new Date()<expDate){
      this.logout;
      return null;
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
  handleError(error: HttpErrorResponse){
    const {message} = error.error.error;
    if(message){
      switch(message){
        case 'EMAIL_NOT_FOUND':
          this.error$.next('Не найден мыло')
          break
        case 'INVALID_EMAIL':
          this.error$.next('Не верное мыдло')
          break
        case 'INVALID_PASSWORD':
          this.error$.next('Не верный пароль')
          break
      }
      return throwError(error)
    }

  }
  private setToken(response: FbAuthResponse | null) {
    if(response){
      const expDate = new Date(new Date().getTime() + +response.expiresIn*1000)
      localStorage.setItem('fb-token',response.idToken)
      localStorage.setItem('fb-token-expires', expDate.toString())
    } else {
      localStorage.clear()
    }

  }
}

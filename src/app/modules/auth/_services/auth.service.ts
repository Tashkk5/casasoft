import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import UserPool from "./Cognito/Cognito";
import { CognitoUserPool,CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<UserModel> {
    // this.isLoadingSubject.next(true);
    const user = new CognitoUser({
      Username: email,
      Pool: new CognitoUserPool({
        UserPoolId: "us-east-1_lrCzjoUto",
        ClientId: "3h8auo09d6vlbihsjdi6sigm3p"
      })
    });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        // console.log('onSuccess : ', data);
        var userModel = new AuthModel();
        userModel.accessToken = data.getAccessToken().getJwtToken();
        userModel.refreshToken = data.getRefreshToken().getToken();
        userModel.expiresIn = new Date(data.getAccessToken().getExpiration());
        this.setAuthFromLocalStorage(userModel);
        this.isLoadingSubject.next(false);
        let user = new UserModel();
        user.email = email;
        user.accessToken = userModel.accessToken;
        user.firstname = 'Tashfeen';
        user.lastname = 'Amin';
        user.fullname = 'Tashfeen Amin';
        return user;
      },
      onFailure: (err) => {
        // console.log('onFailure : ', err.message);
        alert(err.message || JSON.stringify(err));
        // return err.message
      },
      newPasswordRequired(userAttributes, requiredAttributes) {
        delete userAttributes.email_verified;
        let newPassword = 'TashfeenAmin@123';
        user.completeNewPasswordChallenge(newPassword, userAttributes, {
          onSuccess: (data) => {
            console.log('onSuccess : ', data);
          },
          onFailure: (err) => {
            alert(err.message || JSON.stringify(err));
          }
        });
      }
    });
    return this.getUserByToken();
    // return this.authHttpService.login(email, password).pipe(
    //   map((auth: AuthModel) => {
    //     const result = this.setAuthFromLocalStorage(auth);
    //     return result;
    //   }),
    //   switchMap(() => this.getUserByToken()),
    //   catchError((err) => {
    //     console.error('err', err);
    //     return of(undefined);
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.accessToken).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

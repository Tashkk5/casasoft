import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoUserPool,CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'; 
import { AuthModel } from '../_models/auth.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   email: '',
  //   password: '',
  // };
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  defaultAuth: any = {
    email: 'smusmanzia@gmail.com',
    password: 'Smusmanzia@123',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
        this.route.snapshot.queryParams['returnUrl'.toString()] || '/listingpage';
    }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    var email = this.f.email.value;
    var password = this.f.password.value;
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
        console.log('onSuccess : ', data);
        var userModel = new AuthModel();
        userModel.accessToken = data.getAccessToken().getJwtToken();
        userModel.refreshToken = data.getRefreshToken().getToken();
        userModel.expiresIn = new Date(data.getAccessToken().getExpiration());
        this.setAuthFromLocalStorage(userModel);
        // this.isLoadingSubject.next(false);
        let user = new UserModel();
        user.email = email;
        user.accessToken = userModel.accessToken;
        user.firstname = 'Tashfeen';
        user.lastname = 'Amin';
        user.fullname = 'Tashfeen Amin';
        this.router.navigate([this.  returnUrl])
      },
      onFailure: (err) => {
        this.hasError = true;
        alert(err.message || JSON.stringify(err));
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
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }
}

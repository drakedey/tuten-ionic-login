import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authentication/auth-service.service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  logginForm: FormGroup
  logginSubscriptions: Subscription;
  isLoggin: boolean;
  errorObj = { status: false, error: ''};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public navController: NavController
    ) {
      this.logginForm = this.initializeForm();
      this.logginSubscriptions = new Subscription();
      this.onLoginSubscription();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillUnload() {
    this.logginSubscriptions.unsubscribe();
  }

  onLoginSubscription(): void {
    const logginSub = this.authService.onLoggin().subscribe((loginObj: any) => {
      const { status } = loginObj;
      if (!status) {
        console.log('error');
        const { error } = loginObj;
        this.errorObj = { status: true, error };
      } else {
        console.log('navigating');
        this.navController.push(HomePage)
      }
      this.isLoggin = false;
      this.changeDetectorRef.detectChanges();
    });
    this.logginSubscriptions.add(logginSub);
  }

  initializeForm() {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  doLoggin(event) {
    const email = this.logginForm.get('email').value;
    const password = this.logginForm.get('password').value;
    this.authService.logginUser(email, password);
  }

}

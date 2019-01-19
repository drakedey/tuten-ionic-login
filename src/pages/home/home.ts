import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { Booking } from '../../models/bookings.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/authentication/auth-service.service';
import { DataproviderService } from '../../services/http/dataprovider.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  userLogged: User;
  unmodifiedBookingData: any;
  bookingDataFiletered: Booking[];
  bookingDataSubscription = new Subscription();
  filterForm: FormGroup;
  defaultEmailValue: string;
  isSearching = false;
  errorObj = { status: false, message: '' };

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    private formBuilder:  FormBuilder,
    private dataProviderService: DataproviderService,
    private changeDetectorRef: ChangeDetectorRef
    ) {
      this.getCurrentUser();
      this.setAndFillForm();
      this.fetchBookingData();
  }

  ionViewWillUnload() {
    this.bookingDataSubscription.unsubscribe();
  }

  setAndFillForm(): void {
    this.defaultEmailValue = 'contacto@tuten.cl';
    this.filterForm = this.formBuilder.group({
      emailContacto: ['', Validators.required],
      bookingId: [''],
      minPrice: [''],
      maxPrice: ['']
    });
    this.filterForm.get('emailContacto').setValue(this.defaultEmailValue);
  }

  getCurrentUser(): void {
    this.userLogged = this.authService.getCurrentUserValue();
    if(!this.userLogged)  this.navCtrl.push(LoginPage);
  }

  fetchBookingData(): void {
    this.isSearching = true;
    const emailContacto = this.filterForm.get('emailContacto').value;
    const subs = this.dataProviderService.getBookingData(emailContacto)
    .subscribe( data => {
      this.isSearching = true;
      this.unmodifiedBookingData = data;
      this.filterData(data);
      this.isSearching = false;
      this.changeDetectorRef.detectChanges();
    });
    this.bookingDataSubscription.add(subs);
  }

  filterData(unmodifiedBookings: any): void {
    console.log('filtering');
    this.errorObj.status = false;
    const checkEmpty = (value) => value !== '' && value !== null && value !== undefined;
    this.bookingDataFiletered = unmodifiedBookings.map(bookingEl => {
      return new Booking(bookingEl);
    });
    //Filtering by bookingId
    const bookingIdFilter = this.filterForm.get('bookingId').value;
    if (checkEmpty(bookingIdFilter)) {
      this.bookingDataFiletered = this.bookingDataFiletered.filter(bookingEl => {
        const { bookingId } = bookingEl;
        console.log(bookingId.toString().indexOf(bookingIdFilter))
        return bookingId.toString().indexOf(bookingIdFilter.toString()) >= 0
      });
    }

    //Filtering by price range
    const minPriceFilter = this.filterForm.get('minPrice').value;
    const maxPriceFilter = this.filterForm.get('maxPrice').value;
    const emptyCondition = checkEmpty(minPriceFilter) && checkEmpty(maxPriceFilter);
    const minAndMaxCondition = minPriceFilter < maxPriceFilter;
    console.log(minPriceFilter, maxPriceFilter, emptyCondition, minAndMaxCondition);
    if (emptyCondition && minAndMaxCondition) {
      this.bookingDataFiletered = this.bookingDataFiletered.filter(bookingEl => {
        const { bookingPrice } = bookingEl;
        return bookingPrice > minPriceFilter && bookingPrice < maxPriceFilter;
      });
    } else if ((this.filterForm.get('minPrice').touched || this.filterForm.get('maxPrice').touched) && !minAndMaxCondition) {
      console.log('gere');
      this.errorObj = {
        status: true,
        message: 'Max Price no puede ser mayor que min price'
      }
    }
  }

  onFiltered(): void {
    this.filterData(this.unmodifiedBookingData);
    console.log(this.bookingDataFiletered);
  }

  onFormSubmit(event: any): void {
    this.fetchBookingData();
  }



}

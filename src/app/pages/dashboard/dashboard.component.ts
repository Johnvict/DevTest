import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDatepickerInputEvent, MatInput } from '@angular/material';

import { LoanData, UserLoan, UserBio, NewLoan } from '../../interfaces/interface';

import { DataProcessorService } from '../../providers/data-processor.service';
import { MasterProvider } from '../../providers/masterprovider.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;
// const moment =  _moment;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [ 'sn', 'name', 'description', 'interestRate', 'amount', 'tenure', 'apply'];
  displayedColumns2: string[] = [ 'sn', 'name', 'description', 'interestRate', 'amount', 'tenure', 'startTime', 'endTime'];

  userLoans: any;
  availableLoans: any;
  userData: UserBio;
  selectedLoan: LoanData;
  minStartDate = new Date();
  minEndDate: any;
  newLoan: NewLoan = { userId: null, loanId: null, start: null, end: null };
  showApplyForm = false;
  subLoans: Subscription;
  subUserLoans: Subscription;

  dataForAvailableLoansTable: BehaviorSubject<LoanData[]> = new BehaviorSubject([]);
  dataForUserLoanTable: BehaviorSubject<LoanData[]>  = new BehaviorSubject([]);

  @ViewChild('earliest', {
    read: MatInput,
    static: true
  }) earliest: MatInput;

  @ViewChild('latest', {
    read: MatInput,
    static: true
  }) latest: MatInput;

  constructor(private dataService: DataProcessorService, private masterP: MasterProvider) { }

  ngOnInit() {
    this.subLoans = this.fetchAvailableLoans().subscribe( data => {
      this.availableLoans = new MatTableDataSource<any>(data);
    });
    this.subUserLoans = this.fetchUserLoans().subscribe( data => {
      this.userLoans = new MatTableDataSource<any>(data);
    });
  }

  /**
   * Since our available loans is not going to be changing any often, do we always need to contact our backend?
   * If we do, we would cause unnecessary workload, congestion, day we have millions of users,
   * so we'll save it temporarily on user's localStorage
   */
  fetchAvailableLoans(): Observable<LoanData[]> {
    const availableLoans = JSON.parse(localStorage.getItem('availableLoans'));
    const loanData: LoanData[] = availableLoans.map((data: LoanData, index) => {
      return {
        sn: ++index,
        id: data.id,
        name: data.name,
        description: data.description,
        interestRate: data.interestRate,
        amount: data.amount,
        tenure: data.tenure,
        tenureMonths: data.tenureMonths
      };
    });

    this.dataForAvailableLoansTable.next(loanData);
    return this.dataForAvailableLoansTable.asObservable();
  }

  fetchUserLoans(): Observable<LoanData[]> {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    const loanData: LoanData[] = this.userData.loans.map((data: UserLoan, index) => {
      return {
        sn: ++index,
        name: data.loanData.name,
        description: data.loanData.description,
        interestRate: data.loanData.interestRate,
        amount: data.loanData.amount,
        tenure: data.loanData.tenure,
        startTime: data.start,
        endTime: data.end
      };
    });

    this.dataForUserLoanTable.next(loanData);
    return this.dataForUserLoanTable.asObservable();
  }

  // OK, the user chose a particular loan he wants to apply for, WHAT IS THAT LOAN?
  applyForLoan(loanChosen) {
    this.selectedLoan = loanChosen;
  }

// When start date is chosen, we need to compute end date due to the loan duration of loan chosen
  startDateChosen(type: string, date: MatDatepickerInputEvent<Date>) {
    const dateObj = new Date(date.value);
    this.newLoan.start = date.value;
    const durationMonths = this.selectedLoan.tenureMonths;
    this.newLoan.end = new Date(dateObj.getFullYear(), dateObj.getMonth() + durationMonths, dateObj.getDate());
    this.newLoan.start = new Date(date.value);
  }

  // We should format data to please the requirement of our backend before submission
  onSubmitApplication() {
    const start = new Date(this.newLoan.start).getTime();
    const end = new Date(this.newLoan.end).getTime();
    const applyData: NewLoan = {
      userId: this.userData.id,
      loanId: this.selectedLoan.id,
      start,
      end
    };
    this.showApplyForm = !this.showApplyForm;
    this.dataService.applyForLoan(applyData).subscribe(response => {
        this.masterP.openSnackBar(response.message);
        localStorage.setItem('userData', JSON.stringify(response.userData));
        this.fetchUserLoans();
    }, error => this.masterP.openSnackBar(error.error.message));
  }

  // We SUBSCRIBED to some data to monitor immediate reflection of their value changing
  // What if we leave this page, there will be memory leak, so WE MUST UNSUBCRIBE
  ngOnDestroy() {
    this.subLoans.unsubscribe();
    this.subUserLoans.unsubscribe();
  }
}

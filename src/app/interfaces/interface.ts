export interface UserBio {
    id?: number;
    name: string;
    address: string;
    gender: string;
    email: string;
    password: string;
    loans?: UserLoan[];
}


export interface UserStatus {
    loggedIn: boolean;
    username: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoanData {
  sn?: number;
  id?: number;
  name: string;
  description: string;
  interestRate: string;
  amount: string;
  tenure: string;
  tenureMonths?: number;
  startTime?: any;
  endTime?: any;
}

export interface NewLoan {
  userId: number;
  loanId: number;
  start: any;
  end: any;
}

export interface UserLoan {
  start: any;
  end: any;
  loanData: LoanData;
}


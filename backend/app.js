const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  next();
});

var users = [];
// var qualifyData = { userIndex: null, qualified: true };
const loans = [
  {
    id: 1,
    name: "Ren Money",
    description: "Salary earners discounted loan",
    interestRate: "3%",
    amount: "50,000",
    tenure: "1.5 yrs",
    tenureMonths: 18
  },
  {
    id: 2,
    name: "Kia Kia",
    description: "Easy small loan",
    interestRate: "5%",
    amount: "5,000",
    tenure: "3 months",
    tenureMonths: 3,
  }
];
usersTokens = [];

app.use(bodyParser.json());

app.post("/api/user-register", (req, res, next) => {
  const user = req.body;

  user.id = users.length + 1;
  user.loans = [];

  //We need to CHECK  if THE INTENDING user is already registered
  var found = false;
  users.forEach(USER => (user.email == USER.email ? (found = true) : null));

  if (found) {
    // User is registered already: No need to register him
    res.status(409).json({
      message: "User already exists",
      registration: true
    })
  } else {
    // No he is not registered yet: Register him
    users.push(user);
    res.status(201).json({
      success: true,
      message: "Account created successsfully",
      userData: removePasswordFromRes(users[users.length - 1])
    });
  }
});

app.post("/api/user-login", (req, res, next) => {
  const user = req.body;
  var responded = false;
  users.forEach(USER => {
    if (user.email == USER.email) {
      if (user.password == USER.password) {
        responded = true;
        res.status(200).json({
          success: true,
          userData: removePasswordFromRes(USER),
          availableLoans: loans,
          token: generateUserToken(USER)
        });
      }
    }
  });

  if (!responded) {
    res.status(401).json({
      success: false,
      message: "invalid credentials"
    });
  }
});

app.post("/api/auth-check", (req, res, next) => {
  const isAuthenticated = checkAuthStatus(req);
  if (isAuthenticated.authenticated) {
    const authUser = users.filter(user => (user.id == isAuthenticated.userId));
    res.status(200).json({
      isAuthenticated: true,
      userData: removePasswordFromRes(authUser[0])
    });
  } else {
    res.status(401).json({
      isAuthenticated: false
    });
  }
});

// APPLY FOR LOAN MIDDLEWARE
app.post("/api/loan-apply", (req, res, next) => {
  const isAuthenticated = checkAuthStatus(req);
  console.log(108, isAuthenticated);
  if (isAuthenticated.authenticated == true) {
    const newLoan = req.body;
    // Does User Exist?
    var userExist = false;
    users.forEach(user => user.id == newLoan.userId ? userExist = true : null);

    if (users == [] || !userExist) {
      res.status(404).json({ message: "User does not exist" });
    }

    // Check if user is qualifed for loan
    const qualifyData = checkQualify(newLoan);
    loanData = loans.filter(loan => (loan.id == newLoan.loanId));

    // USER IS QUALIFY FOR LOAN: Process his application
    if (qualifyData.qualified == true) {
      users[qualifyData.userIndex].loans.push({
        start: newLoan.start,
        end: newLoan.end,
        loanData: loanData[0]
      });

      res.status(201).json({
        message: "Appliation successful",
        userData: removePasswordFromRes(users[qualifyData.userIndex])
      });

    } else {
      //USER IS NOT QUALIFIED FOR LOAN: Reject his application
      res.status(409).json({
        message: "You cannot apply for loan at this time range",
        loanApply: true
      });
    }
  } else {
    res.status(403).json({
      message: "Sorry, only authenticated users can request for loans",
      isAuthenticated: false
    });

  }
});

app.get("/api/loans", (req, res, next) => {
  res.status(200).json({
    message: "Available loans",
    loans: loans
  });
});

app.post("/api/logout", (req, res, next) => {
  const authStatuss = checkAuthStatus(req);
  if (authStatuss.authenticated == true) {
    usersTokens.map(token => token.userId != authStatuss.userId);
    res.status(200).json({logout: true});
  } else {
    res.status(401).json({logout: true});
  }
});

function removePasswordFromRes(USER) {
  // OK! user is authorized
  // We need to immitate a realtime data security here because anyone may hijack the user data via the server response
  // We should therefor delete the user password before sending the response to the frontend
  // So, we need to copy the user data before deleteting password to avoid deleting the main user object's password - Else in future password will no longer exist in the user data at the server
  const tempUser = Object.assign({}, USER);
  delete tempUser.password

  return tempUser;
}

function checkQualify(newLoanData) {
  var userIndex = null;
  var qualified = true;
  users.forEach((user, INDEX) => {
    if (user.id == newLoanData.userId) {
      userIndex = INDEX;  //  Since there are many users in the array, we need to known which of them... this avoids unnecessary search later on
      user.loans.forEach(loan => {
        if (
          (newLoanData.start == loan.start && newLoanData.end == loan.end) ||   // if application time falls at same time as any previous loan time range
          (newLoanData.start <= loan.start && (newLoanData.end >= loan.start && (newLoanData.end <= loan.end || newLoanData.end >= loan.end))) ||   // If the application start time is ealiear than a previous loan start time and falls within the range
          (newLoanData.start <= loan.end && (newLoanData.start >= loan.start && (newLoanData.end <= loan.end || newLoanData.end >= loan.end)))        // If the application time falls between any previous loan start time and though extends beyond its end time
        ) {
          // If the above conditions come true, then the user is not qualified
          qualified = false;
        }
      });
    }
  });
  return { userIndex, qualified };
}

function generateUserToken(USER) {
  var token = '';
  const randText = 'ABCDefghIJKLmnopQRSTuvwxYZabcdEFGHijklMNOPqrstUVWXyz';
  for (var i = 0; i < 100; i++) {
    token += randText.charAt(Math.floor(Math.random() * randText.length));
  }

  usersTokens.push({
    userId: USER.id,
    token: `devtest ${token}`
  });

  return token;
}

function checkAuthStatus(req) {
  const receivedToken = req.headers.authorization;
  var authData = { authenticated: false, userId: null };
  const check = usersTokens.map(tokenData => {
    console.log(221, authData);
    if (tokenData.token == receivedToken) {
      // authData = { authenticated: true, userId: tokenData.userId };
      authData = Object.assign({}, { authenticated: true, userId: tokenData.userId });
    }
  });

  console.log(227, authData);
  return Object.assign({}, authData);
}
module.exports = app;

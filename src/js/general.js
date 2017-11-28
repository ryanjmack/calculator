/***********************************************************************
 ** Name: Ryan Mack
 ** Date: 11/27/2017
 ** Description: File that contains the code for a simple web based
 ** calc
 ***********************************************************************/

// holds data and functions for the calculator object
const calc = {
  // data members
  total: null, // running total
  firstNum: true,
  nextNumNegative: false,
  currentInput: '', // data that is being inputted from the user
  stringOutput: '', // the output the user sees on the screen
  currentOperation: null, // will hold a closure

  add: function() {
    return function(num) {
      return this.total + num;
    }
  },

  subtract: function() {
    return function(num) {
      return this.total - num;
    }
  },

  multiply: function() {
    return function(num) {
      return this.total * num;
    }
  },

  divide: function() {
    return function(num) {
      if (num === 0) {
        console.error("Attempted Division by 0");
        return 0;
      }
      return this.total / num;
    }
  },

  /* percentage: function() {
    return function(num) {
      return this.total + num;
    }
  },*/
  reset: function(hardReset) {
    // hard reset is used when "AC" is pressed
    if (hardReset) {
      calc.total = null;
      calc.currentInput = '';
      calc.stringOutput = '';
    }

    // soft reset, used when user presses 'equal'
    calc.nextNumNegative = false;
    calc.firstNum = true;
    calc.currentOperation = null;
  },

  allClear: function() {
    // hard reset
    calc.reset(true);
  },

  equals: function() {
    // nothing to compute
    if (!this.currentOperation)
      return;

    // get semi-accurate precision. We want to avoid floating point issues but
    // display the same amount of decimals the user inputted
    const precision = Math.max(
      (calc.currentInput.match(/(?!\.)\d+$/)[0] || '').length,
      (String(calc.total).match(/(?!\.)\d+$/)[0] || '').length);

    // now we can run the operation on the numbers and save the data
    this.total = parseFloat(this.currentOperation(parseFloat(this.currentInput)).toFixed(precision));
    this.currentInput = `${this.total}`;
    this.stringOutput = `${this.total}`;

    // calculcator soft reset
    this.reset(false);
  },

  decimal: function() {
    if (this.currentInput.includes('.'))
      return;

    // format the decimal
    const decimal = (this.currentInput && this.currentInput !== "-") ? '.' : '0.';
    this.currentInput += decimal;
    this.stringOutput += decimal;
  },

  negative: function() {
    // the number being inputted can have its negative sign toggled
    this.nextNumNegative = !this.nextNumNegative;

    // equals button was hit.
    // There is a running total, and it's a standalone number with no operation
    if (this.total !== null && this.firstNum) {
      this.total *= -1;
      this.currentInput = `${this.total}`;
      this.stringOutput = `${this.total}`;
    }
    // negative being toggle off
    // remove the negative sign from the input and output
    else if (this.nextNumNegative === false) {
      this.currentInput = this.currentInput.replace(/^\-/, '');
      this.stringOutput = this.stringOutput.replace(/\-(\d+\.?\d*)?$/, '$1');
    }
    // negative being toggled on with multiple numbers in the
    else {
      const regex = new RegExp(`(${this.currentInput})$`);
      this.stringOutput = calc.stringOutput.replace(regex, `-$1`);
      this.currentInput = `-${this.currentInput}`;
    }
  },

  inputNumber: function(int) {
    if (this.firstNum && this.nextNumNegative) {
      this.currentInput += `-${int}`;
      this.stringOutput += `-${int}`;
    } else {
      this.currentInput += int;
      this.stringOutput += int;
    }
  },

  handleOperator: function(value, operator) {
    if (!this.currentInput)
      return;

    // first number using is inputting
    if (this.firstNum) {
      this.firstNum = false;
      this.total = this.total || parseFloat(this.currentInput);
    } else { // not the first number user is inputting
      this.total = this.currentOperation(parseFloat(this.currentInput));
    }

    this.currentOperation = this[value]();
    this.currentInput = '';
    this.stringOutput += ` ${operator} `
  }

} // end calc object


/***********************************************************************
 ** Runs when the user clicks any buttons
 ***********************************************************************/
function handleClick(e) {
  // get the dataset information
  e.preventDefault();
  const buttonValue = e.target.dataset.value;
  const buttonOperator = e.target.dataset.operator;

  if (!buttonValue) { // all buttons have a buttonValue (add, 1, 2 etc.)
    return;
  }
  else if (!buttonOperator) { // If it's not an operator, it's a number
    calc.inputNumber(buttonValue);
  }
  else { // we are dealing with an operator of some sort
    // this is a special case; see the else statment below
    if (buttonValue === 'negative') {
      calc.negative();
    }
    else {
      // need to make sure this flag is off for ALL operators
      // all operators compute something whereas negative modifies an inputted number
      calc.nextNumNegative = false;

      switch (buttonValue) {
        case 'AC':
          calc.allClear();
          break;
        case 'equals':
          calc.equals();
          break;
        case 'decimal':
          calc.decimal();
          break;
        default: // simple operators
          calc.handleOperator(buttonValue, buttonOperator);
      }
    }
  }
  console.log(calc);
  updateView();
}

function updateView() {
  document.querySelector('.output-field p').innerText = calc.stringOutput;
}

/***********************************************************************
 ** Event listener for the calc object. Event delegation is used
 ** so we don't need 19 event listeners for all the buttons
 ***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

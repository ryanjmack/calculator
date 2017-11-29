/***********************************************************************
 ** Name: Ryan Mack
 ** Date: 11/27/2017
 ** Description: File that contains the code for a simple web based
 ** calc
 ***********************************************************************/

// holds data and functions for the calculator object. This is the model
const calc = {
  // data members
  total: null, // running total
  currentInput: '', // data that is being inputted from the user
  currentOperation: null, // will hold a closure
  firstNum: true, // first number in input?
  nextNumNegative: false,
  output: '', // the output the user sees on the screen

  /*********************************************************************
  ** Mathematical functions. They return a closure, which is saved to
  ** the data member currentOperation. When any operator button is
  ** pressed we can run the currentOperation then save the new closure,
  ** retaining access to the value of total at that point in time
  *********************************************************************/
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

  // Takes the percentage of the the running total
  // Example: 600 + 20% returns 720
  percentage: function() {
    // we don't have a total; percentage of current input
    if (this.total === null) {
      if (!this.currentInput) {
        return;
      }
      else if (!this.currentOperation) {
        this.output += '%';
        this.total = parseFloat(this.currentInput) / 100;
      }
      else {
        return;
      }
    }
    // we have to compute the percentage of the total
    else {
      this.output += '%';
      this.currentInput = Number(this.currentInput) / 100 * this.total;
      this.total = this.currentOperation(Number(this.currentInput));
      this.currentInput = `${this.total}`;
      this.currentOperation = null;
    }
  },

  // reset the calculator. Takes a boolean param to determine
  // whether we want a hard (true) or soft (false) reset.
  reset: function(hardReset) {
    // hard reset is used when "AC" is pressed
    if (hardReset) {
      calc.currentInput = '';
      calc.output = '';
    }

    // soft reset, used when user presses 'equal'. Also run during hard reset
    this.total = null;
    calc.nextNumNegative = false;
    calc.firstNum = true;
    calc.currentOperation = null;
  },

  // clears or resets the entire calculator
  allClear: function() {
    // hard reset
    calc.reset(true);
  },

  // computes the input, if there is anything to compute
  equals: function() {

    if (/%$/.test(this.output)) {
      this.currentInput = `${this.total}`;
      this.output = `${this.total}`;
    }
    else if (!this.currentOperation) { // nothing to compute
      return;
    }
    else {
      // get semi-accurate precision. We want to avoid floating point issues but
      // display the same amount of decimals the user inputted
      const precision = Math.max(
        // regex is not very readable. Basically gets a 'good-enough' level of precision
        (calc.currentInput.match(/(?!\.)\d+$/)[0] || '').length,
        (String(calc.total).match(/(?!\.)\d+$/)[0] || '').length);

      // now we can run the operation on the numbers and save the data
      this.total = parseFloat(this.currentOperation(parseFloat(this.currentInput)).toFixed(precision));
      this.currentInput = `${this.total}`;
      this.output = `${this.total}`;
    }

    // calculator soft reset
    this.reset(false);
  },

  // adds a decimal; doesn't do anything if there already if the user already entered a decimal
  decimal: function() {
    if (this.currentInput.includes('.'))
      return;

    // format the decimal
    const decimal = (this.currentInput && this.currentInput !== "-") ? '.' : '0.';
    this.currentInput += decimal;
    this.output += decimal;
  },

  // toggles the parity of the current input.
  negative: function() {
    // the number being inputted can have its negative sign toggled
    this.nextNumNegative = !this.nextNumNegative;

    // equals button was hit.
    // There is a running total, and it's a standalone number with no operation
    if (this.total !== null && this.firstNum) {
      this.total *= -1;
      this.currentInput = `${this.total}`;
      this.output = `${this.total}`;
    }
    // negative being toggle off
    // remove the negative sign from the input and output
    else if (this.nextNumNegative === false) {
      this.currentInput = this.currentInput.replace(/^\-/, '');
      this.output = this.output.replace(/\-(\d+\.?\d*)?$/, '$1');
    }
    // negative being toggled on with multiple numbers in the
    else {
      const regex = new RegExp(`(${this.currentInput})$`);
      this.output = calc.output.replace(regex, `-$1`);
      this.currentInput = `-${this.currentInput}`;
    }
  },

  // concatenates the int to the currentInput and output
  inputNumber: function(int) {
      this.currentInput += int;
      this.output += int;
  },

  // takes in the value and operator associated with the click event
  // value is the name (add)
  // operator is the shorthand (+)
  handleOperator: function(value, operator) {
    if (!this.currentInput) // can't operate on nothing
      return;

    // first number using is inputting
    if (this.firstNum) {
      this.firstNum = false;
      this.total = (this.total !== null) ? this.total : parseFloat(this.currentInput);
    }
    // edge case for the percentage button. The % button works backwards not forwards
    else if (!this.currentOperation) {
      this.currentOperation = this[value]();
    }
    else { // perform computation
      this.total = this.currentOperation(parseFloat(this.currentInput));
    }

    // this[value] -- value is the html data-value attribute. It has the
    // same value as the method on the calc object.
    this.currentOperation = this[value](); // returns a closure, ready for next operation
    this.currentInput = '';
    this.output += ` ${operator} `
  }

} // end calc object


/***********************************************************************
 ** Runs when the user clicks any buttons. This is the controller
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
        case 'percentage':
          calc.percentage();
          break;
        default: // all other operators
          calc.handleOperator(buttonValue, buttonOperator);
      }
    }
  }
  console.log(calc);
  updateView();
}


/***********************************************************************
** this is the view. Gets called every time the controller is triggered
** (valid button is clicked)
***********************************************************************/
function updateView() {
  document.querySelector('.output-field p').innerText = calc.output;
}


/***********************************************************************
 ** Event listener for the calc object. Event delegation is used
 ***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

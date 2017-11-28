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
      calc.total=  null;
      calc.currentInput= '';
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
    if (!this.currentOperation)
      return;
    // find out how much precision we want to dislay - avoids floating point problems
    const precision =  Math.max(
               (calc.currentInput.match(/(?!\.)\d+$/)[0]||'').length,
               (String(calc.total).match(/(?!\.)\d+$/)[0]||'').length);
    console.log(precision);

    this.total = parseFloat(this.currentOperation(parseFloat(this.currentInput)).toFixed(precision));
    this.currentInput = `${this.total}`;
    this.stringOutput = `${this.total}`;

    // soft reset
    this.reset(false);
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
    console.log("not a button!!");
    return;
  }
  else if (!buttonOperator) { // If it's not an operator, it's a number
    if (calc.firstNum && calc.nextNumNegative) {
      calc.currentInput += `-${buttonValue}`;
      calc.stringOutput += `-${buttonValue}`;
    }
    else {
      calc.currentInput += buttonValue;
      calc.stringOutput += buttonValue;
    }
  }
  else { // we are dealing with an operator of some sort
    switch (buttonValue) {
      // these are special operators
      case 'AC':
        calc.allClear();
        break;
      case 'equals':
        calc.equals();
        break;
      case 'negative':
      case 'decimal':
        handleSpecialOperators(buttonValue, buttonOperator);
        break;
      default: // simple operators
        handleOperator(buttonValue, buttonOperator);
    }
  }
  console.log(calc);
  updateView();
}

function handleOperator(value, operator) {
  if (!calc.currentInput)
    return;

  // first number using is inputting
  if (calc.firstNum) {
    calc.firstNum = false;
    calc.total = calc.total || parseFloat(calc.currentInput);
  }
  else { // not the first number user is inputting
    calc.total = calc.currentOperation(parseFloat(calc.currentInput));
  }

  calc.currentOperation = calc[value]();
  calc.currentInput = '';
  calc.stringOutput += ` ${operator} `
}

function handleSpecialOperators(value, operator) {
  if (value === "negative") {
    calc.nextNumNegative = !calc.nextNumNegative;

    if (calc.nextNumNegative === false) {
      calc.currentInput = calc.currentInput.replace(/^\-/, '');
      calc.stringOutput = calc.stringOutput.replace(/\-(\d+(.?\d)*)$/, '$1');
    }
    else if (calc.total && calc.firstNum) {
      calc.total *= -1;
      calc.stringOutput = calc.stringOutput.replace(/\-(\d+(.?\d)*)$/, '$1');
    }
    else {
      calc.currentInput = `-${calc.currentInput}`;
      calc.stringOutput = calc.stringOutput.replace(/\s?(\d*\.?\d*)?$/, ` -$1`);
    }
  }
  else if (value === "decimal") {
    if (calc.currentInput.includes('.'))
      return;

    // format the decimal
    const decimal = (calc.currentInput && calc.currentInput !== "-") ? '.' : '0.';
    calc.currentInput += decimal;
    calc.stringOutput += decimal;
  }
}

function updateView() {
  document.querySelector('.output-field p').innerText = calc.stringOutput;
}

/***********************************************************************
** Event listener for the calc object. Event delegation is used
** so we don't need 19 event listeners for all the buttons
***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

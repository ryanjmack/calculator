/***********************************************************************
 ** Name: Ryan Mack
 ** Date: 11/29/2017
 ** Description: File that contains the code for a simple web based
 ** calc
 ***********************************************************************/

// holds properties and methods for the calculator object. This is the model
const calc = {
  data: [], // contains the data inputted by the user. Example: ['1', '+', '2']
  currentInput: '',
  isFirstInput: true, // certain restrictions on isFirstInput.

  // Allows the user to input a digit
  inputDigit: function(digit) {
    // this is the first entry
    if (this.isFirstInput) {
      this.currentInput += digit;
      this.isFirstInput = false;
    }
    // if the current input is a digit
    else if (/\d/.test(this.currentInput) || this.currentInput.includes('(-)')) {
      this.currentInput += digit;
    }
    // currentInput is an operator. Push it to the array, start inputting new digit
    else {
      this.data.push(this.currentInput);
      this.currentInput = digit;
    }
  },

  // Allows the user to input an operator
  inputOperator: function(op) {
    // No operators except
    if (this.isFirstInput) {
      return;
    }
    // currentInput is an operator, swap them
    else if (/^[\-+*/]$/.test(this.currentInput)) {
      this.currentInput = op;
    }
    else {
      this.data.push(this.currentInput);
      this.currentInput = op;
    }
  },

  // clears the last entry
  CE: function() {
    // overwrite currentInput with the last piece of data user entered
    if (this.data.length > 0) {
      this.currentInput = this.data.pop();
    }
    // user cleared the first input
    else {
      this.currentInput = '';
    }
  },

  // erases all data held in the calc obj
  AC: function() {
    this.data = [];
    this.currentInput = '';
    this.isFirstInput = true;
  },

  // Allows the user to negate a number
  negative: function() {
    // currentInput is an operator
    if (/^[\-+*/]$/.test(this.currentInput)) {
      // push operator to data and concat negative sign to currentInput
      this.data.push(this.currentInput);
      this.currentInput = '(-)';
    }
    // if currentInput is negative, toggle negation off
    else if (this.currentInput.includes('(-)')) {
      this.currentInput = this.currentInput.slice(3);
    }
    // if equals button is hit and result is negative
    // the result looks looks like -9, not (-)9. Toggle off means remove one char '-'
    else if (/^\-\d/.test(this.currentInput)) {
      this.currentInput = this.currentInput.slice(1);
    }
    else { // add a negative sign
      this.currentInput = `(-)${this.currentInput}`;
    }
  },

  // Allow the user to input a decimal
  decimal: function() {
    // disallow user to input multiple decimal numbers
    if (this.currentInput.includes('.')) {
      return;
    }
    // currentInput is an operator
    else if (/^[\-+*/]$/.test(this.currentInput)) {
      this.data.push(this.currentInput);
      this.currentInput = '0.';
    }
    // we are dealing with a number input. The first one or an existing number
    else {
      this.currentInput += (this.isFirstInput) ? '0.' : '.';
    }
  },

  // allows the user to compute their input
  equals: function() {
    // nothing to compute
    if (this.data.length === 0) {
      return;
    }

    // push the last entry to data; clear the currentInput
    this.data.push(this.currentInput);
    this.currentInput = '';

    // can't compute if equation is even elements or if last element is only a negative sign
    if (this.data.length % 2 === 0 || this.data[this.data.length - 1] === '(-)') {
      this.data = ['Error'];
      return;
    }

    // clean the data
    // --> replace (-) with '-', so parseFloat can operate on the numbers
    this.data = this.data.map(entry => entry.replace('(-)', '-'));

    // evaluate expressions following proper order of operations
    this.evaluateExpressions('*', '/');
    this.evaluateExpressions('+', '-');

    // once statement is evaluated treat it like the user's first input
    // clear data and convert result to string
    this.currentInput = String(this.data.pop());
  },

  // evaluates expressions one by one, iteratively replacing expressions with values
  // takes in two parameters, operator 1 and 2. is either: ('+', '-') or ('*', "/")
  evaluateExpressions: function(op1, op2) {

    // saves where our next expression will start
    let expressionStart = this.data.findIndex(val => val === op1 || val === op2) - 1;

    while (expressionStart >= 0) {

      // expression example: ['3', '*', '2.345'];
      const expression = [...this.data.slice(expressionStart, expressionStart + 3)];
      const num1 = parseFloat(expression[0]);
      const operator = expression[1];
      const num2 = parseFloat(expression[2]);
      let result;

      if (operator === '*') {
        result = num1 * num2;
      }
      else if (operator === '/') {
        if (num2 === 0) { // division by 0
          this.data = ['Error'];
          return;
        }
        result = num1 / num2;
      }
      else if (operator === "+") {
        result = num1 + num2;
      }
      else {
        result = num1 - num2;
      }

      // replace the expression with the result in data
      this.data.splice(expressionStart, 3, result);

      // get the index where the next expression starts
      expressionStart = this.data.findIndex(val => val === op1 || val === op2) - 1;
    }
  }

}  // end calc obj


/***********************************************************************
** this is the controller. Gets called every time the user clicks on
** the main html element
***********************************************************************/
function handleClick(e) {
  const buttonValue = e.target.dataset.value;

  // user tried to calculate an invalid expression
  if (calc.data[0] === 'Error') {
    if (buttonValue === "CE" || buttonValue === "AC") {
      calc.AC(); // run all clear for CE or AC when there is an error.
    }
    updateView();
    return;
  }

  if (!buttonValue) { // not a valid button
    return;
  }
  else if (isDigit(buttonValue)) {
    calc.inputDigit(buttonValue);
  }
  // dataset-value attribute of event is an operator of some sort
  else {
    switch(buttonValue) {
      case 'AC':
        calc.AC();
        break;
      case 'CE':
        calc.CE();
        break;
      case '(-)':
        calc.negative();
        break;
      case '.':
        calc.decimal();
        break;
      case '=':
        calc.equals();
        break;
      default: // +, -, *, /
        calc.inputOperator(buttonValue);
    }
  }
  updateView();
}

/***********************************************************************
** This is the view. Gets called every time the controller is triggered
** (in other words, a valid button was clicked)
***********************************************************************/
function updateView() {
  // if there data join it and add a space and concat currentInput, or simply currentInput
  let output = ((calc.data.length > 0) ? calc.data.join(' ') + ' ' : '') + calc.currentInput;

  // if the computation results is a large decimal, format to 4 decimal spots
  // also remove trailing 0s at the end of a decimal
  if (/^\-?\d+\.\d{4,}$/.test(output)) {
    output = Number(output).toFixed(4);
    output = output.replace(/(\.\d+?)0*$/, '$1');
    calc.currentInput = output;
  }
  // replace (-) with -
  else if (output.includes('(-)')) {
    output = output.replace(/\(\-\)/g, '-');
  }
  document.querySelector('.output-field p').innerText = output;
}

// helper function - checks to see if string digit is integer
function isDigit(digit) {
  return !isNaN(digit);
}

/***********************************************************************
 ** Event listener for the calc object. Event delegation is used.
 ***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

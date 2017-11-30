/***********************************************************************
 ** Name: Ryan Mack
 ** Date: 11/29/2017
 ** Description: File that contains the code for a simple web based
 ** calc
 ***********************************************************************/

// holds data and functions for the calculator object. This is the model
const calc = {
  data: [],
  currentInput: '',
  firstInput: true,

  inputNum: function(num) {
    // this is the first entry
    if (this.firstInput) {
      this.currentInput += num;
      this.firstInput = false;
    }
    // if the current input is a number
    else if (/\d/.test(this.currentInput) || this.currentInput.includes('(-)')) {
      this.currentInput += num;
    }
    // currentInput is an operator. Push it to the array, start inputting new num
    else {
      this.data.push(this.currentInput);
      this.currentInput = num;
    }
  },

  inputOperator: function(op) {
    if (this.firstInput) {
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

  CE: function() {
    // overwrite currentInput with the last piece of data user entered
    if (this.data.length > 0) {
      this.currentInput = this.data.pop();
    }
    // user cleared the firstInput
    else {
      this.currentInput = '';
    }
  },

  AC: function() {
    this.data = [];
    this.currentInput = '';
    this.firstInput = true;
  },

  negative: function() {
    // currentInput is an operator
    if (/^[\-+*/]$/.test(this.currentInput)) {
      // push it to data and concat currentInput
      this.data.push(this.currentInput);
      this.currentInput = '(-)';
    }
    // if currentInput is negative, remove the negative sign
    else if (this.currentInput.includes('(-)')) {
      this.currentInput = this.currentInput.slice(3);
    }
    // after equals button is hit, if result is negative, it looks like -9, not (-)9
    else if (/^\-\d/.test(this.currentInput)) {
      this.currentInput = this.currentInput.slice(1);
    }
    else { // add a negative sign
      this.currentInput = `(-)${this.currentInput}`;
    }
  },

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
      this.currentInput += this.firstInput ? '0.' : '.';
    }
  },


  equals: function() {
    if (this.data.length === 0) {
      return;
    }

    // push the last entry to data
    this.data.push(this.currentInput);
    this.currentInput = '';

    // can't compute if equation is even elements or if last element is only a negative sign
    if (this.data.length % 2 === 0 || this.currentInput === '(-)') {
      this.data = ['Error'];
      return;
    }

    // clean the data --> replace (-) with '-', so parseFloat can operate on the numbers
    this.data = this.data.map(entry => entry.replace('(-)', '-'));

    // evaluate expressions following proper order of operations
    this.evaluateExpressions('*', '/');
    this.evaluateExpressions('+', '-');

    // once statement is evaluated treat it like the user is inputting the first number
    // clear data and convert result to string
    this.currentInput = String(this.data.pop());
  },

  // evaluates expressions one by one, iteratively replacing expressions with values
  evaluateExpressions: function(op1, op2) {

    // saves where our next expression will start
    let expressionStart = this.data.findIndex(val => val === op1 || val === op2) - 1;

    while (expressionStart >= 0) {

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

      // get the index of the start of the next * or / espression
      expressionStart = this.data.findIndex(val => val === op1 || val === op2) - 1;
    }
  }

}  // end calc obj


/***********************************************************************
** this is the controller. Gets called every time the user clicks on the main element
***********************************************************************/
function handleClick(e) {
  const buttonValue = e.target.dataset.value;

  // user trie to calculate an invalid expression
  if (calc.data[0] === 'Error') {
    if (buttonValue === "CE" || buttonValue === "AC") {
      calc.AC(); // run all clear for CE or AC when there is an error
    }
    updateView();
    return; // no other buttons will work
  }

  // dataset-value attribute of event is a number
  if (!buttonValue) { // not a button
    return;
  }
  else if (!isNaN(buttonValue)) {
    calc.inputNum(buttonValue);
  }
  else { // dataset-value attribute of event is an operator of some sort
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
  console.log(calc);
  updateView();
}

/***********************************************************************
** this is the view. Gets called every time the controller is triggered
** (valid button is clicked)
***********************************************************************/
function updateView() {
  // if the
  let output = ((calc.data.length > 0) ? calc.data.join(' ') + ' ' : '') + calc.currentInput;

  // if the computation results is a large decimal, format to 4 decimal spots
  // also remove trailing 0s at the end of a decimal
  if (/^\-?\d*\.\d{4,}$/.test(output)) {
    output = Number(output).toFixed(8);
    output = output.replace(/\.(\d*)0+$/, '$1');
    calc.currentInput = output;
  }
  // replace (-) with -
  else if (output.includes('(-)')) {
    output = output.replace(/\(\-\)/g, '-');
  }

  document.querySelector('.output-field p').innerText = output;
}


/***********************************************************************
 ** Event listener for the calc object. Event delegation is used
 ***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

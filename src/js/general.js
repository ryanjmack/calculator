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
    else {
      this.currentInput = `(-)${this.currentInput}`;
    }
  }
}  // end calc obj


/***********************************************************************
** this is the controller. Gets called every time the user clicks on the main element
***********************************************************************/
function handleClick(e) {
  const buttonValue = e.target.dataset.value;

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
      case '=':
      case '.':
        console.log('special operator');
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
  document.querySelector('.output-field p').innerText = `${calc.data.join(' ')} ${calc.currentInput}`;
}


/***********************************************************************
 ** Event listener for the calc object. Event delegation is used
 ***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

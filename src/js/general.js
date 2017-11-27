const calculator = {
  // data members
  total: null,
  firstNum: true,
  currentInput: '',
  stringOutput: '',
  currentOperation: null,

/***********************************************************************
** calculator methods
***********************************************************************/
  add: function(x) {
    this.total += x;
  },

  resetCurrentInput: function() {
    this.currentInput = '';
  },

  updateCurrentInput: function(val) {
    this.currentInput += val;
    this.updateStringOutput(val);
  },


  updateStringOutput: function(val) {
    this.stringOutput += val;
    updateView(this.stringOutput);
  },

  // simple operators: +, -, *, /, %
  handleOperator: function(value, operator) {
    if (this.firstNum) {
      this.firstNum = false;
      this.total = parseFloat(this.currentInput);
      this.currentInput = '';
    }
    else if (this.currentInput === '') {
      return;
    }
    else {
      this.currentOperation(parseFloat(this.currentInput));
      this.resetCurrentInput();
    }
    console.log(this.total);
    this.updateStringOutput(` ${operator} `);
    this.currentOperation = this[value];
  },

  // special operators: AC, =, (-)
  handleSpecialOperators: function(value, operator) {
    if (value === "equals") {
      this.currentOperation(parseFloat(this.currentInput));
      updateView(this.total);
    }
  }
}



/***********************************************************************
** Runs when the user clicks any buttons
***********************************************************************/
function handleClick(e) {
  e.preventDefault();
  const buttonValue = e.target.dataset.value;
  const buttonOperator = e.target.dataset.operator;

  if (!buttonValue) { // all buttons have a buttonValue
    console.error("Element does not have dataset-value attribute");
    return;
  }
  else if (!buttonOperator) { // If it's not an operator, it's a number
    calculator.updateCurrentInput(Number(buttonValue));
  }
  else { // we are dealing with an operator of some sort
    switch (buttonValue) {
      // these are special operators
      case 'AC':
      case 'negative':
      case 'equals':
        calculator.handleSpecialOperators(buttonValue, buttonOperator);
        break;
      default:
        calculator.handleOperator(buttonValue, buttonOperator);
    }
  }
}


/***********************************************************************
** Updates the view of the calculator every time a button is pressd
***********************************************************************/
function updateView(str) {
  document.querySelector('.output-field p').innerText = str;
}

/***********************************************************************
** Event listener for the calculator object
***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

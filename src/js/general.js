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

  inputNum: function(num) {
    // if the current input is a number, OR
    // this is the first entry --- concatenate a digit
    if (/\d/.test(this.currentInput)
        || (!this.currentInput && this.data.length === 0)) {
      this.currentInput += num;
    }
    else {
      this.data.push(this.currentInput);
      this.currentInput = num;
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
      case 'CE':
      case 'neg':
      case '=':
      case '.':
        console.log('special operator');
        break;
      default: // +, -, *, /
        console.log('operator');
    }
  }

  updateView();
}

/***********************************************************************
** this is the view. Gets called every time the controller is triggered
** (valid button is clicked)
***********************************************************************/
function updateView() {
  document.querySelector('.output-field p').innerText = calc.data.join(' ') + calc.currentInput;
}


/***********************************************************************
 ** Event listener for the calc object. Event delegation is used
 ***********************************************************************/
document.querySelector('main').addEventListener('click', handleClick);

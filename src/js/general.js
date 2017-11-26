
// this grabs the whole calculator; used for event delegation (click)
const calculator = document.querySelector('main');


/***********************************************************************
* Runs when the user clicks or
***********************************************************************/
function handleClick(e) {
  e.preventDefault();
  const buttonValue = e.target.dataset.value;

  switch (buttonValue) {
    case 'AC':
      console.log("AC");
      break;
    case 'negative':
      console.log('neg');
      break;
    case 'percent':
      console.log('percent');
      break;
    case 'divide':
      console.log('divide');
      break;
    case 'multiply':
      console.log('multiply');
      break;
    case 'subtract':
      console.log('sub');
      break;
    case 'add':
      console.log('add');
      break;
    case 'equals':
      console.log('equals');
      break;
    case '.':
      console.log('decimal');
      break;
  default:
      console.log('Number');
      break;
  }
}

calculator.addEventListener('click', handleClick);

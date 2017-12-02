# JavaScript Calculator

This is a simple web based calculator written in vanilla Javascript. The calculator evaluates expressions according to proper order of operations, and doesn't attempt computation until the user hits the equals button. The calculator tries to reduce human input errors. Some examples:

* if an operator was the last input, and another operator is clicked, the former operator will be replaced with the latter
* The calculator doesn't allow a user to enter more than one decimal in a number
* The negative button toggles negation on and off
* Floating point errors are taken care of: 0.1 + 0.2 === 0.3
* Division by zero results in an Error

## Getting Started

Check out the [live demo](https://ryanjmack.github.io/js-calculator/)!

## Built With

* HTML/SCSS
* ES6 JavaScript
* Gulp for automating tasks
* Babel for converting ES6 to ES5

----

## Objectives
This project is one of the intermediate front end projects for freeCodeCamp.

The three user stories that must be fulfilled are:
1. I can add, subtract, multiply and divide two numbers.
2. I can clear the input field with a clear button.
3. I can keep chaining mathematical operations together until I hit the equal button, and the calculator will tell me the correct output.


My personal objectives for this project were:

1. Use no JavaScript libraries or frameworks
2. Use event delegation instead of having 19 event listeners for each button.
3. Try to ensure my code is well commented and readable.
4. Refrain from using any libraries or frameworks. *Everything* was made by myself.

---

## Final Thoughts

One of the main things I learned while doing this project is the success and timeliness of completing a project and also the organization and readability of my code is directly correlated with the level of planning prior to production.

What I mean by this is that I re-did the JS portion of the program because the code became messy. I didn't plan for all the smaller details (they popped up as I was building the project) and this hindered the architecture and readability of my code.

The second time around I felt I was much more prepared and it made the entire development process easier, and more enjoyable. It is a must to plan properly for projects, especially as they increase in complexity.

---
## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/ryanjmack/js-calculator/blob/master/LICENSE.md) file for details

## Acknowledgments

* I cloned the interface of the default calculator found in iPhones.

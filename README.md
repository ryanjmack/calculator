# frontend-project-template

This is boilerplate code for simple front end projects.

## Getting Started
* Clone this repository
* Navigate to the the root of the cloned repo
* Reference the original boilerplate using `git remote add upstream URL`. This allows you to pull changes made to the boilerplate code in the future using `git pull upstream master`
* Initialize an empty repo on Github and change the remote's URL `git remote set-url origin git@github.com:USERNAME/REPOSITORY.git`
* Use`npm install` to get all required node modules
* Use `gulp` to run default task
* Start coding

## Basics
The folder `src` is the development build

The folder `build` is the production build (minified/concatenated files etc)

## List of gulp tasks
* `gulp` (default) - runs styles then serve
* `gulp styles` - converts scss to css in `src/stylesheets` folder; also sets up sourcemaps for scss debugging
* `gulp serve` - creates a webserver for browsersync which then watches for any html/scss changes


## TODO

* Add more gulp tasks for production build -> concat, minify, JavaScript etc.

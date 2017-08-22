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
The folder `src` is the development build.
* /fonts
* /images
* /stylesheets
    * css
        * normalize.css
        * master.css (output of scss compilation)
        * master.css.map (sourcemap for devtools debugging)
    * sass
        * should have a master.scss file - used to import assets (e.g. a google fonts and scss partials)
* index.html
* favicon.ico

The folder `build` is the production build (minified/concatenated files etc)

*The only tasks that need to be manually called are `gulp`, `build` and `cache:clear`*.

The default task, `gulp`, will spin up a webserver on a local port that compiles scss to CSS, autoprefixes the CSS and also imports assets in that CSS file to reduce http requests. BrowserSync will watch for any changes to a file ending in .html, .scss and .js and will reload the page to reflect any changes. There will also be a link in dev tools to a sourcemap (this shows what scss file and what line of that file is responsible for the css rule in devtools).

`cache:clear` will simply empty the cache that stores the optimized images for the build folder. Call this if the images in the build folder are not optimized to your liking.

`build` as the name implies will optimize *all* assets for deployment on a server.

**Important Note**

Comments must be added to the head of the html in order for useref (concatenation/minification of multiple files of the same type) to work.

**CSS**:

<\!-- build:css css/master.min.css* -->

*link to css files*

<\!-- endbuild -->

**JS**

<\!-- build:js js/master.min.js defer -->

*scripts*

<\!-- endbuild -->

async can be used in place of defer in the first comment above the scripts

----

## Complete list of gulp tasks
* `gulp` (default) - runs styles then serves a webpage to a local port that reloads on changes in the src directory
* `gulp styles` - converts scss to css in `src/stylesheets` folder; also sets up sourcemaps for scss debugging
* `gulp build` - takes all applicable files in src/ and optimizes them and sends them to the build/ directory
* `gulp cache:clear` - clears cache (imagemin task caches images to prevent re-optimizing the same images over and over)
* `gulp clean:build` - deletes all files in build/ directory
* `gulp favicon` - pipes favicon to build folder
* `gulp fonts` - pipes fonts to build
* `gulp htmlmin` - minifies html
* `gulp images` - optimizes images for build/
* `gulp serve` - creates a webserver for browsersync which then watches for any html/scss changes
* `gulp sass` - used when the default task is called. Watches for changes in any scss file in the src directory and recompiles the css and reloads the live browser. It also autoprefixes applicable css rules and also imports assets called in .scss files. For example import a google font and the cssimport will import that font reducing http requests.
* `gulp useref` - concatenates files called in the head of the document in to single files of the same type (see note in the **Basics** section).

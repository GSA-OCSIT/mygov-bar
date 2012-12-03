MyGov Discovery Bar
===================

The MyGov Discovery Bar allows visitors to government websites to find relevant content across federal agencies.

Implementation
--------------

Federal agenencies would place a single line of JavaScript immediately prior to the `</body>` tag of their template. When a user scrolls to the bottom of the page, the script will inject an iframe with the MyGov Bar content. The iframe allows the MyGov Discovery Bar to be "sandboxed", meaning it does not have access to, nor can it manipulate the content within the parent page. Instead, the postMessage API is used share style information between the iframe and the parent page (such as showing or hiding the MyGov Discovery Bar, or setting its width).

Structure
---------

* `templates` - HTML files as underscore templates (aliased to `_includes/templates`)
* `css` - stylesheets (aliased to `_includes/templates`)
* `cs` - coffeescript source files
* `img` - images
* `plugins` - browser extensions
* `mygov-bar.html` - main rendered file, which will be the source of the child iframe
* `mygov-bar.js` - compiled javascript which will be the source of the embed code
* `index.md` - sample page with usage instructions 

Running
-------

The MyGov Discovery Bar renders down to a single flat HTML file (the iframe source) and a single javascript file (the embed code). To run locally for development purposes, install Jekyll, and simply run `jekyll --url http://localhost:4000`.

### Setting up a development environoment

1. Install Ruby
2. Install Jekyll
3. Install node (only required for compilation of coffeescript files)
4. Clone the repository
5. `npm install`
6. `jekyll --url http://localhost:4000`
7. (make changes)
8. `cake compile`

Building
--------

The MyGov Discovery bar is package with a bare bones Cakefile to simplify the build process. It contains the following commands:

* `cake compile` - compile coffeescript to javascript
* `cake build` - compile coffeescript and minify
* `cake minify` - compress javascript and css files
* `cake minify:js` - compress javascript files
* `cake minify:css` - compress css files

*Note: by default, when running locally, non-minified css is served for debugging*
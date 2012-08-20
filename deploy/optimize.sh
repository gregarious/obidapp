#!/bin/sh
# Should be run in the deploy/ directory (note that paths.templates is relative to the r.js runtime)
./node_modules/requirejs/bin/r.js -o name=main out=www-build/js/main.js baseUrl=../www/js paths.templates=../templates
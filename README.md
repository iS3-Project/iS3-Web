# WebGIS

This is a webgis application using PostGIS + GeoServer + Openlayers.

## Requirements

Building WebGIS requires Node and npm (v4.4.4+) be [installed](http://nodejs.org/). In addition to installing node and npm it is recommended that `gulp` (v3.9.1+) be installed globally:

    npm install -g gulp

## Quick Start

To install all project dependencies simply run

    npm install

To build all client side assets run

    gulp

## Debug

For convenience of debuging, simply run

	gulp debug

Enter `localhost:9080` in your browser to view the web application

## Minify Build

To generate the minified .js and .css files, just run

	gulp build

Then modify `main.js` and `main.css` in the `index.html` file to `main.min.js` and `main.min.css` respectively.

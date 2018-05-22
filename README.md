# WebGIS

This is a webgis application using PostGIS + GeoServer + Openlayers.

## Requirements

Building WebGIS requires Node and npm (v4.4.4+) be [installed](http://nodejs.org/). In addition to installing node and npm it is recommended that `gulp` (v3.9.1+) be installed globally:

    npm install -g gulp

## Build the project

To install all project dependencies simply run

    npm install

To build all client side assets run

    gulp

## Debug

For convenience of debuging, simply run

	gulp debug

Enter `localhost:9080` in your browser to view the web application

## Configuration

Update the `/config.json` file to change the configuration of this project.

1. server: The geoserver website. If you do not have one, a remote one can be used: 'https://demo.geo-solutions.it/geoserver'
2. lang: CN or EN
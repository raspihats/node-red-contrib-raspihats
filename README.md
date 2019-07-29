# Raspihats Node-RED Nodes

A collection of [Node-RED](http://nodered.org) nodes for the Raspberry Pi add-on boards from [raspihats.com](http://raspihats.com). See below for a list.

## Installation

Go to your Node-RED user data directory and install:  
`cd $HOME/.node-red`
`npm install node-red-contrib-raspihats`
You will then need to restart Node-RED for it to pick-up the new nodes.

## Nodes Information

### I2C-HAT Read DI(DigitalInput)

Node used to read a I2C-HAT Digital Input channel, generates a `msg` object with `msg.payload` that is `true` or `false` depending on the state of the Digital Input channel.

### I2C-HAT Write DQ(DigitalOutput)

Node used to write a I2C-HAT Digital Output channel, expects a `msg` object with a `msg.payload` that is `true` or `false` and writes this to the Digital Output channel.

## Copyright and license

Copyright 2016, 2016 Florin C. under [the MIT license](LICENSE).

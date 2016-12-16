# Raspihats Node-RED Nodes

A collection of [Node-RED](http://nodered.org) nodes for the Raspberry Pi add-on boards at [raspihats](http://raspihats.com). See below for a list.

## Installation

To install - change to your Node-RED user directory.
        cd ~/.node-red
        npm install node-red-contrib-raspihats

To manually install using this repo:

1. Either:
    - download the zip of the repository and extract it
    - run `git clone https://github.com/raspihats/node-red-contrib-raspihats.git`
2. cd to node-red-contrib-raspihats folder
3. run `npm install`

## Copyright and license

Copyright 2016, 2016 raspihats under [the MIT license](LICENSE).

## Nodes Information

### DigitalInput
Node used to read a DigitalInput, has configurable scan interval(in milliseconds), sends a **msg** object with a **msg.payload** of 0 or 1. 

### DigitalOutput
Node used to write a DigitalOutput, expects a **msg** object with a **msg.payload** of 0 or 1.
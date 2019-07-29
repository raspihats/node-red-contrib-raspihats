# Raspihats Node-RED Nodes

A collection of [Node-RED](http://nodered.org) nodes for the Raspberry Pi add-on boards from [raspihats.com](http://raspihats.com). See below for a list.

## Installation

Go to your Node-RED user data directory and install this package:

```
cd $HOME/.node-red
npm install node-red-contrib-raspihats
```

If Node-RED is running, then you'll then need to restart Node-RED for it to pick-up the new nodes.

## Nodes Categories Information

### 1. Raspihats I2CHat

#### DI Read(DigitalInput)

Node used to read a I2C-HAT Digital Input channel state, generates a `msg` object with `msg.payload` that is `true` or `false` depending on the state of the Digital Input channel.

A polling mechanism is used for reading the DigitalInputs states, target polling interval is 10ms.

#### DQ Read (DigitalOutput)

Node used to read a I2C-HAT Digital Output channel state, generates a `msg` object with `msg.payload` that is `true` or `false` depending on the state of the Digital Input channel.

A polling mechanism is used for reading the DigitalOutputs states, target polling interval is 10ms.

#### DQ Write(DigitalOutput)

Node used to write a I2C-HAT Digital Output channel state, expects a `msg` object with a `msg.payload` that is `true` or `false` and writes this to the Digital Output channel.

## TODO

- Replace polling mechanism for Raspihats I2CHat/DI Read with a interrupt based mechanism

## Copyright and license

Copyright 2016, 2016 Florin C. under [the MIT license](LICENSE).

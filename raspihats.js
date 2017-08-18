module.exports = function(RED) {
    "use strict";
    var raspihats = require('raspihats');
    var discan = require('./discan');
    
    function log(level, message) {
        RED.log[level]("[raspihats] " + message);
    }

    function I2CHatNode(config) {

        function getBoard(model, address) {
            try {
                var token = "I2C-HAT";
                var name = model.replace(token, "").trim();
                var board = new raspihats.i2cHats[name](parseInt(address, 16));
                return board;
            }
            catch(err) {
                var message = model + " @" + address + " not responding!!! " + err;
                throw message;
            }
        }

        RED.nodes.createNode(this, config);
        this.board = getBoard(config.model, config.address);
    }
    RED.nodes.registerType("I2C-HAT", I2CHatNode);

    function I2CHatDINode(config) {
        RED.nodes.createNode(this, config);

        this.board = RED.nodes.getNode(config.board).board;
        this.channel = config.channel;

        var node = this;
        var listener = function(state) {
            node.send({payload: Boolean(state)});
        };
        discan.register(this.board, this.channel, listener);

        this.on("close", function() {
            discan.deregister(this.board, this.channel, listener);
        });
    }
    RED.nodes.registerType("I2C-HAT DI", I2CHatDINode);

    function I2CHatDQNode(config) {
        RED.nodes.createNode(this, config);

        this.board = RED.nodes.getNode(config.board).board;
        this.channel = config.channel;

        this.on('input', function (msg) {
            try {
                this.board.DQ.setChannel(this.channel, msg.payload);
            }
            catch(err) {
                var message = this.board.name + " @0x" + this.board.address.toString(16) + " not responding!!! " + err;
                log("error", message);
            }
        });

        this.on("close", function() {

        });
    }
    RED.nodes.registerType("I2C-HAT DQ", I2CHatDQNode);

    RED.events.on("nodes-started",function() {
        // Start DI scanner after all nodes are started.
        discan.start(log);
    })

};

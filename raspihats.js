module.exports = function(RED) {
    "use strict";
    var raspihats = require('raspihats');

    function I2CHatNode(config) {

        function getBoard(model, address) {
            try {
                var token = "I2C-HAT";
                var name = model.replace(token, "").trim();
                var board = new raspihats.i2cHats[name](parseInt(address, 16));
                return board;
            }
            catch(err) {
                throw "Building board object failed for " + model + " @" + address + ". " + err;
            }
        }

        RED.nodes.createNode(this, config);
        this.board = getBoard(config.model, config.address);
    }
    RED.nodes.registerType("I2C-HAT", I2CHatNode);


    function DINode(config) {
        RED.nodes.createNode(this, config);

        this.board = RED.nodes.getNode(config.board).board;
        this.channel = config.channel;
        this.polling = config.polling;

        var node = this;
        var intervalFunction = function() {
          var msg = {payload: node.board.DI.getChannel(node.channel)};
          node.send(msg);
        };
        var intervalTimer = setInterval(intervalFunction, this.polling);

        this.on("close", function() {
            clearInterval(intervalTimer);
        });
    }
    RED.nodes.registerType("DI", DINode);


    function DQNode(config) {
        RED.nodes.createNode(this, config);

        this.board = RED.nodes.getNode(config.board).board;
        this.channel = config.channel;

        this.on('input', function (msg) {
            this.board.DQ.setChannel(this.channel, msg.payload);
        });

        this.on("close", function() {

        });
    }
    RED.nodes.registerType("DQ", DQNode);
};

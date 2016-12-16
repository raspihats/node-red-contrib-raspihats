
// If you use this as a template, update the copyright with your own name.

module.exports = function(RED) {
    "use strict";
    //var foo = require("foo-library");
    
    function ConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.address = n.address;
    }
    RED.nodes.registerType("board-config", ConfigNode);

    
    function DINode(config) {
        RED.nodes.createNode(this, config);

        this.board = RED.nodes.getNode(config.board);
        this.channel = config.channel;
        this.polling = config.polling;
        
        var node = this;
        var intervalFunction = function() {
          var msg = {payload: 1};
          node.send(msg);
        };
        var intervalTimer = setInterval(intervalFunction, this.polling);

        this.on("close", function() {
            // this happens for every Deploy
            clearInterval(intervalTimer);
        });
    }
    RED.nodes.registerType("DI", DINode);
    
    
    function DQNode(config) {
        RED.nodes.createNode(this, config);

        this.board = RED.nodes.getNode(config.board);
        this.channel = config.channel;

        this.on('input', function (msg) {
            this.warn("I saw a payload: " + msg.payload + " for " + this.board.name + " channel:" + this.channel);
        });

        this.on("close", function() {
            
        });
    }
    RED.nodes.registerType("DQ", DQNode);
};

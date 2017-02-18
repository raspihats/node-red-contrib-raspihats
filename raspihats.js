module.exports = function(RED) {
    "use strict";
    var raspihats = require('raspihats');
    
    function getBoard(boardConfig) {
      var token = "I2C-HAT";
      if(boardConfig.name.includes(token)) {
        var name = boardConfig.name.replace(token, "").trim();
        var board = new raspihats.i2cHats[name](parseInt(boardConfig.address, 16));
        if(board.getName() === boardConfig.name) {
          return board;
        }
        throw "Building board object failed! Check type for ";
      }
      throw "Can't build board object";
    }
    
    function ConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.address = n.address;
    }
    RED.nodes.registerType("board-config", ConfigNode);

    
    function DINode(config) {
        RED.nodes.createNode(this, config);

        this.board = getBoard(RED.nodes.getNode(config.board));
        this.channel = config.channel;
        this.polling = config.polling;
        
        var node = this;
        var intervalFunction = function() {
          var msg = {payload: node.board.DI.getChannel(node.channel)};
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

        this.board = getBoard(RED.nodes.getNode(config.board));
        this.channel = config.channel;

        this.on('input', function (msg) {
            this.board.DQ.setChannel(this.channel, msg.payload);
            //this.warn("I saw a payload: " + msg.payload + " for " + this.board + " channel:" + this.channel);
        });

        this.on("close", function() {
            
        });
    }
    RED.nodes.registerType("DQ", DQNode);
};

module.exports = RED => {
  "use strict";
  const raspihats = require("raspihats");
  const discan = require("./discan");
  const dqscan = require("./dqscan");

  const log = (level, message) => {
    RED.log[level]("[raspihats] " + message);
  };

  const formatError = (name, address, error) =>
    `${name}@0x${address.toString(16)} not responding!!! Error: ${error}`;

  function I2CHatNode(config) {
    const getBoard = (name, address) => {
      try {
        const className = name.replace("I2C-HAT", "").trim();
        const board = new raspihats.i2cHats[className](parseInt(address, 16));
        return board;
      } catch (error) {
        throw formatError(name, address, error);
      }
    };
    RED.nodes.createNode(this, config);
    this.board = getBoard(config.model, config.address);
  }
  RED.nodes.registerType("I2C-HAT", I2CHatNode);

  function I2CHatDIReadNode(config) {
    RED.nodes.createNode(this, config);

    this.board = RED.nodes.getNode(config.board).board;
    this.channel = config.channel;

    var node = this;
    var listener = state => {
      node.send({ payload: Boolean(state) });
    };
    discan.register(this.board, this.channel, listener);

    this.on("close", () => {
      discan.deregister(this.board, this.channel, listener);
    });
  }
  RED.nodes.registerType("DI Read", I2CHatDIReadNode);

  function I2CHatDQReadNode(config) {
    RED.nodes.createNode(this, config);

    this.board = RED.nodes.getNode(config.board).board;
    this.channel = config.channel;

    var node = this;
    var listener = state => {
      node.send({ payload: Boolean(state) });
    };
    dqscan.register(this.board, this.channel, listener);

    this.on("close", () => {
      dqscan.deregister(this.board, this.channel, listener);
    });
  }
  RED.nodes.registerType("DQ Read", I2CHatDQReadNode);

  function I2CHatDQWriteNode(config) {
    RED.nodes.createNode(this, config);

    this.board = RED.nodes.getNode(config.board).board;
    this.channel = config.channel;

    this.on("input", msg => {
      try {
        this.board.DQ.setChannel(this.channel, msg.payload);
      } catch (error) {
        throw formatError(this.board.name, this.board.address, error);
      }
    });
  }
  RED.nodes.registerType("DQ Write", I2CHatDQWriteNode);

  RED.events.on("nodes-started", () => {
    // Start DI scanner after all nodes are started.
    discan.start(log);
    dqscan.start(log);
  });
};

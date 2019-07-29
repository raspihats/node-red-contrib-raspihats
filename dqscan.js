module.exports = (() => {
  const monitors = [];
  let intervalTimer;
  let logger = null;

  const log = (level, message) => {
    if (logger != null) {
      logger(level, "[dqscan] " + message);
    }
  };

  const getBoardInfo = board => {
    const { name, address } = board;
    return `${name}@0x${address.toString(16)}`;
  };

  const getListeners = board => {
    listeners = null;
    monitors.forEach(monitor => {
      if (monitor.board == board) {
        listeners = monitor.listeners;
      }
    });
    return listeners;
  };

  const scanner = () => {
    monitors.forEach(monitor => {
      try {
        const dqValue = monitor.board.DQ.getValue();
        if (monitor.dqValueOld === null) {
          // trigger callback for inital value
          monitor.listeners.forEach(listener => {
            const state = (dqValue >> listener.channel) & 0x01;
            listener.callback(state);
          });
        } else {
          monitor.listeners.forEach(listener => {
            const state = (dqValue >> listener.channel) & 0x01;
            const stateOld = (monitor.dqValueOld >> listener.channel) & 0x01;
            if (state != stateOld) {
              // trigger callback for edge change
              listener.callback(state);
            }
          });
        }
        monitor.dqValueOld = dqValue;

        if (monitor.error != null) {
          monitor.error = null;
          log("warn", getBoardInfo(monitor.board) + " responding again!!!");
        }
      } catch (error) {
        monitor.dqValueOld = null;

        if (monitor.error == null) {
          monitor.error = error;
          log(
            "error",
            getBoardInfo(monitor.board) + " not responding!!! " + error
          );
        }
      }
    });
  };

  const start = nrLogger => {
    logger = nrLogger;
    log("info", "Starting...");
    if (intervalTimer != null) {
      clearInterval(intervalTimer);
    }
    intervalTimer = setInterval(scanner, 10);
  };

  const stop = () => {
    clearInterval(intervalTimer);
  };

  const register = (board, channel, callback) => {
    deregister(board, channel);

    const listeners = getListeners(board);
    if (listeners !== null) {
      log("info", "new");
      listeners.push({ channel, callback });
    } else {
      log("info", "new");
      monitors.push({
        board: board,
        listeners: [{ channel, callback }],
        dqValueOld: null,
        error: null
      });
    }
  };

  const deregister = (board, channel) => {
    const listeners = getListeners(board);
    if (listeners !== null) {
      let matchIndex = null;
      listeners.forEach((listener, index) => {
        if (listener.channel === channel) {
          matchIndex = index;
        }
      });
      if (matchIndex !== null) {
        listeners.splice(matchIndex, 1);
      }
    }
  };

  return {
    start,
    stop,
    register,
    deregister
  };
})();

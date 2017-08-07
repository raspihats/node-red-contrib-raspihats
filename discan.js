module.exports = (function(){

    var boardListeners = [];
    var intervalTimer;
    var logger = null;
    var logHeader = "[Raspihats : DI Scan] ";

    function log(level, message) {
        if(logger != null) {
            logger[level](logHeader + message)
        }
    }

    function boardInfo(board) {
        return board.name + "@" + board.address.toString(16);
    }

    function triggerInitial(channels, diValue) {
        var len = channels.length;
        var index, state, stateOld;
        for(var i = 0; i < len; i++) {
            index = channels[i].index;
            state = diValue >> index & 0x01;
            channels[i].listener(state);
        }
    }

    function triggerOnEdge(channels, diValue, diValueOld) {
        var len = channels.length;
        var index, state, stateOld;
        for(var i = 0; i < len; i++) {
            index = channels[i].index;
            state = diValue >> index & 0x01;
            stateOld = diValueOld >> index & 0x01;
            if(state != stateOld) {
                channels[i].listener(state);
            }
        }
    }

    var intervalFunction = function() {
        var boardListener;
        var diValue;
        var len = boardListeners.length;
        for(var i = 0; i < len; i++) {
            boardListener = boardListeners[i];
            try {
                diValue = boardListener.board.DI.getValue();
                if(boardListener.diValueOld == null) {
                    triggerInitial(boardListener.channels, diValue);
                }
                else{
                    triggerOnEdge(boardListener.channels, diValue, boardListener.diValueOld);
                }
                boardListener.diValueOld = diValue;

                if(boardListener.err != null) {
                    boardListener.err = null;
                    log("warn", boardInfo(boardListener.board) + " responding again!!!");
                }
            }
            catch(err) {
                boardListener.diValueOld = null;

                if(boardListener.err == null) {
                    boardListener.err = err;
                    log("error", boardInfo(boardListener.board) + " not responding!!! " + err);
                }
            }
        }
    };

    function start(nrLogger) {
        logger = nrLogger;
        log("info","Starting...");
        if(intervalTimer != null) {
            clearInterval(intervalTimer);
        }
        intervalTimer = setInterval(intervalFunction, 5);
    }

    function stop() {
        clearInterval(intervalTimer);
    }

    function getBoard(board) {
        var len = boardListeners.length;
        for(var i = 0; i < len; i++) {
            if(boardListeners[i].board == board) {
                return boardListeners[i];
            }
        }
        return null;
    }

    function register(board, channel, listener) {
        var boardListener;
        var diValue;
        var state;

        deregister(board, channel, listener);

        boardListener = getBoard(board);
        if(boardListener !== null) {
            boardListener.channels.push(
                {index: channel, listener: listener}
            );
        }
        else {
            boardListener = {
                board: board,
                channels: [
                    {index: channel, listener: listener}
                ],
                diValueOld: null,
                err: null
            }
            boardListeners.push(boardListener);
        }
    }

    function deregister(board, channel, listener) {
        var boardListener;

        boardListener = getBoard(board);
        if(boardListener !== null) {
            var len = boardListener.channels.length;
            for(var i = 0; i < len; i++) {
                if(boardListener.channels[i].index === channel) {
                    boardListener.channels.splice(i , 1);
                    break;
                }
            }
        }
    }

    return {
        start: start,
        stop: stop,
        register: register,
        deregister: deregister
    };

})();
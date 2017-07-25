
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
}

export default class Timer {
    constructor (resourceCount) {
        this.resourceCount = resourceCount || 0;
        this.tasks = [];
    }

    start () {
        if (this.resourceCount !== 0) {
            this.resourceCount--;

            if (this.resourceCount !== 0) {
                return;
            }
        }

        this.isStop = false;

        var lastTime = 0;

        function loopFn () {
            if (this.isStop) {
                return;
            }

            var timeNow = new Date().getTime();
            var elapse = (timeNow - lastTime) / 1000;
            var tasks = this.tasks;

            for (var i = 0; i < tasks.length; i++) {
                tasks[i](elapse);
            }

            lastTime = timeNow;

            requestAnimationFrame(loopFn.bind(this));
        };

        loopFn.call(this);
    }

    addTask (handler) {
        this.tasks.push(handler);
    }

    stop () {
        this.isStop = true;
    }
}

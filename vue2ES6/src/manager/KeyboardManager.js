
import EventManager from '../event/EventManager';
import Events from '../event/Events';

function preventDefault (e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    };
}

export default class KeyboardManager {

    static attach () {
        document.addEventListener('keydown', function (e) {
            var event = e || window.event;

            switch (event.keyCode) {
            case 37:
                EventManager.fire(Events.KEY_DOWN, {
                    direction: 'left'
                });
                preventDefault(e);
                break;
            case 38:
                EventManager.fire(Events.KEY_DOWN, {
                    direction: 'down'
                });
                preventDefault(e);
                break;
            case 39:
                EventManager.fire(Events.KEY_DOWN, {
                    direction: 'right'
                });
                preventDefault(e);
                break;
            case 40:
                EventManager.fire(Events.KEY_DOWN, {
                    direction: 'up'
                });
                preventDefault(e);
                break;
            }
        });
    }
}

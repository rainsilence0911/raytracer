
let eventMapper = {};

export default class EventManager {

    static register(eventName, handler) {

        if (!eventMapper[eventName]) {
            eventMapper[eventName] = [];
        }

        eventMapper[eventName].push(handler);
    }

    static fire(eventName, params) {

        if (!eventMapper[eventName]) {
            return;
        }

        let handlers = eventMapper[eventName];

        for (let i = 0; i < handlers.length; i++) {
            handlers[i](params);
        }

    }
}

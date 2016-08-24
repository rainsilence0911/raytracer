
import React from "react";

import EventManager from '../event/EventManager';
import Events from '../event/Events';

export default class PlatformCanvas extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        EventManager.fire(Events.CANVAS_READY, {
            canvas: this.refs.canvas
        });
    }

    render() {
        return (
            <div id="canvas-container" className="display-part">
                <canvas ref="canvas" width="800px" height="600px"></canvas>
            </div>
        );
    }
}

import React from "react";

import PlatformCanvas from './component/PlatformCanvas';
import OperationPanel from './component/OperationPanel';

import CanvasPrinter from './observer/CanvasPrinter';

import KeyboardManager from './manager/KeyboardManager';

export default class RayTracer extends React.Component {
    constructor() {
        super();
        new CanvasPrinter();
    }

    componentDidMount() {
        KeyboardManager.attach();
    }

    render() {
        return (
            <div id="rayTracer">
                <PlatformCanvas/>
                <OperationPanel/>
            </div>
        );
    }
}


import React from "react";

import EventManager from '../event/EventManager';
import Events from '../event/Events';

export default class OperationPanel extends React.Component {
    constructor() {
        super();
    }

    onReflectFloorChange() {
        EventManager.fire(Events.USE_REFLECT_CHANGE, {
            reflectFloor: this.refs.reflectFloor.checked
        });
    }

    onUseFogChange() {
        EventManager.fire(Events.USE_FOG_CHANGE, {
            useFog: this.refs.useFog.checked
        });
    }

    onFogDensityRangeChange() {
        EventManager.fire(Events.FOG_DENSITY_CHANGE, {
            fogDensity: parseFloat(this.refs.fogDensityRange.value)
        });
    }

    onViewPointRangeChange() {
        EventManager.fire(Events.VIEW_POINT_CHANGE, {
            viewPoint: parseFloat(this.refs.viewPointRange.value)
        });
    }

    componentDidMount() {
        EventManager.fire(Events.OPERATION_PANEL_READY, {
            fogDensity: parseFloat(this.refs.fogDensityRange.value),
            useFog: this.refs.useFog.checked,
            reflectFloor: this.refs.reflectFloor.checked,
            viewPoint: parseFloat(this.refs.viewPointRange.value)
        });
    }

    render() {
        return (
            <div id="operation-panel" className="display-part" style={{padding: "24px"}}>

                <fieldset>
                    <legend>Reflection</legend>
                    <div>
                        <input type="checkbox" id="reflectFloor" ref="reflectFloor" defaultChecked="true" onChange={this.onReflectFloorChange.bind(this)}/>
                        <label htmlFor="reflectFloor">Reflect floor</label>
                    </div>
                    
                    <div>
                        <span>View Point: </span>
                        <span><input type="range" min="0.3" max="0.6" step="0.01" ref="viewPointRange" defaultValue="0.4" 
                                    onChange={this.onViewPointRangeChange.bind(this)}/></span>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Fog</legend>
                    <div>
                        <input type="checkbox" id="useFog" ref="useFog" onChange={this.onUseFogChange.bind(this)}/>
                        <label htmlFor="useFog">Use Fog</label>
                    </div>
                    <div>
                        <span>Fog Density: </span>
                        <span><input type="range" min="1.0" max="2.5" step="0.1" ref="fogDensityRange" defaultValue="2.0"
                                    onChange={this.onFogDensityRangeChange.bind(this)}/></span>
                    </div>
                </fieldset>

                <div>点键盘上下左右改变球的坐标</div>
            </div>
        );
    }
}
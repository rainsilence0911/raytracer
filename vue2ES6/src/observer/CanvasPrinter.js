
import EventManager from '../event/EventManager';
import Events from '../event/Events';

import Shader from '../gl/Shader';
import Vector from '../gl/Vector';

import Timer from '../util/Timer';

import vertShader from '../glsl/ray.vert';
import fragShader from '../glsl/ray.frag';

export default class CanvasPrinter {

    constructor () {
        this.initEvent();
        this.initState();
    }

    initEvent () {
        EventManager.register(Events.CANVAS_READY, this.onCanvasReady.bind(this));
        EventManager.register(Events.OPERATION_PANEL_READY, this.onOperationPanelReady.bind(this));

        EventManager.register(Events.VIEW_POINT_CHANGE, this.onViewPointRangeChange.bind(this));
        EventManager.register(Events.FOG_DENSITY_CHANGE, this.onFogDensityRangeChange.bind(this));
        EventManager.register(Events.USE_FOG_CHANGE, this.onUseFogChange.bind(this));
        EventManager.register(Events.USE_REFLECT_CHANGE, this.onReflectFloorChange.bind(this));

        EventManager.register(Events.KEY_DOWN, this.onKeyDown.bind(this));
    }

    initState () {
        this.state = {
            canvasReady: false,
            operationPanelReady: false,
            cameraPersp: 2
        };

        this.timer = new Timer();
        this.timer.addTask(this.onFrameEnter.bind(this));

        this.cameraTo = Vector.create(0, 0, 0);
        this.up = Vector.create(0, 1, 0);

        this.uniforms = {
            sphere1Center: [0, 0.1, 0],
            uFogDensity: null,
            uUseFog: null,
            uReflectFloor: null,
            cameraPos: null
        };
    }

    onKeyDown (e) {
        switch (e.direction) {
            case 'left':
                this.uniforms.sphere1Center[0] -= 0.01;
                break;
            case 'right':
                this.uniforms.sphere1Center[0] += 0.01;
                break;
            case 'up':
                this.uniforms.sphere1Center[2] += 0.01;
                break;
            case 'down':
                this.uniforms.sphere1Center[2] -= 0.01;
                break;
        }
    }

    onCanvasReady (e) {
        let canvas = e.canvas;
        this.shader = Shader.create(canvas, vertShader, fragShader);
        let mesh = this.shader.createMesh();
        mesh.addAttributeBuffer('aVertexPosition', [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0], 2);
        mesh.addAttributeBuffer('aPlotPosition', [], 3);

        this.ratio = parseInt(canvas.height, 10) / parseInt(canvas.width, 10);

        this.mesh = mesh;

        this.state.canvasReady = true;

        this.execute();
    }

    onOperationPanelReady (e) {
        this.uniforms.uFogDensity = e.fogDensity;
        this.uniforms.uUseFog = e.useFog;
        this.uniforms.uReflectFloor = e.reflectFloor;
        this.cameraFrom = Vector.create(0, e.viewPoint, 1.1);

        this.state.operationPanelReady = true;
        this.execute();
    }

    onReflectFloorChange (e) {
        this.uniforms.uReflectFloor = e.reflectFloor;
    }

    onUseFogChange (e) {
        this.uniforms.uUseFog = e.useFog;
    }

    onFogDensityRangeChange (e) {
        this.uniforms.uFogDensity = e.fogDensity;
    }

    onViewPointRangeChange (e) {
        this.cameraFrom.y = e.viewPoint;
    }

    execute () {
        if (!this.state.canvasReady || !this.state.operationPanelReady) {
            return;
        }

        var shader = this.shader;

        shader.clearColor(0.0, 0.0, 0.0, 1.0);
        shader.clearDepth(1.0);

        this.timer.start();
    }

    onFrameEnter () {
        var shader = this.shader;
        var gl = this.shader.gl;

        shader.viewport();
        shader.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var uniforms = this.uniforms;

        var cameraFrom = this.cameraFrom;
        var cameraDir = this.cameraTo.substract(cameraFrom).normalize();

        // camera line
        var cameraCenter = cameraFrom.add(cameraDir.multiply(this.state.cameraPersp));

        var cameraLeft = cameraDir.cross(this.up).normalize();
        var cameraTop = cameraLeft.cross(cameraDir).normalize().multiply(this.ratio);

        var cameraLeftTop = cameraCenter.add(cameraLeft).add(cameraTop).normalize();
        var cameraRightTop = cameraCenter.substract(cameraLeft).add(cameraTop).normalize();
        var cameraLeftBottom = cameraCenter.add(cameraLeft).substract(cameraTop).normalize();
        var cameraRightBottom = cameraCenter.substract(cameraLeft).substract(cameraTop).normalize();

        var corner = [];

        // Z字按照X轴翻转后的顺序,因为渲染时候的Y和浏览器的Y刚好相反
        corner = corner.concat(cameraRightTop.toArray());
        corner = corner.concat(cameraLeftTop.toArray());
        corner = corner.concat(cameraRightBottom.toArray());
        corner = corner.concat(cameraLeftBottom.toArray());

        this.mesh.updateAttributeBuffer('aPlotPosition', corner);

        uniforms.cameraPos = [cameraFrom.x, cameraFrom.y, cameraFrom.z];

        // render earth
        shader.uniforms(uniforms).draw(this.mesh, gl.TRIANGLE_STRIP);
    }
}

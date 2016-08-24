
export default class Mesh {

    constructor(gl) {
        this.gl = gl;
        this.vertexBuffers = {};
        this.indexBuffer = null;
    }

    addAttributeBuffer(attribute, array, pointNum) {
        var gl = this.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
        this.vertexBuffers[attribute] = {buffer: buffer, length: array.length, spacing: pointNum};
    }

    updateAttributeBuffer(attribute, array) {
        if (this.vertexBuffers[attribute] == null) {
            throw "The attribute[" + attribute + "] is not existed";
        }
        var gl = this.gl;
        var vertexBuff = this.vertexBuffers[attribute];
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
        vertexBuff.length = array.length;
    }
    
    addIndexBuffer(array, drawMode) {
        var gl = this.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), drawMode || gl.STATIC_DRAW);
        this.indexBuffers = {buffer: buffer, length: array.length};
    }
}
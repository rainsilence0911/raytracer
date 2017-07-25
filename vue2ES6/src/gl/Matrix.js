import Vector from './Vector';


/**
 * 列优先矩阵
 * 
 * m[0], m[4], m[8], m[12],
 * m[1], m[5], m[9], m[13],
 * m[2], m[6], m[10], m[14],
 * m[3], m[7], m[11], m[15]
 */
export default class Matrix {

    constructor(m) {
        if (m && m.length == 16) {
            this.m = m;
            return;
        }
        this.m = [];
        this.loadIdentity();
    }

    clone() {
        
        var cloneTarget = [];
        
        for (var index = 0; index < this.m.length; index++) {
            cloneTarget[index] = this.m[index];
        }
        return new Matrix(cloneTarget);
    }

    toArray() {
        return this.m;
    }

    loadIdentity() {
        var m = this.m;
        for (var i = 0; i < 16; i++) {
            m[i] = 0;
        }
        m[0] = 1;
        m[5] = 1;
        m[10] = 1;
        m[15] = 1;
        
        return this;
    }

    transformPoint(v) {
        var m = this.m;

        var x = v[0];
        var y = v[1];
        var z = v[2];
        
        var x1 = m[0] * x + m[4] * y + m[8] * z + m[12] * v[3];
        var y1 = m[1] * x + m[5] * y + m[9] * z + m[13] * v[3];
        var z1 = m[2] * x + m[6] * y + m[10] * z + m[14] * v[3];
        var offset = m[3] * x + m[7] * y + m[11] * z + m[15] * v[3];
        
        return [x1, y1, z1, offset];
    }

    /**
     * 放大缩小
     */
    scale(x, y, z) {
        var scaleMatrix = Matrix.multiply(this, Matrix.scale(x, y, z));
        this.m = scaleMatrix.m;
        return scaleMatrix;
    }

    /**
     * 平移
     */
    translate(x, y, z) {
        var translateMatrix = Matrix.multiply(this, Matrix.translate(x, y, z));
        this.m = translateMatrix.m;
        return translateMatrix;
    }

    /**
     * 旋转
     */
    rotate(angle, x, y, z) {
        var rotateMatrix = Matrix.multiply(this, Matrix.rotate(angle, x, y, z));
        this.m = rotateMatrix.m;
        return rotateMatrix;
    }

    /**
     * 逆转置
     */
    inverseTranspose() {
        return Matrix.transpose(Matrix.inverse(this.clone()));
    }

    inverse() {
        return Matrix.inverse(this.clone());
    }

    getItem(row, col) {
        return this.m[4 * row + col];
    }

    /**
     * 转置
     */
    static transpose(matrix) {
        var m = matrix.m;
        var tmp = m[4];
        m[4] = m[1];
        m[1] = tmp;
        
        tmp = m[8];
        m[8] = m[2];
        m[2] = tmp;
        
        tmp = m[12];
        m[12] = m[3];
        m[3] = tmp;
        
        tmp = m[9];
        m[9] = m[6];
        m[6] = tmp;
        
        tmp = m[13];
        m[13] = m[7];
        m[7] = tmp;
        
        tmp = m[14];
        m[14] = m[11];
        m[11] = tmp;
        return new Matrix(m);
    }

    /**
     * 矩阵求逆
     */
    static inverse(matrix) {
        var result = new Matrix();
        var m = Matrix.transpose(matrix).m, r = result.m;

        r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
        r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
        r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
        r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];

        r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
        r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
        r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
        r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];

        r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
        r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
        r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
        r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];

        r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
        r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
        r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
        r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];

        var det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
        for (var i = 0; i < 16; i++) r[i] /= det;
        return Matrix.transpose(result);
    }
    /**
     * 矩阵乘法
     * m[0], m[4], m[8], m[12],
     * m[1], m[5], m[9], m[13],
     * m[2], m[6], m[10], m[14],
     * m[3], m[7], m[11], m[15]
     */
    static multiply(left, right) {
        var ml = left.m, mr = right.m;
        var matrix = new Matrix();
        var m = matrix.m;
        
        for (var i = 0; i < 4; i++) {
            m[4 * i + 0] = ml[0] * mr[4 * i + 0] + ml[4] * mr[4 * i + 1] + ml[8] * mr[4 * i + 2] + ml[12] * mr[4 * i + 3];
            m[4 * i + 1] = ml[1] * mr[4 * i + 0] + ml[5] * mr[4 * i + 1] + ml[9] * mr[4 * i + 2] + ml[13] * mr[4 * i + 3];
            m[4 * i + 2] = ml[2] * mr[4 * i + 0] + ml[6] * mr[4 * i + 1] + ml[10] * mr[4 * i + 2] + ml[14] * mr[4 * i + 3];
            m[4 * i + 3] = ml[3] * mr[4 * i + 0] + ml[7] * mr[4 * i + 1] + ml[11] * mr[4 * i + 2] + ml[15] * mr[4 * i + 3];
        }
        return matrix;
    }

    /**
     * 矩阵移动
     */
    static translate(x, y, z) {
        var matrix = new Matrix();
        matrix.m[12] = x;
        matrix.m[13] = y;
        matrix.m[14] = z;
        return matrix;
    }

    /**
     * 矩阵缩放
     */
    static scale(x, y, z) {
        var matrix = new Matrix();
        matrix.m[0] = x;
        matrix.m[5] = y;
        matrix.m[10] = z;
        return matrix;
    }

    /**
     * 矩阵旋转
     */
    static rotate(angle, x, y, z) {
        var mag = Math.sqrt(x * x + y * y + z * z);
        var sinAngle = Math.sin(angle * Math.PI / 180.0);
        var cosAngle = Math.cos(angle * Math.PI / 180.0);

        if (mag > 0) {
            var xx, yy, zz, xy, yz, zx, xs, ys, zs;
            var oneMinusCos;
            var rotMat;

            x /= mag;
            y /= mag;
            z /= mag;

            xx = x * x;
            yy = y * y;
            zz = z * z;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * sinAngle;
            ys = y * sinAngle;
            zs = z * sinAngle;
            oneMinusCos = 1.0 - cosAngle;

            rotMat = new Matrix();

            rotMat.m[0] = (oneMinusCos * xx) + cosAngle;
            rotMat.m[1] = (oneMinusCos * xy) + zs;
            rotMat.m[2] = (oneMinusCos * zx) - ys;
            rotMat.m[3] = 0.0;

            rotMat.m[4] = (oneMinusCos * xy) - zs;
            rotMat.m[5] = (oneMinusCos * yy) + cosAngle;
            rotMat.m[6] = (oneMinusCos * yz) + xs;
            rotMat.m[7] = 0.0;

            rotMat.m[8] = (oneMinusCos * zx) + ys;
            rotMat.m[9] = (oneMinusCos * yz) - xs;
            rotMat.m[10] = (oneMinusCos * zz) + cosAngle;
            rotMat.m[11] = 0.0;

            rotMat.m[12] = 0.0;
            rotMat.m[13] = 0.0;
            rotMat.m[14] = 0.0;
            rotMat.m[15] = 1.0;

            return rotMat;
        }
        return null;
    }

    static frustum(l, r, b, t, n, f) {

        var result = new Matrix();
        var m = result.m;

        m[0] = 2 * n / (r - l);
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;

        m[4] = 0;
        m[5] = 2 * n / (t - b);
        m[6] = 0;
        m[7] = 0;

        m[8] = (r + l) / (r - l);
        m[9] = (t + b) / (t - b);
        m[10] = -(f + n) / (f - n);
        m[11] = -1.0;
        
        m[12] = 0;
        m[13] = 0;
        m[14] = -2 * f * n / (f - n);
        m[15] = 0;

        return result;
    }

    static perspective(fovy, aspect, nearZ, farZ) {
        var frustumH = Math.tan(fovy / 360.0 * Math.PI) * nearZ;
        var frustumW = frustumH * aspect;

        return Matrix.frustum(-frustumW, frustumW, -frustumH, frustumH, nearZ, farZ);
    }

    /**
     * LookAt
     * m[0], m[4], m[8], m[12],
     * m[1], m[5], m[9], m[13],
     * m[2], m[6], m[10], m[14],
     * m[3], m[7], m[11], m[15]
     */
    static lookAt(eyeX, eyeY, eyeZ, directionX, directionY, directionZ, upX, upY, upZ) {
        
        var direction = new Vector(eyeX - directionX, eyeY - directionY, eyeZ - directionZ);
        
        var directionVector = direction.normalize();
        
        var rightVector = new Vector(upX - eyeX, upY - eyeY, upZ - eyeZ).cross(directionVector).normalize();
        
        var upVector = directionVector.cross(rightVector).normalize();
        
        var matrix = new Matrix();
        var m = matrix.m;
        m[0] = rightVector.x;
        m[4] = rightVector.y;
        m[8] = rightVector.z;
        m[12] = -rightVector.dot(direction);
        
        m[1] = upVector.x;
        m[5] = upVector.y;
        m[9] = upVector.z;
        m[13] = -upVector.dot(direction);
        
        m[2] = directionVector.x;
        m[6] = directionVector.y;
        m[10] = directionVector.z;
        m[14] = -directionVector.dot(direction);
        
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;
        m[15] = 1;
        return matrix;
    }

}

export default class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    
    normalize() {
        var r = this.length();
        return Vector.create(this.x / r, this.y / r, this.z / r);
    }
    
    add(v) {
        if (v instanceof Vector) {
            return Vector.create(this.x + v.x, this.y + v.y, this.z + v.z);
        }
        return Vector.create(this.x + v, this.y + v, this.z + v);
    }
    
    substract(v) {
        if (v instanceof Vector) {
            return Vector.create(this.x - v.x, this.y - v.y, this.z - v.z);
        }
        return Vector.create(this.x - v, this.y - v, this.z - v);
    }
    
    multiply(v) {
        if (v instanceof Vector) {
            return Vector.create(this.x * v.x, this.y * v.y, this.z * v.z);
        }
        return Vector.create(this.x * v, this.y * v, this.z * v);
    }
    
    divide(v) {
        if (v instanceof Vector) {
            return Vector.create(this.x / v.x, this.y / v.y, this.z / v.z);
        }
        return Vector.create(this.x / v, this.y / v, this.z / v);
    }
    
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    
    cross(v) {
        return Vector.create(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
        );
    }
    
    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length())
        };
    }
    
    toArray() {
        return [this.x, this.y, this.z];
    }
    
    toString() {
        return "x:" + this.x + "\ny:" + this.y + "\nz:" + this.z;
    }

    static create(x, y, z) {
        return new Vector(x, y, z);
    };

    static lerp(a, b, fraction) {
        return b.subtract(a).multiply(fraction).add(a);
    };
}
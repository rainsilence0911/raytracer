precision highp float;

const vec3 lightDir = vec3(0.577350269, 0.577350269, 0.577350269);
const vec3 ambientColor = vec3(0.2, 0.2, 0.2);
const vec3 diffuseColor = vec3(0.8, 0.4, 0.4);
const vec3 specularColor = vec3(0.8, 0.8, 0.8);

const vec4 fogColor = vec4(1.0, 1.0, 1.0, 1.0);

const vec3 COLOR_BLACK = vec3(0.0, 0.0, 0.0);
const vec3 COLOR_WHITE = vec3(1.0, 1.0, 1.0);

// fog density(1.0, 2.5)
uniform float uFogDensity;
uniform bool uUseFog;
uniform bool uReflectFloor;
varying vec3 vPosition;
uniform vec3 cameraPos;
uniform vec3 sphere1Center;


bool intersectSphere(vec3 center, vec3 lStart, vec3 lDir, out float dist) {
    
    vec3 c = lStart - center;

    float b = dot(c, lDir);

    /**
     * 当球心和CameraPos的向量和Ray向量(方向相反)成钝角的时候，才显示到屏幕上
     */
    if (b > 0.0) {
        dist = 10000.0;
        return false;
    }
    /* radius:0.1 */
    float d = b * b - dot(c, c) + 0.01;

    if (d < 0.0) {
        dist = 10000.0;
        return false;
    }
    // 求最短距离，所以sqrt前的符号为-
    dist = -b - sqrt(d);

    if (dist < 0.0) {
        dist = 10000.0;
        return false;
    }

    return true;
}

bool intersectPlane(vec3 lStart, vec3 lDir, out float dist) {
    
    vec3 normal = normalize(vec3(0.0, 1.0, 0.0));

    float a = dot(lDir, normal);

    if (a > 0.0) {
        dist = 10000.0;
        return false;
    }

    float b = dot(normal, lStart - vec3(0.0, 0.0, 0.0));

    dist = -b / a;

    return true;
}

bool intersectWorld(vec3 lStart, vec3 lDir, out vec3 pos, out vec3 normal, out vec3 color, out float distance, out bool isFloor) {
    
    //float distance;

    if (intersectSphere(sphere1Center, lStart, lDir, distance)) {
        pos = lStart + distance * lDir;
        normal = normalize(pos - sphere1Center);

        // *************
        // diffuse light
        // *************
        float diffuseWighting = max(dot(normalize(lightDir), normal), 0.0);

        // *************
        // specular light
        // *************
        vec3 eyeDirection = normalize(-vPosition.xyz);
        vec3 reflectionDirection = reflect(-lightDir, normal);

        // factor: 32
        float specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 32.0);
        color = ambientColor + diffuseWighting * diffuseColor + specularLightWeighting * specularColor;
        isFloor = false;
        
        return true;
    } else if (intersectPlane(lStart, lDir, distance)) {

        pos = lStart + distance * lDir;

        float scale = 6.0;
        color = mod(abs(floor(pos.x * scale) + floor(pos.z * scale)), 2.0) < 1.0 ? COLOR_BLACK : COLOR_WHITE;
        // 地板反射,改变法线向量
        normal = vec3(0.0, 1.0, 0.0);
        
        isFloor = true;
        
        return true;
    } else {
        // 雾模式下，天空会出现溢出，所以在这里将pos.z设置为-1，这样既不会太白，也不会太黑
        pos = vec3(0.0, 0.0, -4.0);
        return false;
    }
}

void main(void) {

    vec3 cameraDir = normalize(vPosition - cameraPos);
    float pointDistance;
    float distance;
    vec3 color, normal, pos1, pos2, pos3;
    vec3 colorM, colorR;
    bool isFloor;
    if (intersectWorld(cameraPos, cameraDir, pos1, normal, color, pointDistance, isFloor)) {
        
        if (!isFloor || uReflectFloor) {
        
            vec3 cameraDir2 = reflect(cameraDir, normal);
            
            if (intersectWorld(pos1, cameraDir2, pos2, normal, colorM, distance, isFloor)) {
            
                // only reflect light that distance <= 1.5.
                if (distance <= 1.5) {
                
                    // 如果是从白色地板反射到球上的，那么使用加法不足以计算颜色。因为超过1.0的还是白色。所以只能用乘法。
                    // f(x) = x / (1 + x)是增函数，x越大，y越大.y越大，则颜色越浅
                    color *= ((colorM + vec3(0.7)) / 1.7);

                    vec3 cameraDir3 = reflect(cameraDir2, normal);
                    
                    // 计算地板反射到球上，并由球反射到地板的光线
                    if (intersectWorld(pos2, cameraDir3, pos3, normal, colorR, distance, isFloor)) {
                        color += (colorR) * 0.3;
                    }
                }
                
            }
        
        }
    } else {
        color = COLOR_BLACK;
    }

    if (uUseFog) {
        // fogFactor = e^-(z * density)
        // we must convert pos1.z from (-1, 1) to (-1, 0)
        // (result - (-1)) / (0 - (-1)) = (pos.z - (-1)) / 1 - (-1) => result = (pos.z - 1) / 2
        float fogFactor = clamp(exp(((pos1.z - 1.0) / 2.0) * uFogDensity), 0.0, 1.0);//clamp((2.0 - pointDistance) / 2.0, 0.0, 1.0);
        gl_FragColor = mix(fogColor, vec4(color, 1.0), fogFactor);
    } else {
        gl_FragColor = vec4(color, 1.0);
    }
}

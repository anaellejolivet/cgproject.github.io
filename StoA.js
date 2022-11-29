"use strict";

/*
    Morphing between 2 word : "SALUT" and "AHOJ" 
    S -> A (5 rect)
    A -> H (3 rect)
    L -> O (4 rect)
    U -> J (3 rect)
    T -> / (2 rect)
*/

var canvas;
var gl;

var numPositions  = 150;

var positions = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

var flag = false;

var morph = true;

var Param = 0.0;
var tParamLoc;

var deltaT = 1.0;

var vertexColors = [
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),

    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),

    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0),  
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),

    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),

    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),

];

var verticesS = [
    vec3(-0.5, 0.1, 0.5),
    vec3( 0.5, 0.1, 0.5),
    vec3( 0.5, -0.1, 0.5),
    vec3(-0.5, -0.1, 0.5),
    vec3(-0.5, 0.1, -0.5),
    vec3( 0.5, 0.1, -0.5),
    vec3( 0.5, -0.1, -0.5),
    vec3(-0.5, -0.1, -0.5),

    vec3(0.25, 0.0, 0.5),
    vec3(0.5, 0.0, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(0.25, -0.5, 0.5),
    vec3(0.25, 0.0, -0.5),
    vec3(0.5, 0.0, -0.5),
    vec3(0.5, -0.5, -0.5),
    vec3(0.25, -0.5, -0.5),

    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.25, 0.5),
    vec3(-0.5, 0.25, 0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, 0.25, -0.5),
    vec3(-0.5, 0.25, -0.5),

    vec3(-0.5, 0.5, 0.5),
    vec3(-0.25, 0.5, 0.5),
    vec3(-0.25, -0.1, 0.5),
    vec3(-0.5, -0.1, 0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(-0.25, 0.5, -0.5),
    vec3(-0.25, -0.1, -0.5),
    vec3(-0.5, -0.1, -0.5),

    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, -0.25, 0.5),
    vec3(0.45, -0.25, 0.5),
    vec3(0.45, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, -0.25, -0.5),
    vec3(0.45, -0.25, -0.5),
    vec3(0.45, -0.5, -0.5),
]

var verticesA = [
    vec3(-0.15, 0.1, 0.5),
    vec3(0.15, 0.1, 0.5),
    vec3(0.15, -0.1, 0.5),
    vec3(-0.15, -0.1, 0.5),
    vec3(-0.15, 0.1, -0.5),
    vec3(0.15, 0.1, -0.5),
    vec3(0.15, -0.1, -0.5),
    vec3(-0.15, -0.1, -0.5),

    vec3(-0.1, 0.5, 0.5),
    vec3(0.1, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(0.25, -0.5, 0.5),
    vec3(-0.1, 0.5, -0.5),
    vec3(0.1, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
    vec3(0.25, -0.5, -0.5),

    vec3(-0.05, 0.5, 0.5),
    vec3(0.05, 0.5, 0.5),
    vec3(0.05, 0.3, 0.5),
    vec3(-0.05, 0.3, 0.5),
    vec3(-0.05, 0.5, -0.5), 
    vec3(0.05, 0.5, -0.5),
    vec3(0.05, 0.3, -0.5),
    vec3(-0.05, 0.3, -0.5),

    vec3(-0.1, 0.5, 0.5),
    vec3(0.1, 0.5, 0.5),
    vec3(-0.25, -0.5, 0.5),
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.1, 0.5, -0.5),
    vec3(0.1, 0.5, -0.5),
    vec3(-0.25, -0.5, -0.5),
    vec3(-0.5, -0.5, -0.5),

    vec3( 0.3, -0.5, 0.5),
    vec3(0.3, -0.3, 0.5),
    vec3( 0.35, -0.3, 0.5),
    vec3( 0.35, -0.5, 0.5),
    vec3( 0.3, -0.5, -0.5),
    vec3(0.3, -0.3, -0.5),
    vec3( 0.35, -0.3, -0.5),
    vec3( 0.35, -0.5, -0.5),

]

var indices = [
    0, 1, 2, 3, 255,
    3, 2, 6, 7, 255,
    7, 6, 5, 4, 255,
    4, 5, 1, 0, 255,
    0, 4, 7, 3, 255,
    1, 5, 6, 2, 255,

    8, 9, 10, 11, 255,
    11, 10, 14, 15, 255,
    15, 14, 13, 12, 255,
    12, 13, 9, 8, 255,
    8, 12, 15, 11, 255,
    9, 13, 14, 10, 255,

    16, 17, 18, 19, 255,
    19, 18, 22, 23, 255,
    23, 22, 21, 20, 255,
    20, 21, 17, 16, 255,
    16, 20, 23, 19, 255,
    17, 21, 22, 18, 255,

    24, 25, 26, 27, 255,
    27, 26, 30, 31, 255,
    31, 30, 29, 28, 255,
    28, 29, 25, 24, 255,
    24, 28, 31, 27, 255,
    25, 29, 30, 26, 255,

    32, 33, 34, 35, 255,
    32, 36, 37, 33, 255,
    33, 37, 38, 34, 255,
    32, 35, 39, 36, 255,
    34, 35, 39, 38, 255,
    36, 37, 38, 39, 255
];

init();


function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    tParamLoc = gl.getUniformLocation( program, "tParam" );

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesA), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    var uBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesS), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "sPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    


    thetaLoc = gl.getUniformLocation(program, "uTheta");


    //event listeners for buttons

    document.getElementById("Morph").onclick = function () {
        morph = !morph;
        console.log(morph);
    };

    render();
}



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);


    if (morph) {
        Param += 0.015 * deltaT;
        if (Param >= 1.0 || Param <= 0.0) {
            deltaT = -deltaT;
        }
    }

    gl.uniform1f(tParamLoc, Param);

    gl.drawElements(gl.TRIANGLE_FAN, numPositions, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

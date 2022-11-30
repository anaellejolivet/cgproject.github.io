"use strict";

var canvas;
var gl;

var near = 0.3;
var far = 3.75;
var radius = 4.0;
var theta = 0.26;
var phi = 2.3;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);


var cBuffer1;
var cBuffer2;

var vBuffer1;
var vBuffer2;


var positionLoc;
var program;

var numPosCube= 150;
var posCubeArray = [];
var colorsCubeArray = [];
var verticesS = [
    vec4(-0.5, 0.1, 0.5, 1.0),
    vec4( 0.5, 0.1, 0.5, 1.0),
    vec4( 0.5, -0.1, 0.5, 1.0),
    vec4(-0.5, -0.1, 0.5, 1.0),
    vec4(-0.5, 0.1, -0.5, 1.0),
    vec4( 0.5, 0.1, -0.5, 1.0),
    vec4( 0.5, -0.1, -0.5, 1.0),
    vec4(-0.5, -0.1, -0.5, 1.0),

    vec4(0.25, 0.0, 0.5, 1.0),
    vec4(0.5, 0.0, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(0.25, -0.5, 0.5, 1.0),
    vec4(0.25, 0.0, -0.5, 1.0),
    vec4(0.5, 0.0, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
    vec4(0.25, -0.5, -0.5, 1.0),

    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.25, 0.5, 1.0),
    vec4(-0.5, 0.25, 0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.25, -0.5, 1.0),
    vec4(-0.5, 0.25, -0.5, 1.0),

    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(-0.25, 0.5, 0.5, 1.0),
    vec4(-0.25, -0.1, 0.5, 1.0),
    vec4(-0.5, -0.1, 0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(-0.25, 0.5, -0.5, 1.0),
    vec4(-0.25, -0.1, -0.5, 1.0),
    vec4(-0.5, -0.1, -0.5, 1.0),

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.25, 0.5, 1.0),
    vec4(0.45, -0.25, 0.5, 1.0),
    vec4(0.45, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, -0.25, -0.5, 1.0),
    vec4(0.45, -0.25, -0.5, 1.0),
    vec4(0.45, -0.5, -0.5, 1.0),
]

var verticesA = [
    vec4(-0.15, 0.1, 0.5, 1.0),
    vec4(0.15, 0.1, 0.5, 1.0),
    vec4(0.15, -0.1, 0.5, 1.0),
    vec4(-0.15, -0.1, 0.5, 1.0),
    vec4(-0.15, 0.1, -0.5, 1.0),
    vec4(0.15, 0.1, -0.5, 1.0),
    vec4(0.15, -0.1, -0.5, 1.0),
    vec4(-0.15, -0.1, -0.5, 1.0),

    vec4(-0.1, 0.5, 0.5, 1.0),
    vec4(0.1, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(0.25, -0.5, 0.5, 1.0),
    vec4(-0.1, 0.5, -0.5, 1.0),
    vec4(0.1, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
    vec4(0.25, -0.5, -0.5, 1.0),

    vec4(-0.05, 0.5, 0.5, 1.0),
    vec4(0.05, 0.5, 0.5, 1.0),
    vec4(0.05, 0.3, 0.5, 1.0),
    vec4(-0.05, 0.3, 0.5, 1.0),
    vec4(-0.05, 0.5, -0.5, 1.0),
    vec4(0.05, 0.5, -0.5, 1.0),
    vec4(0.05, 0.3, -0.5, 1.0),
    vec4(-0.05, 0.3, -0.5, 1.0),

    vec4(-0.1, 0.5, 0.5, 1.0),
    vec4(0.1, 0.5, 0.5, 1.0),
    vec4(-0.25, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.1, 0.5, -0.5, 1.0),
    vec4(0.1, 0.5, -0.5, 1.0),
    vec4(-0.25, -0.5, -0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),

    vec4( 0.3, -0.5, 0.5, 1.0),
    vec4(0.3, -0.3, 0.5, 1.0),
    vec4( 0.35, -0.3, 0.5, 1.0),
    vec4( 0.35, -0.5, 0.5, 1.0),
    vec4( 0.3, -0.5, -0.5, 1.0),
    vec4(0.3, -0.3, -0.5, 1.0),
    vec4( 0.35, -0.3, -0.5, 1.0),
    vec4( 0.35, -0.5, -0.5, 1.0),

]

var vertexColors = [
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
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),

];

var indicesSA = [
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

var numPosTetra= 85;
var posTetraArray = [];
var colorsTetraArray = [];

var vertexColors2 = [
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

];

var verticesH = [

    vec4(-0.5, 0.5, 0.5, 1.0), 
    vec4(-0.25, 0.5, 0.5, 1.0), 
    vec4(-0.25, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(-0.25, 0.5, -0.5, 1.0),
    vec4(-0.25, -0.5, -0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),

    vec4(0.25, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(0.25, -0.5, 0.5, 1.0),
    vec4(0.25, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
    vec4(0.25, -0.5, -0.5, 1.0),

    vec4(-0.25, 0.1, 0.5, 1.0),
    vec4(0.25, 0.1, 0.5, 1.0),
    vec4(0.25, -0.1, 0.5, 1.0),
    vec4(-0.25, -0.1, 0.5, 1.0),
    vec4(-0.25, 0.1, -0.5, 1.0),
    vec4(0.25, 0.1, -0.5, 1.0),
    vec4(0.25, -0.1, -0.5, 1.0),
    vec4(-0.25, -0.1, -0.5, 1.0),
]

var verticesA2 = [

    vec3(-0.1, 0.5, 0.5), //0
    vec3(0.1, 0.5, 0.5),  //1
    vec3(-0.25, -0.5, 0.5), //2
    vec3(-0.5, -0.5, 0.5), //3
    vec3(-0.1, 0.5, -0.5), //4
    vec3(0.1, 0.5, -0.5), //5
    vec3(-0.25, -0.5, -0.5), //6
    vec3(-0.5, -0.5, -0.5), //7

    vec3(-0.1, 0.5, 0.5), //8
    vec3(0.1, 0.5, 0.5), //9
    vec3(0.5, -0.5, 0.5), //10
    vec3(0.25, -0.5, 0.5), //11
    vec3(-0.1, 0.5, -0.5), //12
    vec3(0.1, 0.5, -0.5), //13
    vec3(0.5, -0.5, -0.5), //14
    vec3(0.25, -0.5, -0.5), //15

    vec3(-0.25, 0.1, 0.5), //16
    vec3(0.25, 0.1, 0.5), //17
    vec3(0.25, -0.1, 0.5), //18
    vec3(-0.25, -0.1, 0.5), //19
    vec3(-0.25, 0.1, -0.5), //20
    vec3(0.25, 0.1, -0.5), //21
    vec3(0.25, -0.1, -0.5), //22
    vec3(-0.25, -0.1, -0.5), //23

]

var indicesHA = [
    0, 1, 2, 3, 255,
    3, 7, 6, 2, 255,
    4, 5, 6, 7, 255,
    0, 4, 5, 1, 255,
    0, 3, 7, 4, 255,
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

];

init();

function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // assign color buffer and vertex buffer for color cube
    cBuffer1 = gl.createBuffer();
    vBuffer1 = gl.createBuffer();

    // assign color buffer and vertex buffer for color tetrahderon
    cBuffer2 = gl.createBuffer();
    vBuffer2 = gl.createBuffer();

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

        // array element buffer

var iBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesSA), gl.STATIC_DRAW);

    // ==== color buffer for cube ==== 
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
    
    
    // ==== bind and send vertex info for cube to vertex shader ====
    projectionMatrix = perspective(fovy, aspect, near, far);
    var S = scale(1,1,1);
    var Tx = translate(-1.0,0,0);
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix,Tx);
    modelViewMatrix = mult(modelViewMatrix,S);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesS), gl.STATIC_DRAW);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawElements(gl.TRIANGLE_FAN, numPosCube, gl.UNSIGNED_BYTE, 0);


            // array element buffer

var dBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesHA), gl.STATIC_DRAW);

    // ==== color buffer for tretrahedron ==== 
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors2), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
    // ==== bind and send vertex info for tretrahedron to vertex shader ====
    var Tx = translate(0.2,0,0);
    var S = scale(1,1,1);
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix,Tx);
    modelViewMatrix = mult(modelViewMatrix,S);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesH), gl.STATIC_DRAW);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawElements(gl.TRIANGLE_FAN, numPosTetra, gl.UNSIGNED_BYTE, 0);
}

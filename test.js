"use strict";

var canvas;
var gl;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

var flag = false;

var morph = false;

var Param = 0.0;
var tParamLoc;

var deltaT = 1.0;
var viewerPos;
var near = 0.3;
var far = 3.75;
var radius = 4.0;
var theta = 0.26;
var phi = 2.3;
var dr = (5.0 * Math.PI) / 180.0;

var fovy = 45.0; // Field-of-view in Y direction angle (in degrees)
var aspect; // Viewport aspect ratio

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var cBuffer1;
var cBuffer2;
var cBuffer3;
var cBuffer4;
var cBuffer5;

var vBuffer1;
var vBuffer2;
var vBuffer3;
var vBuffer4;
var vBuffer5;
var vBuffer6;
var vBuffer7;
var vBuffer8;
var vBuffer9;
var vBuffer10;

var positionLoc;
var program;

/**************************************************************
 * light
 * *************************************************************/
 var lightPosition = vec4(1.0, 0.0, 0.0, .0);
 var lightAmbient = vec4(1.0, 0.8, 0.8, 1.0);
 var lightDiffuse = vec4(0.0, 1.0, 1.0, 1.0);
 var lightSpecular = vec4(0.0, 0.0, 1.0, 1.0);
 
 var materialAmbient  = vec4(0.0 , 1.0 , 1.0 , 1.0);
 var materialDiffuse  = vec4(0.1 , 0.1 , 0.01 , 1.0);
 var materialSpecular = vec4(0.5 , 0.5 , 0.5, 1.0);
 var materialShininess = 12.0;

/****************************************************************
 * S to A
 * ****************************************************************/

var numPosSA = 150;

var positionsArraySA = [];
var normalsArraySA = [];

var verticesS = [
  vec4(-0.5, 0.1, 0.5, 1.0),
  vec4(0.5, 0.1, 0.5, 1.0),
  vec4(0.5, -0.1, 0.5, 1.0),
  vec4(-0.5, -0.1, 0.5, 1.0),
  vec4(-0.5, 0.1, -0.5, 1.0),
  vec4(0.5, 0.1, -0.5, 1.0),
  vec4(0.5, -0.1, -0.5, 1.0),
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
];

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

  vec4(0.3, -0.5, 0.5, 1.0),
  vec4(0.3, -0.3, 0.5, 1.0),
  vec4(0.35, -0.3, 0.5, 1.0),
  vec4(0.35, -0.5, 0.5, 1.0),
  vec4(0.3, -0.5, -0.5, 1.0),
  vec4(0.3, -0.3, -0.5, 1.0),
  vec4(0.35, -0.3, -0.5, 1.0),
  vec4(0.35, -0.5, -0.5, 1.0),
];

/****************************************************************
 * A to H
 * ****************************************************************/

var numPosAH = 85;

var positionsArrayAH = [];
var normalsArrayAH = [];

var verticesA2 = [
  vec4(-0.1, 0.5, 0.5, 1.0),
  vec4(0.1, 0.5, 0.5, 1.0),
  vec4(-0.25, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.1, 0.5, -0.5, 1.0),
  vec4(0.1, 0.5, -0.5, 1.0),
  vec4(-0.25, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),

  vec4(-0.1, 0.5, 0.5, 1.0),
  vec4(0.1, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(0.25, -0.5, 0.5, 1.0),
  vec4(-0.1, 0.5, -0.5, 1.0),
  vec4(0.1, 0.5, -0.5, 1.0),
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
];

/****************************************************************
 * L to O
 * ****************************************************************/

var numPosLO = 119;

var positionsArrayLO = [];
var normalsArrayLO = [];

var verticesL = [
  //bottom
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),

  //left
  vec4(-0.5, -0.25, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.2, 0.5, 0.5, 1.0),
  vec4(-0.2, -0.25, 0.5, 1.0),
  vec4(-0.5, -0.25, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(-0.2, 0.5, -0.5, 1.0),
  vec4(-0.2, -0.25, -0.5, 1.0),

  //top
  vec4(-0.2, 0.25, 0.5, 1.0),
  vec4(-0.2, 0.5, 0.5, 1.0),
  vec4(-0.2, 0.5, 0.5, 1.0),
  vec4(-0.2, 0.25, 0.5, 1.0),
  vec4(-0.2, 0.25, -0.5, 1.0),
  vec4(-0.2, 0.5, -0.5, 1.0),
  vec4(-0.2, 0.5, -0.5, 1.0),
  vec4(-0.2, 0.25, -0.5, 1.0),

  //right
  vec4(0.2, -0.25, 0.5, 1.0),
  vec4(0.2, -0.25, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.2, -0.25, -0.5, 1.0),
  vec4(0.2, -0.25, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
];

var verticesO = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),

  vec4(-0.5, -0.25, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.2, 0.5, 0.5, 1.0),
  vec4(-0.2, -0.25, 0.5, 1.0),
  vec4(-0.5, -0.25, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(-0.2, 0.5, -0.5, 1.0),
  vec4(-0.2, -0.25, -0.5, 1.0),

  vec4(-0.2, 0.25, 0.5, 1.0),
  vec4(-0.2, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.25, 0.5, 1.0),
  vec4(-0.2, 0.25, -0.5, 1.0),
  vec4(-0.2, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.25, -0.5, 1.0),

  vec4(0.2, -0.25, 0.5, 1.0),
  vec4(0.2, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.2, -0.25, -0.5, 1.0),
  vec4(0.2, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
];

/****************************************************************
 * U to J
 * ****************************************************************/

var numPosUJ = 90;

var positionsArrayUJ = [];
var normalsArrayUJ = [];

var verticesU = [
  //bottom
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),

  //left
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.2, 0.5, 0.5, 1.0),
  vec4(-0.2, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(-0.2, 0.5, -0.5, 1.0),
  vec4(-0.2, -0.5, -0.5, 1.0),

  //right
  vec4(0.2, -0.25, 0.5, 1.0),
  vec4(0.2, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.2, -0.25, -0.5, 1.0),
  vec4(0.2, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
];

var verticesJ = [
  //bottom
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),

  //top
  vec4(-0.25, 0.25, 0.5, 1.0),
  vec4(-0.25, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.25, 0.5, 1.0),
  vec4(-0.25, 0.25, -0.5, 1.0),
  vec4(-0.25, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.25, -0.5, 1.0),

  //right
  vec4(0.2, -0.25, 0.5, 1.0),
  vec4(0.2, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.25, 0.5, 1.0),
  vec4(0.2, -0.25, -0.5, 1.0),
  vec4(0.2, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.25, -0.5, 1.0),
];

/****************************************************************
 * T to /
 * ****************************************************************/

var numPosT = 60;

var positionsArrayT = [];
var normalsArrayT = [];

var verticesT = [
  //top
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, 0.25, 0.5, 1.0),
  vec4(0.5, 0.25, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(-0.5, 0.25, -0.5, 1.0),
  vec4(0.5, 0.25, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),

  //middle
  vec4(-0.2, -0.5, 0.5, 1.0),
  vec4(-0.2, 0.25, 0.5, 1.0),
  vec4(0.2, 0.25, 0.5, 1.0),
  vec4(0.2, -0.5, 0.5, 1.0),
  vec4(-0.2, -0.5, -0.5, 1.0),
  vec4(-0.2, 0.25, -0.5, 1.0),
  vec4(0.2, 0.25, -0.5, 1.0),
  vec4(0.2, -0.5, -0.5, 1.0),
];

var vertices = [
  //top
  vec4(-0.5, 0.25, 0.5, 1.0),
  vec4(-0.5, 0.25, 0.5, 1.0),
  vec4(0.5, 0.25, 0.5, 1.0),
  vec4(0.5, 0.25, 0.5, 1.0),
  vec4(-0.5, 0.25, -0.5, 1.0),
  vec4(-0.5, 0.25, -0.5, 1.0),
  vec4(0.5, 0.25, -0.5, 1.0),
  vec4(0.5, 0.25, -0.5, 1.0),

  //middle
  vec4(-0.2, 0.25, 0.5, 1.0),
  vec4(-0.2, 0.25, 0.5, 1.0),
  vec4(0.2, 0.25, 0.5, 1.0),
  vec4(0.2, 0.25, 0.5, 1.0),
  vec4(-0.2, 0.25, -0.5, 1.0),
  vec4(-0.2, 0.25, -0.5, 1.0),
  vec4(0.2, 0.25, -0.5, 1.0),
  vec4(0.2, 0.25, -0.5, 1.0),
];

init();

/**
 * SA
 */

function quadSA(a, b, c, d) {

  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[a]);
  var normal = cross(t1, t2);
  normal = vec3(normal);


  positionsArraySA.push(vertices[a]);
  normalsArraySA.push(normal);
  positionsArraySA.push(vertices[b]);
  normalsArraySA.push(normal);
  positionsArraySA.push(vertices[c]);
  normalsArraySA.push(normal);
  positionsArraySA.push(vertices[a]);
  normalsArraySA.push(normal);
  positionsArraySA.push(vertices[c]);
  normalsArraySA.push(normal);
  positionsArraySA.push(vertices[d]);
  normalsArraySA.push(normal);
}


function colorCubeSA()
{
 quadSA(1, 0, 3, 2);
 quadSA(2, 3, 7, 6);
 quadSA(3, 0, 4, 7);
 quadSA(6, 5, 1, 2);
 quadSA(4, 5, 6, 7);
 quadSA(5, 4, 0, 1);
}

/**
 * AH
 */

function quadAH(a, b, c, d) {

  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[a]);
  var normal = cross(t1, t2);
  normal = vec3(normal);


  positionsArrayAH.push(vertices[a]);
  normalsArrayAH.push(normal);
  positionsArrayAH.push(vertices[b]);
  normalsArrayAH.push(normal);
  positionsArrayAH.push(vertices[c]);
  normalsArrayAH.push(normal);
  positionsArrayAH.push(vertices[a]);
  normalsArrayAH.push(normal);
  positionsArrayAH.push(vertices[c]);
  normalsArrayAH.push(normal);
  positionsArrayAH.push(vertices[d]);
  normalsArrayAH.push(normal);
}


function colorCubeAH()
{
 quadAH(1, 0, 3, 2);
 quadAH(2, 3, 7, 6);
 quadAH(3, 0, 4, 7);
 quadAH(6, 5, 1, 2);
 quadAH(4, 5, 6, 7);
 quadAH(5, 4, 0, 1);
}

/**
 * LO
 */

function quadLO(a, b, c, d) {

  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[a]);
  var normal = cross(t1, t2);
  normal = vec3(normal);


  positionsArrayLO.push(vertices[a]);
  normalsArrayLO.push(normal);
  positionsArrayLO.push(vertices[b]);
  normalsArrayLO.push(normal);
  positionsArrayLO.push(vertices[c]);
  normalsArrayLO.push(normal);
  positionsArrayLO.push(vertices[a]);
  normalsArrayLO.push(normal);
  positionsArrayLO.push(vertices[c]);
  normalsArrayLO.push(normal);
  positionsArrayLO.push(vertices[d]);
  normalsArrayLO.push(normal);
}


function colorCubeLO()
{
 quadLO(1, 0, 3, 2);
 quadLO(2, 3, 7, 6);
 quadLO(3, 0, 4, 7);
 quadLO(6, 5, 1, 2);
 quadLO(4, 5, 6, 7);
 quadLO(5, 4, 0, 1);
}

/**
 * UJ
 */

function quadUJ(a, b, c, d) {

  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[a]);
  var normal = cross(t1, t2);
  normal = vec3(normal);


  positionsArrayUJ.push(vertices[a]);
  normalsArrayUJ.push(normal);
  positionsArrayUJ.push(vertices[b]);
  normalsArrayUJ.push(normal);
  positionsArrayUJ.push(vertices[c]);
  normalsArrayUJ.push(normal);
  positionsArrayUJ.push(vertices[a]);
  normalsArrayUJ.push(normal);
  positionsArrayUJ.push(vertices[c]);
  normalsArrayUJ.push(normal);
  positionsArrayUJ.push(vertices[d]);
  normalsArrayUJ.push(normal);
}


function colorCubeUJ()
{
 quadUJ(1, 0, 3, 2);
 quadUJ(2, 3, 7, 6);
 quadUJ(3, 0, 4, 7);
 quadUJ(6, 5, 1, 2);
 quadUJ(4, 5, 6, 7);
 quadUJ(5, 4, 0, 1);
}

/**
 * T
 */

function quadT(a, b, c, d) {

  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[a]);
  var normal = cross(t1, t2);
  normal = vec3(normal);


  positionsArrayT.push(vertices[a]);
  normalsArrayT.push(normal);
  positionsArrayT.push(vertices[b]);
  normalsArrayT.push(normal);
  positionsArrayT.push(vertices[c]);
  normalsArrayT.push(normal);
  positionsArrayT.push(vertices[a]);
  normalsArrayT.push(normal);
  positionsArrayT.push(vertices[c]);
  normalsArrayT.push(normal);
  positionsArrayT.push(vertices[d]);
  normalsArrayT.push(normal);
}


function colorCubeT()
{
 quadT(1, 0, 3, 2);
 quadT(2, 3, 7, 6);
 quadT(3, 0, 4, 7);
 quadT(6, 5, 1, 2);
 quadT(4, 5, 6, 7);
 quadT(5, 4, 0, 1);
}

function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  gl.viewport(0, 0, canvas.width, canvas.height);

  aspect = canvas.width / canvas.height;

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);


  tParamLoc = gl.getUniformLocation(program, "tParam");

  // assign color buffer and vertex buffer for S to A
  cBuffer1 = gl.createBuffer();
  vBuffer1 = gl.createBuffer();
  vBuffer2 = gl.createBuffer();

  // assign color buffer and vertex buffer for A to H
  cBuffer2 = gl.createBuffer();
  vBuffer3 = gl.createBuffer();
  vBuffer4 = gl.createBuffer();

  // assign color buffer and vertex buffer for L to O
  cBuffer3 = gl.createBuffer();
  vBuffer5 = gl.createBuffer();
  vBuffer6 = gl.createBuffer();

  // assign color buffer and vertex buffer for U to J
  cBuffer4 = gl.createBuffer();
  vBuffer7 = gl.createBuffer();
  vBuffer8 = gl.createBuffer();

  // assign color buffer and vertex buffer for T
  cBuffer5 = gl.createBuffer();
  vBuffer9 = gl.createBuffer();
  vBuffer10 = gl.createBuffer();
  

  modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

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

  eye = vec3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );

  if (morph) {
    Param += 0.015 * deltaT;
    if (Param >= 1.0 || Param <= 0.0) {
      deltaT = -deltaT;
    }
    console.log(Param);
  }

  gl.uniform1f(tParamLoc, Param);

  /****************************************************************
   * S to A
   * ****************************************************************/
   colorCubeSA();

   var nBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArraySA), gl.STATIC_DRAW);

   var normalLoc = gl.getAttribLocation(program, "aNormal");
   gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(normalLoc);

  // ==== bind and send vertex info for cube to vertex shader ====
  projectionMatrix = perspective(fovy, aspect, near, far);
  var S = scale(0.5, 0.5, 1);
  var Tx = translate(-1.2, 0, 0);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, Tx);
  modelViewMatrix = mult(modelViewMatrix, S);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesS), gl.STATIC_DRAW);

  positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesA), gl.STATIC_DRAW);

  positionLoc = gl.getAttribLocation(program, "bPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.drawElements(gl.TRIANGLE_FAN, numPosSA, gl.UNSIGNED_BYTE, 0);

  /****************************************************************
 * A to H
 * ****************************************************************/
   colorCubeAH();

   var nBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArrayAH), gl.STATIC_DRAW);

   var normalLoc = gl.getAttribLocation(program, "aNormal");
   gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(normalLoc);
  // ==== bind and send vertex info for tretrahedron to vertex shader ====
  var S = scale(0.5, 0.5, 1);
  var Tx = translate(-0.6, 0, 0);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, Tx);
  modelViewMatrix = mult(modelViewMatrix, S);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesA2), gl.STATIC_DRAW);

  positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer4);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesH), gl.STATIC_DRAW);

  positionLoc = gl.getAttribLocation(program, "bPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  gl.drawElements(gl.TRIANGLE_FAN, numPosAH, gl.UNSIGNED_BYTE, 0);

  /****************************************************************
 * L to O
 * ****************************************************************/

   colorCubeLO();

   var nBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArrayLO), gl.STATIC_DRAW);

   var normalLoc = gl.getAttribLocation(program, "aNormal");
   gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(normalLoc);
 
   // ==== bind and send vertex info for cube to vertex shader ====
   projectionMatrix = perspective(fovy, aspect, near, far);
   var S = scale(0.5, 0.5, 1);   
   var Tx = translate(0, 0, 0);
   modelViewMatrix = lookAt(eye, at, up);
   modelViewMatrix = mult(modelViewMatrix, Tx);
   modelViewMatrix = mult(modelViewMatrix, S);
 
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer5);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesL), gl.STATIC_DRAW);
 
   positionLoc = gl.getAttribLocation(program, "aPosition");
   gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLoc);
 
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer6);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesO), gl.STATIC_DRAW);
 
   positionLoc = gl.getAttribLocation(program, "bPosition");
   gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLoc);
 
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
   gl.drawElements(gl.TRIANGLE_FAN, numPosLO, gl.UNSIGNED_BYTE, 0);

  /****************************************************************
 * U to J
 * ****************************************************************/

   colorCubeUJ();

   var nBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArrayUJ), gl.STATIC_DRAW);

   var normalLoc = gl.getAttribLocation(program, "aNormal");
   gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(normalLoc);
 
   // ==== bind and send vertex info for cube to vertex shader ====
   projectionMatrix = perspective(fovy, aspect, near, far);
   var S = scale(0.5, 0.5, 1);
   var Tx = translate(0.6, 0, 0);
   modelViewMatrix = lookAt(eye, at, up);
   modelViewMatrix = mult(modelViewMatrix, Tx);
   modelViewMatrix = mult(modelViewMatrix, S);
 
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer7);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesU), gl.STATIC_DRAW);
 
   positionLoc = gl.getAttribLocation(program, "aPosition");
   gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLoc);
 
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer8);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesJ), gl.STATIC_DRAW);
 
   positionLoc = gl.getAttribLocation(program, "bPosition");
   gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLoc);
 
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
   gl.drawElements(gl.TRIANGLE_FAN, numPosUJ, gl.UNSIGNED_BYTE, 0);

  /****************************************************************
 * T to /
 * ****************************************************************/

   colorCubeT();

   var nBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArrayT), gl.STATIC_DRAW);

   var normalLoc = gl.getAttribLocation(program, "aNormal");
   gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(normalLoc);
 
   // ==== bind and send vertex info for cube to vertex shader ====
   projectionMatrix = perspective(fovy, aspect, near, far);
   var S = scale(0.5, 0.5, 1);
   var Tx = translate(1.2, 0, 0);
   modelViewMatrix = lookAt(eye, at, up);
   modelViewMatrix = mult(modelViewMatrix, Tx);
   modelViewMatrix = mult(modelViewMatrix, S);
 
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer9);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesT), gl.STATIC_DRAW);
 
   positionLoc = gl.getAttribLocation(program, "aPosition");
   gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLoc);
 
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer10);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
 
   positionLoc = gl.getAttribLocation(program, "bPosition");
   gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLoc);
 
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
   gl.drawElements(gl.TRIANGLE_FAN, numPosT, gl.UNSIGNED_BYTE, 0);

   viewerPos = vec3(0.0, 0.0, -20.0);

    projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
       specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"), materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"),
       false, flatten(projectionMatrix));
       
  requestAnimationFrame(render);
}

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

var morph = true;

var Param = 0.0;
var tParamLoc;

var deltaT = 0.8;
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
var lightAmbient = vec4(0.0, 0.8, 0.8, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
var lightSpecular = vec4(0.0, 0.0, 1.0, 1.0);

var materialAmbient  = vec4(0.0 , 1.0 , 1.0 , 1.0);
var materialDiffuse  = vec4(0.0 , 0.1 , 0.3 , 1.0);
var materialSpecular = vec4(0.5 , 0.5 , 0.5, 1.0);
var materialShininess = 36.0;

/****************************************************************
 * S to A
 * ****************************************************************/

 var numPosSA = 150;

 var vertexColorsSA = [
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

var indicesSA = [
  0, 1, 2, 3, 255, 3, 2, 6, 7, 255, 7, 6, 5, 4, 255, 4, 5, 1, 0, 255, 0, 4, 7,
  3, 255, 1, 5, 6, 2, 255,

  8, 9, 10, 11, 255, 11, 10, 14, 15, 255, 15, 14, 13, 12, 255, 12, 13, 9, 8,
  255, 8, 12, 15, 11, 255, 9, 13, 14, 10, 255,

  16, 17, 18, 19, 255, 19, 18, 22, 23, 255, 23, 22, 21, 20, 255, 20, 21, 17, 16,
  255, 16, 20, 23, 19, 255, 17, 21, 22, 18, 255,

  24, 25, 26, 27, 255, 27, 26, 30, 31, 255, 31, 30, 29, 28, 255, 28, 29, 25, 24,
  255, 24, 28, 31, 27, 255, 25, 29, 30, 26, 255,

  32, 33, 34, 35, 255, 32, 36, 37, 33, 255, 33, 37, 38, 34, 255, 32, 35, 39, 36,
  255, 34, 35, 39, 38, 255, 36, 37, 38, 39, 255,
];

/****************************************************************
 * A to H
 * ****************************************************************/

var numPosAH = 85;

var vertexColorsAH = [
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

var indicesAH = [
  0, 1, 2, 3, 255, 3, 7, 6, 2, 255, 4, 5, 6, 7, 255, 0, 4, 5, 1, 255, 0, 3, 7,
  4, 255, 1, 5, 6, 2, 255,

  8, 9, 10, 11, 255, 11, 10, 14, 15, 255, 15, 14, 13, 12, 255, 12, 13, 9, 8,
  255, 8, 12, 15, 11, 255, 9, 13, 14, 10, 255,

  16, 17, 18, 19, 255, 19, 18, 22, 23, 255, 23, 22, 21, 20, 255, 20, 21, 17, 16,
  255, 16, 20, 23, 19, 255, 17, 21, 22, 18, 255,
];

/****************************************************************
 * L to O
 * ****************************************************************/

var numPosLO = 119;

var vertexColorsLO = [
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

var indicesLO = [
  0, 1, 2, 3, 255, 3, 2, 6, 7, 255, 7, 6, 5, 4, 255, 4, 5, 1, 0, 255, 0, 4, 7,
  3, 255, 1, 5, 6, 2, 255,

  8, 9, 10, 11, 255, 11, 10, 14, 15, 255, 15, 14, 13, 12, 255, 12, 13, 9, 8,
  255, 8, 12, 15, 11, 255, 9, 13, 14, 10, 255,

  16, 17, 18, 19, 255, 19, 18, 22, 23, 255, 23, 22, 21, 20, 255, 20, 21, 17, 16,
  255, 16, 20, 23, 19, 255, 17, 21, 22, 18, 255,

  24, 25, 26, 27, 255, 27, 26, 30, 31, 255, 31, 30, 29, 28, 255, 28, 29, 25, 24,
  255, 24, 28, 31, 27, 255, 25, 29, 30, 26, 255,
];

/****************************************************************
 * U to J
 * ****************************************************************/

var numPosUJ = 90;

var vertexColorsUJ = [
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

var indicesUJ = [
  0, 1, 2, 3, 255, 3, 2, 6, 7, 255, 7, 6, 5, 4, 255, 4, 5, 1, 0, 255, 0, 4, 7,
  3, 255, 1, 5, 6, 2, 255,

  8, 9, 10, 11, 255, 11, 10, 14, 15, 255, 15, 14, 13, 12, 255, 12, 13, 9, 8,
  255, 8, 12, 15, 11, 255, 9, 13, 14, 10, 255,

  16, 17, 18, 19, 255, 19, 18, 22, 23, 255, 23, 22, 21, 20, 255, 20, 21, 17, 16,
  255, 16, 20, 23, 19, 255, 17, 21, 22, 18, 255,
];

/****************************************************************
 * T to /
 * ****************************************************************/

var numPosT = 60;

var vertexColorsT = [
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
  vec4(-0.5, 0.15, 0.5, 1.0),
  vec4(-0.5, 0.15, 0.5, 1.0),
  vec4(0.5, 0.15, 0.5, 1.0),
  vec4(0.5, 0.15, 0.5, 1.0),
  vec4(-0.5, 0.15, -0.5, 1.0),
  vec4(-0.5, 0.15, -0.5, 1.0),
  vec4(0.5, 0.15, -0.5, 1.0),
  vec4(0.5, 0.15, -0.5, 1.0),

  //middle
  vec4(-0.2, 0.15, 0.5, 1.0),
  vec4(-0.2, 0.15, 0.5, 1.0),
  vec4(0.2, 0.15, 0.5, 1.0),
  vec4(0.2, 0.15, 0.5, 1.0),
  vec4(-0.2, 0.15, -0.5, 1.0),
  vec4(-0.2, 0.15, -0.5, 1.0),
  vec4(0.2, 0.15, -0.5, 1.0),
  vec4(0.2, 0.15, -0.5, 1.0),
];

var indicesT = [
  0, 1, 2, 3, 255, 3, 2, 6, 7, 255, 7, 6, 5, 4, 255, 4, 5, 1, 0, 255, 0, 4, 7,
  3, 255, 1, 5, 6, 2, 255,

  8, 9, 10, 11, 255, 11, 10, 14, 15, 255, 15, 14, 13, 12, 255, 12, 13, 9, 8,
  255, 8, 12, 15, 11, 255, 9, 13, 14, 10, 255,
];

init();

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
  // array element buffer

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(indicesSA),
    gl.STATIC_DRAW
  );

  // ==== color buffer for cube ====
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColorsSA), gl.STATIC_DRAW);

  var colorLoc = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);

  // ==== bind and send vertex info for cube to vertex shader ====
  projectionMatrix = perspective(fovy, aspect, near, far);
  var S = scale(0.4, 0.4, 1);
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
  // array element buffer

  var dBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(indicesAH),
    gl.STATIC_DRAW
  );

  // ==== color buffer for tretrahedron ====
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColorsAH), gl.STATIC_DRAW);

  var colorLoc = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);
  
  // ==== bind and send vertex info for tretrahedron to vertex shader ====
  var S = scale(0.4, 0.4, 1);
  var Tx = translate(-0.7, 0, 0);
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

   var kBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, kBuffer);
   gl.bufferData(
     gl.ELEMENT_ARRAY_BUFFER,
     new Uint8Array(indicesLO),
     gl.STATIC_DRAW
   );
 
   // ==== color buffer for cube ====
   var cBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColorsLO), gl.STATIC_DRAW);
 
   var colorLoc = gl.getAttribLocation(program, "aColor");
   gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(colorLoc);
 
   // ==== bind and send vertex info for cube to vertex shader ====
   projectionMatrix = perspective(fovy, aspect, near, far);
   var S = scale(0.4, 0.4, 1);   
   var Tx = translate(-0.2, 0, 0);
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

   var lBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lBuffer);
   gl.bufferData(
     gl.ELEMENT_ARRAY_BUFFER,
     new Uint8Array(indicesUJ),
     gl.STATIC_DRAW
   );
 
   // ==== color buffer for cube ====
   var cBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColorsUJ), gl.STATIC_DRAW);
 
   var colorLoc = gl.getAttribLocation(program, "aColor");
   gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(colorLoc);
 
   // ==== bind and send vertex info for cube to vertex shader ====
   projectionMatrix = perspective(fovy, aspect, near, far);
   var S = scale(0.4, 0.4, 1);
   var Tx = translate(0.3, 0, 0);
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

   var mBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mBuffer);
   gl.bufferData(
     gl.ELEMENT_ARRAY_BUFFER,
     new Uint8Array(indicesT),
     gl.STATIC_DRAW
   );
    
       
   // ==== color buffer for cube ====
   var cBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColorsT), gl.STATIC_DRAW);
 
   var colorLoc = gl.getAttribLocation(program, "aColor");
   gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(colorLoc);
 
   // ==== bind and send vertex info for cube to vertex shader ====
   projectionMatrix = perspective(fovy, aspect, near, far);
   var S = scale(0.4, 0.4, 1);
   var Tx = translate(0.8, 0, 0);
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

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

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
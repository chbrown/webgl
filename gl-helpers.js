"use strict";
/*jslint indent: 2, debug: true, devel: true, browser: true */
/*globals $, Event, CustomEvent */
Math.TAU = 2.0 * Math.PI;

function getShader(gl, selector) {
  var el = document.querySelector(selector);
  var type = el.getAttribute('type');
  var src = el.innerText;

  var shader = null;
  if (type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else if (type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else {
    throw new Error('Unsupported shader type: ' + type);
  }

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  // Ensure that it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Could not compile shader: ' + gl.getShaderInfoLog(shader));
  }

  return shader;
}

function getShaderProgram(gl, selectors) {
  /** calls out to getShader with each selector, and pulls them together as
  one WebGL Program, attaching each Shader after compiling, then linking and
  using the Program on the current WebGL context.
  */
  var program = gl.createProgram();

  selectors.forEach(function(selector) {
    var shader = getShader(gl, selector);
    gl.attachShader(program, shader);
  });

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Could not compile program: ' + gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  return program;
}

function createBuffer3D(gl, vertices) {
  var buffer = gl.createBuffer();
  // buffer.itemSize = 3;
  // buffer.numItems = vertices.length / 3;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return buffer;
}

function initializeGL(gl) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // enable depth testing
  gl.enable(gl.DEPTH_TEST);
  // less-than-or-equal so that near things obscure far things
  gl.depthFunc(gl.LEQUAL);

  // Set clear color to...
  // gl.clearColor(0.0, 0.0, 0.0, 1.0); // black, fully opaque
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // nearly black, fully opaque
  // gl.clearColor(0.5, 0.5, 0.5, 1.0); // half-gray
}

// this is triggered after readyState == 'interactive', with the first canvas on the page.
document.addEventListener('canvasready', function(ev) {
  // log('canvasready', ev);
  var canvas = ev.detail;
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (gl) {
    initializeGL(gl);
    var gl_event = new CustomEvent('glready', {detail: gl});
    document.dispatchEvent(gl_event);
  }
  else {
    throw new Error('Your browser does not support WebGL.');
  }
});


// MDN for `document` https://developer.mozilla.org/en-US/docs/Web/API/Document
document.addEventListener('readystatechange', function(ev) {
  // log('readystatechange', document.readyState);
  if (document.readyState == 'interactive') {
    // detail is a magic word in the event constructor
    var domready = new CustomEvent('domready', {detail: document});
    document.dispatchEvent(domready);

    // we hope there's a canvas to get.
    var el = document.querySelector('canvas');
    if (el) {
      var canvasready = new CustomEvent('canvasready', {detail: el});
      document.dispatchEvent(canvasready);
    }
    else {
      console.error('No canvas available on page load, giving up.');
    }
  }
});

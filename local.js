/*jslint browser: true, devel: true */
Math.TAU = 2.0 * Math.PI;

/**
Return `x` unchanged unless it falls outside the `min` / `max` bounds, in which
case return the value of the bound that it exceeds.

    squeeze(0,  0.75, 1) == 0.75
    squeeze(0,  5   , 1) == 1
    squeeze(0, -5   , 1) == 0
*/
function squeeze(min, x, max) {
  return Math.max(min, Math.min(max, x));
}

/**
Randomly shift each value in `xs` by at most +/- range, but constrain all values
to within the range [0.0, 1.0].
*/
function jitter(xs, range) {
  for (var i = 0; i < xs.length; i++) {
    var offset = (Math.random() - 0.5) * range;
    xs[i] = squeeze(0.0, xs[i] + offset, 1.0);
  }
}


/**
This will call the callback with the raw WebGLRenderingContext of the first
<canvas> element on the page as soon as it is available, potentially
synchronously.
*/
function getWebGLRenderingContext(callback) {
  function _ready() {
    // presumably there's a canvas somewhere
    var canvas_element = document.querySelector('canvas');
    var canvas_context = canvas_element.getContext('webgl');
    callback(canvas_context);
  }
  if (document.readyState == 'interactive' || document.readyState == 'complete') {
    _ready();
  }
  else {
    document.addEventListener('readystatechange', function() {
      // this function will be called twice; once when readyState ==
      // 'interactive', and again when readyState == 'complete'. We only want
      // to trigger the callback once, so we process only on the first of these.
      if (document.readyState == 'interactive') {
        _ready();
      }
    });
  }
}

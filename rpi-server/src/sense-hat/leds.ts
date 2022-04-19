const matrix = require('node-sense-hat').Leds;

const O = [0, 0, 0]//[0,128,128];
const X = [255, 20, 147];

const cross = [
  O, O, O, X, X, O, O, O,
  O, O, X, O, O, X, O, O,
  O, O, O, O, O, X, O, O,
  O, O, O, O, X, O, O, O,
  O, O, O, X, O, O, O, O,
  O, O, O, X, O, O, O, O,
  O, O, O, O, O, O, O, O,
  O, O, O, X, O, O, O, O
];

matrix.setPixels(cross);
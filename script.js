'use strict'

function Calc() {
  this.input = '',
  this.temp = '',
  this.result = '',
  this.modifier = '',
  this.tempModifier = ''
}

Calc.prototype.display = function (location, data) {
  // if (data.length > 12) this.error();
  $(location).html(data);
}

Calc.prototype.getDisplay = function(location) {
  return $(location).html();
}

Calc.prototype.scientificNotation = function(x) {
  if (x.toString().length > 12) {
    return parseFloat(x).toExponential(11);
  } else return x;
}

Calc.prototype.calculate = function () {
  if (this.modifier === '+') this.result = parseFloat(this.temp) + parseFloat(this.input);
  else if (this.modifier === '-') this.result = parseFloat(this.temp) - (this.input);
  else if (this.modifier === '*') this.result = parseFloat(this.temp) * parseFloat(this.input);
  else if (this.modifier === '/') this.result = parseFloat(this.temp) / parseFloat(this.input);
    /* For equals with no modifier -> Keep equals logic simpler */
  else this.result = this.input;
  this.result = this.scientificNotation(this.result);
}

Calc.prototype.inputter = function(x) {
    /* Initialize input for concat */
    if (!this.input) {
    this.input = x;
    this.display('#result', this.input);
    /* Start new calculation with new input */
  } else if (this.input && this.temp && this.tempModifier) {
    this.temp = '';
    this.input = x;
    this.tempModifier = '';
    this.display('#result', this.input);
    /* Don't allow multiple decimals */
  } else if (this.input.indexOf('.') !== -1 && x === '.') {
    this.display('#result', this.input);
    /* Concat */
  } else if (this.input) {
    this.input += x;
    this.input = this.scientificNotation(this.input);
    this.display('#result', this.input);
  }
}

Calc.prototype.modify = function(a) {
  if (!this.modifier) {
    this.temp = this.input;
    this.input = '';
    var html = this.getDisplay('#result');
    if (html.indexOf(a) !== -1); // Prevent double display of modifiers
    else html += a;
    this.display('#result', html);
    this.modifier = a;
    this.tempModifier = '';
  // } else if (this.modifier === a && this.temp === '') {
    // this.modifier = a;
  } else if (this.modifier && this.input && this.temp) {
    this.modifier = a;
    this.calculate();
    this.tempModifier = '';
    this.temp = this.result;
    this.input = '';
    this.result = '';
  } else {
    this.calculate();
    this.temp = this.input;
    this.input = this.result;
    this.modifier = a;
    this.tempModifier = '';
    var html = this.getDisplay('#result');
    if (html.indexOf(a) !== -1);
    else html += a;
    this.display('#result', html);
    this.result = '';
  }
}

Calc.prototype.equaliser = function() {
  if (this.tempModifier) { // For multiple repetitions of equals button
    this.modifier = this.tempModifier;
    /* Reverse temp/input for correct number order - Need to add Order of Operations */
    var temp = this.temp;
    this.temp = this.input;
    this.input = temp;
    this.calculate();
    /* Switch back => Ready for chaining */
    this.temp = this.input;
    this.input = this.result;
    $('#temp-display').html('');
    this.display('#result', this.result);
    /* Clear states */
    this.modifier = '';
    this.result = '';
  } else if (this.modifier) {
    this.calculate();
    this.tempModifier = this.modifier;
    this.modifier = ''; // Hold modifier in memory
    this.temp = this.input; // Hold input in memory
    this.input = this.result;
    $('#temp-display').html('');
    this.display('#result', this.result);
    this.result = '';
  }
}

Calc.prototype.plusOrMinus = function() {
  if (parseFloat(this.input) > 1) {
    var html = this.getDisplay('#result');
    html = "-" + html;
    this.display('#result', html);
    this.input -= this.input * 2;
  } else {
    var arr = this.getDisplay('#result').split('')
    arr.shift();
    var html = arr.join('');
    this.display('#result', html);
    this.input += this.input * -2;        
  }
}
Calc.prototype.squarer = function(x) {
  this.input = Math.pow(parseFloat(this.input), 2);
  this.display('#result', this.input);
}

Calc.prototype.error = function() {
  this.input = '';
  this.temp = '',
  this.result = '';
  this.modifier = '';
  this.tempModifier = '';
  $('#temp-display').html('');
  this.display('#result', 'ERROR');
}

Calc.prototype.allClear = function () {
  this.input = '';
  this.temp = '',
  this.result = '';
  this.modifier = '';
  this.tempModifier = '';
  this.display('#result', '0');
}

Calc.prototype.clear = function () {
  this.input = '';
  this.display('#result', '0');
}

// Diagnostic function - Print object to console

Calc.prototype.printer = function() {
  console.log('result' + this.result);
  console.log('temp' + this.temp);
  console.log('input' + this.input);
  console.log('modifier' + this.modifier);
  console.log('tempModifier' + this.tempModifier);
  console.log('.........');
}

function inputNum() {
  // $(document).ready(function () {
    for (let i = 0; i < 10; i ++) {
      $('#' + i).click(function() {
        newCalc.inputter(i);
      });
    }
    $('#decimal').click(function() {
      newCalc.inputter('.');
    });
    $('#plus-or-minus').click(function() {
      newCalc.plusOrMinus();
    });
    $('#plus').click(function() {
      newCalc.modify('+');
    });
    $('#minus').click(function() {
      newCalc.modify('-');
    });
    $('#multiply').click(function() {
      newCalc.modify('*');
    });
    $('#divide').click(function() {
      newCalc.modify('/');
    });    
    $('#equals').click(function() {
      newCalc.equaliser();
    });
    $('#squared').click(function() {
      newCalc.squarer();
    });    
    $('#all-clear').click(function() {
      newCalc.allClear();
    });
    $('#clear').click(function() {
      newCalc.clear();
    });
  // });
}

var newCalc = new Calc();

$(document).ready(function() {
  newCalc.display('#result', '0');
  inputNum();
});
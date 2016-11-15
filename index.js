/**
 * Module dependencies.
 */

const mocha = require('mocha');
const inherits = mocha.utils.inherits;
const Base = mocha.reporters.Base;

exports = module.exports = Wasp;

const asciWasp = [
  '           ____        ',
  '          /    \\       ',
  '         | o  o |      ',
  '    ____  \\    / ____  ',
  '    \\   \\/     \\/   /  ',
  '    /   _|     |_   \\  ',
  '   |_^_/  \\    / \\_^_| ',
  '          /   /        ',
  '         /___/         ',
  '                       ',
];

function Wasp(runner) {
  Base.call(this, runner);


  this.firstDraw = true;
  this.colorIndex = 0;
  this.rainbowColors = this.generateColors();
  this.tick = 0;

  runner.on('start', () => {
    Base.cursor.hide();
    this.draw();
  });

  runner.on('pending', () => this.draw());
  runner.on('pass', () => this.draw());
  runner.on('fail', () => this.draw());

  runner.on('end', () => {
    Base.cursor.show();
    this.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Wasp, Base);

/**
 * Draw the nyan cat
 *
 * @api private
 */

Wasp.prototype.draw = function() {
  this.drawWasp();
  this.drawScoreboard();
  this.tick = !this.tick;
};


Wasp.prototype.drawWasp = function() {
  if (!this.firstDraw) {
    this.cursorUp(asciWasp.length + 1);
  }
  this.firstDraw = false;

  asciWasp.forEach((waspLine) => {
    const color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
    const colorString = '\u001b[38;5;' + color + 'm' + waspLine + '\u001b[0m';
    this.colorIndex += 1;

    write((this.tick ? ' ' : '') + colorString);
    write('\n');
  });
}

Wasp.prototype.drawScoreboard = function() {
  function draw(type, n) {
    write(Base.color(type, n));
    write(' ');
  }

  draw('green', `Passing: ${this.stats.passes}`);
  draw('fail', `Failing: ${this.stats.failures}`);
  draw('pending', `Pending ${this.stats.pending}`);
  write('\n');
};

Wasp.prototype.cursorUp = function(n) {
  write('\u001b[' + n + 'A');
};

Wasp.prototype.generateColors = function() {
  const colors = [];

  for (let i = 0; i < (6 * 7); i++) {
    const pi3 = Math.floor(Math.PI / 3);
    const n = (i * (1.0 / 6));
    const r = Math.floor(3 * Math.sin(n) + 3);
    const g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    const b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors.push(36 * r + 6 * g + b + 16);
  }

  return colors;
};


function write(string) {
  process.stdout.write(string);
}

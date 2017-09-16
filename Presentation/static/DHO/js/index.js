'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*------------------------------*\
|* Springs
\*------------------------------*/

// Formula for updating the wave was taken from
// http://jsfiddle.net/phil_mcc/sXmpD/8/#run
// Also see: https://gamedev.stackexchange.com/a/45247

// Resolution of simulation
var NUM_POINTS = 30;
// Spring constant for forces applied by adjacent points
var SPRING_CONSTANT = 0.004;
// Sprint constant for force applied to baseline
var SPRING_CONSTANT_BASELINE = 0.005;
// Damping to apply to speed changes
var DAMPING = 0.981;
// Draw radius for wave points
var POINT_RADIUS = 4;
// Mass
var POINT_MASS = 0.5;

/*------------------------------*\
|* Main Canvas
\*------------------------------*/

var Canvas = function () {
    function Canvas() {
        _classCallCheck(this, Canvas);

        // setup a canvas
        this.canvas = document.getElementById('canvas');
        this.dpr = window.devicePixelRatio || 1;
        // this.dpr = 1;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.dpr, this.dpr);

        this.mouse = {
            x: 0,
            y: 0,
            mousedown: false
        };

        this.setCanvasSize = this.setCanvasSize.bind(this);
        this.handleMousedown = this.handleMousedown.bind(this);
        this.handleMouseup = this.handleMouseup.bind(this);
        this.handleMouse = this.handleMouse.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.render = this.render.bind(this);

        this.setCanvasSize();
        this.setupListeners();

        this.constructWave();
        this.triggerWave(this.canvas.width / 2, this.canvas.height);

        this.tick = 0;
        this.render();
    }

    Canvas.prototype.constructWave = function constructWave() {
        var padding = 60 * this.dpr;
        var points = NUM_POINTS;

        var y = this.canvas.height / 2;

        var p1 = new Point(padding, y);

        var p2 = new Point(this.canvas.width - padding, y);

        this.wave = new Wave(points, p1, p2);
    };

    Canvas.prototype.setupListeners = function setupListeners() {
        window.addEventListener('resize', this.setCanvasSize);
        window.addEventListener('mousedown', this.handleMousedown);
        window.addEventListener('mouseup', this.handleMouseup);
        window.addEventListener('mousemove', this.handleMouse);
        window.addEventListener('click', this.handleClick);
    };

    Canvas.prototype.handleClick = function handleClick(event) {
        // const x = event.clientX * this.dpr;
        // const y = event.clientY * this.dpr;
        // this.mouse.x = x;
        // this.mouse.y = y;
    };

    Canvas.prototype.handleMousedown = function handleMousedown(event) {
        this.mouse.mousedown = true;
    };

    Canvas.prototype.handleMouseup = function handleMouseup(event) {
        this.mouse.mousedown = false;
    };

    Canvas.prototype.handleMouse = function handleMouse(event) {
        var x = event.clientX * this.dpr;
        var y = event.clientY * this.dpr;
        this.mouse.x = x;
        this.mouse.y = y;
    };

    Canvas.prototype.triggerWave = function triggerWave(x, y) {
        var closestPoint = {};
        var closestDistance = -1;

        var points = this.wave.points;
        var idx = 0;

        for (var n = 0; n < points.length; n++) {
            var p = points[n];
            var distance = Math.abs(x - p.x);

            if (closestDistance === -1) {
                closestPoint = p;
                closestDistance = distance;
                idx = n;
            } else if (distance <= closestDistance) {
                closestPoint = p;
                closestDistance = distance;
                idx = n;
            }
        }

        var halfHeight = this.canvas.height / 2;
        // update the wave point closest to the mouse to start a wave

        var dy = y - halfHeight; // delta y from baseline

        var spread = 4; // number of points to affect from closest point
        var mod = (idx - spread) % points.length; // modulus
        var start = mod < 0 ? points.length + mod : mod; // starting idx accounting for negatives
        var length = spread * 2 + 1; // number of points total

        var rad = 0; // start radian
        var radInc = Math.PI / length; // radians bases on total length

        for (var _n = 0; _n < length; _n++) {
            var i = (start + _n) % points.length;
            var point = points[i];
            var pow = Math.sin(rad) * dy + halfHeight; // power determined by delta y from baseline
            point.y = pow;
            rad += radInc;
        }
    };

    Canvas.prototype.setCanvasSize = function setCanvasSize() {
        this.canvas.width = window.innerWidth * this.dpr;
        this.canvas.height = window.innerHeight * this.dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        this.constructWave();
    };

    Canvas.prototype.drawBackground = function drawBackground() {
        var gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#a6c1ee');
        gradient.addColorStop(1, '#00ecbc');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Canvas.prototype.drawText = function drawText() {
        var size = this.canvas.width / 10;
        this.ctx.font = 'bold ' + size + 'px Futura';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Springs', this.canvas.width / 2, this.canvas.height / 2 - size / 2);
    };

    Canvas.prototype.drawCurve = function drawCurve() {
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 3 * this.dpr;
        this.ctx.strokeStyle = '#b224ef';

        this.ctx.beginPath();
        this.ctx.moveTo(this.wave.points[0].x, this.wave.points[0].y);

        for (var k = 0; k < this.wave.points.length - 1; k++) {

            var p1 = this.wave.points[k];
            var p2 = this.wave.points[k + 1];

            var cpx = (p1.x + p2.x) / 2;
            var cpy = (p1.y + p2.y) / 2;

            if (k === this.wave.points.length - 2) {
                this.ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
            } else {
                this.ctx.quadraticCurveTo(p1.x, p1.y, cpx, cpy);
            }
        }

        this.ctx.stroke();
    };

    Canvas.prototype.drawSpring = function drawSpring() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = 3 * this.dpr;
        this.ctx.strokeStyle = '#8c6eef';

        for (var k = 0; k < this.wave.points.length; k++) {
            var p1 = this.wave.points[k];
            var p2 = {
                x: p1.x,
                y: this.canvas.height - 60 * this.dpr
            };

            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);

            var coils = this.canvas.height / 20;

            var dy = p2.y - p1.y;
            var dist = dy / coils;

            for (var n = 1; n <= coils; n++) {
                var dyn = dist * n;
                var dx = this.canvas.height * 0.004;

                if (n % 2 === 0) {
                    dx *= -1;
                }

                this.ctx.lineTo(p1.x + dx, p1.y + dyn);
            }

            this.ctx.stroke();
            this.ctx.closePath();
        }
    };

    Canvas.prototype.drawVerts = function drawVerts() {
        var _this = this;

        this.ctx.lineWidth = 2 * this.dpr;
        this.ctx.fillStyle = '#8c6eef';
        this.ctx.strokeStyle = '#009efd';

        this.wave.points.forEach(function (p) {
            _this.ctx.beginPath();
            _this.ctx.arc(p.x, p.y, POINT_RADIUS * _this.dpr, 0, Math.PI * 2, true);
            _this.ctx.closePath();
            _this.ctx.fill();
            _this.ctx.stroke();
        });
    };

    Canvas.prototype.drawMouse = function drawMouse() {
        this.ctx.lineWidth = 2 * this.dpr;
        this.ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
        this.ctx.strokeStyle = this.mouse.mousedown ? '#330867' : '#89f7fe';

        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 16 * this.dpr, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
        this.mouse.mousedown && this.ctx.fill();
    };

    Canvas.prototype.updateWave = function updateWave() {
        // http://jsfiddle.net/phil_mcc/sXmpD/8/#run
        // https://gamedev.stackexchange.com/a/45247

        var points = this.wave.points;

        for (var n = 0; n < points.length; n++) {
            var p = points[n];

            // force to apply to this point
            var force = 0;

            // forces caused by the point immediately to the left or the right
            var forceFromLeft = undefined;
            var forceFromRight = undefined;

            if (n == 0) {
                // wrap to left-to-right
                var _dy = points[points.length - 1].y - p.y;
                forceFromLeft = SPRING_CONSTANT * _dy;
            } else {
                // normally
                var _dy2 = points[n - 1].y - p.y;
                forceFromLeft = SPRING_CONSTANT * _dy2;
            }
            if (n == points.length - 1) {
                // wrap to right-to-left
                var _dy3 = points[0].y - p.y;
                forceFromRight = SPRING_CONSTANT * _dy3;
            } else {
                // normally
                var _dy4 = points[n + 1].y - p.y;
                forceFromRight = SPRING_CONSTANT * _dy4;
            }

            // Also apply force toward the baseline
            var dy = this.canvas.height / 2 - p.y;
            var forceToBaseline = SPRING_CONSTANT_BASELINE * dy;

            // Sum up forces
            force = force + forceFromLeft;
            force = force + forceFromRight;
            force = force + forceToBaseline;

            // Calculate acceleration
            var acceleration = force / p.mass;

            // Apply acceleration (with damping)
            p.vy = DAMPING * p.vy + acceleration;

            // Apply speed
            p.y = p.y + p.vy;
        }
    };

    Canvas.prototype.render = function render() {
        this.drawBackground();
        this.drawText();
        // this.drawCurve();
        this.drawSpring();
        this.drawVerts();
        this.drawMouse();

        this.updateWave();

        // Hold on mousedown
        if (this.mouse.mousedown) {
            var _mouse = this.mouse;
            var x = _mouse.x;
            var y = _mouse.y;

            this.triggerWave(x, y);
        }

        this.tick++;

        window.requestAnimationFrame(this.render);
    };

    return Canvas;
}();

/*------------------------------*\
|* Wave
\*------------------------------*/

var Wave = function Wave(points, p1, p2) {
    _classCallCheck(this, Wave);

    this.p1 = p1;
    this.p2 = p2;

    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;

    var vx = dx / (points - 1);
    var vy = dy / (points - 1);

    this.points = new Array(points).fill(null).map(function (p, i) {
        return new Point(p1.x + vx * i, p1.y + vy * i);
    });
};

/*------------------------------*\
|* Point
\*------------------------------*/

var Point = function () {
    function Point() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;

        this.vy = 0;
        this.vx = 0;

        this.mass = POINT_MASS;
    }

    Point.prototype.moveTo = function moveTo() {
        this.x = arguments.length <= 0 ? undefined : arguments[0];
        this.y = arguments.length <= 1 ? undefined : arguments[1];
    };

    _createClass(Point, [{
        key: 'position',
        get: function get() {
            return {
                x: this.x,
                y: this.y
            };
        }
    }]);

    return Point;
}();

new Canvas();
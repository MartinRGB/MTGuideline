/* BezierEasing - use bezier curve for transition easing function */

(function (definition) {
  if (typeof exports === "object") {
    module.exports = definition();
  }
  else if (typeof window.define === 'function' && window.define.amd) {
    window.define([], definition);
  } else {
    window.BezierEasing = definition();
  }
}(function () {

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === "function";

  function BezierEasing (mX1, mY1, mX2, mY2) {
    // Validate arguments
    if (arguments.length !== 4) {
      throw new Error("BezierEasing requires 4 arguments.");
    }
    for (var i=0; i<4; ++i) {
      if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
        throw new Error("BezierEasing arguments should be integers.");
      }
    }
    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
      throw new Error("BezierEasing x values must be in [0, 1] range.");
    }

    var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

    function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C (aA1)      { return 3.0 * aA1; }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier (aT, aA1, aA2) {
      return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope (aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function newtonRaphsonIterate (aX, aGuessT) {
      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    function calcSampleValues () {
      for (var i = 0; i < kSplineTableSize; ++i) {
        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function binarySubdivide (aX, aA, aB) {
      var currentX, currentT, i = 0;
      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
      return currentT;
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT);
      } else if (initialSlope == 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
      }
    }

    if (mX1 != mY1 || mX2 != mY2)
      calcSampleValues();

    var f = function (aX) {
      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (aX === 0) return 0;
      if (aX === 1) return 1;
      return calcBezier(getTForX(aX), mY1, mY2);
    };
    var str = "BezierEasing("+[mX1, mY1, mX2, mY2]+")";
    f.toString = function () { return str; };

    return f;
  }

  //####### Cubic Bezier Setting
  bezierCurveArray = [[0.0, 0.0, 1.0, 1.0],[0.25, 0.1, 0.25, 1.0],[0.42, 0.0, 0.58, 1.0],[0.23,1,0.32,1],[0.165,0.84,0.44,1]]

  // CSS mapping
  BezierEasing.css = {
    "linear":      BezierEasing.apply(null,bezierCurveArray[0]),
    "ease":        BezierEasing.apply(null,bezierCurveArray[1]),
    "ease-in-out": BezierEasing.apply(null,bezierCurveArray[2]),
    'ease-out-quint':BezierEasing.apply(null,bezierCurveArray[3]),
    'ease-modal':BezierEasing.apply(null,bezierCurveArray[4])
  };

  return BezierEasing;

}));

// create Bezier object to match GSAP syntax
BezierCurve = {
  easeLinear:  new Ease(BezierEasing.css["linear"]),
  ease:      new Ease(BezierEasing.css["ease"]),
  easeInOut: new Ease(BezierEasing.css["ease-in-out"]),
  easeOutQuint: new Ease(BezierEasing.css["ease-out-quint"]),
  easeModal: new Ease(BezierEasing.css["ease-modal"]),
};

/* EaseGetRatio - Draw a Easing Graph Origin by Blake Bowen */

var durationTime = 0.5
var size = 175;
var barWidth = 2
var easeArray = [BezierCurve.easeLinear,BezierCurve.ease,BezierCurve.easeInOut,BezierCurve.easeOutQuint,BezierCurve.easeModal]

// var poly = document.querySelector(".graph_bezierline");
var offset = 100;
var target = { y: 0 };
var tween, points = [];


// ################## 柱状图
// for (var i = 0; i<5;i++){
//   var newEase = easeArray[i]
//   for (var a = 0; a<99; a++){
//     var bar = $("<div/>", {class:"graph_bar"}).appendTo(".animation-box:eq("+i+") .animation_container .graph_container")
//     TweenLite.set(bar, {x:a * barWidth, scaleY:newEase.getRatio(a/99), transformOrigin:"left bottom" });
//   }
//
// }

$('.animation-box').each(function(){
  $(this).find('.play_animation').on('click', function(){
    var indexnum = $(this).parent().parent().index()
    var poly = $(this).parent().find('.graph_bezierline');

    //加 Timing Function
    var transitionCSS = "all "+durationTime+"s cubic-bezier("+bezierCurveArray[indexnum-2].join(',')+")"
    $(this).parent().find('.easing_ball').css("transition",transitionCSS)

    //小球开关
    $(this).parent().find('.easing_ball').toggleClass("easing_ball_moving")

    playEase()

    function playEase() {

      //图表
      tween && tween.kill();
      points = [0, size + offset];
      poly.attr({'points':points});
      tween = TweenLite.fromTo(target, durationTime, {
        y: size + offset
      }, {
        y: offset,
        ease: easeArray[indexnum-2],
        onUpdate: updateGraph
      });
    }

    function updateGraph() {
      var x = tween.progress() * size;
      var y = target.y;
      points.push(x, y);
      poly.attr({'points':points});
    }

  });
});

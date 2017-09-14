// Copyright 2016 GreenSock Inc. See https://greensock.com/gsap/


window.onload = function(){
	(function ($) {
		var htmlLink = "EaseVisualizer.html";
		var id = 0;
		var timeline;
		var $menuEases;
		var highlightTween;
		var isLoaded;
		var _numbersExp = /(?:(-)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig;
		var _rawPathDataExp = /\bd=["']+.*["'][\s\/>]/i;

		var defaults = {
			startEase:  "Power2",
			lightTheme: false,
			lockEase:   false
		};

		var customStrings = {
			"Power0.easeOut":   "0,0,1,1",
			"Power1.easeOut":   "0.104,0.204,0.492,1",
			"Power2.easeOut":   "M0,0,C0.126,0.382,0.282,0.674,0.44,0.822,0.632,1.002,0.818,1.001,1,1",
			"Power3.easeOut":   "M0,0,C0.083,0.294,0.182,0.718,0.448,0.908,0.579,1.001,0.752,1,1,1",
			"Power4.easeOut":   "M0,0,C0.11,0.494,0.192,0.726,0.318,0.852,0.45,0.984,0.504,1,1,1",
			"Back.easeOut":     "M0,0,C0.128,0.572,0.257,1.016,0.512,1.09,0.672,1.136,0.838,1,1,1",
			"Elastic.easeOut":  "M0,0,C0,0,0.049,0.675,0.085,1.115,0.122,1.498,0.156,1.34,0.16,1.322,0.189,1.193,0.203,1.111,0.23,0.978,0.262,0.818,0.303,0.876,0.307,0.882,0.335,0.925,0.349,0.965,0.38,1.006,0.43,1.088,0.484,1.022,0.53,0.997,0.58,0.964,0.667,1.002,0.725,1.004,0.829,1.008,1,1,1,1",
			"Bounce.easeOut":   "M0,0,C0.14,0,0.242,0.438,0.272,0.561,0.313,0.728,0.354,0.963,0.362,1,0.37,0.985,0.414,0.873,0.455,0.811,0.51,0.726,0.573,0.753,0.586,0.762,0.662,0.812,0.719,0.981,0.726,0.998,0.788,0.914,0.84,0.936,0.859,0.95,0.878,0.964,0.897,0.985,0.911,0.998,0.922,0.994,0.939,0.984,0.954,0.984,0.969,0.984,1,1,1,1",
			"Circ.easeOut":     "M0,0,C0,0.408,0.242,0.657,0.295,0.709,0.346,0.76,0.584,1,1,1",
			"Expo.easeOut":     "M0,0,C0.084,0.61,0.214,0.802,0.28,0.856,0.356,0.918,0.374,1,1,1",
			"Sine.easeOut":     "M0,0,C0.266,0.412,0.436,0.654,0.565,0.775,0.609,0.816,0.78,1,1,1",
			"Power1.easeIn":    "0.532,0,0.924,0.862",
			"Power2.easeIn":    "M0,0,C0.366,0,0.438,0.069,0.575,0.19,0.802,0.39,1,1,1,1",
			"Power3.easeIn":    "M0,0,C0.482,0,0.49,0.046,0.625,0.152,0.733,0.237,0.88,0.524,1,1",
			"Power4.easeIn":    "M0,0,C0.46,0,0.496,0.014,0.616,0.088,0.734,0.161,0.884,0.4,1,1",
			"Back.easeIn":      "M0,0,C0.104,0,0.225,-0.057,0.31,-0.082,0.38,-0.102,0.452,-0.106,0.522,-0.078,0.559,-0.063,0.633,-0.003,0.672,0.052,0.772,0.198,0.874,0.414,1,1",
			"Circ.easeIn":      "M0,0,C0.42,0,0.658,0.243,0.71,0.295,0.762,0.348,1,0.59,1,1",
			"Expo.easeIn":      "M0,0,C0.5,0,0.581,0.047,0.625,0.073,0.72,0.13,0.9,0.23,1,1",
			"Sine.easeIn":      "0.434,0.004,0.79,0.698",
			"Power1.easeInOut": "M0,0,C0.272,0,0.472,0.455,0.496,0.496,0.574,0.63,0.744,1,1,1",
			"Power2.easeInOut": "M0,0,C0.173,0,0.242,0.036,0.322,0.13,0.401,0.223,0.449,0.367,0.502,0.506,0.546,0.622,0.62,0.824,0.726,0.916,0.799,0.98,0.869,1,1,1",
			"Power3.easeInOut": "M0,0 C0.212,0 0.247,0.014 0.326,0.09 0.402,0.164 0.46,0.356 0.502,0.504 0.551,0.68 0.594,0.816 0.654,0.882 0.726,0.961 0.734,1 1,1",
			"Power4.easeInOut": "M0,0,C0.29,0,0.294,0.018,0.365,0.103,0.434,0.186,0.466,0.362,0.498,0.502,0.518,0.592,0.552,0.77,0.615,0.864,0.69,0.975,0.704,1,1,1",
			"Back.easeInOut":   "M0,0,C0.068,0,0.128,-0.061,0.175,-0.081,0.224,-0.102,0.267,-0.107,0.315,-0.065,0.384,-0.004,0.449,0.253,0.465,0.323,0.505,0.501,0.521,0.602,0.56,0.779,0.588,0.908,0.651,1.042,0.705,1.082,0.748,1.114,0.799,1.094,0.817,1.085,0.868,1.061,0.938,0.998,1,1",
			"Circ.easeInOut":   "M0,0,C0.17,0,0.286,0.085,0.32,0.115,0.394,0.18,0.498,0.3,0.5,0.5,0.502,0.706,0.608,0.816,0.645,0.852,0.67,0.877,0.794,1,1,1",
			"Expo.easeInOut":   "M0,0,C0.25,0,0.294,0.023,0.335,0.05,0.428,0.11,0.466,0.292,0.498,0.502,0.532,0.73,0.586,0.88,0.64,0.928,0.679,0.962,0.698,1,1,1",
			"Sine.easeInOut":   "M0,0,C0.2,0,0.374,0.306,0.507,0.512,0.652,0.738,0.822,1,1,1"
		};

		var customSVG = {
			"Power0.easeOut":   "M0,500 C0,500 500,0 500,0",
			"Power1.easeOut":   "M0,500 C52,398 246,0 500,0",
			"Power2.easeOut":   "M0,500 C63,309 141,163 220,89 316,-1 409,-0.499 500,0",
			"Power3.easeOut":   "M0,500 C41.5,353 91,141 224,46 289.5,-0.499 376,0 500,0",
			"Power4.easeOut":   "M0,500 C55,253 96,137 159,74 225,8 252,0 500,0",
			"Back.easeOut":     "M0,500 C64,214 128.5,-8 256,-45 336,-68 419,0 500,0",
			"Elastic.easeOut":  "M0,500 C0,500 24.5,162.5 42.5,-57.5 61,-249 78,-170 80,-161 94.5,-96.5 101.5,-55.5 115,11 131,91 151.5,62 153.5,59 167.5,37.5 174.5,17.5 190,-3 215,-44 242,-11 265,1.5 290,18 333.5,-1 362.5,-2 414.5,-4 500,0 500,0",
			"Bounce.easeOut":   "M0,500 C70,500 121,281 136,219.5 156.5,136 177,18.5 181,0 185,7.5 207,63.5 227.5,94.5 255,137 286.5,123.5 293,119 331,94 359.5,9.5 363,1 394,43 420,32 429.5,25 439,18 448.5,7.5 455.5,1 461,3 469.5,8 477,8 484.5,8 500,0 500,0",
			"Circ.easeOut":     "M0,500 C0,296 121,171.5 147.5,145.5 173,120 292,0 500,0",
			"Expo.easeOut":     "M0,500 C42,195 107,99 140,72 178,41 187,0 500,0",
			"Sine.easeOut":     "M0,500 C133,294 218,173 282.5,112.5 304.5,92 390,0 500,0",
			"Power1.easeIn":    "M0,500 C266,500 462,69 500,0",
			"Power2.easeIn":    "M0,500 C183,500 219,465.5 287.5,405 401,305 500,0 500,0",
			"Power3.easeIn":    "M0,500 C241,500 245,477 312.5,424 366.5,381.5 440,238 500,0",
			"Power4.easeIn":    "M0,500 C230,500 248,493 308,456 367,419.5 442,300 500,0",
			"Back.easeIn":      "M0,500 C52,500 112.5,528.5 155,541 190,551 226,553 261,539 279.5,531.5 316.5,501.5 336,474 386,401 437,293 500,0",
			"Circ.easeIn":      "M0,500 C210,500 329,378.5 355,352.5 381,326 500,205 500,0",
			"Expo.easeIn":      "M0,500 C250,500 290.5,476.5 312.5,463.5 360,435 450,385 500,0",
			"Sine.easeIn":      "M0,500 C217,498 395,151 500,0",
			"Power1.easeInOut": "M0,500 C136,500 236,272.5 248,252 287,185 372,0 500,0",
			"Power2.easeInOut": "M0,500 C86.5,500 121,482 161,435 200.5,388.5 224.5,316.5 251,247 273,189 310,88 363,42 399.5,10 434.5,0 500,0",
			"Power3.easeInOut": "M0,500 C106,500 123.5,493 163,455 201,418 230,322 251,248 275.5,160 297,92 327,59 363,19.5 367,0 500,0",
			"Power4.easeInOut": "M0,500 C145,500 147,491 182.5,448.5 217,407 233,319 249,249 259,204 276,115 307.5,68 345,12.5 352,0 500,0",
			"Back.easeInOut":   "M0,500 C34,500 64,530.5 87.5,540.5 112,551 133.5,553.5 157.5,532.5 192,502 224.5,373.5 232.5,338.5 252.5,249.5 260.5,199 280,110.5 294,46 325.5,-21 352.5,-41 374,-57 399.5,-47 408.5,-42.5 434,-30.5 469,1 500,0",
			"Circ.easeInOut":   "M0,500 C85,500 143,457.5 160,442.5 197,410 249,350 250,250 251,147 304,92 322.5,74 335,61.5 397,0 500,0",
			"Expo.easeInOut":   "M0,500 C125,500 147,488.5 167.5,475 214,445 233,354 249,249 266,135 293,60 320,36 339.5,19 349,0 500,0",
			"Sine.easeInOut":   "M0,500 C100,500 187,347 253.5,244 326,131 411,0 500,0"
		};

		var _createSVG = function (type, container, attributes, insertBefore) {
			var element = document.createElementNS("http://www.w3.org/2000/svg", type),
				reg = /([a-z])([A-Z])/g,
				p;
			for (p in attributes) {
				element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
			}
			if (insertBefore) {
				container.parentNode.insertBefore(element, container);
			} else {
				container.appendChild(element);
			}
			return element;
		};

		var methods = {
			init:    function (options) {
				var settings = $.extend({}, defaults, options);

				return this.each(function (index) {
					var vis = $(this);
					var data = vis.data('easeVisualizer');
					if (!data) {
						vis.data('easeVisualizer', {
							id:              id++,
							settings:        settings,
							active:          true,
							graphTL:         null,
							clockTL:         null,
							boxTL:           null,
							currentVis:      "graph",
							currentDuration: 2.5,
							currentEaseName: "Power2",
							currentEase:     null,
							editMode:        false
						});


						$.get(htmlLink).done(function (e) {
							if (e === null) {
								console.log("Error. Could not load html.");
							} else {
								loaded(e, vis);
								
							}
						}).fail(function (e) {
							console.log("Error. Could not load html.");
						});
					}
				});
			},
			destroy: function () {
				return this.each(function (index) {
					var vis = $(this);
					var data = vis.data("easeVisualizer");

					if (data.graphTL) data.graphTL.kill();
					if (data.clockTL) data.clockTL.kill();
					if (data.boxTL) data.boxTL.kill();

					vis.find(".go").off("click.easeVisualizer");
					vis.find("select, input").off("change.easeVisualizer");
					vis.find(".editable").off("change.easeVisualizer");
					vis.find(".main_ease_class_label").off("mousedown.easeVisualizer");

					vis.html("").removeData().removeClass("light ease_visualizer enabled").css("margin-top", "");
				});
			}
		};

		function loaded(html, vis) {
			var data = vis.data("easeVisualizer"),
				startingEaseName, easeMenuWidth,
				i, lastIndex, customEase;

			if (data.settings.lightTheme === true) {
				vis.addClass("light");
			}


			vis.addClass("ease_visualizer").html(html);
			vis.addClass("enabled");

			//$(document.head).append("<link rel='stylesheet' href='" + cssLink + "' media='screen' type='text/css' />");

			easeMenuWidth = (vis.innerWidth() - 595) || 244;
			$menuEases = $(".ease_menu .ease_class");
			$(".ease_menu").css("width", easeMenuWidth + "px").on("click", ".ease_class", {vis: vis}, onMenuEaseClick);

			var main_ease_class_select = vis.find(".main_ease_class_select");

			// run button
			vis.find(".go").css("width", easeMenuWidth + "px").on("click.easeVisualizer", {vis: vis}, onClickRun);

			// select options
			vis.find("select, input").on("change.easeVisualizer", {vis: vis}, selectChange).each(function () {
				var t = $(this);
				t.wrap("<label class='" + t.data('type') + "_label'></label>").after("<span class='display'></span>");
			}).trigger("change");

			vis.find(".editable").attr("tabindex", "-1").on("change.easeVisualizer", function (e) {
				$(this).siblings(".display").focus();
			}).siblings(".display").attr("contenteditable", "true").attr("spellcheck", "true");

			// ease selector
			if (data.settings.lockEase !== true) {
				vis.find(".ease_selector").css({display: "none", opacity: 0}).on("click", "button", {vis: vis}, easeChange).trigger("change");
				vis.find(".main_ease_class_label").on("mousedown.easeVisualizer", {vis: vis}, showVisSelect);
			} else {
				vis.find(".ease_selector").css({display: "none", opacity: 0});
				main_ease_class_select.css("display", "none").parent().addClass('locked');
			}

			vis.find(".custom_path").on("focusout.easeVisualizer", {vis: vis}, onInputCustomPath);

			vis.find(".main_ease_class_select").css("visibility", "hidden");

			var prependElement = vis.find(".graph_lines")[0];

			for (i = 1; i < 13; i++) {
				_createSVG("line", prependElement, {x1: i * 50, x2: i * 50, y1: -150, y2: 500, stroke: "#222", strokeWidth: 1, vectorEffect: "non-scaling-stroke"});
				if (i !== 3) {
					_createSVG("line", prependElement, {x1: 0, x2: 500, y1: i * 50 - 150, y2: i * 50 - 150, stroke:"#222", strokeWidth: 1, vectorEffect: "non-scaling-stroke"});
				}
			}
			_createSVG("line", prependElement, {x1: 0, x2: 500, y1: 0, y2: 0, stroke: "#777", strokeWidth: 1, vectorEffect: "non-scaling-stroke"});

			isLoaded = true;


			//look in the URL for a CustomEase
			i = window.location.href.indexOf("CustomEase=");
			if (i !== -1) {
				lastIndex = window.location.href.indexOf("&", i);
				customEase = decodeURI((lastIndex !== -1) ? window.location.href.substr(i+11, lastIndex - i - 11) : window.location.href.substr(i+11));
				data.settings.startEase = "CustomEase";
				vis.find(".custom_path").text(customEase);
			} else if (data.settings.startEase === "CustomEase") { //in case "CustomEase" is selected initially but no actual ease data passed into the URL, we must first default to an ease to trace, so we use Power2.easeOut.
				main_ease_class_select.find('option[value="Power2"]').prop("selected", true).trigger("change");
			}

			data.settings.startEase = data.settings.startEase || "Power2.easeOut";
			startingEaseName = parseEaseClass(data.settings.startEase, true);
			highlightMenuEase(startingEaseName);
			main_ease_class_select.find('option[value="' + parseEaseClass(data.settings.startEase) + '"]').prop("selected", true).trigger("change");

			if (timeline) {
				timeline.delay(1.5);
			}

		}

		function parseEaseClass(name, short) {
			name = name.split(".")[0];
			if (short) {
				return (name === "RoughEase") ? "Rough" : (name === "SteppedEase") ? "Stepped" : name;
			}
			return (name === "Rough") ? "RoughEase" : (name === "Stepped") ? "SteppedEase" : (name === "Custom") ? "CustomEase" : name;
		}


		function showVisSelect(e) {
			e.preventDefault();
			e.stopPropagation();

			var vis = e.data.vis;

			window.showBasicOverlay(vis.find(".ease_selector").focus(), function () {
				hideVisSelect(vis);
			});

			return false;
		}

		function hideVisSelect(vis) {
			vis.find(".main_ease_class_label").css("visibility", "visible");
			window.hideBasicOverlay();
		}

		function onMenuEaseClick(e) {
			if (highlightMenuEase(this.textContent)) { //returns true if the ease was already selected.
				if (timeline) {
					timeline.restart();
				}
				return;
			}
			e.data.vis.find(".main_ease_class_select").find('option[value="' + parseEaseClass(this.textContent) + '"]').prop("selected", true).trigger("change");
		}


		
		function highlightMenuEase(name) {
			if (highlightTween) { //a simple, performant way to unhighlight the previous ease.
				if (highlightTween.target.textContent !== name) { //if it's the same target, it means the user clicked on the already-highlighted ease, so do nothing.
					TweenLite.to(highlightTween.target, 0.2, {backgroundColor: "rgba(0,0,0,0)", color: "#626262", clearProps: "backgroundColor,color"});
				} else {
					return true;
				}
			}
			var i = $menuEases.length;
			while (--i > -1) {
				if ($menuEases[i].textContent === name) {
					highlightTween = TweenLite.to($menuEases[i], 0.2, {backgroundColor: "#88CE02", color: "black"});
				}
			}
			$menuEases.siblings(".ease_type_section").css("visibility", (name === "Rough" || name === "Stepped" || name === "SlowMo" || name === "Power0" || name === "Custom") ? "hidden" : "visible");
		}

		function easeChange(e) {
			var vis = e.data.vis;
			var main_ease_class_select = vis.find(".main_ease_class_select");
			var basic_ease_type_select = vis.find(".basic_ease_type_select");
			var button = $(this);
			var val = button.attr("class").split(" ");

			main_ease_class_select.find('option[value="' + val[0] + '"]').prop("selected", true).trigger('change');

			if (val[1] && val[1] !== "easeNone") {
				basic_ease_type_select.find('option[value="' + val[1] + '"]').prop("selected", true).trigger('change');
			}

			highlightMenuEase(parseEaseClass(val[0], true));

			hideVisSelect(vis);
		}


		function selectChange(e) {
			var vis = e.data.vis;
			var element = $(this);
			var isSelect = element.is("select");
			var type = element.data("type");
			var value = isSelect ? element.val() : element.prop("checked");
			if (isSelect) {
				var display = element.siblings(".display").text(value);
				//var width = display.width();
				//if (width !== 0) element.width(width);
			} else {
				element.siblings(".display").text(value ? "true" : "false");
			}

			switch (type) {
				case "ease_type_quick":
					vis.find(".basic_ease_type_select").find('option[value="' + value + '"]').prop("selected", true).trigger('change');
					return;
					break;

				case "target":
					var all = vis.find(".visualization");
					var allprops = vis.find(".prop");
					switch (value) {
						case "graph":
							showOnly(vis.find(".graph"), all);
							showOnly(vis.find(".prop_graph"), allprops);
							break;

						case "clock":
							showOnly(vis.find(".clock"), all);
							showOnly(vis.find(".prop_clock"), allprops);
							break;

						case "box":
							showOnly(vis.find(".box"), all);
							showOnly(vis.find(".prop_box"), allprops);
							break;
					}
					break;

				case "main_ease_class":
					var all = vis.find(".main_ease_type");
					var data = vis.data("easeVisualizer");
					data.editMode = false;
					switch (value) {
						case "Power0":
							showOnly(vis.find(".linear_ease"), all);
							break;

						case "RoughEase":
							showOnly(vis.find(".rough_ease"), all);
							break;

						case "SlowMo":
							showOnly(vis.find(".slowmo_ease"), all);
							break;

						case "SteppedEase":
							showOnly(vis.find(".stepped_ease"), all);
							break;

						case "Elastic":
							showOnly(vis.find(".elastic_ease"), all);
							break;

						case "Back":
							showOnly(vis.find(".back_ease"), all);
							break;

						case "CustomEase":
							showOnly(vis.find(".custom_ease"), all);
							data.editMode = true;
							break;

						default:
							showOnly(vis.find(".basic_ease"), all);
					}

					checkVertical(vis);

					var descriptions = vis.find(".descriptions").children();
					showOnly(descriptions.filter("." + value), descriptions);

					vis.toggleClass("editMode", data.editMode);
					break;

				case "rough_ease_class":
					var all = vis.find(".rough_ease_type");
					switch (value) {
						case "Power0":
							showOnly(vis.find(".rough_linear_ease"), all);
							break;

						default:
							showOnly(vis.find(".rough_basic_ease"), all);
					}
					checkVertical(vis);
					break;

				case "main_basic_ease_type":
					checkVertical(vis);
					vis.find(".ease_type_quick_select").find('option[value="' + value + '"]').prop("selected", true);
					vis.find(".ease_type_quick_select").siblings(".display").text(value);
					break;

				case "rough_basic_ease_type":
					checkVertical(vis);
					break;

				case "rough_taper":
				case "rough_randomize":
				case "rough_clamp":
				case "slowmo_yoyo":
					break;
			}

			refreshTween(vis);

			customMode(vis, (vis.data("easeVisualizer").currentEaseName === "CustomEase"));
			run(null, vis);

		}

		function customMode(vis, enabled) {
			if (vis.custom !== enabled) {
				vis.custom = enabled;
				var path = vis.find(".ease_template")[0],
					ease = vis.data("easeVisualizer").currentEase,
					text = vis.find(".custom_path")[0],
					hasError,
					onEaseError = function () {
						hasError = true;
					};
				if (enabled) {
					path.style.visibility = "visible";
					TweenLite.fromTo(".ease-instructions", 0.3, {y: 50}, {autoAlpha: 1, y: 0, delay: 0.2});
					path.setAttribute("d", CustomEase.getSVGData(ease, {width: 500, height: 500}));
					if (vis.editor) {
						vis.editor.enabled(true);
						vis.editor.select();
					} else {
						vis.editor = new PathEditor(path, {
							draggable:  false,
							anchorSnap: PathEditor.getSnapFunction({x: 0, y: 0, width: 500, height: 500, containY: false, gridSize: 50, radius: 5, axis: PathEditor.editingAxis}),
							onUpdate:   function () {
								var hadError = hasError,
									lastX = this._bezier[0][this._bezier[0].length - 2],
									firstX = this._bezier[0][0];
								hasError = false;
								text.innerHTML = this.getNormalizedSVG(500, 500, true, onEaseError);
								hasError = (hasError || firstX > 1 || lastX < 499);
								if (hadError !== hasError) {
									this._selectionPath.style.stroke = hasError ? "red" : "#4e7fff";
								}
							},
							handleSnap: PathEditor.getSnapFunction({x: 0, y: 0, width: 500, height: 500, containY: false, containX: false, radius: 5, axis: PathEditor.editingAxis})
						});
					}

				} else if (vis.editor) {
					vis.editor.enabled(false);
					path.style.visibility = "hidden";
					TweenLite.to(".ease-instructions", 0.3, {autoAlpha: 0});
				}
				else{
					TweenLite.fromTo(".ease-instructions", 0.3, {y: 0},{autoAlpha: 0});
				}
			}
		}

		function onInputCustomPath(e) { //when the user manually changes the custom ease text, like pasting in a chunk of SVG.
			var vis = e.data.vis,
				data, nums, ease;
			if (vis && vis.custom) {
				// console.log("changed text", vis.find(".custom_path").text());
				data = vis.find(".custom_path").text();
				if (data.indexOf("<") !== -1) {
					nums = data.match(_rawPathDataExp);
					if (nums) {
						data = nums[0];
						data = PathEditor.getCubicSVGData(data.substr(3, data.length - 5));
					}
				}
				nums = data.match(_numbersExp);
				ease = CustomEase.create("custom", data, {height: (Math.abs(1 - nums[nums.length - 2]) < 0.01 ? -1 : 0)});
				vis.data("easeVisualizer").currentEase = ease;
				createGraph(vis);
				vis.find(".ease_template").attr("d", vis.find(".graph_path_reveal").attr("d"));
				vis.editor.init();
			}
		}

		function checkVertical(vis) { //Elastic.easeOut needs more room up top.
			var main_ease_class_select = vis.find(".main_ease_class_select").val();
			var basic_ease_type_select = vis.find(".basic_ease_type_select").val();
			var target_select = vis.find(".target_select").val();
			var tall = (target_select === "graph" && (main_ease_class_select === "CustomEase" || (main_ease_class_select === "Elastic" || main_ease_class_select === "Back" || (main_ease_class_select === "RoughEase" && vis.find(".rough_ease_class_select").val() === "Elastic" && vis.find(".rough_ease_type_select").val() === "easeOut"))));
			if (tall) {
				TweenLite.to(vis, 0.5, {paddingTop: 250, ease: Power2.easeInOut});
				TweenLite.to(vis.find(".ease_menu"), 0.5, {top: 250, ease: Power2.easeInOut});
				TweenLite.to(vis.find("#graph_path").find("rect"), 0.5, {attr:{y:-200}, ease:Power2.easeInOut});
			} else { //we decided not to animate BACK after going tall because it's annoying.
				TweenLite.to(vis, 0.3, { paddingTop:100, ease:Power2.easeInOut });
				TweenLite.to(vis.find(".ease_menu"), 0.3, {top:100, ease:Power2.easeInOut});
				TweenLite.to(vis.find("#graph_path").find("rect"), 0.3, {attr:{y:0}, ease:Power2.easeInOut});
			}
		}

		function refreshTween(vis) {
			var d = parseFloat(vis.find(".duration").siblings(".display").text());
			var previousEaseName = vis.data("easeVisualizer").currentEaseName;
			var type = vis.find(".basic_ease_type_select").val();
			if (isNaN(d) || d === 0) d = 2.5;
			vis.find(".duration").siblings(".display").text(d);

			var ease, c = vis.find(".main_ease_class_select").val(), t = vis.find(".target_select").val();
			switch (c) {
				case "Power0":
					ease = Power0.easeNone;
					break;

				case "RoughEase":
					var strength = parseFloat(vis.find(".rough_strength").siblings(".display").text(), 10);
					if (isNaN(strength) || strength === 0) strength = 1;
					vis.find(".rough_strength").siblings(".display").text(strength);

					var points = parseFloat(vis.find(".rough_points").siblings(".display").text(), 10);
					if (isNaN(points) || points === 0) points = 20;
					if (points > 500) points = 500;
					vis.find(".rough_points").siblings(".display").text(points);

					var rc = vis.find(".rough_ease_class_select").val();
					var template = window[rc][vis.find(".rough_ease_type_select").val()];

					ease = new RoughEase({
						strength:  strength,
						points:    points,
						template:  template,
						taper:     vis.find(".rough_taper_select").val().replace(/\"/g, ""),
						randomize: vis.find(".rough_randomize_checkbox").prop("checked"),
						clamp:     vis.find(".rough_clamp_checkbox").prop("checked")
					});
					break;

				case "SlowMo":
					var ratio = parseFloat(vis.find(".slowmo_ratio").siblings(".display").text(), 10);
					if (isNaN(ratio) || ratio < 0) ratio = 0.7;
					vis.find(".slowmo_ratio").siblings(".display").text(ratio);

					var power = parseFloat(vis.find(".slowmo_power").siblings(".display").text(), 10);
					if (isNaN(power) || power < 0) power = 0.7;
					vis.find(".slowmo_power").siblings(".display").text(power);

					var yoyo = vis.find(".slowmo_yoyo_checkbox").prop("checked");

					ease = new SlowMo(ratio, power, yoyo);
					break;

				case "SteppedEase":
					var steps = parseInt(vis.find(".stepped_steps").siblings(".display").text(), 10);
					if (isNaN(steps) || steps === 0) steps = 12;
					if (steps > 100) steps = 100;
					vis.find(".stepped_steps").siblings(".display").text(steps);

					ease = new SteppedEase(steps);
					break;

				case "Elastic":
					var amplitude = parseFloat(vis.find(".elastic_amplitude").siblings(".display").text()) || 1,
						period = parseFloat(vis.find(".elastic_period").siblings(".display").text());
					vis.find(".elastic_amplitude").siblings(".display").text(amplitude);
					vis.find(".elastic_period").siblings(".display").text(period);
					ease = Elastic[type].config(amplitude, period);
					break;

				case "Back":
					var amount = parseFloat(vis.find(".back_amount").siblings(".display").text()) || 1;
					vis.find(".back_amount").siblings(".display").text(amount);
					ease = Back[type].config(amount);
					break;

				case "CustomEase":
					ease = CustomEase.create("custom", vis.find(".custom_path").text(), {height: 1});
					break;

				default:
					ease = window[c][type];
			}

			var data = vis.data("easeVisualizer");
			data.currentVis = t;
			data.currentDuration = d;
			data.currentEaseName = c;
			data.currentEaseType = type;
			data.currentEase = ease;

			if (!(c === "CustomEase" && previousEaseName !== "CustomEase") && isLoaded) {
				createGraph(vis);
			}
		}


		function onClickRun(e, vis) {
			var vis = e.data.vis;
			if (vis && vis.custom) { //if in custom editing mode, create the ease now
				refreshTween(vis);
				run(e, vis);
			}
			if (timeline) {
				timeline.restart();
			}
		}

		function run(e, vis) {
			$("div#load-container").removeClass("hidden");
			if (typeof vis === "undefined") {
				vis = e.data.vis;
				// rebuild each run
				refreshTween(vis);
			}
			var data = vis.data("easeVisualizer");
			var graphTL = data.graphTL;
			var clockTL = data.clockTL;
			var boxTL = data.boxTL;

			if (graphTL) graphTL.progress(0).kill();
			if (clockTL) clockTL.progress(0).kill();
			if (boxTL) boxTL.progress(0).kill();
			switch (data.currentVis) {
				case "graph":
					runGraphVis(vis);
					break;

				case "clock":
					runClockVis(vis);
					break;

				case "box":
					runBoxVis(vis);
					break;
			}
		}
		


		function runGraphVis(vis) {
			var data = vis.data("easeVisualizer");
			var d = data.currentDuration;
			var ease = data.currentEase;
			var offset = 0.2;
			var graphTL = timeline = new TimelineLite({delay: 0.1}); //delay slightly to give the CPU time to breathe after all the setup (avoid jank)
			graphTL.add("start", offset);

			var number = vis.find(".progress_number");
			graphTL.to({p: 0}, d, {
				ease: Linear.easeNone, p: 1, onUpdate: function () {
					number.text(this.target.p.toFixed(2));
				}
			}, "start");

			graphTL.fromTo(vis.find(".graph_line"), 0.0001, {autoAlpha: 0}, {autoAlpha: 1}, "start");

			graphTL.fromTo(vis.find("#graph_path_reveal rect"), d, {attr: {width: 0}}, {attr: {width: 500}, ease: Linear.easeNone}, "start");
			graphTL.fromTo(vis.find(".graph_liney"), d, {attr: {x1: 0, x2: 0}}, {attr: {x1: 500, x2: 500}, ease: Linear.easeNone}, "start");
			graphTL.fromTo(vis.find(".progress_joint"), d, {top: "100%"}, {top: "0%", ease: ease}, "start");
			graphTL.fromTo(vis.find(".graph_linex"), d, {attr: {y1: 500, y2: 500}}, {attr: {y1: 0, y2: 0}, ease: ease}, "start");

			graphTL.fromTo(vis.find(".horizontal .progress_fill"), d, {scaleX: 0, transformOrigin: "left center"}, {ease: Linear.easeNone, scaleX: 1}, "start");
			graphTL.fromTo(vis.find(".vertical .progress_fill"), d, {scaleY: 0, transformOrigin: "left bottom"}, {ease: ease, scaleY: 1}, "start");

			graphTL.to(vis.find(".graph_line"), 0.07, {autoAlpha: 0});

			data.graphTL = graphTL;
			return graphTL;
		}

		function runClockVis(vis) {
			var data = vis.data("easeVisualizer");
			var d = data.currentDuration;
			var ease = data.currentEase;
			var offset = 0.2;

			var clockTL = timeline = new TimelineLite();
			clockTL.add("start", offset);

			clockTL.fromTo(vis.find(".clock_ease"), d, {rotation: 0, transformOrigin: "center bottom"}, {ease: ease, rotation: 360, force3D: true}, "start");
			clockTL.fromTo(vis.find(".clock_linear"), d, {rotation: 0, transformOrigin: "center bottom"}, {ease: Linear.easeNone, rotation: 360, force3D: true}, "start");

			clockTL.fromTo(vis.find(".horizontal .progress_fill"), d, {scaleX: 0, transformOrigin: "left center"}, {ease: Linear.easeNone, scaleX: 1, force3D: true}, "start");

			data.clockTL = clockTL;
		}

		function runBoxVis(vis) {
			var data = vis.data("easeVisualizer");
			var d = data.currentDuration;
			var ease = data.currentEase;
			var easeType = data.currentEaseType;
			var offset = 0.2;

			var boxTL = timeline = new TimelineLite();
			boxTL.add("start", offset);

			boxTL.fromTo(vis.find(".box_power0"), d, {x: "0%"}, {ease: Power0.easeIn, x: "400%", force3D: true}, "start");
			boxTL.fromTo(vis.find(".box_power1"), d, {x: "0%"}, {ease: Power1[easeType] || Power1.easeOut, x: "400%", force3D: true}, "start");
			boxTL.fromTo(vis.find(".box_power2"), d, {x: "0%"}, {ease: Power2[easeType] || Power2.easeOut, x: "400%", force3D: true}, "start");
			boxTL.fromTo(vis.find(".box_power3"), d, {x: "0%"}, {ease: Power3[easeType] || Power3.easeOut, x: "400%", force3D: true}, "start");
			boxTL.fromTo(vis.find(".box_power4"), d, {x: "0%"}, {ease: Power4[easeType] || Power4.easeOut, x: "400%", force3D: true}, "start");
			boxTL.fromTo(vis.find(".box_custom"), d, {x: "0%"}, {ease: ease, x: "400%", force3D: true}, "start");

			boxTL.fromTo(vis.find(".horizontal .progress_fill"), d, {scaleX: 0, transformOrigin: "left center"}, {ease: Linear.easeNone, scaleX: 1, force3D: true}, "start");

			data.boxTL = boxTL;
		}

		function createGraph(vis) {
			var name = vis.find(".main_ease_class_select").val(),
				data = vis.data("easeVisualizer"),
				precision = (name === "SteppedEase" || name === "Bounce" || name === "Elastic") ? 3 : 1,
				ease = data.currentEase || Linear.easeNone,
				mainEase = data.currentEaseName,
				fullEaseName = mainEase + "." + data.currentEaseType,
				customString = ((fullEaseName !== "Elastic.easeOut" && mainEase !== "Back") || (fullEaseName === "Elastic.easeOut" && ease._p1 === 1 && ease._p3 === 0.075) || (mainEase === "Back" && ease._p1 === 1.7)) ? customStrings[fullEaseName] : null, //note: we created a simplified version of Elastic.easeOut and the Back eases, but only with the default configuration so if there is any customization, we should just do the auto-tracing.
				$customPath = vis.find(".custom_path"),
				path, simplified;
			if (customString) {
				$customPath.text(customString);
				path = customSVG[fullEaseName];
			} else {
				path = CustomEase.getSVGData(ease, {width: 500, height: 500, precision: precision});
				simplified = ease.rawBezier ? path : PathEditor.simplifySVG(path, {tolerance: (precision === 1) ? 3 : 1, cornerThreshold: (mainEase === "Bounce") ? 130 : (mainEase === "SteppedEase" || mainEase === "RoughEase") ? 180 : 0});
				$customPath.text(CustomEase.getSVGData(new CustomEase("custom", simplified, {height: 500}), {width: 1, height: -1, y: 1, precision: precision}));
			}
			if (isLoaded) {
				TweenLite.to(".graph_path", 0.4, {morphSVG: path});
				vis.find(".graph_path_reveal").attr("d", path);
			}
		}

		function showOnly(target, set) {
			TweenLite.set(target, {display: ""});
			TweenLite.set(set.not(target), {display: "none"});
		}

		$.fn.easeVisualizer = function (method) {
			if (methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof method === 'object' || !method) {
				return methods.init.apply(this, arguments);
			} else {
				$.error('Method ' + method + ' does not exist');
			}
		};
	})(jQuery);
	/* $("#visualizer").easeVisualizer ({lightTheme :false}); */


	// adds simple showBasicOverlay() and hideBasicOverlay() methods to the window. Just pass a DOM element to showBasicOverlay()
	// and optionally a callback that should be called when the overlay closes, like showBasicOverlay(myElement, myFunction);
	// and it'll handle animating it in/out, centering it in the window, and creating a dimmed background that senses clicks
	// to close itself. It also pauses all GSAP-driven animations that were running, and then resumes them again when it closes.
	// Requires either TweenMax *or* all of the following: TweenLite, CSSPlugin, EasePack (and if you want the auto-pausing, also include TimelineLite).
	;(function () {
		var dimmer = document.getElementById("overlay-dimmer"),
			activeOverlay, overlayZIndex, exportedRoot, overlayOnComplete;
		if (!dimmer) {
			dimmer = document.createElement("div");
			dimmer.setAttribute("id", "overlay-dimmer");
			dimmer.style.cssText = "width: 100%; height: 100%; background-color: black; opacity: 0.5; position: fixed; top: 0;left: 0; z-index: 4000; cursor: pointer; visibility: hidden;";
			TweenLite.set(dimmer, {force3D: true});
			(document.body || document.documentElement).appendChild(dimmer);
		}
		function showBasicOverlay(overlay, onComplete) {
			if (!overlay) {
				console.log("Error: no overlay argument provided to showBasicOverlay().");
				return;
			}
			if (activeOverlay) { //if there's already one open, immediately close it.
				TweenLite.set(activeOverlay, {autoAlpha: 0, display: "none"});
				if (overlayZIndex) {
					activeOverlay.style.zIndex = overlayZIndex;
				} else {
					TweenLite.set(activeOverlay, {clearProps: "zIndex"});
				}
				if (exportedRoot) {
					exportedRoot.resume();
				}
			}
			activeOverlay = overlay[0] || overlay; //in case it's a jQuery object.
			overlayZIndex = activeOverlay.style.zIndex;
			if (window.TimelineLite) {
				exportedRoot = TimelineLite.exportRoot().pause();
			}
			TweenLite.set(activeOverlay, {opacity: 0, xPercent: -50, yPercent: -50, x: 0, display: "block", zIndex: 5000, top: "50%", left: "50%", position: "fixed", maxHeight: "98%", bottom: "auto", right: "auto"});
			TweenLite.to(dimmer, 0.25, {autoAlpha: 0.6, ease: Linear.easeNone});
			TweenLite.to(activeOverlay, 0.25, {autoAlpha: 1, force3D: true});
			overlayOnComplete = onComplete;
			return false;
		}

		function hideBasicOverlay() {
			if (activeOverlay) {
				TweenLite.to(dimmer, 0.2, {autoAlpha: 0, ease: Linear.easeNone, onComplete: overlayOnComplete});
				TweenLite.set(activeOverlay, {
					autoAlpha: 0, display: "none", onComplete: function () {
						if (overlayZIndex) {
							activeOverlay.style.zIndex = overlayZIndex;
						} else {
							TweenLite.set(activeOverlay, {clearProps: "zIndex"});
						}
						activeOverlay = null;
						if (exportedRoot) {
							exportedRoot.resume();
						}
					}
				});
			}
		}

		dimmer.onclick = hideBasicOverlay;

		window.showBasicOverlay = showBasicOverlay;
		window.hideBasicOverlay = hideBasicOverlay;

	}());

	$(".ease-visualizer").each(function () {
		var $this = $(this);
		$this.css({padding: "70px 20px 20px", borderRadius: "10px", color: "#999", backgroundColor: "#222"}).html("<p style='padding:250px 0 300px; font-size:30px; text-align:center;'>Loading...</p>").easeVisualizer({startEase: $this.data("ease") || "Power2.easeOut", lightTheme: $this.data("light")});
	});
}
/*!
 * @author Vincent Dechandon <https://github.com/idawave>
 * Original idea of "3D World" with d3.js by Derek Watkins <https://github.com/dwtkns>
 */
define("vdn_viz_ext_3dworld-src/js/core/controller-module", 
	[
		"vdn_viz_ext_3dworld-src/js/utils/path-creator-module",
		"vdn_viz_ext_3dworld-src/js/utils/color-module",
		"vdn_viz_ext_3dworld-src/js/utils/size-module",
		"vdn_viz_ext_3dworld-src/js/utils/projection-module",
		"vdn_viz_ext_3dworld-src/js/core/events",
		"vdn_viz_ext_3dworld-src/js/lib/topojson.v0"
	], 
	function(PathFactory, ColorFactory, SizeFactory, Projection, EventFactory) {
		
		/*
			Create static elements
		*/
		function _CreateGlobe(svg, width, height, projection, world, path) {
			

			
			var ocean_fill = svg.append("defs").append("radialGradient")
					.attr("id", "ocean_fill")
					.attr("cx", "75%")
					.attr("cy", "25%");
				  ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "#73d2e0");
				  ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "#a5d5cb");

			  var globe_highlight = svg.append("defs").append("radialGradient")
					.attr("id", "globe_highlight")
					.attr("cx", "75%")
					.attr("cy", "25%");
				  globe_highlight.append("stop")
					.attr("offset", "5%").attr("stop-color", "#ffd")
					.attr("stop-opacity","0.6");
				  globe_highlight.append("stop")
					.attr("offset", "100%").attr("stop-color", "#ba9")
					.attr("stop-opacity","0.2");

			  var globe_shading = svg.append("defs").append("radialGradient")
					.attr("id", "globe_shading")
					.attr("cx", "55%")
					.attr("cy", "45%");
				  globe_shading.append("stop")
					.attr("offset","30%").attr("stop-color", "#fff")
					.attr("stop-opacity","0")
				  globe_shading.append("stop")
					.attr("offset","100%").attr("stop-color", "#505962")
					.attr("stop-opacity","0.3")

			  var drop_shadow = svg.append("defs").append("radialGradient")
					.attr("id", "drop_shadow")
					.attr("cx", "50%")
					.attr("cy", "50%");
				  drop_shadow.append("stop")
					.attr("offset","20%").attr("stop-color", "#000")
					.attr("stop-opacity",".3")
				  drop_shadow.append("stop")
					.attr("offset","100%").attr("stop-color", "#000")
					.attr("stop-opacity","0")  

					
			  svg.append("ellipse")
				.attr("cx", width/2).attr("cy", height + (height/20))
				.attr("rx", projection.scale())
				.attr("ry", projection.scale()*.1)
				.attr("class", "noclicks")
				.style("fill", "url(#drop_shadow)");

				

			  svg.append("circle")
				.attr("cx", width / 2).attr("cy", height / 2)
				.attr("r", projection.scale())
				.attr("class", "noclicks")
				.style("fill", "url(#ocean_fill)");
			  
			  svg.append("path")
				.datum(topojson.object(world, world.objects.land))
				.attr("class", "land noclicks")
				.attr("d", path);

			  svg.append("circle")
				.attr("cx", width / 2).attr("cy", height / 2)
				.attr("r", projection.scale())
				.attr("class","noclicks")
				.style("fill", "url(#globe_highlight)");

			  svg.append("circle")
				.attr("cx", width / 2).attr("cy", height / 2)
				.attr("r", projection.scale())
				.attr("class","noclicks")
				.style("fill", "url(#globe_shading)");
		}
		
		
		/*
			Factory
		*/
		return function Core(svg, world) {
			/*
				Private members
			*/
			var _proj, points, pointWrapper;

				var _colorField, _sizeField, _data;

			
			var _width  = +svg.attr("width"), 
				_height = +svg.attr("height");
			
			/*
				Run the dependency factories
			*/
			var Color = ColorFactory();
			
			var Event = EventFactory();
			var Size = SizeFactory();
			var Path = PathFactory(Size);
			

			/*
				Private Methods as closures
			*/			
			function _getDataBoundaries(data, field, type) {
				var min, max;
				data.features.forEach(function(datum) {
					datum = datum.geometry ? datum.geometry.properties : datum.properties;
					if (datum) {
						if (typeof min === "undefined") {
							min = datum[field];
						}
						if (typeof max === "undefined") {
							max = datum[field];
						}
						if (datum[field] < min) {
							min = datum[field];
						}
						if (datum[field] > max) {
							max = datum[field];
						}
					}
					return;
				});
				if (type === "color") {
					Color.setBoundaries(min, max);
				}
				if (type === "size") {
					Size.setBoundaries(min, max);
				}
				return;
			}
			
			function _project(width, height) {
				if (!_proj || _width !== width || _height !== height) {
					_proj = Projection(width, height);
					Path.setProjection(_proj);
					Event.setProjection(_proj);
				}
				return core;
			}
			
			function _createPointsFromData(data) {
				var data = data || _data;
				points = pointWrapper
					.data(data.features);
				points
					.enter()
					.append("path")
					.attr("class", "feature")
					.attr("d", Path.setPath);
				points
					.exit()
					.remove()
				return core;
			}
			
			function _applyColor() {
				points.attr("fill", function(datum, idx) {
					return Color.getColor(datum ? datum.geometry.properties[_colorField] : undefined);
				});
				return core;
			}
			
			function _createControls(fn) {
				d3.select(window)
					.on("mousemove", Event.mousemove.bind(null, fn))
					.on("mouseup", Event.mouseup.bind(null, fn));
					

				//svg.on("mousedown", Event.mousedown, true);
				
				d3.select("svg.v-m-root").on("mousedown", Event.mousedown);

			}
			
			function _refresh() {
				svg.selectAll(".land").attr("d", Path.setPath);
				svg.selectAll(".feature").attr("d",  Path.setPath);
				return this;
			};
			
			
			
			/**
			 * Public API
			 */
			// Factory	
			function core() {
				
				_project(_width, _height);
				_CreateGlobe(svg, _width, _height, _proj, world, Path.setPath);
				_createControls(_refresh);
				pointWrapper = svg
					.append("g")
					.attr("class", "feature-wrapper")
					.selectAll("text");
				return core;
			}

			
			core.setColorField = function(field) {
				_colorField = field;
				if (_data && _colorField) {
					_getDataBoundaries(_data, _colorField, "color");
				}
				return core;
			};
			
			core.setSizeField = function(field) {
				_sizeField = field;
				Path.setSizeField(field);
				if (_data && _sizeField) {
					_getDataBoundaries(_data, _sizeField, "size");
				}
				return core;
			};
			/**
			 * Add a new dataset
			 */
			core.setData = function(data) {
				if (!data) {
					throw new Error("no data was provided");
				}
				_data = data;
				if (_data && _colorField) {
					_getDataBoundaries(_data, _colorField, "color");
				}
				if (_data && _sizeField) {
					_getDataBoundaries(_data, _sizeField, "size");
				}
				_createPointsFromData(_data);
				return core;
			};
			/**
			 * Apply a color ramp to each feature
			 */
			core.applyRamp = function() {
				_applyColor();
			};

			
			  

			return core(); // return the factory
		}
			
	});
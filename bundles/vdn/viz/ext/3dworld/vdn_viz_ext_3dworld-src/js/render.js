/*!
 * @author SAP <www.sap.com>
 * @author Vincent Dechandon <https://github.com/idawave>
 */
define(
	"vdn_viz_ext_3dworld-src/js/render", 
	[
		"require",
		"vdn_viz_ext_3dworld-src/js/core/controller-module", 
		"vdn_viz_ext_3dworld-src/js/utils/data-to-geojson"
	], 
	function(require, _3dWorld, GeoJsonFormatterUtil) {
		
		// Private object accessible through closure
		// That is used to store reusable elements instead of creating/requesting them
		// At each _render call
		var Cache = {};
		
		/*
			data {Array} An array of JS objects of business data
			container {DOM} The DOM element (<g> tag) where we should append our own elements
		*/
		return function _render(data, container) {
			// Private method that sets up the 3D world and map and style data on it
			function createViz(_world) {
				var _3dWorld_ = _3dWorld(container, _world);
				if (sizeFeed) { // Even if no measure has been set Lumira sends a "fake" measure called "Measure" // I'm not sure why but it looks like a bug to me
					_3dWorld_.setSizeField(sizeFeed);
				}
				if (colorFeed) {
					_3dWorld_.setColorField(colorFeed);
				}
				if (dimensions[0] && dimensions[1]) {
					_3dWorld_.setData(data);
					// Called even if no second measure is defined
					// So the features will be painted with default color
					// @todo : This could be done directly through css to improve performance I guess
					_3dWorld_.applyRamp();
				}
			}

			var width      = this.width(),  // container width
				height     = this.height(), // container height
				dimensions = data.meta.dimensions(), // Array of dimensions from feeds
				measures   = data.meta.measures(), // Array of measures from feeds
				sizeFeed   = data.meta.isFeedDefined("Size"), // Is the Size feed used?
				colorFeed  = data.meta.isFeedDefined("Color"); // Is the Color feed used?
				
			if (colorFeed && sizeFeed) {
				sizeFeed  = measures[0];
				colorFeed = measures[1];
			} else if (colorFeed) {
				colorFeed = measures[0];
			} else if (sizeFeed) {
				sizeFeed = measures[0];
			}
				
			container
				.attr("width", width)
				.attr("height", height)
				.selectAll("*") // Recreate everything at each _render call
				.remove();      // This could be improved by caching svg elements and only updates features above them

			// @todo : Can the data mapping be done in the mapper function in dataMapping.js?
			data = GeoJsonFormatterUtil(data, dimensions, [sizeFeed, colorFeed]); // Format JavaScript objects into GeoJSON Feature Collection

			if (Cache.WorldAsJson) {
				createViz(Cache.WorldAsJson);
			} else {
				// Load topojson world to map it to the main globe
				$.getJSON(require.toUrl("vdn_viz_ext_3dworld-src/resources/data/world-110m.topojson"), function(worldAsJson) {
					Cache.WorldAsJson = worldAsJson;
					createViz(worldAsJson);
				});
			}
		};
	}
);
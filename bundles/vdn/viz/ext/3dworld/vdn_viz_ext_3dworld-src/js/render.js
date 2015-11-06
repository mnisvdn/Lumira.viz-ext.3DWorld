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
		return function _render(data, container) {
			// Private method that sets up the 3D world and map and style data on it
			function createViz(_world) {
				var _3dWorld_ = _3dWorld(container, _world);
				if (measures[0] && measures[0] !== "Measure") { // Even if no measure has been set Lumira sends a "fake" measure called "Measure" // I'm not sure why but it looks like a bug to me
					_3dWorld_.setSizeField(measures[0]);
				}
				if (measures[1]) {
					_3dWorld_.setColorField(measures[1]);
				}
				if (dimensions[0] && dimensions[1]) {
					_3dWorld_.setData(data);
					// Called even if no second measure is defined
					// So the features will be painted with default color
					// @todo : This could be done directly through css to improve performance I guess
					_3dWorld_.applyRamp();
				}
			}

			var width      = this.width(),
				height     = this.height(),
				dimensions = data.meta.dimensions(), // Array of dimensions from user input
				measures   = data.meta.measures();   // Array of measures from user input
				
			container
				.attr("width", width)
				.attr("height", height)
				.selectAll("*") // Recreate everything at each _render call
				.remove();      // This could be improved by caching svg elements and only updates features above them

			// @todo : Can the data mapping be done in the mapper function in dataMapping.js?
			data = GeoJsonFormatterUtil(data, dimensions, measures); // Format JavaScript objects into GeoJSON Feature Collection

			// Load topojson world to map it to the main globe
			$.getJSON(require.toUrl("vdn_viz_ext_3dworld-src/resources/data/world-110m.topojson"), function(worldAsJson) {
				createViz(worldAsJson);
			});
		};
	}
);
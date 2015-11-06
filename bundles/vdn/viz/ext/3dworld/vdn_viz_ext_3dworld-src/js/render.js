define(
	"vdn_viz_ext_3dworld-src/js/render", 
	[
		"require",
		"vdn_viz_ext_3dworld-src/js/utils/util", 
		"vdn_viz_ext_3dworld-src/js/core/controller-module", 
		"vdn_viz_ext_3dworld-src/js/utils/data-to-geojson"
	], 
	function(require, util, _3dWorld, DataFormatterUtil) {

	function _cache_(handler) {
		var cache = window._vdn_3dworld_ = window._vdn_3dworld_ || {};
		cache.handler = handler;
	}
	
	function getCache() {
		return window._vdn_3dworld_;
	}

    var render = function(data, container) {

		function go() {
			var _3dWorld_ = _3dWorld(vis, _world, container); // this project world and create all needed elements
			
			if (measures[0] && measures[0] !== "Measure") {
				_3dWorld_.setSizeField(measures[0]);
			}
			if (measures[1]) {
				_3dWorld_.setColorField(measures[1]);
			}
			if (dimensions[0] && dimensions[1]) {
				_3dWorld_.setData(data);
				_3dWorld_.applyRamp();
			}


			//_cache(_3dWorld);
		}

        var width = this.width(),
            height = this.height();
        container.selectAll("*").remove();

		
        var vis = container
			.attr("width", width)
			.attr("height", height);
			
		var dimensions = data.meta.dimensions(),
			measures = data.meta.measures();	

		data = DataFormatterUtil(data, dimensions, measures);
					
		
		var _world;
		
		var url = require.toUrl("vdn_viz_ext_3dworld-src/resources/data/world-110m.topojson");
		
		
		$.getJSON(url, function(worldAsJson) {
			_world = worldAsJson;
			go();
		});

    };

    return render; 
});
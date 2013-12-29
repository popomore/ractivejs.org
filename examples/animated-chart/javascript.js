var linearScale, getPointsArray, resize, cities, ractive;

// this returns a function that scales a value from a given domain
// to a given range. Hat-tip to D3
linearScale = function ( domain, range ) {
	var d0 = domain[0], r0 = range[0], multipler = ( range[1] - r0 ) / ( domain[1] - d0 );

	return function ( num ) {
		return r0 + ( ( num - d0 ) * multipler );
	};
};

// this function takes an array of values, and returns an array of
// points plotted according to the given x scale and y scale
getPointsArray = function ( array, xScale, yScale, point ) {
	var result = array.map( function ( month, i ) {
		return xScale( i + 0.5 ) + ',' + yScale( month[ point ] );
	});

	// add the december value in front of january, and the january value after
	// december, to show the cyclicality
	result.unshift( xScale( -0.5 ) + ',' + yScale( array[ array.length - 1 ][ point ] ) );
	result.push( xScale( array.length + 0.5 ) + ',' + yScale( array[0][ point ] ) );

	return result;
};

ractive = new Ractive({
	el: example,
	template: template,
	data: {
		format: function ( val ) {
			if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
				// convert celsius to fahrenheit
				val = ( val * 1.8 ) + 32;
			}

			return val.toFixed( 1 ) + '°';
		},

		// this function returns the SVG string for the polygon representing the
		// temperature band
		band: function ( months ) {
			var xScale, yScale, high = [], low = [];

			xScale = this.get( 'xScale' );
			yScale = this.get( 'yScale' );

			high = getPointsArray( months, xScale, yScale, 'high' );
			low = getPointsArray( months, xScale, yScale, 'low' );

			return high.concat( low.reverse() ).join( ' ' );
		},
		
		monthNames: [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ]
	}
});


// because we're using SVG, we need to manually redraw
// when the container resizes. You *can* use percentages
// instead of pixel/em lengths, but not in transforms
resize = function () {
	var width, height;

	width = ractive.nodes.svg_wrapper.clientWidth;
	height = ractive.nodes.svg_wrapper.clientHeight;

	ractive.set({
		width: width,
		height: height
	});
};

// recompute xScale and yScale when we need to
ractive.observe({
	width: function ( width ) {
		this.set( 'xScale', linearScale([ 0, 12 ], [ 0, width ]) );
	},
	height: function ( height ) {
		this.set( 'yScale', linearScale([ -10, 42 ], [ height - 20, 25 ]) );
	}
});

// update width and height when window resizes
window.addEventListener( 'resize', resize );
resize();


// respond to user input
ractive.observe( 'selected', function ( index ) {
	this.animate( 'selectedCity', cities[ index ], {
		easing: 'easeOut',
		duration: 300
	});
});


// load our data
reqwest({ url: 'temperature.json', type: 'json' }).then( function ( data ) {
	cities = data;

	ractive.set({
		cities: cities,
		selectedCity: cities[0] // initialise to London
	});
});
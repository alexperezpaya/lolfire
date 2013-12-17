var webshot = require('webshot');

var options = {
	screenSize: {
    	width: 320,
    	height: 480
	},
	shotSize: {
		width: 'all',
    	height: 'all'
    }
};

webshot('flickr.com', 'google.png', options, function(err) {
	if(err){
		console.log(err);
	}
});
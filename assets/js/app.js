$( document ).ready(function() {
    console.log("teste");

    $('select').select2({
    	insertTag: function (data, tag) {
	    	// Insert the tag at the end of the results
	    	data.push(tag);
	  	},
	  	tags: true,
    	tokenSeparators: [',', ' ']
	});


});
$( document ).ready(function() {
    $('#tokens').select2({
    	theme: "bootstrap",
    	width: "none",
    	insertTag: function (data, tag) {
	    	// Insert the tag at the end of the results
	    	data.push(tag);
	  	},
	  	tags: true,
    	tokenSeparators: [',', ' ']
	});

	$('#tokens').change(function(){
   		getTokens();
  	});
});

function getTokens(){
  	arrTokens = [];
	$("#tokens option").each(function(index){
		arrTokens.push($(this).text());
	});
	$('#table_elements').fadeIn('slow');
	getAlphabet(arrTokens);
}

function getAlphabet(arrTokens){
	var alphabet = [];
	for (var i = 0; i < arrTokens.length; i++) {
		for(var indexLetter = 0; indexLetter < arrTokens[i].length; indexLetter++) {
			if(alphabet.indexOf(arrTokens[i][indexLetter]) == -1) {
				alphabet.push(arrTokens[i][indexLetter]);
			}
		}
	}
	formatTable(alphabet, arrTokens);
}


function formatTable(alphabet, arrTokens){
	$(".table-alphabet tbody").html("");
	var q = 0;
	for (var i = 0; i < arrTokens.length; i++) {
		for(var indexLetter = 0; indexLetter < arrTokens[i].length; indexLetter++) {
			$(".table-alphabet tbody").append('<tr class=element-' + i + '-row-' + indexLetter + '><td><b>q' + q++ + '</b></td></tr>');
		}
		$(".table-alphabet tbody").append('<tr class=element-' + i + '-end><td><b>q' + q++ + '*</b></td></tr>');
		for (var k = 0; k < alphabet.length; k++) { 
			$(".element-" + k + "-row-").append("<td></td>");	
		}
	}

	console.log(alphabet);
	$(".table-alphabet thead tr").html("");
	$(".table-alphabet thead tr").append("<th>#</th>")
	alphabet.sort();
	for (var i = 0; i < alphabet.length; i++) { 
		$(".table-alphabet thead tr").append("<th>" + alphabet[i] + "</th>");	
	}
	$('.select2-selection__choice__remove').click( function() {
		setTimeout(function() { 
			getTokens(); 
		}, 100);	
	});
}


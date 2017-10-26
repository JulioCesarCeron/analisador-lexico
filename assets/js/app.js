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
	map(arrTokens);
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

	$(".table-alphabet thead tr").html("");
	$(".table-alphabet thead tr").append("<th>#</th>")
	alphabet.sort();
	for (var i = 0; i < alphabet.length; i++) { 
		$(".table-alphabet thead tr").append("<th>" + alphabet[i] + "</th>");	
	}

	$(".table-alphabet tbody").html("");
	var q = 0;
	var nextQ = 1;
	for (var [indice, value] of mapEstados) {
		$(".table-alphabet tbody").append('<tr class=element-' + indice + '-row-><td>q' + indice + '</td></tr>');
		for (var col = 0; col < alphabet.length; col++) {
			if (value.indexOf(alphabet[col]) != -1){
				$(".element-" + indice + "-row-").append('<td class="table-bordered simbol-' + alphabet[col] + '">q' + nextQ++ + '</td>');		
			} else {
				$(".element-" + indice + "-row-").append('<td class="table-bordered simbol-' + alphabet[col] + '"></td>');		
			}
		}
	}
	
	$('.select2-selection__choice__remove').click( function() {
		setTimeout(function() { 
			getTokens(); 
		}, 100);	
	});
}


var mapEstados = new Map();

function map(arrTokens) {
	var q = 0;
	var simbols = [];
	var add = true;
	for(var key in arrTokens){
		console.log(key);
		if (key > 0){
	 		add = false;
	 	}
		for(i = 0; i < arrTokens[key].length; i++){
			if (add) {
				console.log("entrou if ");
				mapEstados.set(q++, [arrTokens[key][i]]);
			} else {
				console.log("entrou else ");
				if (mapEstados.get(i).indexOf(arrTokens[key][i]) == -1){
					mapEstados.get(i).push(arrTokens[key][i]);
					add = true;
				}
			}
		}
	}
}
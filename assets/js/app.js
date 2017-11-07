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
	console.log(mapEstados);
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
		if (value == "*") {
			$(".table-alphabet tbody").append('<tr class=element-' + indice + '-row-><td>q' + indice + ' ' + value + '</td></tr>');	
		} else {
			$(".table-alphabet tbody").append('<tr class=element-' + indice + '-row-><td>q' + indice + '</td></tr>');
		}
		for (var col = 0; col < alphabet.length; col++) {
			if (value.indexOf(alphabet[col]) != -1){
				$(".element-" + indice + "-row-").append('<td class="table-bordered simbol-' + alphabet[col] + '">q' + value[value.indexOf(alphabet[col]) + 1] + '</td>');		
			} else {
				$(".element-" + indice + "-row-").append('<td class="table-bordered simbol-' + alphabet[col] + '"></td>');		
			}
		}
		nextQ++;
	}
	
	$('.select2-selection__choice__remove').click( function() {
		setTimeout(function() { 
			getTokens(); 
		}, 100);	
	});
}


var mapEstados;

function map(arrTokens) {
	console.log(arrTokens);
	mapEstados = new Map();
	var q = 0;
	var v = 1;
	var simbols = [];
	var add = true;
	for(var key in arrTokens) {
		if (key > 0){
			add = false;
	 	}
		for(i = 0; i < arrTokens[key].length; i++){
			if (add) {
				if (i == arrTokens[key].length - 1) {
					mapEstados.set(q++, [arrTokens[key][i], v++]);
					mapEstados.set(q++, ["*"]);
				} else {
					mapEstados.set(q++, [arrTokens[key][i], v++]);
				}
			} else {
				//console.log("teste " + mapEstados.get(i));
				//console.log("arraytokens " + arrTokens[key][i]);
				if (mapEstados.get(i).indexOf(arrTokens[key][i]) == -1){
					if (i == arrTokens[key].length - 1) {
						mapEstados.get(i).push(arrTokens[key][i], v++);
						mapEstados.set(q++, ["*"]);
					} else {
						mapEstados.get(i).push(arrTokens[key][i], v++);
					}
					//mapEstados.get(i).push(arrTokens[key][i], v++);
					add = true;
				}
			}
		}
	}
}
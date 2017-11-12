$( document ).ready(function() {
	//input tag
    $('#tokens').select2({
    	theme: "bootstrap",
    	width: "none",
    	insertTag: function (data, tag) {
	    	data.push(tag);
	  	},
	  	tags: true,
    	tokenSeparators: [',', ' ']
	});

	$('#tokens').change(function(){
   		getTokens();
	});
	  
	validateTokens();
});
var validateTeste;
var nextState;
var lastState;

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
		if (value.indexOf("*") != -1) {
			$(".table-alphabet tbody").append('<tr class=element-' + indice + '-row><td>q' + indice + '*</td></tr>');	
		} else {
			$(".table-alphabet tbody").append('<tr class=element-' + indice + '-row><td>q' + indice + '</td></tr>');
		}
		for (var col = 0; col < alphabet.length; col++) {
			if (value.indexOf(alphabet[col]) != -1){
				$(".element-" + indice + "-row").append('<td class="table-bordered symbol-' + alphabet[col] + '">q' + value[value.indexOf(alphabet[col]) + 1] + '</td>');		
			} else {
				$(".element-" + indice + "-row").append('<td class="table-bordered symbol-' + alphabet[col] + '"></td>');		
			}
		}
		nextQ++;
	}

	$(".table-alphabet tbody").append('<tr><td style="padding: 0;"></td></tr>');
	
	$('.select2-selection__choice__remove').click( function() {
		setTimeout(function() { 
			getTokens(); 
		}, 100);	
	});
}


var mapEstados;

function map(arrTokens) {
	mapEstados = new Map();
	var q = 0;
	var proximoEstado = 1;
	var add = true;
	var ultimoEstado;
	for(var key in arrTokens) {
		if (key > 0){
			add = false;
		}
		var estadoAtual = 0;
		for(i = 0; i < arrTokens[key].length; i++){
			if (add) {
				if (i == arrTokens[key].length - 1) {
					mapEstados.set(q++, [arrTokens[key][i], proximoEstado++]);
					mapEstados.set(q++, ["*"]);
				} else {
					mapEstados.set(q++, [arrTokens[key][i], proximoEstado++]);
				}
			} else {
				if (mapEstados.get(estadoAtual).indexOf(arrTokens[key][i]) == -1){
					if (i == arrTokens[key].length - 1) {
						mapEstados.get(estadoAtual).push(arrTokens[key][i], proximoEstado++);
						mapEstados.set(q++, ["*"]);
					} else {
						mapEstados.get(estadoAtual).push(arrTokens[key][i], proximoEstado++);
					}
					add = true;
				} else {
					estadoAtual = mapEstados.get(i)[mapEstados.get(i).indexOf(arrTokens[key][i]) + 1];
					if (i == arrTokens[key].length - 1) {
						mapEstados.get(i+1).push("*");
					}
				}
			}
		}
	}
}

function validateTokens(){
	$('#inputValidate').keyup(function () {
		var symbol = $(this).val(); 
		
		if (symbol[symbol.length-1] == " "){
			
		} else { 
			var fieldTable = $('.element-' + (symbol.length - 1) + '-row .symbol-' + symbol[symbol.length-1]).html();
			console.log("teste", fieldTable)
			if (fieldTable || fieldTable == 0) {
				nextState = (fieldTable[fieldTable.length - 1]);
			}	



			if (nextState) {
				nextState--;
				$('tbody tr').removeClass('success wrong');
				$('td').removeClass('wrong selected success selectedWrong');
				$('.element-' + nextState + '-row').addClass('success');
				$('.element-' + nextState + '-row > .symbol-' + symbol[symbol.length-1]).addClass('selected');
				$('.symbol-' + symbol[symbol.length-1]).addClass('success');	
			} else {
				$('tbody tr').removeClass('success wrong selected selectedWrong');
				$('.element-' + lastState + '-row').addClass('wrong');
				$('td').removeClass('success wrong selected selectedWrong');
				$('.symbol-' + symbol[symbol.length-1]).addClass('wrong');
				$('.element-' + lastState + '-row > .symbol-' + symbol[symbol.length-1]).addClass('selectedWrong');
			}
		}
		lastState = nextState;
	});
}
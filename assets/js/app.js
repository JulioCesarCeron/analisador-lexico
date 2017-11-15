$(document).ready(function () {
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

	$('#tokens').change(function () {
		getTokens();
	});

	validateTokens();
});
var validateTeste;
var nextState = 0;
var lastState;
var block = false;
var lastLength;
var mapEstados;


function getTokens() {
	arrTokens = [];
	$("#tokens option").each(function (index) {
		arrTokens.push($(this).text());
	});
	$('#table_elements').fadeIn('slow');
	map(arrTokens);
	getAlphabet(arrTokens);
}

function getAlphabet(arrTokens) {
	var alphabet = [];
	for (var i = 0; i < arrTokens.length; i++) {
		for (var indexLetter = 0; indexLetter < arrTokens[i].length; indexLetter++) {
			if (alphabet.indexOf(arrTokens[i][indexLetter]) == -1) {
				alphabet.push(arrTokens[i][indexLetter]);
			}
		}
	}
	formatTable(alphabet, arrTokens);
}

function formatTable(alphabet, arrTokens) {
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
			if (value.indexOf(alphabet[col]) != -1) {
				$(".element-" + indice + "-row").append('<td class="table-bordered symbol-' + alphabet[col] + '">q' + value[value.indexOf(alphabet[col]) + 1] + '</td>');
			} else {
				$(".element-" + indice + "-row").append('<td class="table-bordered symbol-' + alphabet[col] + '"></td>');
			}
		}
		nextQ++;
	}

	$(".table-alphabet tbody").append('<tr><td style="padding: 0;"></td></tr>');

	$('.select2-selection__choice__remove').click(function () {
		setTimeout(function () {
			getTokens();
		}, 100);
	});
}


function map(arrTokens) {
	mapEstados = new Map();
	var q = 0;
	var proximoEstado = 1;
	var add = true;
	var ultimoEstado;
	for (var key in arrTokens) {
		if (key > 0) {
			add = false;
		}
		var estadoAtual = 0;
		for (i = 0; i < arrTokens[key].length; i++) {
			if (add) {
				if (i == arrTokens[key].length - 1) {
					mapEstados.set(q++, [arrTokens[key][i], proximoEstado++]);
					mapEstados.set(q++, ["*"]);
				} else {
					mapEstados.set(q++, [arrTokens[key][i], proximoEstado++]);
				}
			} else {
				if (mapEstados.get(estadoAtual).indexOf(arrTokens[key][i]) == -1) {
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
						mapEstados.get(i + 1).push("*");
					}
				}
			}
		}
	}
}

function validateTokens() {
	$('#inputValidate').on('keyup', function (event) {
		var symbol = $(this).val();

		if (event.keyCode == 8) {
			if (symbol.length == 0) {
				resetValidate();
			} else {
				backtrack(symbol);
			}
		} else {
			if (symbol.length == 0) {
				resetValidate();
			} else if (symbol[symbol.length - 1] == " "){
				var finalState = $('.element-' + nextState + '-row').find('td:first').html();
				if (finalState.indexOf("*") != -1){
					resetValidate();
					console.log("token encontrado: " + symbol);
				} else {
					resetValidate();
					console.log("não foi possível encontrar o token: " + symbol);
				}
			} else {
				verifySymbol(symbol);
			}
		}

	});
}

function verifySymbol(symbol) {
	if (!block) {
		var fieldTable = $('.element-' + nextState + '-row .symbol-' + symbol[symbol.length - 1]).html();

		if (fieldTable) {
			$('tbody tr').removeClass('success wrong selected selectedWrong');
			$('td').removeClass('wrong selected success selectedWrong');
			$('.element-' + nextState + '-row').addClass('success');
			$('.element-' + nextState + '-row > .symbol-' + symbol[symbol.length - 1]).addClass('selected');
			$('.symbol-' + symbol[symbol.length - 1]).addClass('success');
			lastState = nextState;
			nextState = parseInt(fieldTable[fieldTable.length - 1]);
		} else {
			$('tbody tr').removeClass('success wrong selected selectedWrong');
			$('td').removeClass('success wrong selected selectedWrong');
			$('.element-' + nextState + '-row').addClass('wrong');
			$('.element-' + nextState + '-row > .symbol-' + symbol[symbol.length - 1]).addClass('selectedWrong');
			$('.symbol-' + symbol[symbol.length - 1]).addClass('wrong');
			block = true;
			lastLength = symbol.length;
			lastState = nextState;
		}
	}
}

function backtrack(symbol) {
	console.log("backspace")
	if (lastLength > symbol.length || symbol.length == 0){
		block = false;
	}

	if (!block) {
		var classParent;
		if (lastState > 0) {
			classParent = 	$('.table-alphabet .table-bordered').filter(function() {
								return $(this).text() == 'q' + lastState;
							})["0"].parentNode.className;
		} else {
			classParent = "element-0-row";
		}
	
		$('tbody tr').removeClass('success wrong selected selectedWrong');
		$('td').removeClass('success wrong selected selectedWrong');
	
		$('.symbol-' + symbol[symbol.length - 1]).addClass('success');
		$('.' + classParent).addClass('success');
		$('.table-alphabet .table-bordered').filter(function() {
			return $(this).text() == 'q' + lastState;
		}).addClass('selected');
	
		nextState = lastState;
	
		if (classParent != undefined){
			var state = $('.' + classParent + ' td:first').html();
			lastState = state[state.length - 1];
		} else {
			lastState = 0;
		}	
	}	
}

function resetValidate(){
	$('#inputValidate').val('')
	$('tbody tr').removeClass('success wrong selected selectedWrong');
	$('td').removeClass('success wrong selected selectedWrong');
	nextState = 0;
	lastState = 0;
	block = false;
}
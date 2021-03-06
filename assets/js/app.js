
$(document).ready(function () {
	//configuracoes do input de tokens (foi utilizado a biblioteca 'select2')
	$('#tokens').select2({
		theme: "bootstrap",
		width: "none",
		insertTag: function (data, tag) {
			data.push(tag);
		},
		tags: true,
		tokenSeparators: [',', ' ']
	});

	//a cada novo token inseriro a funcao getTokens() e chamada
	$('#tokens').change(function () {
		getTokens();
	});

	validateTokens();
	toastOptions();
});

//variavel para armazenar o proximo estado no processo de validacao
var nextState = 0;
//variavel para armazenar o ultimo estado no processo de validacao
var lastState;
//bloquear a digitacao caso o simbolo digitado nao exista no token no processo de validacao
var block = false;
//variavel utilizada para desbloquear a ditacao no processo de validacao quando o usuario utilizar o backspace
var lastLength;
// mapa onde sao armazenados todos os estados e simbolos de cada estado
var mapEstados;

//pega o token digitado no input e transoforma em um array de strings
function getTokens() {
	arrTokens = [];
	$("#tokens option").each(function (index) {
		arrTokens.push($(this).text());
	});
	$('#table_elements').fadeIn('slow');
	map(arrTokens);
	getAlphabet(arrTokens);
}

//pega todos os simbolos digitados e adiciona em um array, para gerar o alfabeto da tabela
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

//gera a tabela e já popula os campos com os etados para cada simbolo
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

//cria um map com os estados, adionando cada simbolo do token para cada respectivo estado
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

//funcao para validar os tokens
//e acionada a cada novo simbolo digitado no campo input de validacao
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
			} else if (symbol[symbol.length - 1] == " " || event.keyCode == 13){
				var finalState = $('.element-' + nextState + '-row').find('td:first').html();
				if (finalState.indexOf("*") != -1 && !block){
					resetValidate();
					toastr.success('Token "' + symbol + '" válido')
					validatedToken(symbol);
				} else {
					resetValidate();
					toastr.error('Token "' + symbol + '" inválido')
				}
			} else {
				verifySymbol(symbol);
			}
		}

	});
}

//tenta encontrar o estado do simbolo digitado no campo de validacao
//armazena o ultimo estado
//caso nao encontrar bloqueia a verificacao para novos simbolos digitados
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
			nextState = parseInt(fieldTable.replace("q", ""));
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

//apaga os simbolos digitados
//caso a validacao havia sido bloqueada, se baseia no ultimo tabanho de array para saber qual foi o ultimo simbolo valido digitado
//desbloqueia a verificao para nos simbolos digitados
function backtrack(symbol) {
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
			// lastState = state[state.length - 1];
			lastState = parseInt(state.replace("q", ""));
		} else {
			lastState = 0;
		}	
	}	
}

//limpa todos as colunas e linhas selecionadas quando em processo de validacao de algum simbolo
//zera as variaveis responsaveis por identificar o próximo estado, ultimo estado e bloqueio de digitacao
function resetValidate(){
	$('#inputValidate').val('')
	$('tbody tr').removeClass('success wrong selected selectedWrong');
	$('td').removeClass('success wrong selected selectedWrong');
	nextState = 0;
	lastState = 0;
	block = false;
}

//adiciona token a lista de tokens válidos
function validatedToken(symbol){
	$('#validated-tokens').css("display", "block");
	$('.list-group').append('<li class="list-group-item"><a href="javascript:void(0)" class="badge btn btn-danger btn-xs"><i class="fa fa-times" aria-hidden="true"></i></a>' + symbol + '</li>')
}

//remove token da lista de tokens válidos
$(document).on('click','.btn-danger', function(e){
	e.preventDefault();
	$(this).parent().remove();
}) 

//exibe mensagens quando token válido ou inválio
function toastOptions(){
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-center",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
}
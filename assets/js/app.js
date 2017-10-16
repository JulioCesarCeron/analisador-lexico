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




	var tree = new Tree('0');
	tree._root.children.push(new Node('two'));
	tree._root.children[0].parent = tree;

	tree._root.children.push(new Node('three'));
	tree._root.children[1].parent = tree;

	tree._root.children.push(new Node('four'));
	tree._root.children[2].parent = tree;

	tree._root.children[0].children.push(new Node('five'));
	tree._root.children[0].children[0].parent = tree._root.children[0];

	tree._root.children[0].children.push(new Node('six'));
	tree._root.children[0].children[1].parent = tree._root.children[0];

	tree._root.children[2].children.push(new Node('seven'));
	tree._root.children[2].children[0].parent = tree._root.children[2];


	tree.traverseBF(function(node){
		console.log(node.data);
	})

	console.log("tree", tree);



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

	$(".table-alphabet thead tr").html("");
	$(".table-alphabet thead tr").append("<th>#</th>")
	alphabet.sort();
	for (var i = 0; i < alphabet.length; i++) { 
		$(".table-alphabet thead tr").append("<th>" + alphabet[i] + "</th>");	
	}




	$(".table-alphabet tbody").html("");
	var q = 0;
	var nextQ = 1;
	for (var i = 0; i < arrTokens.length; i++) {
		for(var row = 0; row <= arrTokens[i].length; row++) {
				if(row != arrTokens[i].length) {
					$(".table-alphabet tbody").append('<tr class=element-' + i + '-row-' + row + '><td>q' + q++ + '</td></tr>');
				} else {
					$(".table-alphabet tbody").append('<tr class=element-' + i + '-row-' + row + '><td>q' + q++ + '*</td></tr>');
				}
			for (var col = 0; col < alphabet.length; col++) {
				if (alphabet[col] == arrTokens[i][row]){
					$(".element-" + i + "-row-" + row).append('<td class="table-bordered simbol-' + alphabet[col] + '">q' + nextQ++ + '</td>');		
				} else {
					$(".element-" + i + "-row-" + row).append('<td class="table-bordered simbol-' + alphabet[col] + '"></td>');		
				}
			}
		}
	}
	
	$('.select2-selection__choice__remove').click( function() {
		setTimeout(function() { 
			getTokens(); 
		}, 100);	
	});
}




function Node(data) {
	this.data = data;
	this.parent = null;
	this.children = []
}

function Tree(data) {
	var node = new Node(data);
	this._root = node;
}

Tree.prototype.traverseDF = function(callback) {
	(function recurse(curentNode) {
		for (var i = 0, length = curentNode.children.length; i < length; i++) {
			recurse(curentNode.children[i]);
		}

		callback(curentNode);
	})(this._root);
};


Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();
     
    queue.enqueue(this._root);
 
    currentTree = queue.dequeue();
 
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }
 
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};
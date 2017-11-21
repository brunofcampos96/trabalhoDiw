function getBooks(){
	let booksTable = "";
	getPucLivroJSON().then(function(data){
		let ownFields = data.restify.ownFields;
		tableHeader = "<tr>" + setTableHeader(ownFields);
		document.getElementById("thead").innerHTML = tableHeader +"</tr>";

		booksTable += setTableBody(data.restify.rows, ownFields);
		document.getElementById("tbody").innerHTML = booksTable;
	})
}

function insertBook(){
	let data = "_data=";
	let inputObj = {};
	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		inputObj[inputs[i].id] = inputs[i].value;
		inputs[i].value = "";
	}
	data += JSON.stringify(inputObj);
	$.post("http://www.smartsoft.com.br/webservice/restifydb/empresa/puc_livro/",data,function(callback){
		if(callback.restify.affectedRows){
			getBooks();
		}
	});
}
function getPucLivroJSON(){
	return $.ajax(
		{
			url: "http://www.smartsoft.com.br/webservice/restifydb/empresa/puc_livro/?_view=json"
		}
	);
}

window.onload = function setInputFields(){
	getPucLivroJSON().then(function(data){
		let inputHTML = "";
		data.restify.ownFields.split(",").forEach(function(key){
			inputHTML += '<label for='+key+' class="col-4 col-form-label">'+treatColumnNames(key)+':'+'</label><div class="col-8"><input class="form-control" type="text" id='+key+'></div>'
		})
		document.getElementById("inputs").innerHTML = inputHTML;
	})
}

function setTableHeader(ownFields){
	let columNames = "";
	ownFields.split(",").forEach(function(key){
		columNames += "<th>" + this.treatColumnNames(key) + "</th>";
	});
	return columNames;
}

function setTableBody(rows, ownFields){
	let booksTable = "";
	rows.forEach(function(book){
		booksTable += "<tr>";
		ownFields.split(",").forEach(function(key){
			keyValue = book.values[key].value ? book.values[key].value : " - "; 
			if(key == "imagem_url")
				keyValue = treatImage(book.values[key].value);
			if(key == "descricao")
				keyValue = "<div id ='scroll'>" + keyValue + "</div>";

			booksTable += "<td>" + keyValue + "</td>";
		})
		booksTable += "</tr>";
	})
	return booksTable;
}

function treatColumnNames(columnName){
	let fromTo = {
		"id" 		     : "ID",
		"titulo" 		 : "Título",
		"autor"		     : "Autor",
		"editora"	     : "Editora",
		"ano_lancamento" : "Lançamento",
		"descricao" 	 : "Descrição",
		"status"		 : "Status",
		"imagem_url"	 : "Link para Imagem"
	};

	return fromTo[columnName];
}

function treatImage(value){
	if(value)
		return "<a target='_blank' href = " + keyValue + "> <img src='img/si-glyph-image.svg' style='width:20px; height:auto'> </a>" 
	else
		return "<img src='img/si-glyph-delete.svg' style='width:20px; height:auto'> </a>" 
}
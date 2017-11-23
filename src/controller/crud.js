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

function updateBook(urlComplement){
	let data = setData();
	execRequest("PUT", data, urlComplement);
}

function deleteBook(urlComplement){
	execRequest("DELETE", "", urlComplement);
}

function insertBook(){
	let data = setData();
	execRequest("POST", data);
}

function setData(){
	let data = "_data=";
	let inputObj = {};
	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		inputObj[inputs[i].id] = inputs[i].value;
		inputs[i].value = "";
	}
	return data += JSON.stringify(inputObj);
}

function execRequest(method,data, urlComplement){
	$.ajax(
		{
			url :"http://www.smartsoft.com.br/webservice/restifydb/empresa/puc_livro/"+ urlComplement,
			type: method,
			success: function(callback){
				if(callback.restify.affectedRows){
					getBooks();
				}
			},
			data: data
		}
	)
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
			let input = "<input class='form-control' type='text' id="+key+">"
			let imagem_urlInput = "<input class='form-control' type='text' onfocusout='loadImage()' id="+key+">"
			input = key == "imagem_url" ? imagem_urlInput : input;
			inputHTML += '<label for='+key+' class="col-4 col-form-label">'+treatColumnNames(key)+':'+'</label><div class="col-8">'+ input +'</div>'
		})
		document.getElementById("inputs").innerHTML = inputHTML;
	})
}

function loadImage(){
	let imgUrl = document.getElementById("imagem_url").value;
	if(imgUrl)
		document.getElementById("bookImg").innerHTML = "<img id='bookImage' src="+imgUrl+" width='100%'>";
}

function setTableHeader(ownFields){
	let columNames = "<th>#</th>";
	ownFields.split(",").forEach(function(key){
		columNames += "<th>" + this.treatColumnNames(key) + "</th>";
	});
	return columNames;
}

function setTableBody(rows, ownFields){
	let booksTable = "";

	rows.forEach(function(book){
		let bookInfo = JSON.stringify({
			"bookValues":book.values,
			"ownFields":ownFields
		});
		booksTable += "<tr><td><img src='img/si-glyph-arrow-thin-up.svg' width='22px' height='22px' onclick='fillInputs("+bookInfo+");' /></td>";
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

function fillInputs(bookInfo){
	bookInfo.ownFields.split(",").forEach(function(key){
		document.getElementById(key).value = bookInfo.bookValues[key].value;
	})
	loadImage();
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
		return "<a target='_blank' href = " + keyValue + "> <img src="+keyValue+" style='width:50px; height:auto'> </a>" 
	else
		return "<img src='img/si-glyph-delete.svg' style='width:20px; height:auto'> </a>" 
}
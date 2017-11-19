function getBooks(){
	booksTable = "";
	$.ajax(
		{
			url: "http://www.smartsoft.com.br/webservice/restifydb/empresa/puc_livro/?_view=json",
			success: function(data){
				ownFields = data.restify.ownFields;
				tableHeader = "<tr>" + setTableHeader(ownFields);
				document.getElementById("thead").innerHTML = tableHeader +"</tr>";

				booksTable += setTableBody(data.restify.rows);
				document.getElementById("tbody").innerHTML = booksTable;
			}
		}
	);

	
}

function setTableHeader(ownFields){
	columNames = "";
	ownFields.split(",").forEach(function(key){
		columNames += "<th>" + this.treatColumnNames(key) + "</th>";
	});
	return columNames;
}

function setTableBody(rows){
	rows.forEach(function(book){
		booksTable += "<tr>";
		ownFields.split(",").forEach(function(key){
			keyValue = book.values[key].value ? book.values[key].value : " - "; 
			if(key == "imagem_url")
				keyValue = treatImage(book.values[key].value);

			booksTable += "<td>" + keyValue + "</td>";
		})
		booksTable += "</tr>";
	})
	return booksTable;
}

function treatColumnNames(columnName){
	fromTo = {
		"id" 		     : "#",
		"titulo" 		 : "Título",
		"autor"		     : "Autor",
		"editora"	     : "Editora",
		"ano_lancamento" : "Ano de Lançamento",
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
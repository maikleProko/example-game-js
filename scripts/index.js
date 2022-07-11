function store(){
	let input = document.getElementById("id001");
	let username = input.value;
	if(username == ""){
		window.alert("Input your username!");
	}else{
		window.location.href = "/level1";
		localStorage["tetris.username"] = input.value;
	}	
}

function read(source){
	if(localStorage["tetris.username"] != undefined){
		source.value = localStorage["tetris.username"];
	}
}
function reading() {
	localStorage.setItem('records', JSON.stringify([]));
}
let a = JSON.parse(localStorage.getItem("records"));
console.log(a)
if((a==[])||(a==undefined)){

window.addEventListener('load', reading);
reading();
}
printRecords();


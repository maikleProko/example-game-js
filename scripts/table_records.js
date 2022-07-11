//fs = require("fs");

function readRec() {
    let a = JSON.parse(localStorage.getItem("records"));
    return a;

}

function writeRec(user_test) {
    let a = JSON.parse(localStorage.getItem("records"));
    a.push(user_test);
    a.sort((x,y) => {
        return y.scores - x.scores;
    });
    localStorage.setItem('records', JSON.stringify(a));
}

function deleteRec(name) {
    let a = JSON.parse(localStorage.getItem("records"));
    for(var i = 0; i<a.length; i++) {
        if(a[i].name === name) {
            a.splice(i,1)
            break
        }
    }
}

function printRecords() {
        var canvas1 = document.getElementById("table_records");
        var ctx = canvas1.getContext("2d");
        ctx.font = "16px cambria";
        ctx.clearRect(0,0, 500,500);
        ctx.fillText("  Table records:", 5, 10);
        let a = readRec();
        for(let i = 0; i < a.length; i++) {
              ctx.fillText(a[i].name + " " + a[i].scores, 5, 30*(i+1));
        }
}


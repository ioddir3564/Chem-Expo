function on() {
    document.getElementById("create").style.display = "block";
}

function off() {
    document.getElementById("create").style.display = "none";
  }

function edit(id){
    document.getElementById(id).style.display = "block";
    var list = document.querySelectorAll(".card-body")
    console.log(list);
    var end = list.length-1;
    var index = 0;
    while (end != id){
        end--;
        index++
    }
    console.log(index);
    list[index].style.display = "none"

}
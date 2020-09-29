window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.querySelector("#header1");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;


// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}


function myFunction2(event) {
  // Declare variables
  var input = document.getElementById('search');
  var list = document.querySelectorAll(".Post")
  
  var arr = []
  var word = ""
  
  // console.log(input.value);
  // console.log(list);
  
  // Loop through all list items, and hide those who don't match the search query
  for (var i = 0; i < input.value.length; i++){
    
    if (i == input.value.length-1) {
      word += input.value[i].toLowerCase()
      arr.push(word)
      word = ""
    }
    else if (input.value[i] != " "){
      word += input.value[i].toLowerCase()
    }
    else{
      arr.push(word)
      word = ""
    }
  }
  // console.log(arr);
  var arr_post = []
  var title = ""
  var content = ""
  var tup = []
  word = ""
  console.log(list[0].childNodes);
  console.log(list[0].childNodes[7]);
  for (var i = 0; i < list.length; i++){
    title = list[i].childNodes[7].innerHTML.toLowerCase()
    author = list[i].childNodes[9].innerHTML.toLowerCase()
    content = list[i].childNodes[11].innerHTML.toLowerCase()
    for (var t = 0; t < title.length; t++){
      if (t == title.length-1){
        word += title[t]
        tup.push(word)
        word = ""
      }
      else if (title[t] != " "){
        word += title[t]
      }
      else{
        tup.push(word)
        word = ""
      }
    }
    for (var t = 0; t < author.length; t++){
      if (t == author.length-1){
        word += author[t]
        tup.push(word)
        word = ""
      }
      else if (author[t] != " "){
        word += author[t]
      }
      else{
        tup.push(word)
        word = ""
      }
    }
    for (var t = 0; t < content.length; t++){
      if (t == content.length-1){
        word += content[t]
        tup.push(word)
        word = ""
      }
      else if (content[t] != " "){
        word += content[t]
      }
      else{
        tup.push(word)
        word = ""
      }
        
  }
    arr_post.push([list[i], tup])
    tup = []
}
  // console.log(arr_post);
  var show = []
  for (var i = 0; i < arr_post.length; i++){
    var collection = arr_post[i][1]
    // console.log(collection);
      for (var j = 0; j < arr.length; j++){
      if (collection.includes(arr[j])){
        if (!show.includes(arr_post[0])){
          show.push(arr_post[i][0])
        }
      }
    }
  }
  // console.log(show);

  for (var i = 0; i < list.length; i++){
    if (show.length == 0){
      list[i].style.display = ""
    }
    else if (show.includes(list[i])){
      list[i].style.display = ""
    }
    else{
      list[i].style.display = "none"
    }
  }
}

function on(index) {
  // console.log(index);
  document.getElementById(index).style.display = "block";

}

function off(index) {
  document.getElementById(index).style.display = "none";
}
  // console.log("-");
  // console.log(arr_post[0][1][0].innerHTML);
  // console.log("-");
  
  // for (var i = 0; i < arr_post.length; i++){
  //   for (var j = 0; j < arr.length; j++){

  //     if (arr_post[0][1][0].innerHTML.toLowerCase() == (arr[j])){
  //       console.log("match");

  //     }
  //   }
  // }



// function uniKeyCode(event){
//   var key = event.keyCode;
//   if (key == 13){
//     var input = document.getElementById('search');
//     var list = document.querySelectorAll(".Post")
    
//     var arr = []
//     var word = ""
    
//     // Loop through all list items, and hide those who don't match the search query
//     for (var i = 0; i < input.value.length; i++){
    
//       console.log(key);
//       if (i == input.value.length-1) {
//         word += input.value[i]
//         arr.push(word)
//         word = ""
//       }
//       else if (input.value[i] != " "){
//         word += input.value[i]
//       }
      
//       else{
//         arr.push(word)
//         word = ""
//       }
//     }
//     console.log(arr);
//   }
  
// }


/*
playerNameBox.addEventListener('keydown', (e) => { 
  if (e.key === 'Enter') {
    e.preventDefault()
    var playerName = document.getElementById("playerNameBox").value
    document.getElementById("statusmsg").textContent = playerName
    
    // document.getElementById("addPlayer").submit()//  Trigger form submission
  }
})



function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var ul, li, a, i;
  let input = document.getElementById("myInput");
  let filter = input.value.toUpperCase();
  let div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('#myInput') ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};
*/

export default function ReportScore(){
    return(
        <p>reportscore</p>
        // <div class="dropdown">
        //   <button onclick="toggleDropdown()" class="dropbtn">Dropdown</button>
        //   <div id="myDropdown" class="dropdown-content">
        //     <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()"></input>
        //     <a href="#about">About</a>
        //     <a href="#base">Base</a>
        //     <a href="#blog">Blog</a>
        //     <a href="#contact">Contact</a>
        //     <a href="#custom">Custom</a>
        //     <a href="#support">Support</a>
        //     <a href="#tools">Tools</a>
        //   </div>
        // </div>
    )
}
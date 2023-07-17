// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase, set, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2Hkd30F3HqihhhyvIQSmb7b75ew9_7qI",
  authDomain: "ranked-mini.firebaseapp.com",
  projectId: "ranked-mini",
  storageBucket: "ranked-mini.appspot.com",
  messagingSenderId: "866464034729",
  appId: "1:866464034729:web:0f3478e4ca158c3f4cdeb8",
  measurementId: "G-RGP9QTVCLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

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
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
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


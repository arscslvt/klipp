var db = firebase.firestore();

const loginPage = document.getElementById("loginPage");
const userPage = document.getElementById("userPage");

const loading = document.getElementById("loading");
const logoutbt = document.getElementById("logoutbt");

var cat = "";
var author;
var uid;

document.getElementById("loginbt").addEventListener("click", function(){

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    loading.style.display = "initial";

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
    })
    .catch((error) => {
        loading.style.display = "none";

        var errorCode = error.code;
        var errorMessage = error.message;

        alert("Errore: " + errorCode + "\n" + errorMessage);
    });
})

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        uid = user.uid;
        console.log("logged: " + uid)
        logoutbt.style.display = 'initial';
        userPage.style.display = 'initial';
        loginPage.style.display = 'none';
        loading.style.display = "none";

        var docRef = db.collection("users").doc(uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                author = doc.data().name;
                console.log(author);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    } else {
      // User is signed out
      
    }
  });

logoutbt.addEventListener("click", function(){
    firebase.auth().signOut().then(() => {
        userPage.style.display = 'none';
        loginPage.style.display = 'flex';
      }).catch((error) => {
        // An error happened.
      });
})

document.getElementById("politica").addEventListener("click", function(){
    cat = "politica";
    document.getElementById("tecnologia").style.opacity = 0.5;
    document.getElementById("eco").style.opacity = 0.5;
    document.getElementById("politica").style.opacity = 1;
})
document.getElementById("tecnologia").addEventListener("click", function(){
    cat = "tecnologia";
    document.getElementById("tecnologia").style.opacity = 1;
    document.getElementById("eco").style.opacity = 0.5;
    document.getElementById("politica").style.opacity = 0.5;
})
document.getElementById("eco").addEventListener("click", function(){
    cat = "eco";
    document.getElementById("tecnologia").style.opacity = 0.5;
    document.getElementById("eco").style.opacity = 1;
    document.getElementById("politica").style.opacity = 0.5;
})

document.getElementById("publish").addEventListener("click", function(){
    var title = document.getElementById("title").value;
    var text = document.getElementById("text").value;

    console.log("Titolo: " + title);
    console.log("Categoria: " + cat);
    console.log("Titolo: " + text);

    db.collection("articles").add({
        title: title,
        author: author,
        cat: cat,
        text: text
    })
})
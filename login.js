const signUp = document.getElementById("signUp")
const loginP = document.getElementById("loginPage");
const signP = document.getElementById("signupPage");
const resetPass = document.getElementById("forgetPass");

var db = firebase.firestore();

resetPass.addEventListener("click", passwordReset);

signUp.addEventListener("click", function(){
    if (loginP.style.display == 'none'){
        loginP.style.display = 'flex'
        signP.style.display = 'none'

        signUp.innerHTML = "Sign up"
    }else{
        loginP.style.display = 'none'
        signP.style.display = 'flex'
        signUp.innerHTML = "Login"

    }
})

document.getElementById("loginBt").addEventListener("click", function(){

    var email = document.getElementById("logemail").value;
    var password = document.getElementById("logpassword").value;

    loading.style.display = "initial";

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        loading.style.display = "none";
        window.location.assign("index.html");
    })
    .catch((error) => {
        loading.style.display = "none";

        var errorCode = error.code;
        var errorMessage = error.message;

        alert("Errore: " + errorCode + "\n" + errorMessage);
    });
})

document.getElementById("signBt").addEventListener("click", function(){

    var name = document.getElementById("rname").value;
    var surname = document.getElementById("rsurname").value;
    var email = document.getElementById("remail").value;
    var password = document.getElementById("rpassword").value;

    loading.style.display = "initial";

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        db.collection("users").doc(user.uid).set({
            name: name,
            surname: surname,
            email: email,
            userImage: "generic/noUserImage.png",
            bio: "",
            nat: "",
            city: "",
            birth: "",
            phone: "",
        })
        .then(() => {
            console.log("Document successfully written!");
            loading.style.display = "none";
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            loading.style.display = "none";
        });
        alert("Hi " + name + ", go to login to access Klipp.");
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
    });
})

// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//         // User is signed in
//         uid = user.uid;
//         console.log("logged: " + uid);
//         loading.style.display = "none";
//         window.location.assign("index.html");
//     } else {
//       // User is signed out
      
//     }
// });

function passwordReset(){
    var auth = firebase.auth();
    var emailAddress = document.getElementById("logemail").value;

    if(emailAddress!=""){
        auth.sendPasswordResetEmail(emailAddress).then(function() {
            alert("Check your mailbox! We sent you a password reset link.");
        }).catch(function(error) {
            alert("Mmh, this is an unregisterd email. Try to sign up!");
        });
    }else{
        alert("Type your email first.");
    }
    
}
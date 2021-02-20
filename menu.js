document.getElementById("goHome").addEventListener("click", function(){
    window.location.assign("index.html");
});

document.getElementById("logoutBt").addEventListener("click", function(){
    firebase.auth().signOut().then(() => {
        window.location.assign("login.html");
      }).catch((error) => {
        alert(error);
      });
})
document.getElementById("userProfile").addEventListener("click", function(){
    $(document).ready(function(){
        $('#view').load("user.html");
     });
    // window.location.assign("user.html");
});
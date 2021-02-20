var db = firebase.firestore();
var username = document.getElementById("username");

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        uid = user.uid;
        // console.log("user: " + uid);

        var docRef = db.collection("users").doc(uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                username.innerText = doc.data().name;
                getProfileImage(uid);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting user:", error);
        });
    } else {
        window.location.assign("login.html");
    }
});

function getProfileImage(uid){
    var storage = firebase.storage();
    var storageRef = storage.ref();

    var docRef = db.collection("users").doc(uid);

    docRef.get().then((doc) => {
        // console.log("image uid: " + doc.data().userImage);
        if (doc.exists) {
            var image = doc.data().userImage;
            var spaceRef = storageRef.child(uid + "/" + image);
            if(image != "generic/noUserImage.png"){
                spaceRef.getDownloadURL().then(function(url) {
                    var x = document.getElementsByClassName("myImage");
                    var y = document.getElementsByClassName("myIndexImage");
                    for (var i = 0; i < x.length; i++) {
                        x[i].src = url;
                        y[i].src = url;
                    }
                }).catch(function(error) {
                    console.log("i dont have an image");
                });
            }
        } else {
            // doc.data() will be undefined in this case
            // alert("Cannot find your user image, try to contact us via email.");
            alert(doc.data());
        }
    }).catch((error) => {
        console.log("Error getting image:", error);
    });

    return;
}
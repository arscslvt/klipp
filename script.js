navigator.serviceWorker.register('/service-worker.js');
$(function(){
    $(".menu").load("menu.html");
});

var username = document.getElementById("username");
var articleDiv = document.getElementById("articles");

if (articleDiv.offsetHeight + articleDiv.scrollTop >= articleDiv.scrollHeight) {
    db.collection("articles").orderBy("date", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            
            // doc.data() is never undefined for query doc snapshots
            var data = doc.data();
            var id = doc.id;
            var aut = doc.data().author;
            // console.log(id);
            getArticles(data, id, aut);
        });
    });
}

function getArticles(data, id, aut){

    // Creating article div

    var article = document.createElement("div");
    var title = document.createElement("span");
    var by = document.createElement("div");
    var profilePicture = document.createElement("img");
    var fromDiv = document.createElement("div");
    var author = document.createElement("span");
    var date = document.createElement("span");
    var text = document.createElement("span");
    var control = document.createElement("div");
    var like = document.createElement("div");
    var likeCount = document.createElement("span");
    var comment = document.createElement("div");
    var commentCount = document.createElement("span");


    by.appendChild(profilePicture);
    fromDiv.appendChild(author);
    fromDiv.appendChild(date);
    by.appendChild(fromDiv);
    control.appendChild(like);
    if(aut == firebase.auth().currentUser.uid){
        control.appendChild(comment);
    }
    like.appendChild(likeCount);
    comment.appendChild(commentCount);
    article.appendChild(by);
    article.appendChild(title);
    article.appendChild(text);
    article.appendChild(control);
    // article.appendChild(control);

    // Checking user

    var docRef = db.collection("users").doc(aut);
    var dbAuthor;
    var dbImage;

    // console.log(docRef.id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            dbAuthor = doc.data().name + " " + doc.data().surname;
            dbImage = doc.data().userImage;
            author.innerText = dbAuthor;
            
            // Create a reference to the file we want to download
            if(dbImage != "generic/noUserImage.png"){
                var storageRef = firebase.storage();    
                var pathReference = storageRef.ref('/' + aut + '/' + dbImage);
                //var starsRef = storageRef.child('/' + user + '/profilePicture/' + file.name);

                // Get the download URL
                pathReference.getDownloadURL().then(function(url) {
                // Insert url into an <img> tag to "download"
                    // console.log("userImage: " + doc.data().userImage + "\n Setting image: " + url);
                    profilePicture.src = url;
                });
            }else{
                profilePicture.src = "assets/noUserImage.png";
            }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    // Getting Date and time
    var d = new Date(data.date.toMillis());
    var nowDate = 
        ("0" + d.getDate()).slice(-2) + '-' +
        ("0" + (d.getMonth()+1)).slice(-2) + '-' + 
        d.getFullYear() + ' at ' +
        d.getHours() + ':' +
        d.getMinutes()
    ;

    // Setting innerText

    title.innerText = data.title;
    date.innerText = nowDate;
    text.innerText = data.text;
    likeCount.innerText = 0;

    // commentCount.innerText = data.comments;

    // Setting classes
    
    control.id = id;
    profilePicture.classList = "myIndexImage";
    by.classList = "articleBy";
    fromDiv.classList = "articleFrom";
    author.classList = "articleAuthor";
    date.classList = "articleDate";
    article.classList = "article";
    title.classList = "articleTitle";
    text.classList = "articleText";
    control.classList = "articleControls";

    console.log(like.parentNode.id);

    var nowUser = firebase.auth().currentUser;
    var docRef = db.collection("articles").doc(like.parentNode.id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            var length = doc.data().likers.length;
            for(i=0; i<length; i++){
                if(doc.data().likers[i] == nowUser.uid){
                    like.style.backgroundColor = "#3864FF";
                    like.style.opacity = 1;
                }else{
                    like.style.backgroundColor = "#2b2b2b";
                }
                docRef.onSnapshot((doc) => {
                    var nLikes = parseInt(data.likers.length) - 1;
                    likeCount.innerText = nLikes;
                });
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    like.classList = "controlsLike";
    likeCount.classList = "likeCount";
    likeCount.id = "like"+id;
    comment.classList = "controlsTrash";

    document.getElementById("articles").appendChild(article);
}

$(document).on('click', '.controlsLike', function (){

    var nowUser = firebase.auth().currentUser;

    var docRef = db.collection("articles").doc(this.parentNode.id);

    docRef.get().then((doc) => {
        if (doc.exists) {
            var length = doc.data().likers.length;
            for(i=0; i<length; i++){
                if(doc.data().likers[i] == nowUser.uid){
                    docRef.update({
                        likers: firebase.firestore.FieldValue.arrayRemove(nowUser.uid)
                    })
                    this.style.backgroundColor = "#2b2b2b";
                    this.style.opacity = 0.5;
                }else{
                    docRef.update({
                        likers: firebase.firestore.FieldValue.arrayUnion(nowUser.uid)
                    })
                    this.style.backgroundColor = "#3864FF";
                    this.style.opacity = 1;
                }
                    docRef.onSnapshot((doc) => {
                        this.innerText = parseInt(doc.data().likers.length) - 1;
                    });
            }
        } else {
            // doc.data() will be undefined in this case
            alert("Uhm, seems like post was deleted. Damn.");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});

function setComment(id){
    
}

$(document).on('click', '.controlsTrash', function (){
    var docRef = db.collection("articles").doc(this.parentNode.id);

    if (confirm('Are you sure you want to delete this post?')) {
        // Remove
        docRef.delete().then(() => {
            console.log("Document successfully deleted!");
            window.location.reload();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      } else {
        // Do nothing
        console.log('Deleting function cancelled.');
      }
});
// STATIC FUNCTIONS
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", function(){
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        toTop.style.display = "block";
      } else {
        toTop.style.display = "none";
      }
})

toTop.addEventListener("click", function(){
    document.body.scrollTo({    //for Safari
        top: 0,
        behavior: 'smooth'
    })
    document.documentElement.scrollTo({  // For Chrome, Firefox, IE and Opera
        top: 0,
        behavior: 'smooth'
    }) 
})

let installPromptEvent;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault();
  // Stash the event so it can be triggered later.
  installPromptEvent = event;
  // Update the install UI to notify the user app can be installed
//   document.querySelector('#install-button').disabled = false;
});
// LOGIN FUNCTION

// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//         // User is signed in
//         uid = user.uid;
//         console.log("user: " + uid);

//         var docRef = db.collection("users").doc(uid);

//         docRef.get().then((doc) => {
//             if (doc.exists) {
//                 username.innerText = doc.data().name;
//                 getProfileImage(uid);
//             } else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//             }
//         }).catch((error) => {
//             console.log("Error getting user:", error);
//         });
//     } else {
//         window.location.assign("login.html");
      
//     }
// });

function readURL(input){
    // Create a root reference
    var storageRef = firebase.storage().ref();

    // Create a reference to 'mountains.jpg'
    var mountainsRef = storageRef.child('mountains.jpg');

    // Create a reference to 'images/mountains.jpg'
    var mountainImagesRef = storageRef.child('images/mountains.jpg');

    // While the file names are the same, the references point to different files
    mountainsRef.name === mountainImagesRef.name;           // true
    mountainsRef.fullPath === mountainImagesRef.fullPath;   // false
}

function getUsersImage(ref){
    // console.log("Setting post image of: " + ref);

    // Create a reference to the file we want to download
    var storageRef = firebase.storage();    
    var pathReference = storageRef.ref(ref);
    var repo;
    //var starsRef = storageRef.child('/' + user + '/profilePicture/' + file.name);

    // Get the download URL
    pathReference.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
        repo = url;
        console.log(repo);
    });

    return repo;
}

var addPost = document.getElementById("addPost")
var newPost = document.getElementById("newPost")
var newTitle = document.getElementById("title");
var newText = document.getElementById("text");
var newPublish = document.getElementById("publish");
var newClose = document.getElementById("closePost");

addPost.addEventListener("click", function(){
    newPost.style.animation = 'fadeIn 0.2s ease-in-out';
    newPost.style.display = 'initial';
    addPost.style.display = 'none';
})

newTitle.addEventListener("click", function(){
    newTitle.setAttribute("placeholder", "Choose a title");
    newText.style.display = 'initial';
    newPublish.style.display = 'initial';
})

newClose.addEventListener("click", function(){
    newPost.style.animation = 'fadeOut 0.2s ease-in-out';
    addPost.style.display = 'initial';
    setTimeout(function(){
        newPost.style.display = 'none';
    }, 180)
})

newPublish.addEventListener("click", function(){
    var user = firebase.auth().currentUser;
    // console.log("publish by: " + user);

    var docRef = db.collection("users").doc(user.uid);

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "-"
                    + (currentdate.getMonth()+1)  + "-" 
                    + currentdate.getFullYear() + "T"  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    // console.log(datetime);

    docRef.get().then((doc) => {
        if (doc.exists) {

            //myarticles: firebase.firestore.FieldValue.arrayUnion(docRef.id)

            var author = doc.data().name + " " + doc.data().surname;
            db.collection("articles").add({
                author: user.uid,
                title: newTitle.value,
                text: newText.value,
                like: 0,
                likers: ["autolk"],
                date: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                
                var addArray = db.collection("users").doc(user.id);

                // Atomically add a new region to the "regions" array field.
                addArray.update({
                    myarticles: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                });
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
})


function getUserSettings(myImage, myName, mySurname, myBirth, myNat, myCity, myPhone, myBio){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var docRef = db.collection("users").doc(user.uid);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    myName.value = doc.data().name;
                    mySurname.value = doc.data().surname;

                    var storageRef = firebase.storage();    
                    var pathReference = storageRef.ref('/' + user.uid + '/' + doc.data().userImage);
                    //var starsRef = storageRef.child('/' + user + '/profilePicture/' + file.name);

                    // Get the download URL
                    pathReference.getDownloadURL().then(function(url) {
                        // Insert url into an <img> tag to "download"
                        
                        myImage.src = url;
                    });
                    if(doc.data().birth){
                        console.log(doc.data().birth.toMillis());
                        var parsedTimestamp = new Date(doc.data().birth.toMillis());
                        console.log(parsedTimestamp);
                        myBirth.value = parsedTimestamp.getFullYear() + '-' + parsedTimestamp.getMonth() + '-' + parsedTimestamp.getDate();
                    }
                    if(doc.data().nat){
                        myNat.value = doc.data().nat;
                    }
                    if(doc.data().city){
                        myCity.value = doc.data().city;
                    }
                    if(doc.data().phone){
                        myPhone.value = doc.data().phone;
                    }
                    if(doc.data().bio){
                        myBio.value = doc.data().bio;
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such settings here!");
                }
            }).catch((error) => {
                console.log("Error getting settings:", error);
            });
        } else {
          // No user is signed in.
        }
      });
}

function setUserSettings(myImage, myName, mySurname, myBirth, myNat, myCity, myPhone, myBio){
    console.log(myBirth.value);
    db.collection("users").doc(firebase.auth().currentUser.uid).update({
        name: myName.value,
        surname: mySurname.value,
        // birth: firebase.firestore.Timestamp.fromDate(new Date(myBirth.value)),
        nat: myNat.value,
        city: myCity.value,
        phone: myPhone.value,
        bio: myBio.value
    })
    .then(() => {
        alert("Settings updated.");
        window.location.reload();
        console.log("User settings updated.");
    })
    .catch((error) => {
        console.error("Error writing settings: ", error);
    });
    
}

function setUserImage(myImage){
    var input = document.createElement("input");
    input.type = "file";

    var filename;

    input.onchange = e => {
        files = e.target.files;
        filename = e.target.files[0].name;
        reader = new FileReader();
        reader.onload = function(){
            myImage.src = reader.result;
        }
        reader.readAsDataURL(files[0]);
        
        var user = firebase.auth().currentUser.uid;
        var uploadImage = firebase.storage().ref(user + "/" + filename).put(files[0]);

        db.collection("users").doc(user).update({
            userImage: filename
        })

        var storageRef = firebase.storage();    
        var pathReference = storageRef.ref('/' + user + '/' + doc.data().userImage);
        //var starsRef = storageRef.child('/' + user + '/profilePicture/' + file.name);

        // Get the download URL
        pathReference.getDownloadURL().then(function(url) {
            myImage.src = url;
        });
    }
    input.click()
}
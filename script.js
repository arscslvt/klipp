var db = firebase.firestore();

navigator.serviceWorker.register('/service-worker.js');

var username = document.getElementById("username");

db.collection("articles").orderBy("date", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        var data = doc.data();
        var id = doc.id;
        getArticles(data, id);
    });
});

// db.collection("articles").doc()
//     .onSnapshot((doc) => {
//         var data = doc.data();
//         getArticles(data);
//     });

function getArticles(data, id){
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
    like.appendChild(likeCount);
    control.appendChild(comment);
    comment.appendChild(commentCount);
    article.appendChild(by);
    article.appendChild(title);
    article.appendChild(text);
    // article.appendChild(control);

    title.innerText = data.title;
    author.innerText = data.author;

    // Getting Date and time
    var dateTime = new Date(data.date.toMillis());
    var day = dateTime.getDate();
    var month = dateTime.getMonth();
    var year = dateTime.getFullYear();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();

    date.innerText = day + "-" + month + "-" + year + " at " + hour + ":" + minute,
    text.innerText = data.text;
    likeCount.innerText = data.like;
    commentCount.innerText = data.like;

    profilePicture.src = "assets/noUserImage.png";
    by.classList = "articleBy";
    fromDiv.classList = "articleFrom";
    author.classList = "articleAuthor";
    date.classList = "articleDate";
    article.classList = "article";
    title.classList = "articleTitle";
    control.classList = "articleControls";
    like.classList = "controlsLike";

    like.id = "l." + id;
    like.setAttribute("onclick", "setLike(this.id)");

    comment.classList = "controlsComment";
    
    text.classList = "articleText";

    document.getElementById("articles").appendChild(article);
}

function setLike(id){
    var aid = id.slice(2);

    var postRef = db.collection("articles").doc(aid);

    // Set the "capital" field of the city 'DC'
    return postRef.update({
        like: firebase.firestore.FieldValue.increment(1)
    })
    .then(() => {
        console.log("Document successfully updated!\n: " + db.collection("articles").get().data().like);
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function setComment(id){

}
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

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        uid = user.uid;
        console.log("user: " + uid);

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

document.getElementById("logoutBt").addEventListener("click", function(){
    firebase.auth().signOut().then(() => {
        window.location.assign("login.html");
      }).catch((error) => {
        alert(error);
      });
})

function getProfileImage(uid){
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var image;

    var docRef = db.collection("users").doc(uid);

    docRef.get().then((doc) => {
        // console.log("image uid: " + doc.data().userImage);
        if (doc.exists) {
            var image = doc.data().userImage;
            var spaceRef = storageRef.child(image);

        spaceRef.getDownloadURL().then(function(url) {
            document.getElementById("userImage").src = url;

            }).catch(function(error) {
                alert("cannot get image: " + error);
            });

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

var newTitle = document.getElementById("title");
var newText = document.getElementById("text");
var newPublish = document.getElementById("publish");

newTitle.addEventListener("click", function(){
    newTitle.setAttribute("placeholder", "Choose a title");
    newText.style.display = 'initial';
    newPublish.style.display = 'initial';
})

newTitle.addEventListener("focusout", function(){
    if(newTitle.value == ""){
        newTitle.setAttribute("placeholder", "Write a new post...");
        newText.style.display = 'none';
        newPublish.style.display = 'none';
    }
})

newPublish.addEventListener("click", function(){
    var user = firebase.auth().currentUser;

    var docRef = db.collection("users").doc(user.uid);

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "-"
                    + (currentdate.getMonth()+1)  + "-" 
                    + currentdate.getFullYear() + "T"  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    console.log(datetime);

    docRef.get().then((doc) => {
        if (doc.exists) {
            var author = doc.data().name + " " + doc.data().surname;
            db.collection("articles").add({
                author: author,
                title: newTitle.value,
                text: newText.value,
                like: 0,
                date: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
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

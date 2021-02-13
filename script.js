var db = firebase.firestore();

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope:',  registration.scope);
  }).catch(function(error) {
    console.log('ServiceWorker registration failed:', error);
  });
}

db.collection("articles").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        var data = doc.data();
        getArticles(data);
    });
});

// db.collection("articles").doc()
//     .onSnapshot((doc) => {
//         var data = doc.data();
//         getArticles(data);
//     });

function getArticles(data){
    var article = document.createElement("div");
    var title = document.createElement("span");
    var by = document.createElement("div");
    var profilePicture = document.createElement("img");
    var author = document.createElement("span");
    var text = document.createElement("span");

    by.appendChild(profilePicture);
    by.appendChild(author);
    article.appendChild(by);
    article.appendChild(title);
    article.appendChild(text);

    title.innerText = data.title;
    author.innerText = data.author;
    text.innerText = data.text;

    profilePicture.src = "assets/noUserImage.png";
    by.classList = "articleBy";
    author.classList = "articleAuthor";
    article.classList = "article";
    title.classList = "articleTitle";
    
    text.classList = "articleText";

    document.getElementById("articles").appendChild(article);
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

let deferredPrompt;
const installApp = document.querySelector('#installApp');
//installApp.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    alert("install");
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    installApp.style.display = 'block';
  
    installApp.addEventListener('click', (e) => {
      alert("Add to home");
      // hide our user interface that shows our A2HS button
      installApp.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });

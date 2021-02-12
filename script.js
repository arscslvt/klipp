var db = firebase.firestore();

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

    title.innerHTML = data.title;
    author.innerHTML = data.author;
    text.innerHTML = data.text;

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
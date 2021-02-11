var firebaseConfig = {
    apiKey: "AIzaSyA6UBUHp0MP-N6UZDSTlAFR-cIh2U8wL5U",
    authDomain: "klip-f37eb.firebaseapp.com",
    projectId: "klip-f37eb",
    storageBucket: "klip-f37eb.appspot.com",
    messagingSenderId: "389002540066",
    appId: "1:389002540066:web:98a8dcfb5770cba409867b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
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
    var catP = document.createElement("p");
    var cat = document.createElement("span");
    var title = document.createElement("span");
    var author = document.createElement("span");
    var text = document.createElement("span");

    article.appendChild(catP);
    catP.appendChild(cat);
    article.appendChild(title);
    article.appendChild(author);
    article.appendChild(text);

    cat.innerHTML = data.cat;
    title.innerHTML = data.title;
    author.innerHTML = "di " + data.author;
    text.innerHTML = data.text;

    console.log(data.cat);

    switch(data.cat){
        case 'tecnologia':
            cat.classList = "tecnologia";
        break;
        case 'politica':
            cat.classList = "politica";
        break;
        case 'eco':
            cat.classList = "eco";
        break;

    }
    article.classList = "article";
    title.classList = "articleTitle";
    author.classList = "articleAuthor";
    text.classList = "articleText";

    document.getElementById("articles").appendChild(article);
}
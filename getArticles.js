const container = document.querySelector(".articles");

const getNextPosts = async () => {

    console.log("adding");

    const ref = db.collection('articles')
        .orderBy("date", "desc")
        .limit(8);

    const data = await ref.get();

    var nLikes;

    let template = '';

    data.docs.forEach(doc => {
        const post = doc.data();

        var d = new Date(post.date.toMillis());
        var nowDate = 
            ("0" + d.getDate()).slice(-2) + '-' +
            ("0" + (d.getMonth()+1)).slice(-2) + '-' + 
            d.getFullYear() + ' at ' +
            d.getHours() + ':' +
            d.getMinutes()
        ;

        // docRef.get().then((doc) => {
        //     if (doc.exists) {
        //         var length = doc.data().likers.length;
        //         for(i=0; i<length; i++){
        //             docRef.onSnapshot((doc) => {
        //                 nLikes = parseInt(data.likers.length) - 1;
        //             });
        //         }
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }).catch((error) => {
        //     console.log("Error getting document:", error);
        // });


        template += `
            <div class="article">
            <div class="articleBy">
                <img class="myIndexImage" src="assets/noUserImage.png">
                <div class="articleFrom">
                    <span class="articleAuthor">${post.author}</span>
                    <span class="articleDate">${nowDate}</span>
                </div>
            </div>
                <span class="articleTitle">${post.title}</span>
                <span class="articleText">${post.text}</span>
                <div id="OUxF5fBinbMCQw3HGrYX" class="articleControls">
                    <div class="controlsLike" style="background-color: rgb(43, 43, 43);">
                        <span class="likeCount" id="like${doc.id}">0</span>
                    </div>
                    <div class="controlsComments">
                        <span class="likeCount">${nLikes}</span>
                    </div>
                </div>
            </div>
        `
    })

    container.innerHTML += template;
}

window.addEventListener('DOMContentLoaded', () => getNextPosts())


const loadMore = document.querySelector('.articles button');

const handleClick = () =>{
    getNextPosts()
    console.log("load");
}

loadMore.addEventListener('click', handleClick)
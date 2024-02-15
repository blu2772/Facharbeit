// Beispiel Daten
const posts = [
    {id: 0, title: "Post 1", content: "Dies ist der Inhalt von Post 1",img:"sunset-beach-2.jpg" },
    {id: 1, title: "Post 2", content: "Dies ist der Inhalt von Post 2",img:"" },
    {id: 2, title: "Post 3", content: "Dies ist der Inhalt von Post 3",img:"" },
    {id: 3, title: "Post 4", content: "Dies ist der Inhalt von Post 4",img:"" },

];


function generatePosts() {
    const feed = document.querySelector('.feed');

    posts.forEach(post => {

        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.id = post.id;
        
        const content = `<img src="src/${post.img}"><div class="content"><h2>${post.title}</h2><p>${post.content}</p></div>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    });
}

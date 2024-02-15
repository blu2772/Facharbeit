// Beispiel Daten
const posts = [
    { title: "Post 1", content: "Dies ist der Inhalt von Post 1" },
    { title: "Post 2", content: "Dies ist der Inhalt von Post 2" },
    { title: "Post 3", content: "Dies ist der Inhalt von Post 3" },

];


function generatePosts() {
    const feed = document.querySelector('.feed');

    posts.forEach(post => {

        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        
        const content = `<h2>${post.title}</h2><p>${post.content}</p>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    });
}

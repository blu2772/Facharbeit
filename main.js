// Beispiel Daten
const posts = [
    {id: 0, title: "Post 1", content: "Dies ist der Inhalt von Post 1",img:"sunset-beach-2.jpg" },
    {id: 1, title: "Post 2", content: "Dies ist der Inhalt von Post 2",img:"" },
    {id: 2, title: "Post 3", content: "Dies ist der Inhalt von Post 3",img:"" },
    {id: 3, title: "Post 4", content: "Dies ist der Inhalt von Post 4",img:"" },

];

const url = "http://127.0.0.1/Facharbeit/Api/Connect.php";

async function sendPostRequest(data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok.');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Fehler bei der POST-Anfrage: " + error);
  }
}


async function generatePosts() {
    const feed = document.querySelector('.feed');

    const readdata = {
        cmd: "read",
        limit: 4,
    };
    const posts = await sendPostRequest(readdata);
    console.log(posts);

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.id = post.id;
        
        const content = `<img src="src/${post.img}"><div class="content"><h2>${post.title}</h2><p>${post.content}</p></div>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    });
}



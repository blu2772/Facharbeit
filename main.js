const url = "http://127.0.0.1/Facharbeit/Api/";

async function sendPostRequest(pData) {
  try {
    const response = await fetch(url+"Connect.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pData),
    });
    if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok.');
    }
    try{
        const ergebnis = await response.json();
        return ergebnis;
    }catch	(error){
        return response;
    }
    
  } catch (error) {
    throw new Error("Fehler bei der Anfrage: " + error);

  }
}

async function uploadImage(pBild) {
    if (pBild.files && pBild.files[0]) {
        var formData = new FormData();
        formData.append('image', pBild.files[0]);
  
        try {
            const response = await fetch(url+'image.php', {
                method: 'POST',
                body: formData,
            });
            const ergebnis = await response.json();
            if (ergebnis.success) {
                return ergebnis.path; 
            } else {
                console.error('error', ergebnis.message);
            }
        } catch (error) {
            console.error('Fehler:', error);
        }
    }
    return ""; 
  }


async function generatePosts() {
    const feed = document.querySelector('.feed');

    const Nachricht = {
        cmd: "read",
    };
    const posts = await sendPostRequest(Nachricht);
    console.log(posts);

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.id = post.id;
        
        const content = `<img src="Api/${post.img}"><div class="content"><h2>${post.title}</h2><p>${post.content}</p></div>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    });
}

async function generatefeed(){
  const feed = document.querySelector('.feedcontainer');
  feed.innerHTML = "";
  const Nachricht = {
      cmd: "read",
      limit: 4,
  };
  const posts = await sendPostRequest(Nachricht);
  console.log(posts);

  posts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');
      postDiv.id = post.id;
      
      const content = `<img class="img" src="Api/${post.img}">
                        <div class="content">
                         <h2>${post.title}</h2>
                        </div>
                        <img class="edit" onClick="openedit(${post.id})" src="src/pencil.svg">
                        <img class="delet" onClick="deletPost(${post.id})" src="src/recycle-bin.svg">`;
      postDiv.innerHTML = content;

      feed.appendChild(postDiv);
  });

}
async function openedit(pId){
    const feed = document.querySelector('.apps');
    const Nachricht = {
        cmd: "searchid",
        id: pId,
    };
    const posts = await sendPostRequest(Nachricht);
    console.log(posts);
    const post = posts[0];
    const postDiv = document.createElement('div');
      
      
      const content = ` <div class="editor" >
                            <div class="window">
                                <h1>Edit</h1>
                                <div class="in title">
                                    <input type="text" id="title" name="title" value="${post.title}">
                                </div>
                                <div class="in content">
                                    <textarea id="content" name="content" >${post.content}</textarea>
                                </div>
                                <div class="in immg">
                                    <div class="sep">
                                        <h1 class="pv" >Current Image</h1>
                                        <img class="pv" src="Api/${post.img}">
                                    </div>
                                    <div class="sep">
                                        <h1  >New Image</h1>
                                        <input type="file" id="img" name="img" value="${post.img}">
                                    </div>
                                </div>
                                <div class="submit">
                                    <button onclick="submitedit(${post.id}, '${post.img}')">Submit</button>
                                </div>
                            </div>
                        </div>`;
      postDiv.innerHTML = content;

      feed.appendChild(postDiv);
}
async function newPost(){
    const postDiv = document.createElement('div');
      
    const feed = document.querySelector('.apps');
    const content = ` <div class="editor" >
                          <div class="window">
                              <h1>Neuer Post</h1>
                              <div class="in title">
                                  <input type="text" id="title" name="title" placeholder="Titel">
                              </div>
                              <div class="in content">
                                  <textarea id="content" name="content" placeholder="Inhalt"></textarea>
                              </div>
                              <div class="in img">
                                  <input type="file" id="img" name="img" ">
                              </div>
                              <div class="submit">
                                  <button onclick="submitcreate()">Submit</button>
                              </div>
                          </div>
                      </div>`;
    postDiv.innerHTML = content;

    feed.appendChild(postDiv);
}


async function submitcreate(){  
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const img = document.getElementById('img');
    const imagepath = await uploadImage(img);
    console.log(imagepath);
    const Nachricht = {
        cmd: "create",
        title: title,
        content: content,
        img: imagepath,
    };
    const posts = await sendPostRequest(Nachricht);
    closeEditor();
    generatefeed();
}

function closeEditor(){
    const feed = document.querySelector('.apps');
    feed.innerHTML = "";
}
async function submitedit(pID, pImage){
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const img = document.getElementById('img');
    let imagepath = pImage;
    if(img.value !== ""){
        imagepath = await uploadImage(img);
    }

    const Nachricht = {
        cmd: "edit",
        id: pID,
        title: title,
        content: content,
        img: imagepath,
    };

    const posts = await sendPostRequest(Nachricht);

    closeEditor();
    generatefeed();
}
async function deletPost(pID){
  const Nachricht = {
    cmd: "delet",
    id: pID,
};
const response = await sendPostRequest(Nachricht);
generatefeed();
}



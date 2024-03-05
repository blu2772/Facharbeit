// Beispiel Daten


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
    try{
        const result = await response.json();
        return result;
    }catch	(error){
        return response;
    }
    
  } catch (error) {
    throw new Error("Fehler bei der POST-Anfrage: " + error);

  }
}


async function generatePosts() {
    const feed = document.querySelector('.feed');

    const readdata = {
        cmd: "read",
    };
    const posts = await sendPostRequest(readdata);
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
async function openedit(id){
    const feed = document.querySelector('.apps');
    const readdata = {
        cmd: "searchid",
        id: id,
    };
    const posts = await sendPostRequest(readdata);
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
                                    <button onclick="submitedit(${post.id})">Submit</button>
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
                              <h1>Edit</h1>
                              <div class="in title">
                                  <input type="text" id="title" name="title" placeholder="Title">
                              </div>
                              <div class="in content">
                                  <textarea id="content" name="content" placeholder="Contnet"></textarea>
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
async function uploadImage(input) {
  if (input.files && input.files[0]) {
      var formData = new FormData();
      formData.append('image', input.files[0]);

      try {
          const response = await fetch('http://127.0.0.1/Facharbeit/Api/image.php', {
              method: 'POST',
              body: formData,
          });
          const data = await response.json();
          if (data.success) {
              return data.path; 
          } else {
              console.error('error', data.message);
          }
      } catch (error) {
          console.error('Fehler:', error);
      }
  }
  return ""; 
}

async function submitcreate(){  
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const img = document.getElementById('img');
    const imagepath = await uploadImage(img);
    console.log(imagepath);
    const readdata = {
        cmd: "create",
        title: title,
        content: content,
        img: imagepath,
    };
    const posts = await sendPostRequest(readdata);
    closeEditor();
    generatefeed();
}

function closeEditor(){
    const feed = document.querySelector('.apps');
    feed.innerHTML = "";
}
async function submitedit(ID){
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const img = document.getElementById('img');
    const imagepath = await uploadImage(img);
    const readdata = {
        cmd: "edit",
        id: ID,
        title: title,
        content: content,
        img: imagepath,
    };
    const posts = await sendPostRequest(readdata);
    closeEditor();
    generatefeed();
}
async function deletPost(pID){
  const readdata = {
    cmd: "delet",
    id: pID,
};
const response = await sendPostRequest(readdata);
generatefeed();
}



class APIConnector {
    constructor(url) {
        this.url = url;
    }

    async sendPostRequest(pData) {
        try {
            const response = await fetch(this.url + "Connect.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pData),
            });
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            try {
                const ergebnis = await response.json();
                return ergebnis;
            } catch (error) {
                return response;
            }

        } catch (error) {
            throw new Error("Fehler bei der Anfrage: " + error);
        }
    }


    async uploadImage(pBild) {
        try {
            if (!pBild.files && !pBild.files[0]) {
                throw new Error('Keine Datei ausgewählt.');
            }
            let formData = new FormData();
            formData.append('image', pBild.files[0]);
            const response = await fetch(this.url + 'image.php', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            try {
                const ergebnis = await response.json();
                return ergebnis.path;
            } catch (error) {
                return response;
            }
        } catch (error) {
            throw new Error("Fehler bei der Anfrage: " + error);
        }
    }
}

class PostManager {
    constructor(apiConnector) {
        this.apiConnector = apiConnector;
    }
    async generatePosts() {
        const feed = document.querySelector('.feed');

        const Nachricht = {
            cmd: "read",
        };
        const posts = await this.apiConnector.sendPostRequest(Nachricht);


        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.id = post.id;

            const content = `<img onClick="postManager.openPostView(${post.id})" src="Api/${post.img}"><div class="content"><h2>${post.title}</h2><p>${post.content}</p></div>`;
            postDiv.innerHTML = content;

            feed.appendChild(postDiv);
        });
    }

    async generatefeed(){
    const feed = document.querySelector('.feedcontainer');
    feed.innerHTML = "";
    const Nachricht = {
        cmd: "read",
        limit: 4,
    };
    const posts = await this.apiConnector.sendPostRequest(Nachricht);


    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.id = post.id;
        
        const content = `<img  class="img" src="Api/${post.img}">
                            <div class="content">
                            <h2>${post.title}</h2>
                            </div>
                            <img class="edit" onClick="postManager.openedit(${post.id})" src="src/pencil.svg">
                            <img class="delet" onClick="postManager.deletPost(${post.id})" src="src/recycle-bin.svg">`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    });

    }
    async openPostView(pId){
        const feed = document.querySelector('.apps');
        const Nachricht = {
            cmd: "searchid",
            id: pId,
        };
        const posts = await this.apiConnector.sendPostRequest(Nachricht);

        const post = posts[0];
        const postDiv = document.createElement('div');
        
        const content = `<div class="Open">
                            <img src="Api/${post.img}" >
                            <img class="close" onClick="postManager.closePostView()" src="Src/close.svg">
                            <h1>${post.title}</h1>
                            <div class="content">${post.content}</div>
                        </div>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    }
    closePostView(){
        const feed = document.querySelector('.apps');
        feed.innerHTML = "";
    }
    async openedit(pId){
        const feed = document.querySelector('.apps');
        const Nachricht = {
            cmd: "searchid",
            id: pId,
        };
        const posts = await this.apiConnector.sendPostRequest(Nachricht);
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
                                        <button onclick="postManager.submitedit(${post.id}, '${post.img}')">Submit</button>
                                    </div>
                                </div>
                            </div>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    }
    async newPost(){
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
                                    <button onclick="postManager.submitcreate()">Submit</button>
                                </div>
                            </div>
                        </div>`;
        postDiv.innerHTML = content;

        feed.appendChild(postDiv);
    }


    async  submitcreate(){  
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const img = document.getElementById('img');
        const imagepath = await this.apiConnector.uploadImage(img);

        const Nachricht = {
            cmd: "create",
            title: title,
            content: content,
            img: imagepath,
        };
        const posts = await this.apiConnector.sendPostRequest(Nachricht);
        this.closeEditor();
        this.generatefeed();
    }

    closeEditor(){
        const feed = document.querySelector('.apps');
        feed.innerHTML = "";
    }
    async submitedit(pID, pImage){
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const img = document.getElementById('img');
        let imagepath = pImage;
        if(img.value !== ""){
            imagepath = await this.apiConnector.uploadImage(img);
        }

        const Nachricht = {
            cmd: "edit",
            id: pID,
            title: title,
            content: content,
            img: imagepath,
        };

        const posts = await this.apiConnector.sendPostRequest(Nachricht);

        this.closeEditor();
        this.generatefeed();
    }
    async  deletPost(pID){
        const Nachricht = {
            cmd: "delet",
            id: pID,
        };
        const response = await this.apiConnector.sendPostRequest(Nachricht);
        this.generatefeed();
    }

}
const apiConnector = new APIConnector("http://127.0.0.1/Facharbeit/Api/");
const postManager = new PostManager(apiConnector);
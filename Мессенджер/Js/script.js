//#region Глобальные переменные
const HOST = 'http://api-messenger.web-srv.local'
const CONTENT = _elem('.content')

//#endregion

//#region Комбайны

function setToken() {
    token = localStorage.setItem('')
}

function _del() {
    let HTTP_REQUEST = new XMLHttpRequest()
    HTTP_REQUEST.open('DELETE', params.url)
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send()
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    }
}

function _get(params, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', params.url);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send();
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    };
}

function _elem(selector) {
    return document.querySelector(selector)
}

function _post(params, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('POST', params.url);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send(params.data);
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    }
}

function _load(url, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', url);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send();
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            if (callback) {
                callback(HTTP_REQUEST.responseText)
            }
        }
    }
}

//#endregion

//#region Объявление страницы

first();

//#endregion

//#region Функции

function first() {
    _get({ url: '/Modules/AUTH.html' }, function (responseText) {
        CONTENT.innerHTML = responseText;
        auth();
        _elem(".btn-reg").addEventListener('click', function () {
            _load('/Modules/REG.html', function (responseText) {
                CONTENT.innerHTML = responseText;
                reg();
            })
        })
    })
}

function reg() {
    registration();
    _elem('.btn-head-reg').addEventListener('click', function () {
        first();
        auth();
    })
}

function registration() {
    _elem(".btn-registr").addEventListener('click', function () {
        let rdata = new FormData();
        rdata.append('fam', _elem('input[name = "fam"]').value);
        rdata.append('name', _elem('input[name = "name"]').value);
        rdata.append('otch', _elem('input[name = "otch"]').value);
        rdata.append('email', _elem('input[name = "email"]').value);
        rdata.append('pass', _elem('input[name = "pass"]').value);
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('POST', `${HOST}/user/`);
        HTTP_REQUEST.send(rdata);
        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState == 4) {
                regData = JSON.parse(HTTP_REQUEST.responseText);
                console.log(regData);

                if (regData.message) {
                    token = regData.Data.token;
                    localStorage.setItem('_token', token);
                    console.log(token);
                    _load('/Modules/WORK.html', function (responseText) {
                        CONTENT.innerHTML = responseText;
                        document.querySelector('.user-name').textContent = regData.Data.fam + " " + regData.Data.name;
                        getChats();
                    })
                }
                else {
                    alert("Пользователь c таким именем уже существует");
                }
            }
        }
    })
}

function auth() {
    console.log("fwsedfgwd");
    _elem(".btn-auth").addEventListener('click', function () {

        let adata = new FormData();
        adata.append('email', _elem('input[name = "email"]').value);
        adata.append('pass', _elem('input[name = "pass"]').value);

        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('POST', `${HOST}/auth/`);
        HTTP_REQUEST.send(adata);
        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState == 4) {
                AuthData = JSON.parse(HTTP_REQUEST.responseText);
                console.log(AuthData);

                if (AuthData.message) {
                    token = AuthData.Data.token;
                    localStorage.setItem('_token', token)
                    console.log(token);
                    _load('/Modules/WORK.html', function (responseText) {
                        CONTENT.innerHTML = responseText;
                        _elem('.user-name').textContent = AuthData.Data.fam + " " + AuthData.Data.name;
                        _elem('.user-photo');
                        getChats();
                        createChat()
                    })
                }
            }
        }
    })
}
function getChats() {
    let chdata = new FormData();
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', `${HOST}/chats/`);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send(chdata);
    HTTP_REQUEST.onreadystatechange = function(){
        if(HTTP_REQUEST.readyState == 4){
            localStorage.getItem('_token', token);
            Chatdata = JSON.parse(HTTP_REQUEST.responseText);
            console.log(Chatdata);

        }
    }
}
function createChat(){
    _elem('.create-chat').addEventListener('click', function(){
            let crdata = new FormData();
            crdata.append('email', _elem('input[name="email-work"]').value);
            let HTTP_REQUEST = new XMLHttpRequest()
            HTTP_REQUEST.open('POST', `${HOST}/chats/`)
            HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
            HTTP_REQUEST.send(crdata);
            HTTP_REQUEST.onreadystatechange = function(){
                if(HTTP_REQUEST.readyState == 4){
                    localStorage.getItem('_token', token);
                    CreateData = JSON.parse(HTTP_REQUEST.responseText);
                    console.log(CreateData);
                    createChatBlock()
                    }
            }
        
        // _post({url:`${HOST}/chats/`, Data: crdata}, function(responseText){
        //     responseText = JSON.parse(responseText);
        //     console.log(responseText);
        //     localStorage.getItem('_token', token);
        // })
    })
}
function createChatBlock(chatdata) {
        
    let chatBlock = document.createElement('div');
    chatBlock.classList.add('block_chats');
    chatBlock.id = `chat_${chatdata.chat_id}`;
    let chatImg = document.createElement('img');
    chatImg.src = HOST + chatdata.companion_photo_link;
    chatBlock.append(chatImg);
    let chatName = document.createElement('p');
    chatName.textContent = chatdata.chat_name;
    chatBlock.append(chatName);
    console.log('createChatBlock()');
    
}

//#endregion
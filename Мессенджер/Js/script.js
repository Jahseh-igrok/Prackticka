//#region Глобальные переменные
const HOST = 'http://api-messenger.web-srv.local'
const CONTENT = _elem('.content')
const INTERVAL_UPDATE_CHATS = 5000;
const INTERVAL_UPDATE_MSG = 5000;
var CURRENT_CHAT;
var GLOBAL_TIMERS = [];
var TIMER_UPDATE_MSG;
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

// function localJSON(name, link){

//     link = 

//     localStorage.setItem(name, link)


// }

//#endregion

//#region Объявление страницы

first();

//#endregion

//#region Функции

//#region Остановление всех интервалов
function stopTimers() {
    clearInterval(TIMER_UPDATE_MSG)
    GLOBAL_TIMERS.forEach(element => {
        clearInterval(element)
        
    })
}
//#endregion

//#region Получение первой страницы 
function first() {
    _get({ url: '/Modules/AUTH.html' }, function (responseText) {
        CONTENT.innerHTML = responseText;
        auth();
        stopTimers()
        clearTimeout()
        localStorage.removeItem('_token');
        localStorage.removeItem('_UserID');
        localStorage.removeItem('_chatID');
        localStorage.removeItem('_pass');
        localStorage.removeItem('_fam');
        localStorage.removeItem('_name');
        localStorage.removeItem('_otch');
        localStorage.removeItem('_photo');
        _elem(".btn-reg").addEventListener('click', function () {
            _load('/Modules/REG.html', function (responseText) {
                CONTENT.innerHTML = responseText;
                reg();
            })
        })
    })
}
//#endregion

//#region Регистрация
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
                //console.log(regData);

                if (regData.message) {
                    token = regData.Data.token;
                    UserID = regData.Data.id;
                    localStorage.setItem('_token', token);
                    localStorage.setItem('_UserID', UserID);
                    let userInf = JSON.stringify(regData.Data)
                    localStorage.setItem('userInf', userInf)
                    //console.log(token);
                    _load('/Modules/WORK.html', function (responseText) {
                        CONTENT.innerHTML = responseText;
                        document.querySelector('.user-name').textContent = regData.Data.fam + " " + regData.Data.name;
                        // document.querySelector('.user-img').src
                        getChats();
                        createChat();
                        userInfo();
                        btnPostMessHandler();
                    })
                }
                else {
                    alert("Пользователь c таким именем уже существует");
                }
            }
        }
    })
}
//#endregion

//#region Авризация
function auth() {
    //console.log("fwsedfgwd");
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
                    UserID = AuthData.Data.id
                    // pass = AuthData.Data.pass
                    // fam = AuthData.Data.fam
                    // nam = AuthData.Data.name
                    // let userInf = JSON.stringify(AuthData.Data)
                    // localStorage.setItem('_userInf', userInf)
                    // const storedDataString = localStorage.getItem('_userInf');
                    // if(storedDataString){
                    //     const storedData = JSON.parse(storedDataString)
                    //     console.log(storedData);
                    // }

                    pass = AuthData.Data.pass
                    fame = AuthData.Data.fam
                    nam = AuthData.Data.name
                    otch = AuthData.Data.otch
                    photo = AuthData.Data.photo_link
                    
                    localStorage.setItem('_pass', pass);
                    localStorage.setItem('_fam', fame);
                    localStorage.setItem('_name', nam);
                    localStorage.setItem('_otch', otch);
                    localStorage.setItem('_photo', photo);

                    localStorage.setItem('_token', token);
                    localStorage.setItem('_UserID', UserID);

                    //console.log(token);
                    _load('/Modules/WORK.html', function (responseText) {
                        CONTENT.innerHTML = responseText;
                        _elem('.user-inf img').src = `${HOST}${AuthData.Data.photo_link}`;
                        _elem('.user-name').textContent = AuthData.Data.fam + " " + AuthData.Data.name;
                        // img = _elem('.user-img')
                        // img.src = AuthData.Data.photo_link
                        // const container = document.getElementById('user-img')
                        // container.append(img)
                        getChats();
                        createChat();
                        userInfo();
                        btnPostMessHandler();

                    })
                }
            }
        }
    })
}
//#endregion

//#region Получение чатов
function getChats() {
    let chdata = new FormData();
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', `${HOST}/chats/`);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send(chdata);
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            localStorage.getItem('_token');
            localStorage.getItem('_UserID');
            Chatdata = JSON.parse(HTTP_REQUEST.responseText);
            setTimeout(getChats, INTERVAL_UPDATE_CHATS);
            // GLOBAL_TIMERS.push(setInterval(getChats, INTERVAL_UPDATE_CHATS))
            //console.log(Chatdata);
            Chatdata.forEach(element => {
                let block_chats = document.getElementById(`chat_${element.chat_id}`)
                if (!block_chats) {
                    _elem('.block_chats').append(
                        createChatBlock(element)
                    )
                } else {
                    // if (block_chats.getAttribute('last-msg') != element.chat_last_message) {
                    //     block_chats.style = 'background-color:red;'
                    // }
                }
            });
        }
    }
}

//#endregion

//#region Создание чатов

function createChat() {
    _elem('.create-chat').addEventListener('click', function () {
        let crdata = new FormData();
        crdata.append('email', _elem('input[name="email-work"]').value);
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('POST', `${HOST}/chats/`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send(crdata);
        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState == 4) {
                localStorage.getItem('_token');
                localStorage.getItem('_UserID');
                CreateData = JSON.parse(HTTP_REQUEST.responseText);
                //console.log(CreateData);
                getChats();
                _elem('.block_chats').append(getChats());
            }
        }
        // _post({url:`${HOST}/chats/`, Data: crdata}, function(responseText){
        //     responseText = JSON.parse(responseText);
        //     //console.log(responseText);
        //     localStorage.getItem('_token', token);
        // })
    })
}

//#endregion

//#region Создание блоков с чатами

function createChatBlock(chatdata) {
    //console.log(chatdata);
    let chatBlock = document.createElement('div');
    chatBlock.classList.add('block_chat');
    chatBlock.id = `chat_${chatdata.chat_id}`;
    let chatImg = document.createElement('img');
    chatImg.src = HOST + chatdata.companion_photo_link;
    chatBlock.append(chatImg);
    let chatName = document.createElement('p');
    chatName.textContent = chatdata.chat_name;
    chatBlock.append(chatName);
    chatBlock.setAttribute('last-msg', chatdata.chat_last_message);
    // chatBlock.onclick = function () {
    //     CURRENT_CHAT = chatdata.chat_id;
    //     getMessage(chatdata.chat_id);
    //     // //console.log(CURRENT_CHAT);

    //     // makeMess(chatdata)

    //     // makeMess(chatdata);

    // }
    chatBlock.onclick = function () {
        // btnPostMessHandler()
        CURRENT_CHAT = chatdata.chat_id;
        localStorage.setItem('_chatID', CURRENT_CHAT);

        this.style = ''
        if (Array.isArray(_elem('.block_chat'))) {
            _elem('.block_chat').forEach(element => {
                element.classList.remove('active');
            });
        } else {
            _elem('.block_chat').classList.remove('active');
        }

        this.classList.add('active');

        clearInterval(TIMER_UPDATE_MSG);

        _elem('.message_block').innerHTML = '';
        getMessage(chatdata.chat_id);
        TIMER_UPDATE_MSG = setInterval(() => {
            getMessage(chatdata.chat_id);
        }, INTERVAL_UPDATE_MSG);

        _elem('.message_block').classList.remove('hidden');
        _elem('.area-input').classList.remove('hidden');
    }

    //console.log('createChatBlock()');
    return chatBlock

}
//#endregion

//#region Получение данных о пользователе

function userInfo() {
    _elem('.fa-bars').onclick = function () {
        _elem('.user-block').classList.toggle('hidden');
        changeInfoUser();
        loadInfo();
        closeInfo();
    }
}

function closeInfo() {
    _elem('.fa-xmark').onclick = function () {
        _elem('.user-block').classList.add('hidden');
        userInfo();
    }
}

//#endregion

//#region Загрузка данных о пользователе

function loadInfo() {
    let udata = new FormData();
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', `${HOST}/user/`);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send(udata);
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            localStorage.getItem('_token');
            localStorage.getItem('UserID');
            userData = JSON.parse(HTTP_REQUEST.responseText);
            _elem('.user-block .user-img').src = `${HOST}${userData.photo_link}`;
            _elem('.user-block .user-email').textContent = userData.email;
            _elem('.user-block .user-fam').textContent = userData.fam;
            _elem('.user-block .user-name-work').textContent = userData.name;
            
            exit();
            //console.log(userData);
        }
    }
}
//#endregion

//#region Выход с учетной записи

function exit() {
    _elem('.footer-exit').onclick = function () {
        let exdata = new FormData();
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('DELETE', `${HOST}/auth/`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send(exdata);
        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState == 4) {
                localStorage.removeItem('_token');
                localStorage.removeItem('_UserID');
                localStorage.removeItem('_chatID');
                first();
            }
        }
    }
}

//#endregion

//#region Загрузка сообщений в чат

function getMessage(chat_id) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', `${HOST}/messages/?chat_id=${chat_id}`);
    HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
    HTTP_REQUEST.send();
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            localStorage.getItem('_token');  //*
            localStorage.getItem('_UserID'); //*
            localStorage.getItem('_chatID'); //*
            messdata = JSON.parse(HTTP_REQUEST.responseText);
            // console.log(messdata);

            let originalArray = messdata;
            for (let i = originalArray.length - 1; i >= 0; i--) {
                // reverseArray.push(originalArray[i]);
                let element = originalArray[i]
                // console.log(element);
                let message_block = document.getElementById(`msg_${element.id}`);
                if (!message_block) {
                    let msgBlock = makeMess(element);
                    _elem('.message_block').append(msgBlock);
                    // console.log(msgBlock);
                    // btnPostMessHandler();
                    // _elem('.msg-me').classList.add('hidden');
                    // _elem(`msg_${element.sender.id}`.classList.toggle('hidden'));
                    // document.getElementById(`msg_${element.sender.id}`.classList.toggle('hidden'))
                    // _elem('.msg-my').classList.toggle('hidden');
                    // _elem('.msg-me').classList.toggle('hidden');
                    //console.log('messdata');   
                }
            }

            // reverseArray.forEach(element => {
            //      // console.log(element);
            //      let message_block = document.getElementById(`msg_${element.id}`);
            //      if (!message_block) {
            //        let msgBlock = makeMess(element);
            //         _elem('.message_block').append(msgBlock);
            //         // console.log(msgBlock);
            //         // btnPostMessHandler();
            //          // _elem('.msg-me').classList.add('hidden');
            //         // _elem(`msg_${element.sender.id}`.classList.toggle('hidden'));
            //         // document.getElementById(`msg_${element.sender.id}`.classList.toggle('hidden'))
            //         // _elem('.msg-my').classList.toggle('hidden');
            //         // _elem('.msg-me').classList.toggle('hidden');
            //         //console.log('messdata');   
            //     }
            // }
            // )
            // //console.log(messdata);
        }
    }
}

//#endregion

//#region Создаие блока для сообщения

function makeMess(mess) {

    let msgBlock = document.createElement('div');
    msgBlock.classList.add('msg');
    mess.sender.id == localStorage.getItem('_UserID') ? msgBlock.classList.add('msg-my') : msgBlock.classList.add('msg-me');
    msgBlock.id = `msg_${mess.id}`;

    let msgSender = document.createElement('h4');
    msgSender.textContent = ` ${mess.sender.fam} ${mess.sender.name} ${mess.sender.otch}`;
    msgBlock.append(msgSender);

    let msgText = document.createElement('p');
    msgText.textContent = `${mess.text}`;
    msgBlock.append(msgText);

    let msgDateTime = document.createElement('p');
    msgDateTime.classList.add('datetime');
    msgDateTime.textContent = `${mess.datetime_create}`;
    msgBlock.append(msgDateTime);

    //console.log(mess);
    //console.log('makeMess()');

    return msgBlock;

}

//#endregion

//#region Отправка сообщения в чат

function btnPostMessHandler() {

    _elem('.btn-post').addEventListener('click', function () {

        let post = new FormData();
        post.append('chat_id', localStorage.getItem('_chatID'));
        post.append('text', _elem('input[name="message"]').value);
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('POST', `${HOST}/messages/`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send(post);
        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState == 4) {
                postData = JSON.parse(HTTP_REQUEST.responseText);
                localStorage.getItem('_token');
                localStorage.getItem('_UserID');
                // console.log(postData);
                getMessage(localStorage.getItem('_chatID'));
                //console.log(CURRENT_CHAT);
            }
        }
    }
    )
}

function changeInfoUser() {
    _elem('.footer-change').addEventListener('click', function () {
        let changeus = new FormData();
        changeus.append('pass', localStorage.getItem('_pass'));
        changeus.append('fam', localStorage.getItem('_fam'));
        changeus.append('name', localStorage.getItem('_name'));
        changeus.append('otch', localStorage.getItem('_otch'));
        changeus.append('photo_link', localStorage.getItem('_photo'));

        localStorage.getItem('_userInf');
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('GET', `${HOST}/user/`);
        HTTP_REQUEST.setRequestHeader("Athorization", "Bearer " + localStorage.getItem('token'));
        HTTP_REQUEST.send(changeus);
        if (HTTP_REQUEST.readyState == 4) {
            changeData = JSON.parse(HTTP_REQUEST.responseText);
        }
    })
}

//#endregion

//#endregion

//  url?key=value&key2=value2
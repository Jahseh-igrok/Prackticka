//#region Глобальные переменные
const HOST = 'http://api-messenger.web-srv.local'
const CONTENT = _elem('.content')
const INTERVAL_UPDATE_CHATS = 5000;
const INTERVAL_UPDATE_MSG = 5000;
var CURRENT_CHAT;
var GLOBAL_TIMERS = [];
var TIMER_UPDATE_MSG;
var TIMER_BLINK_CHAT = false;
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

//#region Остановка всех интервалов
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
                        _elem('.user-inf img').src = `${HOST}${regData.Data.photo_link}`;
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

//#region Авторизация
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

                    token = AuthData.Data.token;
                    UserID = AuthData.Data.id



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
                    if (block_chats.getAttribute('last-msg') != element.chat_last_message) {
                        // block_chats.style = 'background-color:red;'
                        TIMER_BLINK_CHAT = setInterval(() => {
                            block_chats.classList.toggle('chat-alert')
                        }, 500);
                    }
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
                _elem('input[name = "email-work"]').value = ''
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

        _elem('.change-name-chat-area').classList.remove('hidden')
        _elem('.message_block').classList.remove('hidden');
        _elem('.area-input').classList.remove('hidden');
        changeNameChat()

    }
    // chatBlock.onmouseenter = function(){
    //     CURRENT_CHAT = chatdata.chat_id
    //     let changeBlock = document.createElement('div')
    //     changeBlock.classList.add('change-block')
    //     changeBlock.id = `chat_${chatdata.chat_id}`
    // }
    //console.log('createChatBlock()');

    return chatBlock

}
//#endregion

//#region Получение данных о пользователе

function userInfo() {
    _elem('.fa-bars').onclick = function () {
        _elem('.user-block').classList.remove('hidden');
        loadInfo();
        closeInfo();
    }
}

function closeInfo() {
    _elem('.fa-xmark').onclick = function () {
        _elem('.user-block').classList.add('hidden');
        _elem('.user-change').classList.add('hidden');
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
            changeInfoUser()
            deleteUser()
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

//#region Создание блока для сообщения

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
                _elem('input[name="message"]').value = "";
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

//#endregion

//#region Изменить информацию о пользователе

function changeInfoUser() {

    _elem('.footer-change').onclick = function () {
        _elem('.user-change').classList.toggle('hidden');
    }

    _elem('.change-back').onclick = function () {
        _elem('.user-change').classList.add('hidden');
    }

    changeInfoUserHandler()
    // _elem('.footer-change').addEventListener('click', function () {
    //     _elem('.user-block-body').classList.add('hidden')
    //     _elem('.footer').classList.add('hidden')
    //     _elem('.user-change').classList.remove('hidden')
    //     closeInfo()

    //     let changeus = new FormData();

    //     let HTTP_REQUEST = new XMLHttpRequest();
    //     HTTP_REQUEST.open('PUT', `${HOST}/user/`);
    //     HTTP_REQUEST.setRequestHeader("Athorization", "Bearer " + localStorage.getItem('token'));
    //     HTTP_REQUEST.send(changeus);
    //     HTTP_REQUEST.onreadystatechange = function(){
    //         if (HTTP_REQUEST.readyState == 4) {
    //         changeData = JSON.parse(HTTP_REQUEST.responseText);
    //         console.log(changeData);
    //     }
    //     }
    // })
}

function changeInfoUserHandler() {
    _elem('.change-data').addEventListener('click', function () {
        let changeus = new FormData();
        changeus.append('pass', _elem('input[name="change-pass"]').value)
        changeus.append('fam', _elem('input[name="change-fam"]').value)
        changeus.append('name', _elem('input[name="change-name"]').value)
        changeus.append('otch', _elem('input[name="change-otch"]').value)
        changeus.append('photo_link', _elem('img[id="user-change-img"]').src)
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('PUT', `${HOST}/user/?pass=${_elem('input[name="change-pass"]').value}&fam=${_elem('input[name="change-fam"]').value}&name=${_elem('input[name="change-name"]').value}&otch=${_elem('input[name="change-otch"]').value}`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send(changeus);
        HTTP_REQUEST.onreadystatechange = function () {
            if (HTTP_REQUEST.readyState == 4) {
                // changeData = JSON.parse(HTTP_REQUEST.responseText);
                _elem('.user-name').textContent = '';
                _elem('.user-name').append(_elem('input[name="change-fam"]').value + " " + _elem('input[name="change-name"]').value);
            }
            
            
        }
    })
}

//#endregion

//#region Удаление пользователя из системы

function deleteUser(){
    _elem('.delete-user').addEventListener('click', function(){
        let deluser = new FormData();
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('DELETE', `${HOST}/user/`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send(deluser);
        HTTP_REQUEST.onreadystatechange = function(){
            if(HTTP_REQUEST.readyState == 4){
                first();
            }
        }
    })
}

//#endregion

//#region Изменение имени чата

function changeNameChat(){
    _elem('.change-name-btn').addEventListener('click', function(){
        let changech = new FormData();
        let HTTP_REQUEST = new XMLHttpRequest();
        HTTP_REQUEST.open('PUT', `${HOST}/chats/?chat_id=${localStorage.getItem('_chatID')}&chat_name=${_elem('input[name="change-name-input"]').value}`);
        HTTP_REQUEST.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('_token'));
        HTTP_REQUEST.send(changech);
        HTTP_REQUEST.onreadystatechange = function(){
            if(HTTP_REQUEST.readyState == 4){
                changeDataChat = JSON.parse(HTTP_REQUEST.responseText);
                _elem(`#chat_${changeDataChat.Data.chat_id} p`).textContent = changeDataChat.Data.chat_name;
            }
        }
    })
}

//#endregion



//#endregion

//  url?key=value&key2=value2
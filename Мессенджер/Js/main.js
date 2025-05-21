function onloadMain() {
    loadChats();
    userBlockHandler();
    newChatBlockHandler();

    _elem('.new-message-block button').onclick = function () {
        log(CURRENT_CHAT)
        if (CURRENT_CHAT > 0) {
            log(CURRENT_CHAT)
            let fdata = new FormData();
            fdata.append("chat_id", CURRENT_CHAT)
            fdata.append("text", _elem('.new-message-block textarea').value)
            _postJSON('messages', fdata, false)
        }
    }

    GLOBAL_TIMERS.push(setInterval(loadChats, INTERVAL_UPDATE_CHATS))
}

function newChatBlockHandler() {
    _elem('.btn-new-chat').onclick = function () {
        this.classList.add('hidden')
        _elem('.new-chat-form').classList.remove('hidden')
    }

    _elem('.new-chat-form button').onclick = function () {
        if (_elem('.new-chat-form input').value.length > 0) {
            _postJSON('chats', {email: _elem('.new-chat-form input').value}, function () {
                _elem('.new-chat-form').classList.add('hidden')
                _elem('.btn-new-chat').classList.remove('hidden')
            })
        } else {
            blinkError('.new-chat-form input')
        }
    }
}

function loadChats() {
    _getJSON('chats', false, function onLoadChats(response) {
        response.forEach(element => {
            let chat_block = document.getElementById(`chat_${element.chat_id}`)
            if (!chat_block) {
                _elem('.chats-block').append(
                    makeChatBlock(element)
                )
            } else {
                if (chat_block.getAttribute('last-msg') != element.chat_last_message) {
                    chat_block.style = 'background-color:red;'
                }
            }
        });
    });
}

function loadCUInfo() {
    _getJSON('user', false, function (response) {
        _elem('.user p').textContent = `${response.name} ${response.fam[0]}.`
        _elem('.user img').src = `${HOST}${response.photo_link}`
        _elem('.user-block img').src = `${HOST}${response.photo_link}`
        _elem('.user-block .email').textContent = response.email
        _elem('.user-block .fam').textContent = response.fam
        _elem('.user-block .name').textContent = `${response.name} ${response.otch}`
    });
}

function userBlockHandler() {
    _elem('.user').onclick = function () {
        _elem('.user-block').classList.remove('hidden')
    }
    _elem('.user-block-head .fa-times').onclick = function () {
        _elem('.user-block').classList.add('hidden')
    }

    loadCUInfo();

    _elem('.logout').onclick = function () {
        _deleteJSON('auth', onStartApp)
    }

}

function makeChatBlock(chatdata) {
    let chatBlock = document.createElement('div')
    chatBlock.classList.add('chat-block')
    chatBlock.id = `chat_${chatdata.chat_id}`
    let chatimg = document.createElement('img');
    chatimg.src = HOST + chatdata.companion_photo_link
    chatBlock.append(chatimg)
    let chatname = document.createElement('p');
    chatname.textContent = chatdata.chat_name
    chatBlock.append(chatname)

    chatBlock.setAttribute('last-msg', chatdata.chat_last_message)

    chatBlock.onclick = function () {
        CURRENT_CHAT = chatdata.chat_id;

        this.style = ''
        if (Array.isArray(_elem('.chat-block'))) {
            _elem('.chat-block').forEach(element => {
                element.classList.remove('active')
            });
        } else {
            _elem('.chat-block').classList.remove('active')
        }

        this.classList.add('active')

        clearInterval(TIMER_UPDATE_MSG)

        _elem('.message-block').innerHTML = '';
        loadMessages(chatdata.chat_id)
        TIMER_UPDATE_MSG = setInterval(() => {
            loadMessages(chatdata.chat_id)
        }, INTERVAL_UPDATE_MSG);

        _elem('.message-block').classList.remove('hidden')
        _elem('.new-message-block').classList.remove('hidden')
    }
    return chatBlock;
}

function loadMessages(chat_id) {
    _getJSON('messages', { chat_id: chat_id }, function (messages) {
        messages.forEach(element => {
            let msg_block = document.getElementById(`msg_${element.id}`)
            if (!msg_block) {
                _elem('.message-block').append(
                    makeMsg(element)
                )
            }
        });
    })
}

function makeMsg(message) {
    log(message)
    let msgBlock = document.createElement('div')
    msgBlock.classList.add('msg')
    message.sender.id == getUserID() ? msgBlock.classList.add('msg-my') : msgBlock.classList.add('msg-me')
    msgBlock.id = `msg_${message.id}`

    let msgSender = document.createElement('h4')
    msgSender.textContent = `${message.sender.name} ${message.sender.otch} ${message.sender.fam}`
    msgBlock.append(msgSender)

    let msgText = document.createElement('p')
    msgText.textContent = `${message.text}`
    msgBlock.append(msgText)

    let msgDatetime = document.createElement('p')
    msgDatetime.classList.add('datetime')
    msgDatetime.textContent = `${message.datetime_create}`
    msgBlock.append(msgDatetime)

    return msgBlock;
}
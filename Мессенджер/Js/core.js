const CONTENT = document.querySelector('.content');
const HOST = 'http://api-messenger.web-srv.local'
const INTERVAL_UPDATE_CHATS = 200;
const INTERVAL_UPDATE_MSG = 200;
var CURRENT_CHAT;
var GLOBAL_TIMERS = [];
var TIMER_UPDATE_MSG;

document.addEventListener('DOMContentLoaded', onStartApp)


function onStartApp() {
    clearInterval(TIMER_UPDATE_MSG)
    GLOBAL_TIMERS.forEach(element => {
        clearInterval(element)
    });
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${HOST}/chats/`, true);
    xhr.setRequestHeader("Authorization", "Bearer " + getToken())
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                onSuccessAuth();
                return;
            } else {
                loadView('auth', onLoadAuth);
                return;
            }
        }
    }
    xhr.send();
    _elem('.modal-msg-fade button').addEventListener('click', function () {
        _elem('.modal-msg-fade').classList.add('hidden');
        _elem('.modal-msg-fade .msg').textContent = '';
    })
}

function getToken() {
    let token = localStorage.getItem("_token");
    if (token) {
        return token
    } else {
        return '';
    }
}

function setToken(token) {
    localStorage.setItem("_token", token);
}

function getUserID() {
    let id = localStorage.getItem("_UserID");
    if (id) {
        return id
    } else {
        return '';
    }
}

function setUserID(id) {
    localStorage.setItem("_UserID", id);
}


function loadView(view, onload) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/views/${view}.html`, false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(`${xhr.status} ${xhr.statusText}`);
    } else {
        CONTENT.innerHTML = xhr.responseText;
        if (typeof (onload) == 'function') {
            onload();
        }
    }
}

function _elem(selector) {
    elements = document.querySelectorAll(selector);
    let AeElements = new Array()
    switch (elements.length) {
        case 1:
            return elements[0]
            break;
        case 0:
            return false;
        default:
            elements.forEach(element => {
                AeElements.push(element)
            });
            return AeElements
            break;
    }
}


function blinkError(selector) {
    const TIMEOUT_BLINK = 300;
    document.querySelectorAll(selector).forEach(element => {
        element.classList.toggle('error')
        setTimeout(() => {
            element.classList.toggle('error')
            setTimeout(() => {
                element.classList.toggle('error')
                setTimeout(() => {
                    element.classList.toggle('error')
                }, TIMEOUT_BLINK);
            }, TIMEOUT_BLINK);

        }, TIMEOUT_BLINK);

    });
}

function showMessage(msg) {
    _elem('.modal-msg-fade .msg').textContent = msg;
    _elem('.modal-msg-fade').classList.toggle('hidden');
}

function _postJSON(route, data, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${HOST}/${route}/`, false);
    xhr.setRequestHeader("Authorization", "Bearer " + getToken())
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            _callbackRequest(xhr, callback)
        }
    }
    xhr.send(data);
}

function _getJSON(route, data, callback) {
    let uri_data = `${HOST}/${route}/`
    if (data) {
        uri_data += "?"
        Object.keys(data).forEach(element => {
            uri_data += `${element}=${data[element]}&`
        });
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET', uri_data, false);
    xhr.setRequestHeader("Content-Type", "text/plain")
    xhr.setRequestHeader("Authorization", "Bearer " + getToken())
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            _callbackRequest(xhr, callback)
        }
    }
    xhr.send();
}

function _putJSON(route, data, callback) {
    let uri_data = `${HOST}/${route}/?`
    if (data) {
        uri_data += "?"
        Object.keys(data).forEach(element => {
            uri_data += `${element}=${data[element]}&`
        });
    }
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', uri_data, false);
    xhr.setRequestHeader("Authorization", "Bearer " + getToken())
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            _callbackRequest(xhr, callback)
        }
    }
    xhr.send();
}

function _deleteJSON(route, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${HOST}/${route}/`, false);
    xhr.setRequestHeader("Authorization", "Bearer " + getToken())
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            _callbackRequest(xhr, callback)
        }
    }
    xhr.send();
}

function _callbackRequest(xhr, callback) {
    switch (xhr.status) {
        case 200:
            if (typeof (callback) == 'function') {
                callback(JSON.parse(xhr.responseText))
            }
            break;
        case 401:
            showMessage(`Сессия окончена!`);
            onStartApp();
            break;
        default:
            showMessage(`${JSON.parse(xhr.responseText).message}`);
            break;
    }
}

function log(msg) {
    console.log(msg)
}
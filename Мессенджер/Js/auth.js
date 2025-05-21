function onLoadAuth() {
    _elem('.btn').forEach(element => {
        element.addEventListener('click', function () {
            const formAuth = _elem('.auth-view-block .auth')
            const formReg = _elem('.auth-view-block .register')
            if (this.textContent == 'Авторизация') {
                formAuth.classList.remove("hidden");
                formReg.classList.add("hidden");
            } else {
                formAuth.classList.add("hidden");
                formReg.classList.remove("hidden");
            }
        })
    });

    _elem('.auth button').addEventListener('click', function () {
        const email = _elem('.auth input[name="email"]').value;
        const pass = _elem('.auth input[name="pass"]').value;
        if (email.length == 0) {
            blinkError('.auth input[name="email"]');
            return;
        }
        if (pass.length == 0) {
            blinkError('.auth input[name="pass"]');
            return;
        }

        var fdata = new FormData();
        fdata.append('email', email);
        fdata.append('pass', pass);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${HOST}/auth/`, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                // console.log(xhr.responseText);
                if (xhr.status != 200) {
                    showMessage(`${xhr.status} ${xhr.statusText}`);
                } else {
                    setToken(JSON.parse(xhr.responseText).Data.token);
                    setUserID(JSON.parse(xhr.responseText).Data.id)                   
                    onSuccessAuth();
                    console.clear();
                }
            }
        }
        xhr.send(fdata);
    })

    _elem('.register button').addEventListener('click', function () {
        const email = _elem('.register input[name="email"]').value;
        const pass = _elem('.register input[name="pass"]').value;
        const fam = _elem('.register input[name="fam"]').value;
        const name = _elem('.register input[name="name"]').value;
        const otch = _elem('.register input[name="otch"]').value;

        if (email.length == 0) {
            blinkError('.register input[name="email"]');
            return;
        }
        if (pass.length == 0) {
            blinkError('.register input[name="pass"]');
            return;
        }

        if (fam.length == 0) {
            blinkError('.register input[name="fam"]');
            return;
        }

        if (name.length == 0) {
            blinkError('.register input[name="name"]');
            return;
        }

        if (otch.length == 0) {
            blinkError('.register input[name="otch"]');
            return;
        }

        var fdata = new FormData();
        fdata.append('email', email);
        fdata.append('pass', pass);
        fdata.append('fam', fam);
        fdata.append('name', name);
        fdata.append('otch', otch);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${HOST}/user/`, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                if (xhr.status != 200) {
                    showMessage(`${JSON.parse(xhr.responseText).message}`);
                } else {
                    setToken(JSON.parse(xhr.responseText).Data.token);
                    onSuccessAuth();
                }
            }
        }
        xhr.send(fdata);
    })
}

function onSuccessAuth() {
    loadView('main', onloadMain)
}
/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable indent */
const form = document.getElementById('login_form');
const Userame = document.getElementById('username');
const Password = document.getElementById('password');

form.addEventListener('submit', (event) => {
    let flag = 0;
    const usernamevalue = Userame.value.trim();
    const passwordvalue = Password.value.trim();
    if (usernamevalue === '') {
        setError(Userame, 'Field is empty', 'usererror');
        flag = 1;
    } else {
        setSuccess(Userame, 'usererror');
        flag = 0;
    }
    if (passwordvalue === '') {
        setError(Password, 'Field is empty', 'passworderror');
        flag = 1;
    } else {
        setSuccess(Password, 'passworderror');
        flag = 0;
    }
    if (flag === 1) {
        event.preventDefault();
        return 0;
    } else {
        return 0;
    }
});

function setError(element, message, id) {
    const inputControl = element.parentElement;
    document.getElementById(id).innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

function setSuccess(element, id) {
    const inputControl = element.parentElement;
    document.getElementById(id).innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
}

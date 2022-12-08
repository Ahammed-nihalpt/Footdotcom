/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable indent */
const form = document.getElementById('sign_form');
const CurrentPassword = document.getElementById('currpassword');
const Password = document.getElementById('password');
const ConfirmPassword = document.getElementById('conPassword');

// eslint-disable-next-line consistent-return
form.addEventListener('submit', (event) => {
    let flag = 0;
    const passwordvalue = Password.value.trim();
    const confirmpasswordvalue = ConfirmPassword.value.trim();
    const cpassword = CurrentPassword.value.trim();
    if (cpassword === '') {
        setError(CurrentPassword, 'Field is empty', 'cpassworderror');
        flag = 1;
    } else {
        setSuccess(CurrentPassword, 'cpassworderror');
        flag = 0;
    }
    if (flag === 0) {
        if (passwordvalue === '') {
            setError(Password, 'Field is empty', 'passworderror');
            flag = 1;
        } else if (passwordvalue.length < 8) {
            setError(Password, 'Password length must be atleast 8 characters', 'passworderror');
            flag = 1;
        } else if (passwordvalue.length > 15) {
            setError(Password, 'Password length must not exceed 15 characters', 'passworderror');
            flag = 1;
        } else {
            setSuccess(Password, 'passworderror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (confirmpasswordvalue === '') {
            setError(ConfirmPassword, 'Field is empty', 'conpassworderror');
            flag = 1;
        } else if (passwordvalue !== confirmpasswordvalue) {
            setError(ConfirmPassword, 'Password do not match', 'conpassworderror');
            flag = 1;
        } else {
            setSuccess(ConfirmPassword, 'conpassworderror');
            flag = 0;
        }
    }

    if (flag === 1) {
        event.preventDefault();
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

// eslint-disable-next-line no-unused-vars
function myFunction() {
    const x = document.getElementById('password');
    const y = document.getElementById('conPassword');
    if (x.type === 'password' && y.type === 'password') {
        x.type = 'text';
        y.type = 'text';
    } else {
        x.type = 'password';
        y.type = 'password';
    }
}

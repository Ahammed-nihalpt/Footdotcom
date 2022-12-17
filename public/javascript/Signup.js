/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable indent */
const form = document.getElementById('sign_form');
const Name = document.getElementById('name');
const Userame = document.getElementById('Username');
const Address = document.getElementById('address');
const State = document.getElementById('state');
const City = document.getElementById('city');
const Pincode = document.getElementById('pincode');
const Email = document.getElementById('email');
const Phone = document.getElementById('phone');
const Password = document.getElementById('password');
const ConfirmPassword = document.getElementById('conPassword');

// eslint-disable-next-line consistent-return
form.addEventListener('submit', (event) => {
    let flag = 0;
    const namevalue = Name.value.trim();
    console.log(namevalue.trim());
    const usernamevalue = Userame.value.trim();
    const addressvalue = Address.value.trim();
    const statevalue = State.value.trim();
    const cityvalue = City.value.trim();
    const pincodevalue = Pincode.value.trim();
    const emailvalue = Email.value.trim();
    const phonevalue = Phone.value.trim();
    const passwordvalue = Password.value.trim();
    const confirmpasswordvalue = ConfirmPassword.value.trim();

    if (namevalue === '') {
        setError(Name, 'Field is empty', 'nameerror');
        flag = 1;
    } else if (!onlyLetters(namevalue)) {
        setError(Name, 'Name should only contain letters', 'nameerror');
        flag = 1;
    } else {
        setSuccess(Name, 'nameerror');
        flag = 0;
    }
    if (flag === 0) {
        if (usernamevalue === '') {
            setError(Userame, 'Field is empty', 'usererror');
            flag = 1;
        } else if (!onlyLettersunder(usernamevalue)) {
            setError(Userame, 'should only contain letter, numbers, and _', 'usererror');
            flag = 1;
        } else if (usernamevalue.lenght > 10) {
            setError(Userame, 'Username should not exceed 10 characters', 'usererror');
            flag = 1;
        } else {
            setSuccess(Userame, 'usererror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (addressvalue === '') {
            setError(Address, 'Field is empty', 'addresserror');
            flag = 1;
        } else if (!addressPat(addressvalue) || addressvalue.length < 5) {
            setError(Address, 'Address is invalid', 'addresserror');
            flag = 1;
        } else {
            setSuccess(Address, 'addresserror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (statevalue === '') {
            setError(State, 'Field is empty', 'stateerror');
            flag = 1;
        } else if (!onlyLetters(statevalue)) {
            setError(State, 'state is invalid', 'stateerror');
            flag = 1;
        } else {
            setSuccess(State, 'stateerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (cityvalue === '') {
            setError(City, 'Field is empty', 'cityerror');
            flag = 1;
        } else if (!onlyLetters(cityvalue)) {
            setError(City, 'City is invalid', 'cityerror');
            flag = 1;
        } else {
            setSuccess(City, 'cityerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (pincodevalue === '') {
            setError(Pincode, 'Field is empty', 'pinerror');
            flag = 1;
        } else if (!/^\d{6}$/.test(pincodevalue)) {
            setError(Pincode, 'Pincode is invalid', 'pinerror');
            flag = 1;
        } else {
            setSuccess(Pincode, 'pinerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (emailvalue === '') {
            setError(Email, 'Field is empty', 'emailerror');
            flag = 1;
        } else if (!emailvalidation(emailvalue)) {
            setError(Email, 'Email ID is invalid', 'emailerror');
            flag = 1;
        } else {
            setSuccess(Email, 'emailerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (phonevalue === '') {
            setError(Phone, 'Field is empty', 'phoneerror');
            flag = 1;
        } else if (phonevalue.toString().length !== 10 || isNaN(Number(phonevalue))) {
            setError(Phone, 'Phone number is invalid', 'phoneerror');
            flag = 1;
        } else {
            setSuccess(Phone, 'phoneerror');
            flag = 0;
        }
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

function onlyLetters(str) {
    return /^[a-zA-Z\s]*$/.test(str);
}

function addressPat(str) {
    return /^[a-z0-9\s,.'-]*$/i.test(str);
}

function onlyLettersunder(str) {
    return /^\w+$/.test(str);
}

function emailvalidation(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
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

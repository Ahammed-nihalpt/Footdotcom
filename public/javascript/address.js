/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable indent */
const form = document.getElementById('sign_form');
const Address = document.getElementById('address');
const State = document.getElementById('state');
const City = document.getElementById('city');
const Pincode = document.getElementById('pincode');

// eslint-disable-next-line consistent-return
form.addEventListener('submit', (event) => {
    let flag = 0;
    const addressvalue = Address.value.trim();
    const statevalue = State.value.trim();
    const cityvalue = City.value.trim();
    const pincodevalue = Pincode.value.trim();

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
    return /^[a-zA-Z]+$/.test(str);
}

function addressPat(str) {
    return /^[a-z0-9\s,.'-]*$/i.test(str);
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

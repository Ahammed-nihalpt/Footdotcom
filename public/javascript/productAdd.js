/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable indent */
const form = document.getElementById('add_product_table');
const Name = document.getElementById('productName');
const Price = document.getElementById('price');
const Stock = document.getElementById('stock');
const Color = document.getElementById('color');
const Size = document.getElementById('size');
const Brand = document.getElementById('brand');
const Img = document.getElementById('prodcutImage');

// eslint-disable-next-line consistent-return
form.addEventListener('submit', (event) => {
    let flag = 0;
    const namevalue = Name.value.trim();
    const pricevalue = Price.value.trim();
    const stockvalue = Stock.value.trim();
    const colorvalue = Color.value.trim();
    const sizevalue = Size.value.trim();
    const brandvalue = Brand.value.trim();
    const image = Img.value;
    if (image === '') {
        setError(Name, 'select a image', 'imageerror');
        flag = 1;
    } else if (!imageval(image)) {
        setError(Name, 'jpg file only', 'imageerror');
        flag = 1;
    } else {
        setSuccess(Name, 'imageerror');
        flag = 0;
    }
    if (flag === 0) {
        if (namevalue === '') {
            setError(Name, 'Field is empty', 'nameerror');
            flag = 1;
        } else {
            setSuccess(Name, 'nameerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (pricevalue === '') {
            setError(Price, 'Field is empty', 'priceerror');
            flag = 1;
        } else if (isNaN(Number(pricevalue))) {
            setError(Price, 'should only contain numbers', 'priceerror');
            flag = 1;
        } else if (!isInDesiredForm(pricevalue)) {
            setError(Price, 'should only contain positive numbers', 'priceerror');
            flag = 1;
        } else {
            setSuccess(Price, 'priceerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (stockvalue === '') {
            setError(Stock, 'Field is empty', 'stockerror');
            flag = 1;
        } else if (isNaN(Number(stockvalue))) {
            setError(Stock, 'Stock is invalid', 'stockerror');
            flag = 1;
        } else if (!isInDesiredForm(stockvalue)) {
            setError(Price, 'should only contain positive numbers', 'priceerror');
            flag = 1;
        } else {
            setSuccess(Stock, 'stockerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (colorvalue === '') {
            setError(Color, 'Field is empty', 'colorerror');
            flag = 1;
        } else if (!onlyLetters(colorvalue)) {
            setError(Color, 'color is invalid', 'colorerror');
            flag = 1;
        } else {
            setSuccess(Color, 'colorerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (sizevalue === '') {
            setError(Size, 'Field is empty', 'sizeerror');
            flag = 1;
        } else if (isNaN(Number(sizevalue))) {
            setError(Size, 'Size is invalid', 'sizeerror');
            flag = 1;
        } else if (!isInDesiredForm(sizevalue)) {
            setError(Price, 'should only contain positive numbers', 'priceerror');
            flag = 1;
        } else {
            setSuccess(Size, 'sizeerror');
            flag = 0;
        }
    }
    if (flag === 0) {
        if (brandvalue === '') {
            setError(Brand, 'Field is empty', 'branderror');
            flag = 1;
        } else {
            setSuccess(Brand, 'branderror');
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

function imageval(params) {
    return /\.jpe?g$/i.test(params);
}

function isInDesiredForm(str) {
    const n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
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

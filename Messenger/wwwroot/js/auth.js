'use strict';


let username = document.getElementById('username');
let usernameData = document.getElementById('username-data');
let usernameLegend = document.getElementById('username-legend');

let login = document.getElementById('login');
let loginLegend = document.getElementById('login-legend');

let password = document.getElementById('pass');
let passwordLegend = document.getElementById('password-legend');

let repeatPassword = document.getElementById('repeat-pass');
let repeatPasswordData = document.getElementById('repeat-pass-data');
let repeatPassLegend = document.getElementById('rep-pass-legend');

let additionalButton = document.getElementById('additional-button');
let submitButton = document.getElementById('submit-button');
let authForm = document.getElementById('auth-form');
let formContainer = document.getElementById('form-container');

let authHandler = 'Authorization';
let registerHandler = 'Registration';


// Валидация формы
submitButton.onclick = () => {
    if (authForm.attributes.action.textContent == authHandler) {
        validate(loginLegend, login, "Логин", "Логин (Неверный логин или пароль)");
        validate(loginLegend, password, "Логин", "Логин (Неверный логин или пароль)");

        return;
    }

    validate(usernameLegend, usernameData, "Никнейм", "Никнейм (Только латинские буквы)");
    validate(loginLegend, login, "Логин", "Логин (Только цифры и латинские буквы)");
    validate(passwordLegend, password, "Пароль", "Пароль (Не менее 8 символов)");

    repeatPassLegend.classList.remove('error');
    repeatPassLegend.textContent = "Повторите пароль";
    if (password.value != repeatPasswordData.value) {
        password.value = '';
        repeatPasswordData.value = '';
        repeatPassLegend.classList.add('error');
        repeatPassLegend.textContent = "Повторите пароль (Пароли не совпадают)";
    }
}

function validate(htmlElement, elementData, validContent, errorContent) {
    htmlElement.classList.remove('error');
    htmlElement.textContent = validContent;
    elementData.oninvalid = () => {
        htmlElement.classList.add('error');
        htmlElement.textContent = errorContent;
    }
}
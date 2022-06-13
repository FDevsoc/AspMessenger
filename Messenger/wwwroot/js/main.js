//Ненужный пользователь
var Users = [/*{Id:1,Name:"Sque"},{Id:2,Name:"Loh"}*/];
//Хранить сообщения, но можно удалить 
var Messages = [];
//Элементы окн(диалогов,чата и текст-арии)
var friend = document.getElementById('friendMenu');
var dialog_win = document.getElementById('DialogWin');
var textMess = document.getElementById('usertext');

//метод выполняемый при загрузки всего dom'а и ресурсов
window.onload = Start();
//метод добавления диалогам  прослушивания событий
function Start() {
    //массив карточек
    var user_card = document.getElementsByClassName('userCard');
    if (user_card) {
        //перебор карточек и добавление каждой прослушки
        Array.from(user_card).forEach(u_card => {
            u_card.addEventListener('click', function () {
                //удаление заглушки "нет сообщений"
                var sub = document.getElementById('subtextWin');
                sub.classList.add("d-none");
                //для мобилки убираем отображение диалогов и добавляем отображение окна сообщений
                dialog_win.classList.remove("d-none");
                friend.classList.add("d-none");
                //добавляем кнопке, а именно стиль "активной"
                var ch = u_card.firstElementChild;
                u_card.classList.add('border-primary');
                ch.classList.add("bushcard");

                var username = u_card.lastElementChild.innerHTML;

                //удаляем стиль "активной" у остальных других, если такие имеются
                for (var i = 0; user_card.length > i; i++) {
                    var fItem = user_card[i].classList;
                    if (fItem.contains("border-primary") & u_card.classList != fItem) {
                        fItem.remove("border-primary");
                    }
                    var item = user_card[i].firstElementChild.classList;
                    if (item.contains("bushcard") & u_card.classList != fItem) {
                        item.remove("bushcard");
                    }
                }
                //Отображем окно сообщения(для мобилки)
                ShowMessangesWin(username);
            })
        })
    }
}
//метод просто отображения окна сообщений
function ShowMessangesWin(username) {
    var chatbox = document.getElementById('chatWin');
    chatbox.classList.remove("d-none");

    var dialog = document.getElementById('dialog-info');
    dialog.innerHTML = username;
}
//Кнопка "назад" (для мобилки)
var backButt = document.getElementById('backBtn');
//обработчик события на нажатие кнопки "назад"
backButt.onclick = function () {
    dialog_win.classList.add("d-none");
    friend.classList.remove("d-none");
}
//Кнопка "Отправить сообщение"
var sendBtn = document.getElementById('sendMessange');
//Обработчик кнопки "Отправить сообщение"
sendBtn.addEventListener('click', SendMessange)
//функция выполняемая при нажатие на кнопку "Отправить сообщение"
function SendMessange() {
    //Хранилище для сообщения которое набрали
    var messange = {};
    //id пользователя которому отправляется сообщение
    var recId = 0;
    //name пользователя которому отправляется сообщение
    var reciverName;
    //Проверка на то что сообщение кому то вообще адресовано(переписать под ваш лад)
    if (recId != 0) {
        //Получаем текущее время в формате(вся инфа)
        var nowdate = new Date();
        //Получаем из этой инфы только текущие часы и минуты
        var hrs = nowdate.getHours();
        var min = nowdate.getMinutes();
        //Записываем их в строку
        if (hrs < 10) hrs = "0" + hrs;
        if (min < 10) min = "0" + min;
        let timesend = hrs + ":" + min;
        //Проверка на то что сообщение не пустое
        if (textMess.value) {
            //формирование сообщения
            messange = { Text: textMess.value, SendData: timesend, SenderId: user.Id, ReceiverId: recId};
        }
    }
    //Добавление в массив сообщений(можно изменить куда что как сохранятся будет)
    Messages.push(messange);
    //Очистка поля ввода сообщения после нажатия на кнопку
    textMess.value = "";
    //Задает скролл листа сообщений таким образом что при добавлении скрол сам будет опускаться вниз
    document.getElementById('messengeWin').scrollIntoView(false);
}
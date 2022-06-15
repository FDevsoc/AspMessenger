var currentUser;

var Messages = [];

var userFriends = [];

userName = document.getElementById("username");

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("MainChat")
    .build();

// получение сообщения от сервера
hubConnection.on('GetData', function (currentClient, messages, friendList) {
    currentUser = currentClient;
    Messages = messages;
    userFriends = friendList;
});

// отправка сообщения на сервер
var searchBtn = document.getElementById("dropdownMenu2");
searchBtn.onclick = () => hubConnection.invoke("GetData", userName);

hubConnection.start();

//Элементы окн(диалогов,чата и текст-арии)
var friend = document.getElementById('friendMenu');
var dialog_win = document.getElementById('DialogWin');
var textMess = document.getElementById('usertext');
//Контейнер для сообщений
var dialogContainer;

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
                ShowMessangesWin(ch.firstElementChild.innerText);
            })
        })
    }
}
//метод просто отображения окна сообщений
function ShowMessangesWin(Username) {
    var chatbox = document.getElementById('chatWin');
    chatbox.classList.remove("d-none");
    document.getElementById('dialog-info').innerText = Username;
    var thisFriendMessangesFromDate = [];
    UpdateMess(Username);
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
    Array.from(userFriends).forEach(userFr => {
        if (userFr.Name === document.getElementById('dialog-info').innerHTML) {
            recId = userFr.Id;
            reciverName = userFr.Name;
        }
    })
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
        let timesend = hrs + ":" + min;
        //Проверка на то что сообщение не пустое
        if (textMess.value) {
            //формирование сообщения
            messange = { Id: 1, Text: textMess.value, SendData: timesend, SenderId: currentUser.Id, ReceiverId: recId, DialogId: 7 };
        }
    }
    //Добавление в массив сообщений(можно изменить куда что как сохранятся будет)
    Messages.push(messange);
    //Очистка поля ввода сообщения после нажатия на кнопку
    textMess.value = "";
    //Задает скролл листа сообщений таким образом что при добавлении скрол сам будет опускаться вниз
    document.getElementById('messengeWin').scrollIntoView(false);
    UpdateMess(reciverName);
}
//Функция создания карточек сообщений(разные стили)
function CreateMessage(Message) {
    if (currentUser.Id === Message.SenderId) {
        let card = document.createElement('div');
        card.className = 'card mb-3 text-white senderBox bg-primary ';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let text = document.createElement('div');
        text.innerText = Message.Text;
        text.className = 'card-text text-start ';

        let footer = document.createElement('div');
        footer.innerText = Message.SendData;
        footer.className = 'label text-end labelData small ';


        cardBody.appendChild(text);
        cardBody.appendChild(footer);
        card.appendChild(cardBody);
        dialogContainer.appendChild(card);
    } else {
        let card = document.createElement('div');
        card.className = 'card mb-3 text-white bg-dark reciverBox ';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let text = document.createElement('div');
        text.innerText = Message.Text;
        text.className = 'card-text text-start';

        let footer = document.createElement('div');
        footer.innerText = Message.SendData;
        footer.className = 'label text-muted text-end labelData small';

        cardBody.appendChild(text);
        cardBody.appendChild(footer);
        card.appendChild(cardBody);
        dialogContainer.appendChild(card);
    }
};


function initMessange(Message) {
    if (dialogContainer) {
        document.getElementById('messengeWin').replaceWith(dialogContainer);
    }

    dialogContainer = document.getElementById('messengeWin');
    var sub = document.getElementById('subtext');

    if (sub) {
        sub.classList.add("d-none");
    }

    Array.from(Message).forEach(Mes => CreateMessage(Mes));

};
function UpdateMess(Username) {
    var messange = document.getElementById('messengeWin');
    while (messange.firstChild) {
        messange.removeChild(messange.firstChild);
    }
    var thisFriendMessanges = [];
    Array.from(Messages).forEach(Mess => {
        for (var i = 0; userFriends.length > i; i++) {
            if (userFriends[i].Name === Username) {
                if (userFriends[i].Id === Mess.ReceiverId || userFriends[i].Id === Mess.SenderId) {
                    if (currentUser.Id === Mess.ReceiverId || currentUser.Id === Mess.SenderId) {
                        thisFriendMessanges.push(Mess);
                    }

                }

            }
        }
    })
    initMessange(thisFriendMessanges);
};
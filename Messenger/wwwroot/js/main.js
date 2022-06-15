var currentUser;
var Messages = [];
var userFriends = [];

//Элементы окн(диалогов,чата и текст-арии)
var friend = document.getElementById('friendMenu');
var dialog_win = document.getElementById('DialogWin');
var textMess = document.getElementById('usertext');

//Контейнер для сообщений
var dialogContainer;

/*userName = document.getElementById("username");*/

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
function GetUserData() {
    let userName = document.getElementById("username");
    setTimeout(function () { hubConnection.invoke("GetData", userName.innerHTML) }, 300);
}

function SendData(message) {
    setTimeout(function () { hubConnection.invoke("SendData", currentUser, message); }, 300);
}

hubConnection.start();

GetUserData();

//метод выполняемый при загрузки всего dom'а и ресурсов
Start();

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
sendBtn.addEventListener('click', SendMessange);


//функция выполняемая при нажатие на кнопку "Отправить сообщение"
function SendMessange() {
    //Хранилище для сообщения которое набрали
    var message = {};
    //id пользователя которому отправляется сообщение
    var recId = null;
    Array.from(userFriends).forEach(userFr => {
        if (userFr.name === document.getElementById('dialog-info').innerHTML) {
            recId = userFr.id;
            reciverName = userFr.name;
        }
    })
    //name пользователя которому отправляется сообщение
    var reciverName;
    //Проверка на то что сообщение кому то вообще адресовано(переписать под ваш лад)
    if (recId != null) {
        //Получаем текущее время в формате(вся инфа)
        var nowdate = new Date();
        //Получаем из этой инфы только текущие часы и минуты
        var hrs = nowdate.getHours();
        var min = nowdate.getMinutes();

        if (hrs < 10) hrs = "0" + hrs;
        if (min < 10) min = "0" + min;
        //Записываем их в строку
        let timesend = hrs + ":" + min;
        //Проверка на то что сообщение не пустое
        if (textMess.value) {
            //формирование сообщения
            message = { Id: 0, Text: textMess.value, SendDate: nowdate, SenderId: currentUser.id, ReceiverId: recId, DialogId: 0 };
            SendData(message);
        }
    }

    // Очистка поля ввода сообщения после нажатия на кнопку
    textMess.value = "";

    UpdateMess(reciverName);
}
//Функция создания карточек сообщений(разные стили)
function CreateMessage(Message) {
    if (currentUser.id === Message.senderId) {
        let card = document.createElement('div');
        card.className = 'card mb-3 text-white senderBox bg-primary ';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let text = document.createElement('div');
        text.innerText = Message.text;
        text.className = 'card-text text-start ';

        let footer = document.createElement('div');
        if (Message.sendDate.length > 5) {
            Message.sendDate = Message.sendDate.substring(11, 16);
        }
        footer.innerText = Message.sendDate;
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
        text.innerText = Message.text;
        text.className = 'card-text text-start';

        let footer = document.createElement('div');
        if (Message.sendDate.length > 5) {
            Message.sendDate = Message.sendDate.substring(11, 16);
        }
        footer.innerText = Message.sendDate;
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
            if ((userFriends[i].name === Username) && 
                (userFriends[i].id === Mess.receiverId || userFriends[i].id === Mess.senderId) &&
                (currentUser.id === Mess.receiverId || currentUser.id === Mess.senderId))
            {
                thisFriendMessanges.push(Mess);
            }
        }
    })
    initMessange(thisFriendMessanges);

    // Задает скролл листа сообщений таким образом что при добавлении скрол сам будет опускаться вниз
    document.getElementById('messengeWin').scrollIntoView(false);
};
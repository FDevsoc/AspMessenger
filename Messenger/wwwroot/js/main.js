// Данные пользователя
var currentUser;
var messages = [];
var userFriends = [];
var newUserFriends = [];
var foundUser;

// Название карточки (никнейм собеседника)
var cardDialogName;
// Карточка диалога (HTML элемент)
var cardDialog;

// Элементы окн (диалогов, чата и поля ввода)
var friendMenu = document.getElementById('friendMenu');
var dialogWindow = document.getElementById('DialogWin');
var messageInputField = document.getElementById('usertext');
var listItem = document.getElementById('findUser');

// Контейнер для карточек сообщений 
var messageCardsContainer;

// Хранилище карточек диалогов
var dialogCardsContainer = document.getElementsByClassName('userCard');

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("MainChat")
    .build();

// Получение сообщениий от сервера
hubConnection.on('GetData', function (currentClient, messageList, friendList) {
    currentUser = currentClient;
    messages = messageList;
    userFriends = friendList;

    showDialogWindow(cardDialogName);
});

hubConnection.on('FindUser', function (newFriend) {
    foundUser = newFriend;
    addFindUserInList(foundUser);
});

// Отправка сообщения на сервер
function GetUserData() {
    let userName = document.getElementById("username");
    hubConnection.invoke("GetData", userName.innerHTML);
}

hubConnection.start();






document.getElementById('dropdownMenu2').onclick = findUser;

function findUser() {
    let findField = document.getElementById('searchBox').value;
    hubConnection.invoke("FindUser", findField);
}


function addFindUserInList(foundUser) {
    if (foundUser == null) listItem.innerText = "Ничего не найдено";

    listItem.innerText = foundUser.name;
}


listItem.onclick = () => {
    if (listItem.innerText == "Ничего не найдено") return;

    if (userFriends.find(u => u.id == foundUser.id)) return;

    document.getElementById('dialog').innerHTML += `
        <div class="card userCard text-white bg-dark shadow">
          <div class="card-body rey">
            <h5 class="card-title">${foundUser.name}</h5>
          </div>
        </div>
    `;
    dialogCardsContainer = document.getElementsByClassName('userCard');

    initDialog();

    document.getElementById('subtext').classList.add("d-none");
    newUserFriends.push(foundUser);
}



function initDialog() {
    if (!dialogCardsContainer) return;

    // Перебор карточек и добавление каждой прослушки
    Array.from(dialogCardsContainer).forEach(cardDialogItem => {
        cardDialogItem.addEventListener('click', function () {
            cardDialogName = cardDialogItem.firstElementChild.firstElementChild.innerText;
            cardDialog = cardDialogItem;

            GetUserData();

            var dialogWindowPlaceholder = document.getElementById('subtextWin');
            dialogWindowPlaceholder.classList.add("d-none");

            // Убирает отображение диалогов и добавляет отображение окна сообщений на мобильных устройствах
            dialogWindow.classList.remove("d-none");
            friendMenu.classList.add("d-none")

            var mainDialogWindow = document.getElementById('chatWin');
            mainDialogWindow.classList.remove("d-none");

            var dialogCardBody = cardDialogItem.firstElementChild;
            cardDialogItem.classList.add('border-primary');
            dialogCardBody.classList.add("bushcard");

            // Удаляет стиль "активной" у остальных других, если такие имеются
            for (var i = 0; dialogCardsContainer.length > i; i++) {
                var cardClassList = dialogCardsContainer[i].classList;
                if (cardClassList.contains("border-primary") &&
                    cardDialogItem.classList != cardClassList) {
                    cardClassList.remove("border-primary");
                }

                var cardBodyClassList = dialogCardsContainer[i].firstElementChild.classList;
                if (cardBodyClassList.contains("bushcard") & cardDialogItem.classList != cardClassList) {
                    cardBodyClassList.remove("bushcard");
                }
            }

            setTimeout(scrollDown, 200);
        });
    });
}

initDialog();

// Метод отображения окна сообщений
function showDialogWindow(friendName) {
    document.getElementById('dialog-info').innerText = friendName;
    updateMessages(friendName);
}


// Кнопка "назад" (для мобильных устройств)
var backBtn = document.getElementById('backBtn');

// Обработчик события клика на кнопку "назад"
backBtn.onclick = () => {
    dialogWindow.classList.add("d-none");
    friendMenu.classList.remove("d-none");
}


// Кнопка отправки сообщения
var sendBtn = document.getElementById('sendMessange');
// Событие клика на кнопку отправки сообщения

sendBtn.addEventListener('click', () => {
    sendMessage();
    setTimeout(scrollDown, 200);
});


// Обработчик события отправки сообщения
function sendMessage() {
    if (!messageInputField.value) return;

    // Объект нового сообщения
    let message;
    // Id и имя пользователя которому отправляется сообщение
    let receiverId;
    let reciverName;

    Array.from(userFriends).forEach(userFriend => {
        if (userFriend.name === document.getElementById('dialog-info').innerHTML) {
            receiverId = userFriend.id;
            reciverName = userFriend.name;
        }
    })

    if (receiverId == null) {
        Array.from(newUserFriends).forEach(userFriend => {
            if (userFriend.name === document.getElementById('dialog-info').innerHTML) {
                receiverId = userFriend.id;
                reciverName = userFriend.name;
            }
        })
    }

    // Формирование объекта сообщения
    message = {
        Id: 0,
        Text: messageInputField.value,
        SendDate: new Date(),
        SenderId: currentUser.id,
        ReceiverId: receiverId,
        DialogId: 0
    };

    hubConnection.invoke("SendData", currentUser, message);

    // Очистка поля ввода сообщения после нажатия на кнопку
    messageInputField.value = "";
    updateMessages(reciverName);
}


function scrollDown() {
    document.getElementById('messengeWin').scrollIntoView(false);
}


//Функция создания карточек сообщений 
function createMessage(message) {
    function refreshHtmlMessage(cardClasses, footerClass = '') {
        let card = document.createElement('div');
        card.className = `card mb-3 text-white ${cardClasses}`;

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let text = document.createElement('div');
        text.innerText = message.text;
        text.className = 'card-text text-start';

        let footer = document.createElement('div');

        if (message.sendDate.length > 5) message.sendDate = message.sendDate.substring(11, 16);

        footer.innerText = message.sendDate;
        footer.className = `label text-end labelData small ${footerClass}`;

        cardBody.appendChild(text);
        cardBody.appendChild(footer);
        card.appendChild(cardBody);
        messageCardsContainer.appendChild(card);
    }

    if (currentUser.id === message.senderId) {
        refreshHtmlMessage('bg-primary senderBox')
    } else {
        refreshHtmlMessage('bg-dark reciverBox', 'text-muted');
    }
};


function initMessages(messages) {
    if (messageCardsContainer) document.getElementById('messengeWin').replaceWith(messageCardsContainer);
    messageCardsContainer = document.getElementById('messengeWin');

    let dialogMenuPlaceholder = document.getElementById('subtext');
    if (dialogMenuPlaceholder) dialogMenuPlaceholder.classList.add("d-none");

    Array.from(messages).forEach(message => createMessage(message));
};


function updateMessages(friendName) {
    GetUserData();
    updateMessageCards(friendName);
};


function updateMessageCards(friendName) {
    let messageWindow = document.getElementById('messengeWin');
    while (messageWindow.firstChild) {
        messageWindow.removeChild(messageWindow.firstChild);
    }

    let messageList = [];
    Array.from(messages).forEach(message => {
        for (let i = 0; userFriends.length > i; i++) {
            if ((userFriends[i].name === friendName) &&
                (userFriends[i].id === message.receiverId || userFriends[i].id === message.senderId) &&
                (currentUser.id === message.receiverId || currentUser.id === message.senderId)) {
                messageList.push(message);
            }
        }
    })

    initMessages(messageList);
}
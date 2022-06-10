// Диалоги
var Users = [];

var Messages = [];

let user = { Id: 1, Name: "Какой-то чел"};

let cardContainer;
let dialogContainer;

// Создание карточки диалога
let createDialogCard = (Users) => {
    let card = document.createElement('div');
    card.className = 'card userCard text-white bg-dark shadow ';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement('h5');
    title.innerText = Users.Name;
    title.className = 'card-title';

    cardBody.appendChild(title);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
};

let initListOfTasks = () => {
    if (cardContainer) {
        document.getElementById('dialog').replaceWith(cardContainer);
        return;
    }

    cardContainer = document.getElementById('dialog');
    var sub = document.getElementById('subtext');
    sub.classList.add("d-none");

    Users.forEach((User) => {
        createDialogCard(User);
    });
};

initListOfTasks(); 
var chatbox = document.getElementById('chatWin');
var dialog_win = document.getElementById('DialogWin');
var friend = document.getElementById('friendMenu');

var user_card = document.getElementsByClassName('userCard');

if (user_card) {
    Array.from(user_card).forEach(u_card => {
        u_card.addEventListener('click', function () {
            var sub = document.getElementById('subtextWin');
            sub.classList.add("d-none"); 
            dialog_win.classList.remove("d-none");
            friend.classList.add("d-none");
            GetMessanges(u_card,user_card);
        });

        u_card.addEventListener('mouseenter', function(){
            var needColor = u_card.firstChild;
            needColor.classList.add("reqs");
        });

        u_card.addEventListener('mouseleave', function () {
            var needColor = u_card.firstChild;
            needColor.classList.remove("reqs");
        });
    });
}


function GetMessanges(card, user_c){
    var username = document.getElementById('dialog-info');
    chatbox.classList.remove("d-none");
    var ch = card.firstChild;

    for(var i=0;user_c.length>i;i++){
        var fItem = user_c[i];
        if(fItem.classList.contains("border-primary"))
        {
            fItem.classList.remove("border-primary");
        }

        var item = fItem.firstChild;
        if(item.classList.contains("bushcard"))
        {
            item.classList.remove("bushcard");
        }
    }

    card.classList.add("border-primary");
    ch.classList.add("bushcard");
    var lch = ch.firstChild;
    username.innerText = lch.innerText;
    UpdateMess(lch.innerText);
};


function UpdateMess(userN) {
    var messange = document.getElementById('messengeWin');
    while (messange.firstChild) {
        messange.removeChild(messange.firstChild);
    }
    let arrayMessanges = [];

    Array.from(Messages).forEach(Mess => {
        for(var i=0;Users.length>i;i++) {
            var User = Users[i];
            if(User.Id === Mess.ReceiverId  & User.Name === userN)
            {
                arrayMessanges.push(Mess);
            }
        }
    });
    initMessange(arrayMessanges);
};


var backButt = document.getElementById('backBtn');


backButt.onclick = function(){
    dialog_win.classList.add("d-none");
    friend.classList.remove("d-none");
    

}

function CreateDialog(Message){
    if (user.Id === Message.SenderId) {
        let card = document.createElement('div');
        card.className = 'card mb-3 text-white senderBox bg-transp';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body reqsforChat';

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


function initMessange(Message){
    if (dialogContainer) {
        document.getElementById('messengeWin').replaceWith(dialogContainer);
    }

    dialogContainer = document.getElementById('messengeWin');
    var sub = document.getElementById('subtext');

    if(sub){
        sub.classList.add("d-none");
    }
    
    Array.from(Message).forEach(Mes =>CreateDialog(Mes));
};


var sendBtn = document.getElementById('sendMessange');
sendBtn.addEventListener('click', SendMessange);


function SendMessange(){
    var messange = {};
    var recId = 0;
    var reciverName = document.getElementById("dialog-info");

    Array.from(Users).forEach(User => {
        if (User.Name === reciverName.innerText) {
            recId = User.Id;
        }
    });

    if (recId != 0) {
        var nowdate = new Date();
        var hrs = nowdate.getHours();
        var min = nowdate.getMinutes();

        if (hrs < 10) hrs = "0" + hrs;
        if (min < 10) min = "0" + min;

        let timesend = hrs + ":" + min;
        var textMess = document.getElementById('usertext');

        if (textMess.value) messange = {Id:1,Text:textMess.value,SendData:timesend,SenderId: user.Id,ReceiverId: recId,DialogId:7};
    }

    Messages.push(messange);
    UpdateMess(reciverName.innerText);
    textMess.value = "";
    document.getElementById('messengeWin').scrollIntoView(false);
};
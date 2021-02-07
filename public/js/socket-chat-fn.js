let params = new URLSearchParams(window.location.search);

let divUsers = document.getElementById('divUsers');
let formSend = document.getElementById('formSend');
let txtMessage = document.getElementById('txtMessage');
let divChatbox = document.getElementById('divChatbox');

let name = params.get('name');
let room = params.get('room');

function renderUser(persons) {
    let markup = `
        <li>
            <a href="javascript:void(0)" class="active"><span>${params.get('room')}</span> Chat</a>
        </li>
    `;
            
    for(let i=0; i<persons.length; i++) {
        markup += `
            <li>
                <a data-id='${persons[i].id}' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persons[i].name}<small class="text-success">online</small></span></a>
            </li>
        `;
    }

    divUsers.innerHTML = markup;
    divUsers.querySelectorAll('a').forEach( link => {
        link.addEventListener('click', () => {
            let id = link.getAttribute('data-id');
            if(id) {
                console.log(id);
            }
        });
    });
}

function renderMessage(message, me) {
    let markup = '';
    var date = new Date(message.date);
    var hour = `${date.getHours()} : ${date.getMinutes()}`;

    var adminClass = 'info';
    if(message.name === 'Administrator'){
        adminClass = 'danger';
    }

    if(me) {
        markup += `
            <li class="animated fadeIn reverse">
                <div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-inverse">${message.message}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
    } else {
        if(message.name !== 'Administrator'){
            markup += `
                <li class='animated fadeIn'>
                    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
            `;
        }

        markup += `
            <div class="chat-content">
                <h5>${message.name}</h5>
                <div class="box bg-light-${adminClass}">${message.message}</div>
            </div>
            <div class="chat-time">${hour}</div>
        </li>
        `;
    }

    divChatbox.insertAdjacentHTML('beforeend', markup);
}

function scrollBottom(allwaysBottom) {
    //Two different ways
    if(allwaysBottom) {
        //other way to scroll, finded in internet
        // this way if an element grows, the scroll always directs to bottom.
    divChatbox.scrollTo(0,divChatbox.scrollHeight);
    } else {
        //--code jquery to vanilla js
        if(!divChatbox.querySelector('li:last-child')) return;
    
        var newMessage = divChatbox.querySelector('li:last-child');
        var clientHeight = divChatbox.clientHeight;
        var scrollTop = divChatbox.scrollTop;
        var scrollHeight = divChatbox.scrollHeight;
        var newMessageHeight = parseFloat(getComputedStyle(newMessage, null).height.replace("px", ""));
        var lastMessageHeight = 0;
        if(newMessage.previousElementSibling) {
            lastMessageHeight = parseFloat(getComputedStyle(newMessage.previousElementSibling, null).height.replace("px", ""));
        }
    
        if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            divChatbox.scrollTop = scrollHeight;
        }
    }
}

formSend.addEventListener('submit', function(e) {
    e.preventDefault();
    if(txtMessage.value.trim().length === 0) {
        return;
    }
    console.log(txtMessage.value)
    socket.emit('createMessage',{
            user: name,
            message: txtMessage.value
    }, function(message) {
        txtMessage.value = '';
        txtMessage.focus();
        renderMessage(message, true);
        scrollBottom(true);
    });
});

const chatId = document.getElementById('chatId').value;
const msg = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const msgContainer = document.getElementById('messages-container');
const callBtn = document.getElementById("callBtn");
msgContainer.scrollTop = msgContainer.scrollHeight;

socket.emit('joinChat', chatId);

sendBtn.onclick = function () {
    let content = msg.value;
    socket.emit('sendMessage', {
        chat: chatId,
        content: content,
        sender: myId
    }, () => {
        msg.value = '';
        msgContainer.scrollTop = msgContainer.scrollHeight;
    });
};

socket.on('newMessage', msg => {
    msgContainer.innerHTML += `
        <span class="msg ${msg.sender === myId ? "left" : "right"}">
            ${msg.content}
        </span>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;
});

let peer = new Peer();
let peerId = null;
peer.on('open', function(id) {
    console.log('My Id Is', id);
    peerId = id;
});

callBtn.onclick = () => {
    socket.emit('requestPeerId', chatId);
}

socket.on('getPeerId', () => {
    socket.emit('sendPeerId',{
        chatId: chatId,
        peerId: peerId 
    });
});

socket.on('receivePeerId', id => {
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
        let call = peer.call(id, stream); 
        call.on('stream', showVideoCall);   
    }).catch(err => {
        console.log(err);
    });
});

peer.on('call', function(call) {
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
        call.answer(stream);
        call.on('stream', showVideoCall);
    }).catch(err => {
        console.log(err);
    });
});

function showVideoCall(stream) {
    let video = document.createElement('video');
    video.srcObject = stream;
    document.body.append(video);
    video.play();
}
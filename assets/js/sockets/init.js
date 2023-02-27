const socket = io();
const btn = document.getElementById('friendRequestsDropdown');
const myId = document.getElementById('userId').value;

socket.on('connect', () => {
    console.log('Connected');
    socket.emit('joinNotificationsRoom', myId);
    socket.emit('goOnline', myId);
});

socket.on('newFriendRequest', data => {
    const friendRequests = document.getElementById('friendRequests');
    const span = friendRequests.querySelector('.noRequests');
    if (span) {
        span.remove();
    }
    friendRequests.innerHTML += `
        <li>
            <a class="dropdown-item" href="/profile/${data.id}">${data.name}</a>
        </li>
    `;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-danger');
});

btn.onclick = () => {
    btn.classList.remove('btn-danger');
    btn.classList.add('btn-primary');
};
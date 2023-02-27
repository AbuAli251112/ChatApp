socket.emit('getOnlineFriends', myId);

socket.on('onlineFriends', friends => {
    let div = document.getElementById('onlineFriends');
    if (friends.length === 0) {
        div.innerHTML = `
            <p class="alert alert-danger mt-2">No Online Friends</p>
        `;
    } else {
        let html = `
            <div class="row">
        `;
        for (let friend of friends) {
            html += `
                <div class="col-12 col-md-6 col-lg-4 mt-2">
                    <img src="/${friend.image}">
                    <div>
                        <h3
                            <a href="/profile/${friend.id}">${friend.name}</a>
                        </h3>
                        <a href="/chat/${friend.chatId}" class="btn btn-success">Chat</a>
                    </div>
                </div>
            `;
        }
        html += "</div>";
        div.innerHTML = html;
    }
});
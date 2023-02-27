const express = require('express');
const path = require('path');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session');
const flash = require('connect-flash');
const socketIO = require('socket.io');
const http = require('http');
const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const friendRouter = require('./routes/friend.route');
const homeRouter = require('./routes/home.route');
const chatRouter = require('./routes/chat.route');
const groupRouter = require("./routes/group.route");
const getFriendRequests = require('./models/user.model').getFriendRequests;

const SessionStore = sessionStore(session);
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.onlineUsers = {};

io.on('connection', socket => {
    console.log('New User Connected');
    require('./sockets/init.socket')(io, socket);
    require('./sockets/friend.socket')(io, socket);
    require('./sockets/chat.socket')(io, socket);
    require('./sockets/group.socket')(io, socket);
});

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(flash());

const Store = new SessionStore({
    uri: "mongodb+srv://hassanAbuAli:k679Q4XCyjuu3JK@cluster0.qtszyhb.mongodb.net/Chat-App?retryWrites=true&w=majority",
    collection: 'sessions'
});

app.use(session({
    secret: 'This Is My Secret Secret To Hash Express Sessions ......',
    saveUninitialized: false,
    store: Store,
    resave: true
}));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.session.userId) {
        getFriendRequests(req.session.userId).then((requests) => {
            req.friendRequests = requests;
            next();
        }).catch((err) => {
            res.redirect('/error');
        })
    } else {
        next();
    }
});

app.use('/', homeRouter);
app.use('/user', authRouter);
app.use('/profile', profileRouter);
app.use('/friend', friendRouter);
app.use('/chat', chatRouter);
app.use("/groups", groupRouter);

app.get('/error', (req, res) => {
    res.status(500);
    res.render('error', {
        isUser: req.session.userId,
        myId: req.session.userId,
        pageTitle: 'Error',
        friendRequests: req.friendRequests
    })
});

app.use((req, res) => {
    res.status(404);
    res.render('not-found', {
        isUser: req.session.userId,
        myId: req.session.userId,
        pageTitle: "Page Not Found",
        friendRequests: req.friendRequests
    })
});

server.listen(5000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server Listen On Port 5000');
    }
})
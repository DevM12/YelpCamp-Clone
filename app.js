if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//process.env.SECRET or anything



const express = require("express");  //connecting express package
const app = express();
const path = require('path');
const methodOverride = require('method-override');  //connecting  meathod override package
const { v4: uuid } = require('uuid');   //connecting uuid package
uuid();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');

const MongoDBStore=require('connect-mongo')(session);

const helmet = require('helmet');

const User = require('./models/user.js');

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";

//"mongodb://127.0.0.1:27017/yelp-camp"
//morgan
const morgan = require('morgan');
app.use(morgan('dev'))

//ejs mate
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate)

//connecting mongoose
const mongoose = require('mongoose');

const ExpressError = require('./utilities/ExpressError.js');

//connecting mongoose to port

//mongodb://127.0.0.1:27017/yelp-camp
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error;"));
db.once("open", () => {
    console.log("Database connected");
});

//meathod override package usage
app.use(methodOverride('_method'));

//express package usage
app.use(express.urlencoded({ entended: true }))
app.use(express.json())

app.use(mongoSanitize());

//connectiong folders in which ejs files and partials folder is saved
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')))


const secret = process.env.CLOUDINARY_SECRET0||'This is a secret';

const store = new MongoDBStore({
    url:dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on("error",function(e){
    console.log("session Store Error",e)
})



const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialised: true,
    cookie: {
        httpOnly: true,

        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dkr4ci3nw/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }),
    helmet.crossOriginEmbedderPolicy({
        policy:"credentialless"
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.dark = req.flash('dark');
    res.locals.danger = req.flash('danger');
    next();
})

//USER SECTION

const userRoutes = require('./routes/user.js')
app.use('/', userRoutes)


//CAMPGROUND SECTION
const campgroundRoutes = require('./routes/campgrounds.js');
app.use('/campgrounds', campgroundRoutes)


//REVIEW SECTION
const reviewRoutes = require('./routes/review.js');
app.use('/campgrounds/:id/review', reviewRoutes)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = '500' } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('./error', { err });
})


app.listen(3000, () => {
    console.log('Listening on port 3000');

})

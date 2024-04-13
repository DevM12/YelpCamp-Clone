const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '659ba7a45cad3c033c6083bb',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)},${sample(places)}`,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            description: 'BLAH BLAH BLAH',
            image: [
                {
                    url: "https://res.cloudinary.com/dkr4ci3nw/image/upload/v1708113574/yelp/eidpvdtsjaikpop4hqjq.jpg",
                    filename: "yelp/eidpvdtsjaikpop4hqjq"
                },
                {
                    url: "https://res.cloudinary.com/dkr4ci3nw/image/upload/v1708113575/yelp/ctar1pnv5rsp4thzs8ac.jpg",
                    filename: "yelp/ctar1pnv5rsp4thzs8ac"
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => mongoose.connection.close());
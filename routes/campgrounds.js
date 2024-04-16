const express = require("express");  //connecting express package
const router = express.Router();
const campground = require('../controllers/campgrounds.js');
const catchAsync = require('../utilities/catchAsync.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campground.index))

    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground))

router.get('/new', isLoggedIn, campground.newCampgroundForm);



router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))





module.exports = router;

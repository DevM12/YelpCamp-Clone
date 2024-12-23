const express = require("express");  //connecting express package
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync.js');
const ExpressError = require('../utilities/ExpressError.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');
const review = require('../controllers/reviews.js')




router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview))



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))

module.exports = router;

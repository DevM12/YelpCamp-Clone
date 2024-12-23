const { campgroundSchema, reviewSchema } = require('./Schema.js');
const ExpressError = require('./utilities/ExpressError.js');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        
        req.flash('danger', 'You must be signed in');
        res.redirect('/login');
    }
    next();
};
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('danger', 'You are not allowed!')
        res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('danger', 'You are not allowed!')
        res.redirect(`/campgrounds/${id}`)
    }
    next();
}


module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.storeReturnTo = (req, res, next) => {
    if (!req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    } next();
};

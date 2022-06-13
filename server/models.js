const getReviews = require('../database/getReviews');
const getReviewMeta = require('../database/getReviewMeta');
const addPhotos = require('../database/addphotos');
const addReview = require('../database/addreview');
const addCharact = require('../database/addcharact');
const addHelpful = require('../database/addhelpful');
const addReported = require('../database/addreported');

module.exports = {
  dbGetReviews: (params) => getReviews(params),
  dbGetMeta: (params) => getReviewMeta(params),
  dbAddReview: (params) => {
    return addReview(params)
    .then(({rows}) => {
      const reviewId = rows[0].id;
      addPhotos({ photos: params.photos, reviewId });
      addCharact({ characteristics: params.characteristics, reviewId });
    });
  },
  dbAddHelpful: (params) => addHelpful(params),
  dbReportReview: (params) => addReported(params),
}
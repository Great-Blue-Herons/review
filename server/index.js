const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const controller = require('./controllers');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/reviews/:product_id', controller.addReview);
app.put('/reviews/:review_id/helpful', controller.addHelpful);
app.put('/reviews/:review_id/report', controller.reportReview);
app.get('/reviews/:product_id/list', controller.getReviews);
app.get('/reviews/:product_id/meta', controller.getReviewMeta);

app.listen(3000);

console.log("Listening on port 3000");
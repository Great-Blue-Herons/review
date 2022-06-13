const pool = require('./index');

module.exports = ({ photos, reviewId }) => {
  const query = ` INSERT INTO reviews_photos (url, review_id)
        SELECT url, review_id FROM UNNEST ($1::text[], $2::int[]) AS t (url, review_id)`;

  return pool.connect().then((client) => {
    return client
      .query(query, [photos, Array(photos.length).fill(reviewId)])
      .then((res) => {
        client.release();
        return res;
      })
      .catch((err) => {
        client.release();
        console.log('DB INSERT ERROR: ', err);
      });
  });
};
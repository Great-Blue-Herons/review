const pool = require('./index');

module.exports = ({ characteristics, reviewId }) => {
  const query = ` INSERT INTO characteristics_reviews (review_id, characteristics_id, value)
        SELECT review_id, characteristics_id, value FROM UNNEST ($1::int[], $2::int[], $3::int[]) AS t (review_id, characteristics_id, value)`;

  return pool.connect().then((client) => {
    return client
      .query(query, [
        Array(Object.keys(characteristics).length).fill(reviewId),
        Object.keys(characteristics),
        Object.values(characteristics),
      ])
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
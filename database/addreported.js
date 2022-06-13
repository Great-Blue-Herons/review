const pool = require('./index');

module.exports = (reviewId) => {
  const query = ` UPDATE "reviews"
        SET "reported" = ${true}
        WHERE id = ${reviewId};`;

  return pool.connect().then((client) => {
    return client
      .query(query)
      .then((res) => {
        client.release();
        return res;
      })
      .catch((err) => {
        client.release();
        return err;
      });
  });
};
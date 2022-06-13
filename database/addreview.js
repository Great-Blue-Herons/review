const pool = require('./index');

module.exports = ({ productId, rating, summary, body, recommend, name, email }) => {
  const query = ` INSERT INTO "reviews"
        ("product_id", "rating", "date", "summary", "body", "recommend", "reviewer_name", "reviewer_email", "helpfulness")
        VALUES
        (${productId}, ${rating}, ${Date.now()}, '${summary}', '${body}', ${recommend}, '${name}', '${email}', 0)
        RETURNING id;`;

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
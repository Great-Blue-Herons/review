const pool = require('./index');

module.exports = (productId) => {
  const query = `
      select rMain.product_id,
        (
        select jsonb_agg(outerC) from
          (
          SELECT json_object_agg(r2.rating,
            (
            SELECT count(r1.rating)
            FROM reviews r1
            WHERE r1.product_id = rMain.product_id AND r1.rating = r2.rating
            )
          ) AS counts
        FROM reviews r2
        WHERE r2.product_id = rMain.product_id
        GROUP BY r2.rating) as outerC) as ratings,
        (
        select jsonb_agg(outerRecommendCounts) from
          (
          SELECT json_object_agg(r4.recommend,
            (
            SELECT count(r3.recommend)
            FROM reviews r3
            WHERE r3.product_id = rMain.product_id AND r3.recommend = r4.recommend
            )
          ) AS recommendCounts
        FROM reviews r4
        WHERE r4.product_id = rMain.product_id
        GROUP BY r4.recommend) as outerRecommendCounts
        ) as recommended,
        (
        select array_to_json(array_agg(characteristicGroup)) from
          (
          select c.name, c.id, avg(cr.value) as value
          from "characteristics" c
          inner join characteristics_reviews cr
          on c.id = cr.characteristics_id
          where c.product_id = rMain.product_id
          group by c.id
          ) characteristicGroup
        ) as characteristics
      from reviews rMain
      where rMain.product_id = ${productId}
      group by rMain.product_id
      ;`;

  const transformer = (data) => {
    let ratings = {};
    let recommended = {};
    let characteristics = {};
    data = data.rows[0];
    data.ratings.forEach((row) => {
      ratings = { ...ratings, ...row.counts };
    });
    data.ratings = ratings;
    data.recommended.forEach((row) => {
      recommended = { ...recommended, ...row.recommendcounts };
    });
    data.recommended = recommended;
    data.characteristics.forEach((row) => {
      characteristics = { ...characteristics, [row.name]: { id: row.id, value: row.value } };
    });
    data.characteristics = characteristics;
    return data;
  };

  return pool.connect().then((client) => {
    return client
      .query(query)
      .then((res) => {
        client.release();
        return transformer(res);
      })
      .catch((err) => {
        client.release();
        return err;
      });
  });
};
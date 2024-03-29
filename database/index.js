const { Client } = require('pg');
const squel = require('squel');
const dbconf = require('../config/db_config.js');


const makeQuery = (client, sql, callback) => {
  client.connect()
    .then(() => {
      client.query(sql)
        .then((res) => {
          callback(null, res.rows);
          client.end();
        })
        .catch((err) => {
          callback(err);
          client.end();
        });
    })
    .catch((err) => {
      callback(err);
      client.end();
    });
};

module.exports.getAllReviews = (restaurantId, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });

  const sql = `SELECT 
    reviews.id, 
    reviews.restaurant,
    reviews.text,
    reviews.date,
    reviews.overall,
    reviews.food,
    reviews.service,
    reviews.ambience,
    reviews.wouldrecommend,
    reviews.tags,
    diners.firstname,
    diners.lastname,
    diners.city,
    diners.avatarcolor,
    diners.isvip,
    diners.totalreviews
    from reviews INNER JOIN diners 
    on (reviews.diner = diners.id) 
    where reviews.restaurant = ${restaurantId}`;

  makeQuery(client, sql, callback);
};

module.exports.getSummary = (restaurantId, callback) => {
  // get restaurant summary info from restaurant table
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });
  const sql = squel.select()
    .from('restaurants')
    .field('restaurants.location')
    .field('restaurants.noise')
    .field('restaurants.recommendpercent', 'recommendPercent')
    .field('restaurants.valuerating', 'valueRating')
    .field('restaurants.averageoverall', 'averageOverall')
    .field('restaurants.averagefood', 'averageFood')
    .field('restaurants.averageambience', 'averageAmbience')
    .field('restaurants.averageservice', 'averageService')
    .where(`id = ${restaurantId}`)
    .toString();

  makeQuery(client, sql, callback);
};

module.exports.createReview = (reviewData, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });

  const insertReview = `INSERT INTO reviews
    (
      restaurant,
      diner,
      text,
      date,
      overall,
      food,
      service,
      ambience,
      wouldrecommend,
      tags
    ) 
    VALUES
    (
      ${reviewData.restaurant},
      ${reviewData.diner},
      ${reviewData.text},
      ${reviewData.date},
      ${reviewData.overall},
      ${reviewData.food},
      ${reviewData.service},
      ${reviewData.ambience},
      ${reviewData.wouldrecommend},
      ${reviewData.tags},
    )`;
  
    makeQuery(client, insertReview, callback);
}

module.exports.editReview = (reviewData, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });

  const editReview = `UPDATE reviews
    SET text = ${reviewData.text}
    WHERE id = ${reviewData.id}
    `;
  
    makeQuery(client, editReview, callback);
}

module.exports.deleteReview = (reviewData, callback) => {
  const client = new Client({
    user: dbconf.role,
    host: dbconf.host,
    database: 'reviews',
    password: dbconf.password,
    port: 5432
  });

  const deleteReview = `DELETE FROM reviews WHERE id = ${reviewData.id}`;
  
    makeQuery(client, deleteReview, callback);
}
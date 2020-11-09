
exports.seed = async knex => {
  // Deletes ALL existing entries
  await knex('cart').del()
  await knex('product').del()
  await knex('user').del()

  await knex("user").insert([{
    id: 1,
    email: "test@gmail.com",
    password: "password"
  }])
  await knex("product").insert([{
    id: 1,
    name: "T-shirt",
    product_type: "Shirt",
    size: "S",
    color: "white"
  }])
  await knex("cart").insert([{
    user_id: 1,
    product_id: 1
  }])
};

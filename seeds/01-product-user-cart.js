
exports.seed = async knex => {
  // Deletes ALL existing entries
  await knex('cart').del()
  await knex('product').del()
  await knex('user').del()

  await knex("user").insert([{
    // id: 1,
    email: "test@gmail.com",
    password: "password"
  }])
  await knex("product").insert([{
    // id: 1,
    name: "Mens T-shirt",
    product_type: "Mens-Shirt",
    size: "M",
    color: "white"
  },{
  // id: 1,
  name: "Womans T-shirt",
  product_type: "Womens-Shirt",
  size: "M",
  color: "white"
},{
  // id: 2,
  name: "Unisex Long-sleeve Shirt",
  product_type: "LS-Shirt",
  size: "M",
  color: "white"
},{
  name: "Unisex face covering",
  product_type: "mask",
  size: "M",
  color: "white"
},{
  // id: 3,
  name: "Ball cap",
  product_type: "Hat",
  size: "A",
  color: "white"
},{
  // id: 4,
  name: "Coffee Mug",
  product_type: "Coffee Mug",
  size: "none",
  color: "white"
}])
  // await knex("cart").insert([{
  //   // user_id: 1,
  //   // product_id: 1
  // }])
};

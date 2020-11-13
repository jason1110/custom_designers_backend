
exports.up = async knex => {
    await knex.schema.createTable("user", table => {
        table.increments("id");
        table.string("email")
        table.string("password")
    })
    await knex.schema.createTable("product", table => {
        table.increments("id");
        table.string("name")
        table.string("product_type")
        table.string("size")
        table.string("color")
    })
    await knex.schema.createTable("customProduct", table => {
        table.increments("id");
        table.string("name")
        table.string("product_type")
        table.string("size")
        table.string("color")
        table.string("text")
    })
    await knex.schema.createTable("cart", table => {
        table.integer("user_id").references("id").inTable("user")
        table.integer("customProduct_id").references("id").inTable("customProduct")

    })
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists("cart")
    await knex.schema.dropTableIfExists("customProduct")
    await knex.schema.dropTableIfExists("product")
    await knex.schema.dropTableIfExists("user")
};

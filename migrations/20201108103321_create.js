
exports.up = async knex => {
    await knex.schema.createTable("user", table => {
        table.increments("id");
        table.string("email")
        table.string("password_digest")
    })
    await knex.schema.createTable("product", table => {
        table.increments("id");
        table.string("name")
        table.string("product_type")
        table.string("size")
        table.string("color")
    })
    await knex.schema.createTable("cart", table => {
        table.integer("user_id").references("id").inTable("user")
        table.integer("product_id").references("id").inTable("product")

    })
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists("cart")
    await knex.schema.dropTableIfExists("product")
    await knex.schema.dropTableIfExists("user")
};

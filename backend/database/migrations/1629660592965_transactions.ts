import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Transactions extends BaseSchema {
  protected tableName = "transactions";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer("id").primary();

      table
        .string("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table.string("status").notNullable();
      table.string("type").notNullable();
      table.decimal("value", 8, 2).notNullable();
      table.string("qr_code").notNullable();
      table.string("qr_code_base64").notNullable();
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}

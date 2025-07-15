/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("videos", (table) => {
    table.integer("last_comment_count").defaultTo(0);
    table.float("last_vote_ratio").defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("videos", (table) => {
    table.dropColumn("last_comment_count");
    table.dropColumn("last_vote_ratio");
  });
};

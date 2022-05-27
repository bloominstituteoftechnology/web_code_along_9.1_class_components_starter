const { onUpdateTrigger } = require('../../../knexfile')

exports.up = async function (knex) {
  await knex.schema
    .createTable('roles', (users) => {
      users.increments('role_id')
      users.timestamps(false, true)
      users.string('role_name', 200).notNullable().unique()
    }).then(() => knex.raw(onUpdateTrigger('roles')))

  await knex.schema
    .createTable('users', (users) => {
      users.increments('user_id')
      users.timestamps(false, true)
      users.string('username', 200).notNullable().unique()
      users.string('password', 100).notNullable().unique()
      users.integer('role_id')
        .unsigned()
        .notNullable()
        .references('role_id')
        .inTable('roles')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
    }).then(() => knex.raw(onUpdateTrigger('users')))

  await knex.schema
    .createTable('questions', (questions) => {
      questions.increments('question_id')
      questions.timestamps(false, true)
      questions.string('question_title', 100).notNullable()
      questions.string('question_text', 500).notNullable()
    }).then(() => knex.raw(onUpdateTrigger('questions')))

  await knex.schema
    .createTable('options', (options) => {
      options.increments('option_id')
      options.timestamps(false, true)
      options.string('option_text', 500).notNullable()
      options.string('remark', 500)
      options.boolean('is_correct')
      options.integer('question_id')
        .unsigned()
        .notNullable()
        .references('question_id')
        .inTable('questions')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
    }).then(() => knex.raw(onUpdateTrigger('options')))

  await knex.schema
    .createTable('answers', (answers) => {
      answers.increments('answer_id')
      answers.timestamps(false, true)
      answers.boolean('correctly_answered')
      answers.integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      answers.integer('question_id')
        .unsigned()
        .notNullable()
        .references('question_id')
        .inTable('questions')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
    }).then(() => knex.raw(onUpdateTrigger('answers')))
}

exports.down = async function (knex) {
  await knex.schema
    .dropTableIfExists('answers')
    .dropTableIfExists('options')
    .dropTableIfExists('questions')
    .dropTableIfExists('users')
    .dropTableIfExists('roles')
}

const { importView } = require('@keystonejs/build-field-types');
const { File } = require('@keystonejs/fields');

const { CloudinaryGallery, MongoInterface, KnexInterface } = require('./Implementation');

/**
 * Things to do:
 *
 * - Filter view
 * - Cell view
 * - Publish to NPM
 */

module.exports = {
  type: 'Stars',
  implementation: CloudinaryGallery,
  views: {
    Controller: importView('./views/Controller'),
    Field: importView('./views/Field'),
    Filter: File.views.Filter,
    Cell: importView('./views/Cell'),
  },
  adapters: {
    mongoose: MongoInterface,
    knex: KnexInterface,
  },
};

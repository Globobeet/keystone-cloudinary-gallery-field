const { importView } = require('@keystonejs/build-field-types');

const { CloudinaryGallery, MongoInterface, KnexInterface } = require('./Implementation');

module.exports = {
  type: 'Stars',
  implementation: CloudinaryGallery,
  views: {
    Controller: importView('./views/Controller'),
    Field: importView('./views/Field'),
    Filter: importView('./views/Filter'),
    Cell: importView('./views/Cell'),
  },
  adapters: {
    mongoose: MongoInterface,
    knex: KnexInterface,
  },
};

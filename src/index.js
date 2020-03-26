const { importView } = require('@keystonejs/build-field-types');
const { CloudinaryImageGallery, MongoInterface, KnexInterface } = require('./Implementation');

module.exports = {
  type: 'CloudinaryImageGallery',
  implementation: CloudinaryImageGallery,
  views: {
    Controller: importView('./views/Controller'),
    Field: importView('./views/Field'),
    Cell: importView('./views/Cell'),
  },
  adapters: {
    mongoose: MongoInterface,
    knex: KnexInterface,
  },
};

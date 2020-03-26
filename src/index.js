const { importView } = require('@keystonejs/build-field-types');
const { CloudinaryImage } = require('@keystonejs/fields');
const CloudinaryImageGallery = require('./Implementation');

module.exports = {
    type: 'CloudinaryImageGallery',
    implementation: CloudinaryImageGallery,
    views: {
        Controller: importView('./views/Controller'),
        Field: importView('./views/Field'),
        Cell: importView('./views/Cell'),
    },
    adapters: CloudinaryImage.adapters,
};

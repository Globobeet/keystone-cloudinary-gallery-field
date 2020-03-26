const { CloudinaryImage } = require('@keystonejs/fields');

console.log('>>>', CloudinaryImage);

class CloudinaryImageGallery extends CloudinaryImage.implemenation {}

module.exports = {
    CloudinaryImageGallery,
    MongoInterface: CloudinaryImage.adapters.mongoose,
    KnexInterface: CloudinaryImage.adapters.knex,
};

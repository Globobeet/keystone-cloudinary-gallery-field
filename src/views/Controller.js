const FieldController = require('@keystonejs/fields/Controller');

class CloudinaryGalleryController extends FieldController.default {
  serialize = data => {
    const { path } = this;
    if (!data || !data[path]) {
      // Forcibly return null if empty string
      return null;
    }
    return data[path];
  };

  getQueryFragment = () => `
    ${this.path} {
        images {
            caption
            image {
                id
                path
                filename
                mimetype
                encoding
                publicUrlTransformed(transformation: {
                    height: "120"
                    crop: "limit"
                })
            }
        }
    }
  `;

  getFilterTypes = () => [];
}

module.exports = CloudinaryGalleryController;

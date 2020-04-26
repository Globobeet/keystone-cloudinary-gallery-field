# CloudinaryImageGallery

A sortable list of images uploaded to Cloudinary.

## Usage

You will first need to install the package with your preferred package manager:

```bash
yarn add keystone-cloudinary-gallery-field
npm install keystone-cloudinary-gallery-field
```

Then add the field to a list, passing a valid `CloudinaryAdapter` instance

```js
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
const KeystoneCloudinaryGallery = require('keystone-cloudinary-gallery-field');

const cloudinaryAdapter = new CloudinaryAdapter({...});

keystone.createList('Post', {
  fields: {
    photos: {
      type: KeystoneCloudinaryGallery,
      adapter: cloudinaryAdapter,
    },
  },
});
```

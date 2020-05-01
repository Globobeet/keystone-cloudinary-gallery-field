# Keystone Cloudinary Gallery Field

A sortable list of images uploaded to Cloudinary.

![Screensot](https://cdn-std.droplr.net/files/acc_197298/o2UccL)

## Usage

You will first need to install the package with your preferred package manager:

```bash
yarn add @globobeet/keystone-cloudinary-gallery-field
npm install @globobeet/keystone-cloudinary-gallery-field
```

Then, you'll need a file adapter (which is also used for CloudinaryImage fields)

```js
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'my-keystone-app',
});
```

Then add the field to any list, passing your `CloudinaryAdapter` instance

```js
const KeystoneCloudinaryGallery = require('@globobeet/keystone-cloudinary-gallery-field');

keystone.createList('Post', {
  fields: {
    photos: {
      type: KeystoneCloudinaryGallery,
      adapter: cloudinaryAdapter,
    },
  },
});
```

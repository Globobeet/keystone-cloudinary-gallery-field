const { CloudinaryImage } = require('@keystonejs/fields');
const { MongooseFieldAdapter } = require('@keystonejs/adapter-mongoose');
const { KnexFieldAdapter } = require('@keystonejs/adapter-knex');
const { Types: MongooseTypes } = require('mongoose');

class CloudinaryGallery extends CloudinaryImage.implementation {
  gqlOutputFields() {
    return [`${this.path}: CloudinaryGallery`];
  }

  gqlOutputFieldResolvers() {
    return {
      [this.path]: item => {
        const itemValues = item[this.path];
        if (!itemValues) return null;
        const images = itemValues.images || [];
        return {
          ...itemValues,
          images: images.map(item => ({
            ...item,
            image: {
              ...item.image,
              publicUrl: this.fileAdapter.publicUrl(item.image),
              publicUrlTransformed: ({ transformation }) =>
                this.fileAdapter.publicUrlTransformed(item.image, transformation),
            },
          })),
        };
      },
    };
  }

  getGqlAuxTypes({ schemaName }) {
    return [
      ...super.getGqlAuxTypes({ schemaName }),
      `
          input CloudinaryGalleryImageInput {
              isCover: Boolean
              caption: String
              image: Upload
          }
          input CloudinaryGalleryInput {
              images: [CloudinaryGalleryImageInput]
          }
          type CloudinaryGalleryImage {
              isCover: Boolean
              caption: String
              image: CloudinaryImage_File
          }
          type CloudinaryGallery {
            cover: CloudinaryImage_File
            images: [CloudinaryGalleryImage]
          }
        `,
    ];
  }

  get gqlUpdateInputFields() {
    return [`${this.path}: CloudinaryGalleryInput`];
  }

  get gqlCreateInputFields() {
    return [`${this.path}: CloudinaryGalleryInput`];
  }

  async resolveInput({ resolvedData, existingItem }) {
    /*
    I don't think these apply to us, as our "null" condition would still
    look like:

    {
      cover: null,
      images: [],
    }


    const previousData = existingItem && existingItem[this.path];
    const uploadData = resolvedData[this.path];

    // NOTE: The following two conditions could easily be combined into a
    // single `if (!uploadData) return uploadData`, but that would lose the
    // nuance of returning `undefined` vs `null`.
    // Premature Optimisers; be ware!
    if (typeof uploadData === 'undefined') {
      // Nothing was passed in, so we can bail early.
      return undefined;
    }

    if (uploadData === null) {
      // `null` was specifically uploaded, and we should set the field value to
      // null. To do that we... return `null`
      return null;
    }
    */

    const oldValue = existingItem && existingItem[this.path];
    console.log('>>> Old', oldValue);

    const newValue = resolvedData[this.path];
    console.log('>>> Incoming', newValue);

    newValue.images = await Promise.all(
      newValue.images.map(async data => {
        if (data.image) {
          const {
            createReadStream,
            filename: originalFilename,
            mimetype,
            encoding,
          } = await data.image;

          // Creating a new image
          if (createReadStream) {
            const stream = createReadStream();
            const newId = new MongooseTypes.ObjectId();
            const { id, filename, _meta } = await this.fileAdapter.save({
              stream,
              filename: originalFilename,
              mimetype,
              encoding,
              id: newId,
            });

            return {
              ...data,
              image: { id, filename, originalFilename, mimetype, encoding, _meta },
            };
          }

          const existing = oldValue.images.find(x => {
            console.log(x.image.id.toString(), data.image.id.toString());
            return x.image.id.toString() === data.image.id.toString();
          });

          console.log('>>> an existing?', existing);
          return {
            ...data,
            image: existing.image,
          };
        }

        return data;
      })
    );

    console.log('>>> Outgoing', newValue);
    return newValue;

    /*
    const { createReadStream, filename: originalFilename, mimetype, encoding } = await uploadData;
    const stream = createReadStream();

    if (!stream && previousData) {
      // TODO: FIXME: Handle when stream is null. Can happen when:
      // Updating some other part of the item, but not the file (gets null
      // because no File DOM element is uploaded)
      return previousData;
    }

    const newId = new ObjectId();

    const { id, filename, _meta } = await this.fileAdapter.save({
      stream,
      filename: originalFilename,
      mimetype,
      encoding,
      id: newId,
    });

    return { id, filename, originalFilename, mimetype, encoding, _meta };
    */
  }
}

const CommonInterface = superclass =>
  class extends superclass {
    getQueryConditions(dbPath) {
      return {
        ...this.equalityConditions(dbPath),
        ...this.stringConditions(dbPath),
        ...this.inConditions(dbPath),
      };
    }
  };

class MongoInterface extends CommonInterface(MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    const schemaOptions = {
      type: {
        images: [
          {
            type: {
              caption: String,
              isCover: Boolean,
              image: {
                type: {
                  id: MongooseTypes.ObjectId,
                  path: String,
                  filename: String,
                  mimetype: String,
                  _meta: Object,
                },
              },
            },
          },
        ],
      },
    };

    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config),
    });
  }
}

class KnexInterface extends CommonInterface(KnexFieldAdapter) {
  constructor() {
    super(...arguments);
  }

  addToTableSchema(table) {
    const column = table.jsonb(this.path);
    if (this.isNotNullable) column.notNullable();
    if (this.defaultTo) column.defaultTo(this.defaultTo);
  }
}

module.exports = {
  CloudinaryGallery,
  MongoInterface,
  KnexInterface,
};

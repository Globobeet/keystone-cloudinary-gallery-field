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
              caption: String
              image: Upload
          }
          input CloudinaryGalleryInput {
              images: [CloudinaryGalleryImageInput]
          }
          type CloudinaryGalleryImage {
              caption: String
              image: CloudinaryImage_File
          }
          type CloudinaryGallery {
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
    const oldValue = existingItem && existingItem[this.path];
    const newValue = resolvedData[this.path];

    // This field wasn't changed
    if (newValue.images == null) return;

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

          const existing = oldValue.images.find(
            x => x.image.id.toString() === data.image.id.toString()
          );

          return { ...data, image: existing.image };
        }

        return data;
      })
    );

    return newValue;
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

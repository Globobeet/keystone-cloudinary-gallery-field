const { CloudinaryImage, Implementation } = require('@keystonejs/fields');
const { MongooseFieldAdapter } = require('@keystonejs/adapter-mongoose');
const { KnexFieldAdapter } = require('@keystonejs/adapter-knex');
const mongoose = require('mongoose');

const {
  Types: { ObjectId },
} = mongoose;

class CloudinaryImageGallery extends CloudinaryImage.implementation {
  //   constructor(...args) {
  //     super(...args);
  //     this.fileAdapter = this.adapter;
  //   }

  gqlOutputFields() {
    return [`${this.path}: CloudinaryGallery`];
  }

  //   gqlOutputFieldResolvers() {
  //     return {
  //       [this.path]: item => {
  //         const itemValues = item[this.path];
  //         if (!itemValues) return null;

  //         const entries = itemValues.entries || [];
  //         console.log('getOutputFieldResolvers', itemValues);
  //         return {
  //           ...itemValues,
  //           entries: entries.map(entry => ({
  //             ...entry,
  //             image: {
  //               ...entry.image,
  //               publicUrl: this.fileAdapter.publicUrl(itemValues),
  //               publicUrlTransformed: ({ transformation }) =>
  //                 this.fileAdapter.publicUrlTransformed(itemValues, transformation),
  //             },
  //           })),
  //         };

  //         // itemValues.forEach(itemValue => {
  //         //     if (itemValue.id) itemValue.id = itemValue.id.toString();
  //         // });

  //         // FIXME: This can hopefully be removed once graphql 14.1.0 is released.
  //         // https://github.com/graphql/graphql-js/pull/1520
  //         // if (itemValues.id) itemValues.id = itemValues.id.toString();
  //       },
  //     };
  //   }

  getGqlAuxTypes() {
    return [
      `
      input CloudinaryGalleryEntryInput {
          caption: String
          image: Upload
      }

      input CloudinaryGalleryInput {
          entries: [CloudinaryGalleryEntryInput]
      }

      type CloudinaryGalleryEntry {
          caption: String
          image: CloudinaryImage_File
      }

      type CloudinaryGallery {
        entries: [CloudinaryGalleryEntry]
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
    const previousData = existingItem && existingItem[this.path];
    const uploadData = resolvedData[this.path];

    console.log('>>> we in here');
    return null;

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
        entries: [
          {
            type: {
              caption: String,
              image: {
                type: {
                  id: ObjectId,
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
  CloudinaryImageGallery,
  MongoInterface,
  KnexInterface,
};

/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import { FieldContainer, FieldLabel, FieldInput } from '@arch-ui/fields';
import { HiddenInput } from '@arch-ui/input';
import { CloudUploadIcon } from '@arch-ui/icons';
import uniqueString from 'unique-string';
import arrayMove from 'array-move';

import FieldGallery from './FieldGallery';
import FieldEditor from './FieldEditor';

/**
 * Things to do:
 *
 * - Delete image
 * - Caption
 * - IsCover
 * - Dismiss editor
 * - Implement cover resolver
 * - Make it pretty
 * - Clean it up
 * - Documentation/Readme
 */

const reducer = (state, action) => {
  switch (action.type) {
    case 'create':
      // There's already an empty one to edit
      const existing = state.images.find(x => !x.image);
      if (existing) return { ...state, currentlyEditing: existing.id };

      // Insert a new empty entry to edit
      const newId = uniqueString();
      return {
        ...state,
        images: [
          ...state.images,
          {
            id: newId,
            image: null,
            caption: '',
            isCover: false,
          },
        ],
        currentlyEditing: newId,
      };

    case 'edit':
      return {
        ...state,
        currentlyEditing: action.payload,
      };

    case 'update-image':
      return {
        ...state,
        images: state.images.map(item => {
          const { id, ...payloadProps } = action.payload;
          return item.id === id
            ? {
                ...item,
                ...payloadProps,
              }
            : item;
        }),
      };

    case 'move-image':
      return {
        ...state,
        images: arrayMove(state.images, action.payload.from, action.payload.to),
      };

    case 'editor-cancel':
      return {
        ...state,
        currentlyEditing: null,
      };

    case 'remove-image':
      return {
        ...state,
        images: state.images.filter(x => x.id !== action.payload),
        currentlyEditing: null,
      };

    default:
      throw new Error(`Unhandled event: "${action.type}"`);
  }
};

const getDataURI = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    // reader.onloadstart = () => {
    //   this.setState({ isLoading: true });
    // };

    reader.onerror = err => reject(err);
    reader.onloadend = upload => resolve(upload.target.result);
  });

const getImageSrc = image => image?.publicUrlTransformed ?? image;

const CloudinaryGalleryField = ({ field, value, onChange, autoFocus, errors }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    currentlyEditing: null,
    images:
      value.images.map(item => ({
        ...item,
        id: uniqueString(),
      })) ?? [],
  });

  console.log('>>>', state);

  const currentlyEditing = state.currentlyEditing
    ? state.images.find(x => x.id === state.currentlyEditing)
    : null;

  const memoizedImages = React.useMemo(
    () =>
      state.images
        .filter(x => x.image)
        .map(x => ({
          caption: x.caption,
          isCover: x.isCover,
          image: x.upload || x.image,
        })),
    [state.images]
  );

  React.useEffect(() => {
    onChange({ images: memoizedImages });
  }, [onChange, memoizedImages]);

  const htmlID = `ks-cloudinary-gallery-${field.path}`;

  const handleUpload = async ({
    target: {
      // validity,
      files: [file],
    },
  }) => {
    // bail if the user cancels from the file browser
    if (!file) return;

    // const { errorMessage, onChange } = this.props;

    // // basic validity check
    // if (!validity.valid) {
    //   this.setState({
    //     errorMessage: errorMessage({ type: 'save' }),
    //   });
    //   return;
    // }

    // // check if the file is actually an image
    // if (!file.type.includes('image')) {
    //   this.setState({
    //     errorMessage: errorMessage({ type: 'invalid' }),
    //   });
    //   return;
    // } else if (this.state.errorMessage) {
    //   this.setState({ errorMessage: null });
    // }

    dispatch({
      type: 'update-image',
      payload: {
        id: state.currentlyEditing,
        image: await getDataURI(file),
        upload: file,
      },
    });
  };

  return (
    <FieldContainer>
      <FieldLabel htmlFor={htmlID} field={field} errors={errors} />
      <div css={{ border: '1px solid #ccc', padding: 12, borderRadius: 6 }}>
        <FieldInput>
          <FieldGallery
            images={state.images.map(x => ({ id: x.id, src: getImageSrc(x.image) }))}
            onCreate={() => dispatch({ type: 'create' })}
            onEdit={id => dispatch({ type: 'edit', payload: id })}
            onMove={(from, to) => dispatch({ type: 'move-image', payload: { from, to } })}
          />
        </FieldInput>
        {currentlyEditing && (
          <div css={{ borderTop: '1px solid #ccc', padding: '18px 0', margin: '12px 6px 0' }}>
            <FieldInput>
              <FieldEditor
                {...currentlyEditing}
                image={currentlyEditing.image ? getImageSrc(currentlyEditing.image) : null}
                showRemove={!!currentlyEditing.image}
                onUpload={handleUpload}
                onRemove={() => dispatch({ type: 'remove-image', payload: currentlyEditing.id })}
                onClose={() => dispatch({ type: 'editor-cancel' })}
              />
            </FieldInput>
          </div>
        )}
      </div>
    </FieldContainer>
  );
};

export default CloudinaryGalleryField;

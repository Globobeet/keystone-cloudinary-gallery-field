/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import { FieldContainer, FieldLabel, FieldInput } from '@arch-ui/fields';
import { Input, HiddenInput } from '@arch-ui/input';
import { PlusIcon, CloudUploadIcon } from '@arch-ui/icons';
import { Button } from '@arch-ui/button';
import uniqueString from 'unique-string';

const reducer = (state, action) => {
  switch (action.type) {
    case 'create':
      // There's already an empty one to edit
      const existingIndex = state.images.findIndex(x => !x.image);
      if (existingIndex !== -1) return { ...state, currentlyEditing: existingIndex };

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
          return item.id === action.payload.id
            ? {
                ...item,
                image: action.payload.image,
              }
            : item;
        }),
      };

    case 'editor-cancel':
      return {
        ...state,
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
      state.images.map(x => ({
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
      },
    });
  };

  return (
    <FieldContainer>
      <FieldLabel htmlFor={htmlID} field={field} errors={errors} />
      <FieldInput>
        <div css={{ border: '1px solid #ccc', padding: 12, width: '100%' }}>
          <div css={{ display: 'flex', marginLeft: -6, marginTop: -6 }}>
            {state.images.map(item => {
              const src = getImageSrc(item.image);

              return !src ? null : (
                <div key={item.id} css={{ paddingLeft: 6, paddingTop: 6 }}>
                  <Button
                    variant="subtle"
                    onClick={() => dispatch({ type: 'edit', payload: item.id })}
                  >
                    <img
                      src={src}
                      alt=""
                      css={{
                        display: 'block',
                        height: 120,
                      }}
                    />
                  </Button>
                </div>
              );
            })}
            <div css={{ paddingLeft: 6, paddingTop: 6 }}>
              <Button variant="subtle" css={{}} onClick={() => dispatch({ type: 'create' })}>
                <div
                  css={{
                    width: 120,
                    height: 120,
                    background: '#e1e1e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    '&:hover': {
                      background: '#ccc',
                    },
                  }}
                >
                  <PlusIcon css={{ color: '#333', width: 24, height: 24 }} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </FieldInput>
      {currentlyEditing && (
        <FieldInput>
          <div css={{ border: '1px solid #ccc', padding: 12, width: '100%', marginTop: 16 }}>
            <label
              css={{
                background: '#ccc',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentlyEditing.image ? (
                <img
                  src={getImageSrc(currentlyEditing.image)}
                  alt=""
                  css={{ display: 'block', height: 120 }}
                />
              ) : (
                <CloudUploadIcon css={{ color: '#333', width: 24, height: 24 }} />
              )}
              <HiddenInput
                autoComplete="off"
                autoFocus={autoFocus}
                id={htmlID}
                name={field.path}
                onChange={handleUpload}
                type="file"
              />
            </label>
          </div>
        </FieldInput>
      )}
    </FieldContainer>
  );
};

export default CloudinaryGalleryField;

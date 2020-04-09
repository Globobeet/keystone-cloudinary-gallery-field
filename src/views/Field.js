/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import { FieldContainer, FieldLabel, FieldInput } from '@arch-ui/fields';
import { Input, HiddenInput } from '@arch-ui/input';
import { PlusIcon, CloudUploadIcon } from '@arch-ui/icons';

const reducer = (state, action) => {
  switch (action.type) {
    case 'edit':
      return {
        ...state,
        currentlyEditing: action.payload,
      };

    case 'add':
      return {
        ...state,
        images: [...state.images, action.payload],
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

const CloudinaryGalleryField = ({ field, value, onChange, autoFocus, errors }) => {
  console.log('>>>', value);

  const [state, dispatch] = React.useReducer(reducer, {
    currentlyEditing: null,
    images: value.images ?? [],
  });

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
      type: 'add',
      payload: {
        caption: '',
        image: await getDataURI(file),
        upload: file,
        isCover: false,
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
              const imageId = item.image?.id ?? 'new-image';
              const imageSrc = item.image?.publicUrlTransformed ?? item.image;

              return (
                <div key={imageId} css={{ paddingLeft: 6, paddingTop: 6 }}>
                  <img src={imageSrc} alt="" css={{ display: 'block', height: 120 }} />
                </div>
              );
            })}
            <div css={{ paddingLeft: 6, paddingTop: 6 }}>
              <button
                css={{
                  background: '#ccc',
                  width: 120,
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'edit',
                    payload: { caption: '', file: '' },
                  })
                }
              >
                <PlusIcon css={{ color: '#333', width: 24, height: 24 }} />
              </button>
            </div>
          </div>
        </div>
      </FieldInput>
      {!!state.currentlyEditing && (
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
              <CloudUploadIcon css={{ color: '#333', width: 24, height: 24 }} />
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

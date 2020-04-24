/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import { CloudUploadIcon } from '@arch-ui/icons';
import { FieldLabel } from '@arch-ui/fields';
import { HiddenInput, Input } from '@arch-ui/input';
import { Button } from '@arch-ui/button';

const FieldEditor = ({
  image,
  showRemove,
  caption,
  onChangeCaption,
  onUpload,
  onRemove,
  onClose,
}) => {
  return (
    <div css={{ display: 'flex', marginLeft: -24, flexGrow: 1 }}>
      <div css={{ flexShrink: 0, paddingLeft: 24 }}>
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
          {image ? (
            <img
              src={image}
              alt=""
              css={{
                display: 'block',
                width: 120,
                height: 120,
                objectPosition: 'center',
                objectFit: 'cover',
              }}
            />
          ) : (
            <CloudUploadIcon css={{ color: '#333', width: 24, height: 24 }} />
          )}
          <HiddenInput autoComplete="off" name="uploader" onChange={onUpload} type="file" />
        </label>
      </div>
      <div css={{ flexGrow: 1, paddingLeft: 24, display: 'flex' }}>
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 8,
            paddingBottom: 8,
            flexGrow: 1,
          }}
        >
          <div>
            <FieldLabel htmlFor="caption" field={{ label: 'Caption', config: {} }} />
            <Input
              type="text"
              value={caption}
              autoComplete="off"
              onChange={({ target }) => onChangeCaption(target.value)}
              id="caption"
              css={{ width: '100%' }}
            />
          </div>
          <div css={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div css={{ display: 'flex', marginLeft: -18 }}>
              <div css={{ paddingLeft: 18 }}>
                <Button variant="subtle" onClick={onClose} css={{ padding: 0 }}>
                  Close
                </Button>
              </div>
              {showRemove && (
                <div css={{ paddingLeft: 18 }}>
                  <Button
                    appearance="danger"
                    variant="subtle"
                    onClick={onRemove}
                    css={{ padding: 0 }}
                  >
                    Remove this image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FieldEditor.propTypes = {
  caption: PropTypes.string,
  onChangeCaption: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showRemove: PropTypes.bool,
  image: PropTypes.string,
};

FieldEditor.defaultProps = {
  caption: '',
  showRemove: true,
  image: null,
};

export default FieldEditor;

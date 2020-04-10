/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import { CloudUploadIcon } from '@arch-ui/icons';
import { HiddenInput } from '@arch-ui/input';
import { Button } from '@arch-ui/button';

const FieldEditor = ({ image, showRemove, onUpload, onRemove, onClose }) => {
  return (
    <div css={{ display: 'flex', alignItems: 'flex-end', marginLeft: -24 }}>
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
      <div css={{ flexGrow: 1, paddingLeft: 24 }}>
        {showRemove && (
          <Button variant="subtle" onClick={onRemove}>
            Remove this image
          </Button>
        )}
        <Button variant="subtle" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

FieldEditor.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showRemove: PropTypes.bool,
  image: PropTypes.string,
};

FieldEditor.defaultProps = {
  showRemove: true,
  image: null,
};

export default FieldEditor;

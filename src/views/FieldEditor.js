/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import { AlertIcon, CloudUploadIcon } from '@arch-ui/icons';
import { FieldLabel } from '@arch-ui/fields';
import { HiddenInput, Input } from '@arch-ui/input';
import { Button } from '@arch-ui/button';
import { Lozenge } from '@arch-ui/lozenge';
import { colors, gridSize, borderRadius } from '@arch-ui/theme';

const FieldEditor = ({
  image,
  showRemove,
  caption,
  error,
  onChangeCaption,
  onUpload,
  onRemove,
  onClose,
}) => {
  return (
    <div css={{ flexGrow: 1 }}>
      <div css={{ display: 'flex', marginLeft: -24 }}>
        <div css={{ flexShrink: 0, paddingLeft: 24 }}>
          <label
            css={{
              background: colors.N20,
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              borderRadius: borderRadius / 2,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'background .2s ease-out',
              '&:hover': { background: colors.N30 },
            }}
          >
            {image ? (
              <React.Fragment>
                <span
                  css={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'opacity 0.2s ease-out',
                    padding: gridSize * 1.5,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <CloudUploadIcon css={{ color: '#fff', opacity: 0.65, width: 32, height: 32 }} />
                </span>
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
              </React.Fragment>
            ) : (
              <CloudUploadIcon css={{ color: colors.N70, width: 24, height: 24 }} />
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
            <div css={{ display: 'flex', justifyContent: 'flex-start', marginTop: gridSize * 2 }}>
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
      {error && (
        <Lozenge
          style={{
            backgroundColor: colors.R.L80,
            borderColor: 'transparent',
            color: colors.R.D20,
            display: 'inline-flex',
            marginTop: gridSize * 2,
          }}
        >
          <AlertIcon css={{ marginRight: gridSize }} />
          {error}
        </Lozenge>
      )}
    </div>
  );
};

FieldEditor.propTypes = {
  caption: PropTypes.string,
  error: PropTypes.string,
  onChangeCaption: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showRemove: PropTypes.bool,
  image: PropTypes.string,
};

FieldEditor.defaultProps = {
  caption: '',
  error: null,
  showRemove: true,
  image: null,
};

export default FieldEditor;

/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import { borderRadius, colors, gridSize } from '@arch-ui/theme';

const PREVIEW_COUNT = 5;

export default ({ data }) => {
  const images = data.images ?? [];
  const previews = images.slice(0, PREVIEW_COUNT);
  const remainder = images.length - PREVIEW_COUNT;

  return (
    <div
      css={{
        display: 'flex',
        marginLeft: (gridSize / 2) * -1,
      }}
    >
      {previews.map(({ caption, image }) => (
        <div key={image.id} css={{ paddingLeft: gridSize / 2 }}>
          <img
            src={image.publicUrlTransformed}
            alt={caption}
            css={{ width: 24, height: 24, borderRadius: borderRadius / 2, display: 'block' }}
          />
        </div>
      ))}
      {remainder > 0 && (
        <div css={{ paddingLeft: gridSize / 2 }}>
          <div
            css={{
              width: 24,
              height: 24,
              borderRadius: borderRadius / 2,
              background: colors.N15,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: colors.N50,
            }}
          >
            +{remainder}
          </div>
        </div>
      )}
    </div>
  );
};

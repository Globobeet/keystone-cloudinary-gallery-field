/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@arch-ui/button';
import { PlusIcon } from '@arch-ui/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const GalleryTile = SortableElement(({ src, onClick }) => (
  <div css={{ flexShrink: 0 }}>
    <Button
      variant="subtle"
      onClick={onClick}
      css={{
        width: 120,
        height: 120,
      }}
    >
      <img src={src} alt="" css={{ display: 'block', height: 120 }} />
    </Button>
  </div>
));

const GalleryAddTile = SortableElement(({ onClick }) => (
  <div css={{ flexShrink: 0 }}>
    <Button variant="subtle" onClick={onClick}>
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
));

const GalleryList = SortableContainer(({ items, onEdit, onCreate }) => (
  <div css={{ display: 'flex', flexWrap: 'wrap' }}>
    {items.map(({ id, src }, index) =>
      !src ? null : (
        <GalleryTile
          key={id}
          id={id}
          src={src}
          onClick={() => onEdit(id)}
          index={index}
          value={id}
        />
      )
    )}
    <GalleryAddTile onClick={onCreate} index={items.length} value="create" disabled />
  </div>
));

const FieldGallery = ({ images, onEdit, onCreate, onMove }) => {
  return (
    <div css={{ border: '1px solid #ccc', padding: 12, width: '100%' }}>
      <GalleryList
        items={images}
        onEdit={onEdit}
        onCreate={onCreate}
        axis="xy"
        onSortEnd={({ oldIndex, newIndex }) => onMove(oldIndex, newIndex)}
        distance={2}
      />
    </div>
  );
};

FieldGallery.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      src: PropTypes.string,
    })
  ),
};

FieldGallery.defaultProps = {
  images: [],
};

export default FieldGallery;

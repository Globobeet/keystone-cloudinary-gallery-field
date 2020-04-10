/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@arch-ui/button';
import { PlusIcon } from '@arch-ui/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const GalleryTile = SortableElement(({ src, onClick }) => (
  <GridTile>
    <Button
      variant="subtle"
      onClick={onClick}
      css={{
        width: 120,
        height: 120,
        padding: 0,
      }}
    >
      <img
        src={src}
        alt=""
        css={{
          display: 'block',
          width: 120,
          height: 120,
          objectPosition: 'center',
          objectFit: 'cover',
        }}
      />
    </Button>
  </GridTile>
));

const GalleryAddTile = SortableElement(({ onClick }) => (
  <GridTile>
    <Button variant="subtle" onClick={onClick} css={{ padding: 0 }}>
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
  </GridTile>
));

const GalleryList = SortableContainer(({ items, onEdit, onCreate }) => (
  <Grid>
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
  </Grid>
));

const FieldGallery = ({ images, onEdit, onCreate, onMove }) => (
  <GalleryList
    items={images}
    onEdit={onEdit}
    onCreate={onCreate}
    axis="xy"
    onSortEnd={({ oldIndex, newIndex }) => onMove(oldIndex, newIndex)}
    distance={2}
  />
);

const Grid = props => (
  <div css={{ display: 'flex', flexWrap: 'wrap', maxHeight: 324, overflowY: 'auto' }} {...props} />
);

const GridTile = props => <div css={{ flexShrink: 0, padding: 6 }} {...props} />;

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

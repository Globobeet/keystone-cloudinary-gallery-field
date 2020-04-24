/** @jsx jsx */

import { jsx, ClassNames } from '@emotion/core';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@arch-ui/button';
import { PlusIcon } from '@arch-ui/icons';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const GalleryTile = SortableElement(({ src, caption, state, onClick }) => (
  <GridTile>
    <Button
      variant="subtle"
      onClick={onClick}
      css={{
        width: 120,
        height: 120,
        padding: 0,
        border: 0,
        outline: state === 'active' ? '3px solid #2684FF' : '',
      }}
    >
      <img
        src={src}
        alt=""
        title={caption}
        css={{
          display: 'block',
          width: 120,
          height: 120,
          objectPosition: 'center',
          objectFit: 'cover',
          opacity: state === 'inactive' ? 0.4 : 1,
          transition: 'opacity .2s ease-out',
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

const GalleryList = SortableContainer(({ items, onEdit, onCreate }) => {
  const editMode = items.some(x => x.isEditing);

  return (
    <Grid>
      {items.map(({ id, src, caption, isEditing }, index) => {
        if (!src) return null;

        let editState = 'default';
        if (editMode) editState = isEditing ? 'active' : 'inactive';

        return (
          <GalleryTile
            key={id}
            id={id}
            src={src}
            caption={caption}
            state={editState}
            onClick={() => onEdit(id)}
            index={index}
            value={id}
          />
        );
      })}
      <GalleryAddTile onClick={onCreate} index={items.length} value="create" disabled />
    </Grid>
  );
});

const FieldGallery = ({ images, onEdit, onCreate, onMove }) => (
  <ClassNames>
    {({ css }) => (
      <GalleryList
        items={images}
        onEdit={onEdit}
        onCreate={onCreate}
        axis="xy"
        onSortEnd={({ oldIndex, newIndex }) => onMove(oldIndex, newIndex)}
        distance={2}
        helperClass={css`
          z-index: 5;
        `}
      />
    )}
  </ClassNames>
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
      caption: PropTypes.string,
      isEditing: PropTypes.bool,
    })
  ),
};

FieldGallery.defaultProps = {
  images: [],
};

export default FieldGallery;

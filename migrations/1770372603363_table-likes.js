/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('likes', 'unique_owner_comment_id', 'UNIQUE(owner, comment_id)');
};

export const down = (pgm) => {
  pgm.dropTable('likes');
};

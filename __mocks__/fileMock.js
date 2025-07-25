/* eslint-env browser, node */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Mock générique pour un import de fichier (image, pdf…).
 * ➜ Rend simplement un <button> cliquable utilisable en test.
 *
 * @param {object}   props
 * @param {Function} props.onChange – callback déclenché au clic
 * @param {object}   props.value    – valeur arbitraire renvoyée
 */
export default function FileMock({ onChange = () => {}, value = {} }) {
  return (
    <button
      type="button"
      data-testid="file-mock"
      style={{
        padding      : '4px 8px',
        fontSize     : 12,
        borderRadius : 4,
        border       : '1px solid #ccc',
        background   : '#f5f5f5',
        cursor       : 'pointer',
      }}
      onClick={() => onChange({ target: { value } })}
    >
      {value?.label ?? 'file‑mock'}
    </button>
  );
}

FileMock.propTypes = {
  onChange: PropTypes.func,
  value   : PropTypes.shape({ label: PropTypes.string }),
};

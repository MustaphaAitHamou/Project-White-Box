/* eslint-env browser, node */

// Je fournis ici un mock générique pour les imports de fichiers (images, PDF…)
// afin de simplifier les tests : je remplace l’input par un simple bouton.
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
  // Je renvoie un bouton minimaliste : pratique pour les snapshots et les sélecteurs.
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
      // Je simule un “event” proche d’un onChange DOM : { target: { value } }.
      // Ça me permet d’intégrer ce mock sans changer la logique des composants.
      onClick={() => onChange({ target: { value } })}
    >
      {/* Je montre un label si présent, sinon un libellé par défaut. */}
      {value?.label ?? 'file-mock'}
    </button>
  );
}

// Je garde un typage léger pour clarifier l’API en test.
FileMock.propTypes = {
  onChange: PropTypes.func,
  value   : PropTypes.shape({ label: PropTypes.string }),
};

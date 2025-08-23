/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Mock minimal pour `react-google-places-autocomplete`.
 * Je simule juste un <input> contrôlé avec la même forme d’API
 * (via `selectProps`) pour que les composants consomment ce mock
 * sans changer leur logique.
 */
export default function GooglePlacesAutocompleteMock({
  // Je récupère onChange et value depuis selectProps comme le vrai composant.
  selectProps: { onChange = () => {}, value = null, ...rest } = {},
}) {
  return (
    <input
      data-testid="google-places-mock"     // Je facilite la sélection en test.
      placeholder="Destination"
      // Je reflète la valeur courante via value.label si présent.
      value={value?.label ?? ''}
      // Au changement, je renvoie un objet { label, value } comme attendu par le code.
      onChange={(e) =>
        onChange({ label: e.target.value, value: e.target.value })
      }
      // Je propage le reste (className, style, etc.) pour rester interchangeable.
      {...rest}
    />
  );
}

// Je garde un typage léger pour documenter l’API utilisée en test.
GooglePlacesAutocompleteMock.propTypes = {
  selectProps: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.shape({ label: PropTypes.string }),
  }),
};

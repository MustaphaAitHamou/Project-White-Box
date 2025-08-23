/* eslint-env browser */
// Champ d’autocomplétion Google Places.
// Je m’appuie sur le composant tiers `react-google-places-autocomplete`
// et je laisse la valeur/les changements piloter par le parent via `selectProps`.

import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PropTypes from 'prop-types';

// Je documente l’API attendue : une valeur et un callback obligatoire.
GooglePlaceInput.propTypes = {
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired,
};

export default function GooglePlaceInput({ value, onChange }) {
  return (
    <GooglePlacesAutocomplete
      // Je lis la clé côté build via import.meta.env (Vite).
      apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
      // Je passe en "controlled" via selectProps pour rester aligné
      // avec la façon dont le composant externe gère sa valeur.
      selectProps={{
        value,
        onChange,
        placeholder: 'Destination',
        // Je pose quelques styles simples : hauteur minimale et z-index du menu.
        styles: {
          control: (base) => ({ ...base, borderRadius: 8, minHeight: 42 }),
          menu: (base) => ({ ...base, zIndex: 9999 }),
        },
      }}
    />
  );
}

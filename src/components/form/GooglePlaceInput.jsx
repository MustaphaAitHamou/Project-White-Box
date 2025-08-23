/* eslint-env browser */
import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PropTypes from 'prop-types';
GooglePlaceInput.propTypes = {
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired,
};

export default function GooglePlaceInput({ value, onChange }) {
  return (
    <GooglePlacesAutocomplete
      apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
      selectProps={{
        value,
        onChange,
        placeholder: 'Destination',
        styles: {
          control: (base) => ({ ...base, borderRadius: 8, minHeight: 42 }),
          menu: (base) => ({ ...base, zIndex: 9999 }),
        },
      }}
    />
  );
}

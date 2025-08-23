/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Mock minimal pour `react-google-places-autocomplete`
 * ‑ renvoie simplement un `<input>` contrôlé.
 */
export default function GooglePlacesAutocompleteMock({
  selectProps: { onChange = () => {}, value = null, ...rest } = {},
}) {
  return (
    <input
      data-testid="google-places-mock"
      placeholder="Destination"
      value={value?.label ?? ''}
      onChange={(e) =>
        onChange({ label: e.target.value, value: e.target.value })
      }
      {...rest}
    />
  );
}

GooglePlacesAutocompleteMock.propTypes = {
  selectProps: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.shape({ label: PropTypes.string }),
  }),
};

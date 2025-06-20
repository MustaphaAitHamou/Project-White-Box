export default function MockedGooglePlacesAutocomplete({ onChange, value }) {
    return (
      <input
        aria-label="Destination"
        value={value?.label || ''}
        onChange={(e) => onChange?.({ label: e.target.value })}
      />
    );
  }
  

  
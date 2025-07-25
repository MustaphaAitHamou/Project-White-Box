/* eslint-env browser */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as api from '~/service/api';

export default function InfoSection({ placeId, name }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .GetPlacePhoto(placeId)
      .then((url) => { if (mounted) setPhotoUrl(url); })
      .catch(() => { if (mounted) setPhotoUrl('/placeholder.png'); });
    return () => { mounted = false; };
  }, [placeId]);

  return (
    <div className="h-[420px] flex items-center justify-center bg-gray-100 rounded-xl">
      {!photoUrl ? (
        'Chargement…'
      ) : (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          alt={`Photo de ${name}`}
          src={photoUrl}
          className="h-full w-full object-cover rounded-xl"
        />
      )}
    </div>
  );
}

InfoSection.propTypes = {
  placeId: PropTypes.string,
  name   : PropTypes.string,
};

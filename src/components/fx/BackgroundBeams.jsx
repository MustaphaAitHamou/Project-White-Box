import React from 'react';
import PropTypes from 'prop-types';

/**
 * Arrière-plan décoratif en “beams” floutés.
 * Je le rends purement visuel (aria-hidden) et non interactif (pointer-events-none)
 * pour éviter de gêner la navigation clavier et les lecteurs d’écran.
 */
BackgroundBeams.propTypes = {
  className: PropTypes.string,
};

function BackgroundBeams({ className = '', ...rest }) {
  return (
    <div
      // Je masque cet élément aux technologies d’assistance : il n’apporte pas d’information.
      aria-hidden
      // Je recouvre toute la zone du parent et je n’intercepte aucun clic.
      // Je laisse className pour que le parent puisse ajuster la position/z-index si besoin.
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      // Je propage les props restantes pour garder de la souplesse (data-*, style, etc.).
      {...rest}
    >
      {/* Je dessine trois taches colorées floutées pour créer de la profondeur. */}
      <div className="absolute -left-1/4 top-1/3 h-96 w-96 rotate-45 bg-violet-600/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 -rotate-12 bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 bg-blue-500/20 blur-3xl" />
    </div>
  );
}

export default BackgroundBeams;

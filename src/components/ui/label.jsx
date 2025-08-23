// Petit composant <Label> avec forwardRef.
// Je garde une API minimale : className optionnel, children libre, et je propage le reste des props.
// Je passe aussi la ref vers l’élément <label> natif pour gérer le focus/accessibilité côté parent.
import React from 'react';
import PropTypes from 'prop-types';

// J’expose la version nommée pour des imports sélectifs, et je conserve aussi un export par défaut plus bas.
export const Label = React.forwardRef(({ className = '', children, ...rest }, ref) => (
  // Je rends un label natif, stylable via className, et j’injecte toutes les props (htmlFor, aria-*, etc.).
  <label ref={ref} className={className} {...rest}>
    {children}
  </label>
));
Label.displayName = 'Label';

// Je documente l’API attendue pour garder un contrat clair en usage et en test.
Label.propTypes = {
  className: PropTypes.string,
  children : PropTypes.node,
};

export default Label;

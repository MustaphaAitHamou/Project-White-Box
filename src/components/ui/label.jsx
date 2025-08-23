import React from 'react';
import PropTypes from 'prop-types';

 
export const Label = React.forwardRef(({ className = '', children, ...rest }, ref) => (
  <label ref={ref} className={className} {...rest}>
    {children}
  </label>
));
Label.displayName = 'Label';

Label.propTypes = {
  className: PropTypes.string,
  children : PropTypes.node,
};

export default Label;

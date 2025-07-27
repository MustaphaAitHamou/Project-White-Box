import React from 'react';
import PropTypes from 'prop-types';

BackgroundBeams.propTypes = {
  className: PropTypes.string,
};


function BackgroundBeams({ className = '', ...rest }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      {...rest}
    >
      <div className="absolute -left-1/4 top-1/3 h-96 w-96 rotate-45 bg-violet-600/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 -rotate-12 bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 bg-blue-500/20 blur-3xl" />
    </div>
  );
}

export default BackgroundBeams;

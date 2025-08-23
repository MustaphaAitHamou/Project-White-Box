/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';

export const Input  = (p) => <input {...p} />;
export const Label  = ({ children, ...p }) => <label {...p}>{children}</label>;
export const Button = ({ children, ...p }) => <button {...p}>{children}</button>;

export const Dialog = ({ open, children }) => (open ? <div>{children}</div> : null);
export const DialogContent     = ({ children, ...p }) => <div {...p}>{children}</div>;
export const DialogHeader      = ({ children }) => <div>{children}</div>;
export const DialogTitle       = ({ children, ...p }) => <h2 {...p}>{children}</h2>;
export const DialogDescription = ({ children, ...p }) => <p {...p}>{children}</p>;

/* ---- PropTypes pour calmer eslint ---- */
Label.propTypes  =
Button.propTypes =
DialogContent.propTypes =
DialogHeader.propTypes =
DialogTitle.propTypes =
DialogDescription.propTypes = {
  children: PropTypes.node,
};

Dialog.propTypes = {
  open     : PropTypes.bool,
  children : PropTypes.node,
};

/* eslint-env browser */
/**
 * Petits shims UI ultra-simples pour les tests.
 * Je rends des éléments natifs (<input>, <label>, <button>, etc.)
 * et je propage toutes les props sans logique additionnelle.
 */
import React from 'react';
import PropTypes from 'prop-types';

/** Input minimal : je propage toutes les props (value, onChange, aria-*, …). */
export const Input  = (p) => <input {...p} />;

/** Label minimal : je rends les enfants et je propage le reste des props. */
export const Label  = ({ children, ...p }) => <label {...p}>{children}</label>;

/** Button minimal : je rends les enfants et je propage le reste des props. */
export const Button = ({ children, ...p }) => <button {...p}>{children}</button>;

/**
 * Dialog minimaliste :
 * - je rends le contenu seulement si `open` est vrai
 * - pas d’overlay ni de gestion focus ici (c’est un mock)
 */
export const Dialog = ({ open, children }) => (open ? <div>{children}</div> : null);

/** Sous-composants du dialog : je rends simplement des wrappers neutres. */
export const DialogContent     = ({ children, ...p }) => <div {...p}>{children}</div>;
export const DialogHeader      = ({ children }) => <div>{children}</div>;
export const DialogTitle       = ({ children, ...p }) => <h2 {...p}>{children}</h2>;
export const DialogDescription = ({ children, ...p }) => <p {...p}>{children}</p>;

/* ---- PropTypes pour calmer eslint et documenter l’intention ---- */
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

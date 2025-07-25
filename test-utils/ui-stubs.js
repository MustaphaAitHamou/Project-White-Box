// test-utils/ui-stubs.js
import React from 'react';

export const Input = (p) => <input {...p} />;
export const Label = ({ children, ...p }) => <label {...p}>{children}</label>;
export const Button = ({ children, ...p }) => <button {...p}>{children}</button>;

export const Dialog = ({ open, children }) => (open ? <div>{children}</div> : null);
export const DialogContent = ({ children, ...p }) => <div {...p}>{children}</div>;
export const DialogHeader = ({ children }) => <div>{children}</div>;
export const DialogTitle = ({ children, ...p }) => <h2 {...p}>{children}</h2>;
export const DialogDescription = ({ children, ...p }) => <p {...p}>{children}</p>;

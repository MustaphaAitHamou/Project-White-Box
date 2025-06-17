/* eslint-env jest */
/* global describe, it, expect */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from 'App.jsx'; // résolu en src/App.jsx

describe('App', () => {
  it('affiche le titre principal', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/Embarquez vers l'inconnu/i);
  });
});

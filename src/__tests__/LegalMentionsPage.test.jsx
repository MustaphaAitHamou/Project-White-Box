/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import LegalMentions from '~/components/pages/LegalMentions';

test('LegalMentions affiche Mentions légales', () => {
  render(<LegalMentions />);
  expect(screen.getByText(/mentions légales/i)).toBeInTheDocument();
});

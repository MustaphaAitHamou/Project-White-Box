/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '~/components/pages/PrivacyPolicy';

test('PrivacyPolicy affiche Politique de confidentialité', () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/politique de confidentialité/i)).toBeInTheDocument();
});

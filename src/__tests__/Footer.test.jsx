/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';
import Footer from '~/view-trip/components/Footer';

test('Footer se rend sans crasher', () => {
  const { container } = render(<Footer />);
  // simple smoke test qui exécute le code et contribue au coverage
  expect(container.firstChild).toBeTruthy();
});

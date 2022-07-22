import React from 'react';
import renderer from 'react-test-renderer';
import { Default as Thing } from '../stories/auth.stories';

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: () => Math.random(),
  },
});
// @ts-ignore
global.crypto.subtle = {};

describe('Thing', () => {
  it('renders without crashing', () => {
    const component = renderer.create(<Thing />);
    component.unmount();
  });
});

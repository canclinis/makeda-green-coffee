import { describe, expect, it } from 'vitest';
import './design.css';

describe('site type', () => {
  it('sets the page in Darwin Pro', () => {
    expect(getComputedStyle(document.body).fontFamily).toContain('Darwin Pro');
  });
});

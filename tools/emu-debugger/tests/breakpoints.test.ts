import { describe, it, expect } from 'vitest';
import { BreakpointSet, WatchpointSet } from '../breakpoints.js';

describe('BreakpointSet', () => {
  it('adds and detects breakpoints', () => {
    const bps = new BreakpointSet();
    bps.add(0x1000);
    expect(bps.has(0x1000)).toBe(true);
    expect(bps.has(0x2000)).toBe(false);
  });

  it('removes breakpoints', () => {
    const bps = new BreakpointSet();
    bps.add(0x1000);
    bps.remove(0x1000);
    expect(bps.has(0x1000)).toBe(false);
  });

  it('clears all breakpoints', () => {
    const bps = new BreakpointSet();
    bps.add(0x1000);
    bps.add(0x2000);
    bps.clear();
    expect(bps.size()).toBe(0);
  });

  it('masks addresses to 16 bits', () => {
    const bps = new BreakpointSet();
    bps.add(0x11000);
    expect(bps.has(0x1000)).toBe(true);
  });
});

describe('WatchpointSet', () => {
  it('detects write watchpoint on write access', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'write');
    expect(ws.check(0x1000, 'write')).toBe('write');
    expect(ws.check(0x1000, 'read')).toBe(null);
  });

  it('detects read watchpoint on read access', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'read');
    expect(ws.check(0x1000, 'read')).toBe('read');
    expect(ws.check(0x1000, 'write')).toBe(null);
  });

  it('access watchpoint fires on both reads and writes', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'access');
    expect(ws.check(0x1000, 'read')).toBe('access');
    expect(ws.check(0x1000, 'write')).toBe('access');
  });

  it('allows multiple kinds on same address', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'read');
    ws.add(0x1000, 'write');
    expect(ws.size()).toBe(2);
  });

  it('removing one kind leaves others', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'read');
    ws.add(0x1000, 'write');
    ws.remove(0x1000, 'read');
    expect(ws.check(0x1000, 'read')).toBe(null);
    expect(ws.check(0x1000, 'write')).toBe('write');
  });

  it('clear removes all watchpoints', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'write');
    ws.add(0x2000, 'read');
    ws.clear();
    expect(ws.size()).toBe(0);
  });

  it('returns null for unmatched address', () => {
    const ws = new WatchpointSet();
    expect(ws.check(0x9999, 'read')).toBe(null);
  });
});

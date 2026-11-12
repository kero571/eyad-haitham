'use client';
import { createContext, useContext } from 'react';

export const Ctx = createContext(null);
export const useEd = () => useContext(Ctx);

export const getIn = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
export const setIn = (o, p, v) => {
  const [k, ...rest] = p.split('.');
  const clone = Array.isArray(o) ? [...o] : { ...o };
  clone[k] = rest.length ? setIn(o?.[k] ?? {}, rest.join('.'), v) : v;
  return clone;
};

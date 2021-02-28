
const truthyOrZero = (i) => !!i || i === 0;
const isArray = Array.isArray;
const isFunction = (input) => typeof input === 'function';
function isObject (input, strict = false) {
  if (!input) return false;
  if (typeof input !== 'object') return false;
  if (isArray(input)) return false;
  if (!strict) return true;
  if (!(input instanceof Object)) return false;
  if (input.constructor !== Object.prototype.constructor) return false;
  return true;
}
function range (start, end, predicate = null) {
  const result = [];
  for (let i = start; i <= end; i++) {
    if (predicate) {
      const res = predicate(i, i, i);
      if (res !== undefined) result.push(res);
    } else {
      result.push(i);
    }
  }
  return result;
}
function mapValues (collection, predicate) {
  const result = {};

  let i = 0;
  for (const [ key, value ] of Object.entries(collection)) {
    result[key] = predicate(value, key, i++);
  }

  return result;
}



export function r (fn) {
  if (isFunction(fn)) return r(fn());
  if (isArray(fn)) return fn.map(r);
  if (isObject(fn, true)) return mapValues(fn, r);
  return fn;
}

export function Resolver (input) {
  return () => r(input);
}

export function If (...input) {
  return () => {
    let value;
    for (value of input) {
      value = r(value);

      if (!truthyOrZero(value)) {
        return false;
      }
    }
    return value;
  };
}

export function Collection (length, datamap) {
  return () => range(0, length, Resolver(datamap));
}

export function Tern (condition, t, f) {
  return () => (r(condition) ? r(t) : r(f));
}

export function Picker (items) {
  if (isArray(items)) return () => items[ ~~(Math.random() * items.length) ];
  if (isObject(items)) {
    return Picker(Object.values(items));
  }
}

export function Concat (...items) {
  return () => items.map(r).filter(truthyOrZero).join('');
}

export function Join (delimiter, ...items) {
  return () => items.map(r).filter(truthyOrZero).join(delimiter);
}


export function Padded (fn, length, padding = '0') {
  const mut = length < 0
    ? (s) => s.padStart(Math.abs(length), padding)
    : (s) => s.padEnd(length, padding)
  ;

  return () => mut(String(r(fn)));
}

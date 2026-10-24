/** A CMP API that throws (the `broken` case of every fixture). */
export const boom = () => {
  throw new Error('cmp exploded');
};

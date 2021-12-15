const ELEMENT_CLASS_NAMES = new Set(['CardElement', 'TextElement']);

const hasElement = (object: unknown): boolean => {
  if (object && typeof object === 'object') {
    return (
      Object.entries(object).find(([, value]) => {
        if (ELEMENT_CLASS_NAMES.has(value?.constructor?.name)) {
          return true;
        }

        return hasElement(value);
      }) !== undefined
    );
  }

  return false;
};

export { ELEMENT_CLASS_NAMES, hasElement };

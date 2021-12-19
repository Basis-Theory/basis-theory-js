const ELEMENT_CLASS_NAMES = new Set(['CardElement', 'TextElement']);

const hasElement = (payload: unknown): boolean => {
  if (payload && typeof payload === 'object') {
    return (
      Object.entries(payload).find(([, value]) => {
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

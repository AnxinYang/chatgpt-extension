const deduplicateDecode = (str: string) => {
  const deduped = [...new Set(str.split("\n"))].join("\n");
  return deduped;
};

export { deduplicateDecode };

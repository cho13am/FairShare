export const calculateSplit = (total, count) => {
    if(!total || !count || count <= 0) return 0;
    return Number((total / count).toFixed(2));
};

export const getRemainder = (total, count) => {
  const perPerson = calculateSplit(total, count);
  return Number((total - (perPerson * count)).toFixed(2));
};
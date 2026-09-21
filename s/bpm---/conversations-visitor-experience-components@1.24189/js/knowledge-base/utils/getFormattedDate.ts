function applyPadding(value) {
  return `${value}`.padStart(2, '0');
}
const formatDate = date => {
  const year = date.getFullYear();
  const month = applyPadding(date.getMonth() + 1);
  const day = applyPadding(date.getDate());
  return `${year}${month}${day}`;
};

// Returns today's date as a string in YYYYMMDD format
export const getTodayFormatted = () => {
  const today = new Date();
  return formatDate(today);
};

// Return the date thirty days ago as a string in YYYYMMDD format
export const getThirtyDaysAgoFormatted = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return formatDate(date);
};
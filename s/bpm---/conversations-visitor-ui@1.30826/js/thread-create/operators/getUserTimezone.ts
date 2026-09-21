// adds a 0 infront of number if needed: 9 -> 09
const addZero = num => num >= 10 ? num : `0${num}`;
export const getUserTimezone = () => {
  // returns offset in minutes ex: -330 (india +05:30) or 480 (California -8:00)
  const offset = new Date().getTimezoneOffset();
  // returns -1 if negative, 1 if positive
  const sign = Math.sign(offset);
  // converts total minutes to hours: -330 -> 5
  const offsetHours = Math.floor(Math.abs(offset / 60));
  // converts total minutes to minutes: -330 -> 30
  const offsetMinutes = Math.abs(offset % 60);

  //builds the string: 5:30
  const offsetString = `${addZero(offsetHours)}:${addZero(offsetMinutes)}`;

  // adds + or minus to the string: -5:30
  return sign > 0 ? `-${offsetString}` : `+${offsetString}`;
};
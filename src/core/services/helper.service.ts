export const addDaysToDate = (dateObj, numberOfDays) => {
  dateObj.setDate(dateObj.getDate() + numberOfDays);
  return dateObj;
};
export const addMonthsToDate = (dateObj, numberOfMonths) => {
  dateObj.setMonth(dateObj.getMonth() + numberOfMonths);
  return dateObj;
};
export function isUuidValid(uuid: string) {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  if (regexExp.test(uuid)) {
    return true;
  } else return false;
}

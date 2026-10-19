/**
 * Get the label for the current budget period based on the start day.
 * @param {number} startDay - The day of the month when the budget cycle begins (1-28).
 * @returns {{ label: string }} An object containing a label string describing the period.
 */
export function getBudgetPeriod(startDay) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const day = today.getDate();

  let startYear, startMonth;

  if (day >= startDay) {
    startYear = year;
    startMonth = month;
  } else {
    // If today is before the start day, the period started in the previous month
    startYear = month === 0 ? year - 1 : year;
    startMonth = (month === 0) ? 11 : month - 1;
  }

  const startDate = new Date(startYear, startMonth, startDay);

  // Calculate the end date: day before the next start day
  // First day of next month
  const nextStart = new Date(startYear, startMonth + 1, 1);
  // Set to the intended start day (safe since startDay is 1-28 and we start from day 1)
  nextStart.setDate(startDay);
  // The end date is the day before this
  const endDate = new Date(nextStart);
  endDate.setDate(endDate.getDate() - 1);

  // Format dates
  const startMonthName = startDate.toLocaleString('default', { month: 'short' });
  const endMonthName = endDate.toLocaleString('default', { month: 'short' });
  const startDayStr = startDate.getDate();
  const endDayStr = endDate.getDate();
  const displayStartYear = startDate.getFullYear();
  const displayEndYear = endDate.getFullYear();

  if (displayStartYear === displayEndYear) {
    return {
      label: `${startMonthName} ${startDayStr}–${endMonthName} ${endDayStr}, ${displayStartYear}`
    };
  } else {
    return {
      label: `${startMonthName} ${startDayStr}, ${displayStartYear}–${endMonthName} ${endDayStr}, ${displayEndYear}`
    };
  }
}
// if is workday
export const isWorkday = (timestamp) => {
  if (timestamp) {
    return !(new Date(timestamp).getDay() === 6 || new Date(timestamp).getDay() === 0);
  } else {
    return !(new Date().getDay() === 6 || new Date().getDay() === 0);
  }
};

// if is before 9 o'clock
export const isBeforeNine = (timestamp) => {
  if (timestamp) {
    return new Date(timestamp).getHours() < 9;
  } else {
    return new Date().getHours() < 9;
  }
};

// if is over 13:30
export const isOverThirteenHalf = (timestamp) => {
  if (timestamp) {
    return new Date(timestamp) > new Date(new Date(timestamp).toDateString() + ", 13:30:00");
  } else {
    return new Date() > new Date(new Date().toDateString() + ", 13:30:00");
  }
};

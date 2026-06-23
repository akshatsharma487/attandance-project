export const saveTimerState = (checkInTime) => {
  localStorage.setItem('timerStartTime', checkInTime);
};

export const getTimerState = () => {
  return localStorage.getItem('timerStartTime');
};

export const clearTimerState = () => {
  localStorage.removeItem('timerStartTime');
};

export const calculateElapsedTime = (startTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const diff = now - start;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};

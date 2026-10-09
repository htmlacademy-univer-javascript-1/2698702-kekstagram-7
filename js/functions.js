const checkStringLength = (string, maxLength) => string.length <= maxLength;
checkStringLength('Hello, World!', 15);

const isPalindrome = (string) => {
  const normalizedString = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';

  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }

  return normalizedString === reversedString;
};
isPalindrome('A man a plan a canal Panama');

const getDigits = (string) => {
  let result = '';

  string = string.toString();

  for (let i = 0; i < string.length; i++) {
    const number = parseInt(string[i], 10);

    if (!Number.isNaN(number)) {
      result += number;
    }
  }

  return result === '' ? NaN : parseInt(result, 10);
};
getDigits('abc123def456');

const getMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isMeetingWithinWorkingHours = (workingDayStart, workingDayEnd, meetingStart, meetingDuration) => {
  const startWorkingMinutes = getMinutes(workingDayStart);
  const endWorkingMinutes = getMinutes(workingDayEnd);
  const startMeetingMinutes = getMinutes(meetingStart);
  const endMeetingMinutes = startMeetingMinutes + meetingDuration;

  return startMeetingMinutes >= startWorkingMinutes &&
  endMeetingMinutes <= endWorkingMinutes;
};

isMeetingWithinWorkingHours('08:00', '17:30', '14:00', 90);
isMeetingWithinWorkingHours('8:0', '10:0', '8:0', 120);
isMeetingWithinWorkingHours('08:00', '14:30', '14:00', 90);
isMeetingWithinWorkingHours('14:00', '17:30', '08:0', 90);
isMeetingWithinWorkingHours('8:00', '17:30', '08:00', 900);

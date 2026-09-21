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

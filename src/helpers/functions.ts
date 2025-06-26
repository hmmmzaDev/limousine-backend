export function generateRandomString(
  length: number,
  { small, numeric }: { small?: boolean; numeric?: boolean } = {
    small: true,
    numeric: false,
  },
) {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (!small) {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  }
  if (numeric) {
    characters = "0123456789";
  }

  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function removeBeforeV(input: string): string {
  const index = input.indexOf("/v/");
  if (index !== -1) {
    return input.substring(index);
  } else {
    return input; // If '/v/' substring is not found, return the original string
  }
}

export function isOlderThanTwoDays(timestamp: Date): boolean {
  const currentTimestamp = Date.now();

  const twoDaysAgoTimestamp = currentTimestamp - 2 * 24 * 60 * 60 * 1000;

  return new Date(timestamp).getTime() < twoDaysAgoTimestamp;
}

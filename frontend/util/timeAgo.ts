export default function timeAgo(date: Date) {
  const timeDiff = Math.abs(new Date().getTime() - date.getTime());
  const yearDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) % 365;
  const minuteDiff = Math.floor(timeDiff / (1000 * 60)) % 60;
  let result = "";

  if (yearDiff === 1) {
    result += "1 year";
  } else if (yearDiff > 1) {
    result += `${yearDiff} years`;
  }

  if (dayDiff === 1) {
    result += ` 1 day`;
  } else if (dayDiff > 1) {
    result += ` ${dayDiff} days`;
  }

  if (minuteDiff === 1) {
    result += ` 1 minute ago`;
  } else if (minuteDiff > 1) {
    result += ` ${minuteDiff} minutes ago`;
  }

  return result.trim();
}

export const format_long_string = (str: string): string => {
  return str.length > 14 ? str.substring(0, 14) + "..." : str;
}

export function format_unix(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  const now = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formatted_day = day < 10 ? `0${day}` : day;
  const formatted_month = month < 10 ? `0${month}` : month;

  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  let time_ago = '';
  if (diffInDays === 0) {
    time_ago = 'Today';
  } else if (diffInDays === 1) {
    time_ago = 'Yesterday';
  } else {
    time_ago = `${diffInDays.toLocaleString()} days ago`;
  }

  const data = {
    time_ago,
    date: `${formatted_day}/${formatted_month}/${year}`
  }

  return data;
}

export function format_atomic(decimals: number, total: number): number | string {
  let returning_value = typeof total === 'string' ? parseFloat(total) : total;

  switch (decimals) {
    case 12: returning_value = total / 1e12; break;
    case 11: returning_value = total / 1e11; break;
    case 10: returning_value = total / 1e10; break;
    case 9:  returning_value = total / 1e9;  break;
    case 8:  returning_value = total / 1e8;  break;
    case 7:  returning_value = total / 1e7;  break;
    case 6:  returning_value = total / 1e6;  break;
    case 5:  returning_value = total / 1e5;  break;
    case 4:  returning_value = total / 1e4;  break;
    case 3:  returning_value = total / 1e3;  break;
    case 2:  returning_value = total / 1e2;  break;
    case 1:  returning_value = total / 10;   break;
    case 0:  break;
    default: break;
  }

  return returning_value;
}

export const format_to_readable_number = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    const formattedValue = (value / 1_000_000_000_000).toFixed(2);
    return `${formattedValue}T`;
  } else if (value >= 1_000_000_000) {
    const formattedValue = (value / 1_000_000_000).toFixed(2);
    return `${formattedValue}B`;
  } else if (value >= 1_000_000) {
    const formattedValue = (value / 1_000_000).toFixed(2);
    return `${formattedValue}M`;
  } else {
    return value.toString();
  }
}
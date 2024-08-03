export default function convert(currTime: string): string {
  const dat = new Date(currTime);
  const now = new Date();

  1000 * 60 * 60 * 24; // mins
  1000 * 60 * 60; //hours
  1000 * 60; //minutes

  const timeDiff = Math.floor((now.getTime() - dat.getTime()) / (1000 * 60));
  if (timeDiff < 1) {
    return "just now";
  } else if (timeDiff < 60) {
    return `${timeDiff} minutes ago`;
  } else if (timeDiff < 3600) {
    return `${Math.floor(timeDiff / 60)} hours ago`;
  } else {
    return `${Math.floor(timeDiff / 1440)} days ago`;
  }
}

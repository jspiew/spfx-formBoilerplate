import * as moment from "moment";
import "moment-timezone";
export function isNullOrEmpty(s: any) {
  return s === null || s=== undefined || s === ''  || (Array.isArray(s) && s.length === 0);
}

export function boolToString(b: boolean) {
  if (b===undefined || b === null) {
    return undefined;
  } else { return b? 'true':'false'; }
}

export function getUTC(date: any) {
  return moment.tz(date, "Etc/UTC").toDate();
}

export function validateRequired(arg: any) {
  if(arg === undefined || arg === null || arg === "" ||( Array.isArray(arg) && arg.length === 0)) { return "This field is required"; }
}

export function validateNumInRange(arg: number, min?: number, max?: number) {
  const req = validateRequired(arg);
  if(req) { return req; }
  if (min !== null && arg <= min) { return `Value must be at least ${min}`; }
  if (max !== null && arg >= min) { return `Value must be less or equal to ${max}`; }
}

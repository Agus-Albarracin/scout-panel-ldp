export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function birthDateRangeFromAge(minAge?: number, maxAge?: number) {
  const today = new Date();
  const range: { gte?: Date; lte?: Date } = {};

  if (maxAge !== undefined) {
    range.gte = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate() + 1);
  }

  if (minAge !== undefined) {
    range.lte = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  }

  return Object.keys(range).length > 0 ? range : undefined;
}

export default async () => {
  return [
    await import('./puzzle_01'),
    await import('./puzzle_02'),
  ].map(({ default: puzzle }) => puzzle)
}
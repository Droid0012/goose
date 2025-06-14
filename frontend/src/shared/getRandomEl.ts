export function getRandomEl<T>(list: T[] | Set<T>): T {
  if (list instanceof Set) {
    list = Array.from(list)
  }

  const idx = Math.floor(Math.random() * list.length)

  return list[idx]!
}

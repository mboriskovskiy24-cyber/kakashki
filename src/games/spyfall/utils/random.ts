export function pickRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? null
}

export function pickUniqueIndices(size: number, count: number) {
  const indices = Array.from({ length: size }, (_, index) => index)

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]]
  }

  return indices.slice(0, count)
}

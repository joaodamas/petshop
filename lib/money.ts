export function cents(n: number) {
  return Math.round(n * 100)
}

export function fmtBRL(c: number) {
  return (c / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

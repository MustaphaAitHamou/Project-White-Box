/* Garantit ≥ 1,1 s entre deux appels RapidAPI (plan BASIC = 1 req/s) */
let last = 0;
export async function throttle(delay = 1100) {
  const wait = delay - (Date.now() - last);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  last = Date.now();
}

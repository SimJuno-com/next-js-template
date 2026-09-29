// Stripe's charge units: https://docs.stripe.com/currencies#zero-decimal
// ISK and UGX use two-decimal API amounts despite having no fractional charges.
const zeroDecimalCurrencies = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

// Returns the number of Stripe charge units in one currency unit.
export function stripeCurrencyScale(currencyCode: string) {
  if (!/^[a-z]{3}$/i.test(currencyCode)) throw new Error("Invalid payment currency.");
  return zeroDecimalCurrencies.has(currencyCode.toLowerCase()) ? 1 : 100;
}

// Converts a saved SimJuno price into the amount Stripe should charge.
export function stripeAmount(price: number, currencyCode: string) {
  if (!Number.isSafeInteger(price) || price <= 0) {
    throw new Error("Invalid payment amount.");
  }
  // Simjuno prices use 1/10,000 currency units; Stripe expects the currency's minor unit.
  const amount = Math.round(price / (10_000 / stripeCurrencyScale(currencyCode)));
  const wholeUnitsOnly = ["isk", "ugx"].includes(currencyCode.toLowerCase());
  if (amount <= 0 || amount > 99_999_999 || (wholeUnitsOnly && amount % 100 !== 0)) {
    throw new Error("This price cannot be charged.");
  }
  return amount;
}

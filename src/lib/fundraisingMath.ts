export function inventoryFundraiserResult(purchased: number, sold: number, unitCost: number, salePrice: number, otherCosts: number) {
  if (![purchased, sold, unitCost, salePrice, otherCosts].every((value) => Number.isFinite(value) && value >= 0)
    || !Number.isInteger(purchased) || !Number.isInteger(sold) || sold > purchased) return null;
  const revenue = sold * salePrice;
  const costs = purchased * unitCost + otherCosts;
  return { revenue, costs, net: revenue - costs, unsold: purchased - sold };
}

import DebtPareto from './debtPareto';
import { DebtItemInterface, PricerInterface, DebtParetoInterface, DebtInterface, PrioritizationTypes } from './types';

export default class Debt implements DebtInterface {
  public debtParetos: Map<string, DebtParetoInterface>;
  public debtScore: number;
  public pricer: PricerInterface;

  public constructor(pricer: PricerInterface) {
    this.debtParetos = new Map<string, DebtParetoInterface>();
    this.debtScore = 0;
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    this.debtScore += this.pricer.getPrice(debtItem);

    let debtPareto = this.debtParetos.get(debtItem.type);
    if (debtPareto) {
      debtPareto.addDebtItem(debtItem);
    } else {
      debtPareto = new DebtPareto(debtItem.type, this.pricer);
      debtPareto.addDebtItem(debtItem);
      this.debtParetos.set(debtItem.type, debtPareto);
    }
  }

  public getDebtScoreByType(type: string): number {
    const pareto = this.debtParetos.get(type);
    return pareto ? pareto.debtScore : 0;
  }

  public getDebtScoreByPrioritization(prioritizationType: PrioritizationTypes): number {
    let debtScore = 0;
    for (const [, pareto] of this.debtParetos) {
      debtScore += pareto.debtScoreByPrioritization[prioritizationType];
    }
    return debtScore;
  }
}

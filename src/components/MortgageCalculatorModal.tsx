import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  DollarSign, 
  Percent, 
  Calendar, 
  PieChart, 
  CheckCircle2, 
  TrendingUp, 
  Info 
} from 'lucide-react';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 1250000
}) => {
  const [homePrice, setHomePrice] = useState<number>(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2);
  const [annualInsurance, setAnnualInsurance] = useState<number>(2400);
  const [monthlyHoa, setMonthlyHoa] = useState<number>(250);

  if (!isOpen) return null;

  // Mortgage calculations
  const downPaymentAmount = Math.round((homePrice * downPaymentPct) / 100);
  const loanPrincipal = Math.max(0, homePrice - downPaymentAmount);
  
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;

  const monthlyPrincipalAndInterest = monthlyInterestRate > 0 && totalPayments > 0
    ? (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
    : loanPrincipal / (totalPayments || 1);

  const monthlyTax = Math.round((homePrice * (propertyTaxRate / 100)) / 12);
  const monthlyInsurance = Math.round(annualInsurance / 12);
  const totalMonthlyPayment = Math.round(monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + monthlyHoa);
  const totalLoanInterest = Math.round((monthlyPrincipalAndInterest * totalPayments) - loanPrincipal);

  return (
    <div className="fixed inset-0 z-50 bg-[#3E3C38]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E8E6E1] overflow-hidden max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#3E3C38] text-white flex items-center justify-between border-b border-[#3E3C38] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8A9A5B]/20 border border-[#8A9A5B]/40 flex items-center justify-center text-[#8A9A5B]">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Mortgage & Loan Payment Calculator</h3>
              <p className="text-[11px] text-[#E8E6E1]/70">Estimate your total monthly mortgage payment, taxes, insurance, & loan amortization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#4A4844] hover:bg-[#5C5A55] text-[#E8E6E1] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Payment Banner */}
          <div className="bg-[#3E3C38] text-white p-6 rounded-2xl shadow-md border border-[#3E3C38] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#8A9A5B] uppercase tracking-wider block">Estimated Total Monthly Payment</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-4xl font-extrabold text-white">${totalMonthlyPayment.toLocaleString()}</span>
                <span className="text-sm text-[#E8E6E1]/80 font-medium">/ month</span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-[#4A4844] sm:pl-6 text-xs text-[#E8E6E1]/80 space-y-1 w-full sm:w-auto">
              <div className="flex justify-between sm:justify-end gap-3">
                <span>Loan Principal:</span>
                <strong className="text-white">${loanPrincipal.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between sm:justify-end gap-3">
                <span>Total Interest Paid:</span>
                <strong className="text-white">${totalLoanInterest.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-xs space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#3E3C38] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#5C6B4E]" />
              Monthly Payment Breakdown
            </h4>

            {/* Visual Bar */}
            <div className="h-5 rounded-full overflow-hidden flex bg-[#E8E6E1]">
              <div style={{ width: `${(monthlyPrincipalAndInterest / totalMonthlyPayment) * 100}%` }} className="bg-[#5C6B4E]" title="Principal & Interest" />
              <div style={{ width: `${(monthlyTax / totalMonthlyPayment) * 100}%` }} className="bg-[#8A9A5B]" title="Property Tax" />
              <div style={{ width: `${(monthlyInsurance / totalMonthlyPayment) * 100}%` }} className="bg-[#D98E73]" title="Home Insurance" />
              <div style={{ width: `${(monthlyHoa / totalMonthlyPayment) * 100}%` }} className="bg-[#3E3C38]" title="HOA Fee" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E8E6E1]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5C6B4E]" />
                  <span className="font-bold text-[#8C8A85]">Principal & Int</span>
                </div>
                <span className="font-serif text-base font-extrabold text-[#3E3C38]">${Math.round(monthlyPrincipalAndInterest).toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E8E6E1]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A9A5B]" />
                  <span className="font-bold text-[#8C8A85]">Property Tax</span>
                </div>
                <span className="font-serif text-base font-extrabold text-[#3E3C38]">${monthlyTax.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E8E6E1]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D98E73]" />
                  <span className="font-bold text-[#8C8A85]">Home Insurance</span>
                </div>
                <span className="font-serif text-base font-extrabold text-[#3E3C38]">${monthlyInsurance.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E8E6E1]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3E3C38]" />
                  <span className="font-bold text-[#8C8A85]">HOA Fees</span>
                </div>
                <span className="font-serif text-base font-extrabold text-[#3E3C38]">${monthlyHoa.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Calculator Inputs Controls */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-xs space-y-5">
            <h4 className="font-serif font-bold text-sm text-[#3E3C38] border-b border-[#E8E6E1] pb-2">
              Loan Inputs & Financial Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Home Price */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#3E3C38]">Property Home Price ($)</label>
                  <span className="text-xs font-extrabold text-[#5C6B4E]">${homePrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={10000000}
                  step={25000}
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full accent-[#5C6B4E] h-2 bg-[#E8E6E1] rounded-lg cursor-pointer mb-2"
                />
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2 text-xs font-semibold text-[#3E3C38] focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                />
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#3E3C38]">Down Payment ({downPaymentPct}%)</label>
                  <span className="text-xs font-extrabold text-[#5C6B4E]">${downPaymentAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={1}
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#5C6B4E] h-2 bg-[#E8E6E1] rounded-lg cursor-pointer mb-2"
                />
                <div className="flex gap-2">
                  {[5, 10, 15, 20, 30].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentPct(pct)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border ${
                        downPaymentPct === pct
                          ? 'bg-[#5C6B4E] text-white border-[#5C6B4E]'
                          : 'bg-[#F3F1ED] text-[#3E3C38] border-[#E8E6E1] hover:bg-[#E8E6E1]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#3E3C38]">Interest Rate (%)</label>
                  <span className="text-xs font-extrabold text-[#5C6B4E]">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={2.0}
                  max={12.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#5C6B4E] h-2 bg-[#E8E6E1] rounded-lg cursor-pointer mb-2"
                />
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2 text-xs font-semibold text-[#3E3C38] focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]"
                />
              </div>

              {/* Loan Term */}
              <div>
                <label className="text-xs font-bold text-[#3E3C38] block mb-1">Loan Term (Years)</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setLoanTermYears(term)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        loanTermYears === term
                          ? 'bg-[#5C6B4E] text-white border-[#5C6B4E] shadow-xs'
                          : 'bg-[#F3F1ED] text-[#3E3C38] border-[#E8E6E1] hover:bg-[#E8E6E1]'
                      }`}
                    >
                      {term} Years
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Additional Taxes & Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E8E6E1]">
              <div>
                <label className="text-[11px] font-bold text-[#8C8A85] block mb-1">Property Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2 text-xs font-semibold text-[#3E3C38]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8C8A85] block mb-1">Annual Homeowners Ins ($)</label>
                <input
                  type="number"
                  value={annualInsurance}
                  onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                  className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2 text-xs font-semibold text-[#3E3C38]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8C8A85] block mb-1">Monthly HOA Fees ($)</label>
                <input
                  type="number"
                  value={monthlyHoa}
                  onChange={(e) => setMonthlyHoa(Number(e.target.value))}
                  className="w-full bg-[#F3F1ED] border border-[#E8E6E1] rounded-xl p-2 text-xs font-semibold text-[#3E3C38]"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

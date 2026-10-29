import { SceneArt } from '../../art/SceneArt.jsx';
import { SimplifiedNote } from '../Money.jsx';
import { FundSection } from './FundSection.jsx';
import { InsuranceSection } from './InsuranceSection.jsx';
import { LoanSection } from './LoanSection.jsx';
import { SavingsSection } from './SavingsSection.jsx';

export function Bank({ state, dispatch }) {
  return (
    <div className="bank" data-testid="bank">
      <SceneArt slot="bank" className="bank-banner" />
      <LoanSection state={state} dispatch={dispatch} />
      <SavingsSection state={state} dispatch={dispatch} />
      <InsuranceSection state={state} dispatch={dispatch} />
      <FundSection state={state} dispatch={dispatch} />
      <SimplifiedNote />
    </div>
  );
}

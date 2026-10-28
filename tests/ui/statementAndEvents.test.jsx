import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { EVENTS, INSURANCE, REPAIR, SCAM } from '../../src/game/config/economy.js';
import { createSeason } from '../../src/game/engine/index.js';
import { EventCard } from '../../src/ui/season/EventCard.jsx';
import { GlossaryProvider } from '../../src/ui/season/Glossary.jsx';
import { click, closeLessons, nextResults, skipEvent, startSeason, text } from './seasonHarness.jsx';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
});

function crash(damage) {
  click('enter-stage');
  click('start-race');
  nextResults.damage = damage;
  fireEvent.click(screen.getByText('finish'));
}

const fullBill = (damage) => REPAIR.base + damage * REPAIR.perDamagePoint;

describe('results statement', () => {
  it('offers an uninsured repair at the full bill, or racing on damaged', () => {
    startSeason('career');
    crash(40);
    expect(text('repair')).toContain(fullBill(40).toLocaleString('en-US'));
    click('race-damaged');
    skipEvent();
    closeLessons();
    expect(screen.getByTestId('pit-hub')).toBeTruthy();
    click('enter-stage');
    expect(screen.getByTestId('pre-race').textContent).toContain('40%');
  });

  it('an insured crash costs only the uncovered share', () => {
    startSeason('career');
    click('tab-bank');
    click('toggle-insurance');
    click('tab-home');
    crash(40);
    const bill = Math.floor((fullBill(40) * (100 - INSURANCE.coversPercent)) / 100);
    expect(text('repair')).toContain(bill.toLocaleString('en-US'));
    expect(text('line-insurance')).toContain(`− AED ${INSURANCE.premium}`);
    click('repair');
    expect(text('line-repair')).toContain(bill.toLocaleString('en-US'));
    expect(screen.getByTestId('continue')).toBeTruthy();
  });
});

describe('event cards', () => {
  function showEvent(eventId, cash) {
    cleanup();
    const dispatch = vi.fn();
    const state = { ...createSeason({ mode: 'career', seed: 7 }), phase: 'EVENT', pendingEvent: eventId, cash };
    render(
      <GlossaryProvider>
        <EventCard state={state} dispatch={dispatch} />
      </GlossaryProvider>,
    );
    return dispatch;
  }

  it('Desert Gold shows red flags and each choice cost before choosing', () => {
    const dispatch = showEvent('desertGold', 2000);
    expect(screen.getByTestId('red-flags').querySelectorAll('li')).toHaveLength(4);
    expect(text('choice-invest1000')).toContain(`− AED ${SCAM.investOptions[0].toLocaleString('en-US')}`);
    expect(screen.getByTestId('choice-invest3000').disabled).toBe(true);
    click('choice-walkAway');
    expect(dispatch).toHaveBeenCalledWith({ type: 'chooseEvent', choiceId: 'walkAway' });
  });

  it('the sponsor deal shows the cash now and the risk', () => {
    showEvent('sponsorDeal', 0);
    expect(text('choice-accept')).toContain(EVENTS.sponsorNow.toLocaleString('en-US'));
    expect(text('choice-accept')).toContain(EVENTS.sponsorPenalty.toLocaleString('en-US'));
  });
});

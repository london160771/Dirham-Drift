import { SPEED_TO_KMH } from '../../game/config/car.js';
import { t } from '../../i18n/strings.js';
import { formatAed } from '../format.js';

function Bar({ value, className }) {
  return (
    <div className={`bar ${className}`}>
      <div className="bar-fill" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

export function Hud({ telemetry, money, onPause }) {
  if (!telemetry) return null;
  const sprint = telemetry.laps === 1;
  return (
    <div className="hud" data-testid="hud">
      <div className="hud-left">
        <div className="hud-pos">
          <span className="hud-label">{t('hud.position')}</span>
          <strong>{telemetry.position}</strong>
          <span>/{telemetry.carCount}</span>
        </div>
        <div className="hud-lap">
          {sprint ? t('hud.progress', { percent: Math.round(telemetry.progress * 100) }) : t('hud.lap', { current: telemetry.lap, total: telemetry.laps })}
        </div>
        {money && (
          <div className="hud-money" data-testid="hud-money">
            <span>{t('hud.cash', { amount: formatAed(money.cash) })}</span>
            <span className={money.loanLeft > 0 ? 'owed' : ''}>
              {money.loanLeft > 0 ? t('hud.loan', { amount: formatAed(money.loanLeft) }) : t('hud.noLoan')}
            </span>
          </div>
        )}
      </div>
      <button type="button" className="hud-pause" onClick={onPause} aria-label={t('hud.pause')}>
        II
      </button>
      <div className="hud-right">
        <div className="hud-speed">
          <strong>{Math.round(telemetry.speed * SPEED_TO_KMH)}</strong>
          <span>{t('hud.speed')}</span>
        </div>
        <div className="hud-meter">
          <span>{t('hud.nitro')}</span>
          <Bar value={telemetry.nitro} className={telemetry.nitroActive ? 'nitro active' : 'nitro'} />
        </div>
        <div className={telemetry.damage > 0 ? 'hud-damage hurt' : 'hud-damage'}>{t('hud.damage', { value: telemetry.damage })}</div>
      </div>
    </div>
  );
}

export function Countdown({ telemetry }) {
  if (!telemetry) return null;
  if (telemetry.phase === 'countdown') return <div className="countdown">{telemetry.countdown}</div>;
  if (telemetry.phase === 'racing' && telemetry.timeMs < 900) return <div className="countdown go">{t('hud.go')}</div>;
  return null;
}

export function DebugOverlay({ telemetry, input }) {
  if (!telemetry) return null;
  const state = input.read({});
  return (
    <div className="debug" data-testid="debug">
      {t('hud.fps', { fps: telemetry.fps })} · steer {state.steer} · gas {state.gas} · brake {state.brake} · nitro {state.nitro ? 1 : 0}
    </div>
  );
}

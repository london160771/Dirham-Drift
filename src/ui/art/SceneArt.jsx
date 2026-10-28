import { ART_FILES } from './artSlots.js';
import { BankArt, GarageArt, ScamAdArt } from './RoomArt.jsx';
import { Skyline } from './Skyline.jsx';

const CODE_ART = { title: Skyline, garage: GarageArt, bank: BankArt, scamAd: ScamAdArt };

export function SceneArt({ slot, className = '' }) {
  const file = ART_FILES[slot];
  const CodeArt = CODE_ART[slot];
  return (
    <div className={`scene-art ${className}`} data-testid={`art-${slot}`} data-source={file ? 'image' : 'code'}>
      {file ? <img src={file} alt="" draggable="false" /> : <CodeArt />}
    </div>
  );
}

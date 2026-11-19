import type { ConsentAdapterId } from '../../src/consent/port.js';
import type { FakeWindow } from './harness.js';
import { cookiemunchFixture } from '../fixtures/consent/cookiemunch/fixture.js';
import { customFixture } from '../fixtures/consent/custom/fixture.js';
import { onetrustFixture } from '../fixtures/consent/onetrust/fixture.js';
import { cookiebotFixture } from '../fixtures/consent/cookiebot/fixture.js';
import { usercentricsFixture } from '../fixtures/consent/usercentrics/fixture.js';
import { didomiFixture } from '../fixtures/consent/didomi/fixture.js';
import { osanoFixture } from '../fixtures/consent/osano/fixture.js';
import { termlyFixture } from '../fixtures/consent/termly/fixture.js';
import { tcfFixture } from '../fixtures/consent/tcf/fixture.js';
import { gppFixture } from '../fixtures/consent/gpp/fixture.js';
import { gcmFixture } from '../fixtures/consent/gcm/fixture.js';

/**
 * One fake CMP per adapter, shaped after the vendor's documented browser API
 * (each adapter's fixture lives in test/fixtures/consent/<id>/, see docs/PORTS.md): install it with no
 * decision, then grant, deny, or install a broken one whose API throws.
 */
export interface CmpFixture {
  id: ConsentAdapterId;
  install(w: FakeWindow): void;
  grant(w: FakeWindow): void;
  deny(w: FakeWindow): void;
  /** The CMP is on the page, but its API throws. */
  broken(w: FakeWindow): void;
  /** How long a change takes to be seen (ms of timers to run). */
  tickMs?: number;
  /** Evidence fields a grant must carry. */
  evidence?: Record<string, unknown>;
}

/** Every adapter's fixture except `none` (always granted, tested on its own). */
export const FIXTURES: CmpFixture[] = [customFixture, cookiemunchFixture, onetrustFixture, cookiebotFixture, usercentricsFixture, didomiFixture, osanoFixture, termlyFixture, tcfFixture, gppFixture, gcmFixture];

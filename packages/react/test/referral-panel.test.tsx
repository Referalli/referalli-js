import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReferalliProvider, ReferralPanel, type ReferralWidgetElement } from '../src/index.js';

afterEach(cleanup);

const scripts = () => [...document.querySelectorAll<HTMLScriptElement>('script[src*="/widget.js"]')];

describe('ReferralPanel', () => {
  it('loads widget.js once, mounts the element with attributes and the getter, and removes it on unmount', async () => {
    const onReady = vi.fn();
    const getAuthToken = vi.fn(() => 'jwt_1');
    const view = render(
      <ReferalliProvider publishableKey="tk_1" track={false} resolvePartner={false}>
        <ReferralPanel programId="prg_1" auth="atlas" lang="de" onReady={onReady} />
        <ReferralPanel programId="prg_1" auth="custom" getAuthToken={getAuthToken} className="panel" />
      </ReferalliProvider>,
    );
    expect(scripts().map((s) => s.src)).toEqual(['https://referalli.com/t/tk_1/widget.js']);

    // What the served script does: define the element, then fire load.
    const seen: { getter: unknown }[] = [];
    customElements.define(
      'referalli-referral-widget',
      class extends HTMLElement {
        connectedCallback() {
          seen.push({ getter: (this as ReferralWidgetElement).getAuthToken });
        }
      },
    );
    await act(async () => {
      scripts()[0]!.dispatchEvent(new Event('load'));
    });

    const els = [...view.container.querySelectorAll<ReferralWidgetElement>('referalli-referral-widget')];
    expect(els).toHaveLength(2);
    expect(els[0]!.getAttribute('program')).toBe('prg_1');
    expect(els[0]!.getAttribute('auth')).toBe('atlas');
    expect(els[0]!.getAttribute('lang')).toBe('de');
    expect(els[0]!.getAuthToken).toBeUndefined();
    expect(els[1]!.hasAttribute('getauthtoken')).toBe(false);
    expect(await els[1]!.getAuthToken!()).toBe('jwt_1');
    expect(seen[1]!.getter).toBeTypeOf('function'); // set before the element connected
    expect(view.container.querySelector('.panel referalli-referral-widget')).toBe(els[1]);
    expect(onReady).toHaveBeenCalledWith(els[0]);

    // A later panel reuses the defined element: no second script.
    const late = render(<ReferralPanel programId="prg_2" auth="clerk" trackingToken="tk_1" />);
    await act(async () => {});
    expect(scripts()).toHaveLength(1);
    expect(late.container.querySelector('referalli-referral-widget')!.getAttribute('program')).toBe('prg_2');

    view.unmount();
    late.unmount();
    expect(document.querySelectorAll('referalli-referral-widget')).toHaveLength(0);
  });

  it('reports a missing tracking token', () => {
    const onError = vi.fn();
    render(<ReferralPanel programId="prg_1" auth="atlas" onError={onError} />);
    expect(onError.mock.calls[0]![0]).toBeInstanceOf(Error);
  });

  it('types the custom element for hand-written JSX', () => {
    const el = <referalli-referral-widget program="prg_1" auth="atlas" token-url="/api/t" />;
    expect(el.props.program).toBe('prg_1');
  });
});

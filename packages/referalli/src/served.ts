/**
 * The standalone `aff.js` script served from the tracking endpoint. Mirrors the
 * behavior of snippet.ts as a dependency-free IIFE, with the org token and base
 * URL inlined at serve time. The consent gate and its adapters are the same
 * functions snippet.ts runs, inlined by source text (consent/served.ts).
 *
 * Page-level overrides go on the script tag:
 *  - `data-consent="auto" | "none" | "pending" | "<adapter id>"`: how consent
 *    is read (default: the org's tracking setting). Until a CMP grants, the
 *    context is kept in memory only: nothing stored, no visit beacon.
 *  - `data-consent-category`, `data-consent-tcf-vendor`: adapter options.
 *  - `data-persist="referral-only"`: store and send nothing unless the URL
 *    carries a referral (code or click id).
 *  - `data-cookie-days="30"`: how long the context is kept.
 *  - `data-attribution="first" | "last"`: which referral a new one replaces.
 *  - `data-cookie-domain=".app.com"`: share the cookie with subdomains (an
 *    auth page on auth.app.com can then read the referral).
 * `aff.consent(true|false)` is the push path for pages without a supported
 * CMP; `aff.forget()` deletes the stored context (consent withdrawn). Calls
 * queued before the script loads (`window.aff = window.aff || {q: []};
 * aff.q.push(['consent', true])`) are run on load.
 */
import { LEGACY_REFERRAL_COOKIE, REFERRAL_COOKIE_NAMES } from './attribution.js';
import { NAME_SHIM, consentSource } from './consent/served.js';
import { AUTO_ORDER, CONSENT_MODES, consentConfig, type ConsentOptions } from './consent/port.js';

export interface SnippetOptions {
  /** Default lifetime of the stored context; the org's longest program cookie window. */
  cookieDays?: number;
  /** Keep the first referral instead of the latest (every program is first_click). */
  firstTouch?: boolean;
  /** Extra query parameters that carry a referral code (an imported tool's, e.g. fpr), after via/ref/aff. */
  params?: string[];
  /** Older storage/cookie names to read a saved context from (it is re-saved under the current name). */
  legacyKeys?: string[];
  /** The org's consent default (`data-consent` on the tag overrides it). Default `none`. */
  consent?: ConsentOptions;
  /**
   * Inline only these adapters (`?consent=<id>` on the script URL), keeping
   * the script small. Default: every adapter.
   */
  consentAdapters?: string[];
}

export function renderSnippetJs(token: string, baseUrl: string, opts: SnippetOptions = {}): string {
  const days = Math.max(1, Math.min(400, Math.round(opts.cookieDays ?? 60)));
  const consent = consentConfig(opts.consent);
  const ids = opts.consentAdapters?.length ? opts.consentAdapters.filter((id) => (AUTO_ORDER as readonly string[]).includes(id)) : [...AUTO_ORDER];
  const src = consentSource(ids);
  return `(function(){
  ${NAME_SHIM}
  var KEY='referalli_ctx';
  // Legacy twin, written with the same value, attributes and expiry: Atlas's
  // Referalli connector and Cookie Munch's preset still read referally_ctx.
  // Drop it once they read referalli_ctx (see LEGACY_REFERRAL_COOKIE).
  var WKEYS=[KEY,${JSON.stringify(LEGACY_REFERRAL_COOKIE)}];
  var s=document.currentScript;
  function attr(n){return s&&s.getAttribute?s.getAttribute(n):null;}
  var BASE=${JSON.stringify(baseUrl)};
  try{if(s&&s.src)BASE=new URL(s.src).origin;}catch(e){}
  var days=parseInt(attr('data-cookie-days')||'',10);if(!(days>0))days=${days};if(days>400)days=400;
  var a=attr('data-attribution');var first=a==='first'||(a!=='last'&&${opts.firstTouch ? 'true' : 'false'});
  var referralOnly=attr('data-persist')==='referral-only';
  var secure=location.protocol==='https:'?'; Secure':'';
  var cd=attr('data-cookie-domain');var dom=cd&&/^\\.?[a-z0-9.-]+$/i.test(cd)?'; domain='+cd:'';
  var gone=false,dropped=false,sent=false,cstate='unknown',pendingId=null;
  var KEYS=WKEYS.concat(${JSON.stringify((opts.legacyKeys ?? []).filter((k) => /^[A-Za-z0-9_]{1,64}$/.test(k) && !REFERRAL_COOKIE_NAMES.includes(k)))});
  function readKey(k){var r=null;try{r=localStorage.getItem(k);}catch(e){}
    if(!r){var m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));if(m)r=decodeURIComponent(m[1]);}
    if(!r)return null;try{var c=JSON.parse(r);if(!c||typeof c.anonId!=='string'||(c.exp&&c.exp<Date.now()))return null;return c;}catch(e){return null;}}
  function read(){for(var i=0;i<KEYS.length;i++){var c=readKey(KEYS[i]);if(c)return c;}return null;}
  function write(c){if(gone||dropped)return;var r=JSON.stringify(c);var t='='+encodeURIComponent(r)+'; path=/; max-age='+(days*86400)+'; SameSite=Lax'+dom+secure;
    for(var i=0;i<WKEYS.length;i++){var k=WKEYS[i];
      try{localStorage.setItem(k,r);}catch(e){}
      try{document.cookie=k+t;}catch(e){}}}
  function clear(){for(var i=0;i<KEYS.length;i++){var k=KEYS[i];try{localStorage.removeItem(k);}catch(e){}
    try{document.cookie=k+'=; path=/; max-age=0; SameSite=Lax'+dom+secure;}catch(e){}}}
  function forget(){gone=true;clear();}
  function rid(){var t='a_',c='abcdefghijklmnopqrstuvwxyz0123456789';
    for(var i=0;i<20;i++)t+=c[Math.floor(Math.random()*c.length)];return t;}
  var u=new URL(window.location.href);
  var PARAMS=${JSON.stringify(['via', 'ref', 'aff', ...(opts.params ?? []).filter((p) => /^[a-z][a-z0-9_]{0,39}$/.test(p))])};
  var code=null;for(var pi=0;pi<PARAMS.length&&!code;pi++)code=u.searchParams.get(PARAMS[pi]);
  var clickId=u.searchParams.get('ref_click_id');
  var st=read()||{};
  var keep=first&&(st.code||st.clickId);
  var ctx={anonId:st.anonId||rid(),
    code:keep?(st.code||null):(code||st.code||null),
    clickId:keep?(st.clickId||null):(clickId||st.clickId||null),
    ts:st.ts||Date.now()};
  ctx.exp=keep&&st.exp?st.exp:((code||clickId)?Date.now()+days*86400000:(st.exp||Date.now()+days*86400000));
  function post(p,b){if(gone||dropped)return;try{fetch(BASE+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b),keepalive:true}).catch(function(){});}catch(e){}}
  var active=!referralOnly||code||clickId;
  // Consent: the org default, overridden by the tag.
  var CFG=${JSON.stringify(consent)};
  var cm=attr('data-consent');if(cm&&${JSON.stringify(CONSENT_MODES)}.indexOf(cm)>=0)CFG.mode=cm;
  var cc=attr('data-consent-category');if(cc)CFG.category=cc.slice(0,80);
  var tv=parseInt(attr('data-consent-tcf-vendor')||'',10);if(tv>0)CFG.tcfVendorId=tv;
  function identify(o){o=o||{};if(gone||dropped)return;if(!active&&!st.anonId)return;
    if(cstate!=='granted'){pendingId=o;return;}
    post('/t/${token}/identify',{anonId:ctx.anonId,customerRef:o.customerRef,emailHash:o.emailHash});}
  function onConsent(state,ev){cstate=state;
    if(state==='granted'){dropped=false;
      if(active){write(ctx);
        if(!sent){sent=true;post('/t/${token}/visit',{anonId:ctx.anonId,code:(keep?null:code)||ctx.code||undefined,clickId:(keep?null:clickId)||ctx.clickId||undefined,url:window.location.href,consent:ev||undefined});}}
      if(pendingId){var o=pendingId;pendingId=null;identify(o);}}
    else if(state==='denied'){clear();dropped=true;pendingId=null;}}
  var gate=${src.gate}(window,CFG,${src.adapters},${src.order},onConsent);
  function view(){return gone||dropped?{anonId:null,code:null,clickId:null,ts:null}:{anonId:ctx.anonId,code:ctx.code,clickId:ctx.clickId,ts:ctx.ts};}
  var api={
    getReferral:view,
    signupMetadata:function(){var v=view();var m={referalli_anon_id:v.anonId};if(v.clickId)m.referalli_click_id=v.clickId;if(v.code)m.referalli_coupon=v.code;return m;},
    identify:identify,
    forget:forget,
    consent:function(g){gate.push(g===true);},
    consentState:function(){return cstate;},
    consentEvidence:function(){return gate.evidence();},
    get consentMode(){return gate.mode();}
  };
  function run(e){try{if(e&&typeof api[e[0]]==='function')api[e[0]].apply(api,Array.prototype.slice.call(e,1));}catch(x){}}
  var prev=window.aff;var queued=prev&&prev.q&&typeof prev.q.length==='number'?prev.q:[];
  api.q={push:run};
  window.aff=api;
  gate.start();
  for(var qi=0;qi<queued.length;qi++)run(queued[qi]);
})();`;
}

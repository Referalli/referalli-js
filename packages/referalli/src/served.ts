/**
 * The standalone `aff.js` script served from the tracking endpoint. Mirrors the
 * behavior of snippet.ts as a dependency-free IIFE, with the org token and base
 * URL inlined at serve time.
 *
 * Page-level overrides go on the script tag:
 *  - `data-persist="referral-only"`: store and send nothing unless the URL
 *    carries a referral (code or click id). Use it before consent.
 *  - `data-cookie-days="30"`: how long the context is kept.
 *  - `data-attribution="first" | "last"`: which referral a new one replaces.
 *  - `data-cookie-domain=".app.com"`: share the cookie with subdomains (an
 *    auth page on auth.app.com can then read the referral).
 * `aff.forget()` deletes the stored context (consent withdrawn).
 */
export interface SnippetOptions {
  /** Default lifetime of the stored context; the org's longest program cookie window. */
  cookieDays?: number;
  /** Keep the first referral instead of the latest (every program is first_click). */
  firstTouch?: boolean;
  /** Extra query parameters that carry a referral code (an imported tool's, e.g. fpr), after via/ref/aff. */
  params?: string[];
  /** Older storage/cookie names to read a saved context from (it is re-saved under the current name). */
  legacyKeys?: string[];
}

export function renderSnippetJs(token: string, baseUrl: string, opts: SnippetOptions = {}): string {
  const days = Math.max(1, Math.min(400, Math.round(opts.cookieDays ?? 60)));
  return `(function(){
  var KEY='referalli_ctx';
  var s=document.currentScript;
  function attr(n){return s&&s.getAttribute?s.getAttribute(n):null;}
  var BASE=${JSON.stringify(baseUrl)};
  try{if(s&&s.src)BASE=new URL(s.src).origin;}catch(e){}
  var days=parseInt(attr('data-cookie-days')||'',10);if(!(days>0))days=${days};if(days>400)days=400;
  var a=attr('data-attribution');var first=a==='first'||(a!=='last'&&${opts.firstTouch ? 'true' : 'false'});
  var referralOnly=attr('data-persist')==='referral-only';
  var secure=location.protocol==='https:'?'; Secure':'';
  var cd=attr('data-cookie-domain');var dom=cd&&/^\\.?[a-z0-9.-]+$/i.test(cd)?'; domain='+cd:'';
  var gone=false;
  var KEYS=[KEY].concat(${JSON.stringify((opts.legacyKeys ?? []).filter((k) => /^[A-Za-z0-9_]{1,64}$/.test(k)))});
  function readKey(k){var r=null;try{r=localStorage.getItem(k);}catch(e){}
    if(!r){var m=document.cookie.match(new RegExp('(?:^|; )'+k+'=([^;]*)'));if(m)r=decodeURIComponent(m[1]);}
    if(!r)return null;try{var c=JSON.parse(r);if(!c||typeof c.anonId!=='string'||(c.exp&&c.exp<Date.now()))return null;return c;}catch(e){return null;}}
  function read(){for(var i=0;i<KEYS.length;i++){var c=readKey(KEYS[i]);if(c)return c;}return null;}
  function write(c){if(gone)return;var r=JSON.stringify(c);
    try{localStorage.setItem(KEY,r);}catch(e){}
    try{document.cookie=KEY+'='+encodeURIComponent(r)+'; path=/; max-age='+(days*86400)+'; SameSite=Lax'+dom+secure;}catch(e){}}
  function forget(){gone=true;try{localStorage.removeItem(KEY);}catch(e){}
    try{document.cookie=KEY+'=; path=/; max-age=0; SameSite=Lax'+dom+secure;}catch(e){}}
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
  function post(p,b){if(gone)return;try{fetch(BASE+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b),keepalive:true}).catch(function(){});}catch(e){}}
  var active=!referralOnly||code||clickId;
  if(active){write(ctx);
    post('/t/${token}/visit',{anonId:ctx.anonId,code:(keep?null:code)||ctx.code||undefined,clickId:(keep?null:clickId)||ctx.clickId||undefined,url:window.location.href});}
  window.aff={
    getReferral:function(){return gone?{anonId:null,code:null,clickId:null,ts:null}:{anonId:ctx.anonId,code:ctx.code,clickId:ctx.clickId,ts:ctx.ts};},
    identify:function(o){o=o||{};if(!active&&!st.anonId)return;post('/t/${token}/identify',{anonId:ctx.anonId,customerRef:o.customerRef,emailHash:o.emailHash});},
    forget:forget
  };
})();`;
}

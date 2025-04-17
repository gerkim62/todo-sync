(()=>{"use strict";var e;let t,a,r,s=(e,...t)=>{let a=e;return t.length>0&&(a+=` :: ${JSON.stringify(t)}`),a};class n extends Error{details;constructor(e,t){super(s(e,t)),this.name=e,this.details=t}}let i=e=>new URL(String(e),location.href).href.replace(RegExp(`^${location.origin}`),""),l={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"serwist",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},o=e=>[l.prefix,e,l.suffix].filter(e=>e&&e.length>0).join("-"),c=e=>{for(let t of Object.keys(l))e(t)},h={updateDetails:e=>{c(t=>{let a=e[t];"string"==typeof a&&(l[t]=a)})},getGoogleAnalyticsName:e=>e||o(l.googleAnalytics),getPrecacheName:e=>e||o(l.precache),getRuntimeName:e=>e||o(l.runtime)};class u{promise;resolve;reject;constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}function d(e,t){let a=new URL(e);for(let e of t)a.searchParams.delete(e);return a.href}async function f(e,t,a,r){let s=d(t.url,a);if(t.url===s)return e.match(t,r);let n={...r,ignoreSearch:!0};for(let i of(await e.keys(t,n)))if(s===d(i.url,a))return e.match(i,r)}let y=new Set,p=async()=>{for(let e of y)await e()};function w(e){return new Promise(t=>setTimeout(t,e))}let g="-precache-",m=async(e,t=g)=>{let a=(await self.caches.keys()).filter(a=>a.includes(t)&&a.includes(self.registration.scope)&&a!==e);return await Promise.all(a.map(e=>self.caches.delete(e))),a},_=e=>{self.addEventListener("activate",t=>{t.waitUntil(m(h.getPrecacheName(e)).then(e=>{}))})},b=()=>{self.addEventListener("activate",()=>self.clients.claim())},v=(e,t)=>{let a=t();return e.waitUntil(a),a},q=(e,t)=>t.some(t=>e instanceof t),R=new WeakMap,E=new WeakMap,P=new WeakMap,S={get(e,t,a){if(e instanceof IDBTransaction){if("done"===t)return R.get(e);if("store"===t)return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return D(e[t])},set:(e,t,a)=>(e[t]=a,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function D(e){if(e instanceof IDBRequest){let t=new Promise((t,a)=>{let r=()=>{e.removeEventListener("success",s),e.removeEventListener("error",n)},s=()=>{t(D(e.result)),r()},n=()=>{a(e.error),r()};e.addEventListener("success",s),e.addEventListener("error",n)});return P.set(t,e),t}if(E.has(e))return E.get(e);let t=function(e){if("function"==typeof e)return(r||(r=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(k(this),t),D(this.request)}:function(...t){return D(e.apply(k(this),t))};return(e instanceof IDBTransaction&&function(e){if(R.has(e))return;let t=new Promise((t,a)=>{let r=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",n),e.removeEventListener("abort",n)},s=()=>{t(),r()},n=()=>{a(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",s),e.addEventListener("error",n),e.addEventListener("abort",n)});R.set(e,t)}(e),q(e,a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(e,S):e}(e);return t!==e&&(E.set(e,t),P.set(t,e)),t}let k=e=>P.get(e),C=["get","getKey","getAll","getAllKeys","count"],T=["put","add","delete","clear"],I=new Map;function L(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(I.get(t))return I.get(t);let a=t.replace(/FromIndex$/,""),r=t!==a,s=T.includes(a);if(!(a in(r?IDBIndex:IDBObjectStore).prototype)||!(s||C.includes(a)))return;let n=async function(e,...t){let n=this.transaction(e,s?"readwrite":"readonly"),i=n.store;return r&&(i=i.index(t.shift())),(await Promise.all([i[a](...t),s&&n.done]))[0]};return I.set(t,n),n}S=(e=>({...e,get:(t,a,r)=>L(t,a)||e.get(t,a,r),has:(t,a)=>!!L(t,a)||e.has(t,a)}))(S);let N=["continue","continuePrimaryKey","advance"],U={},x=new WeakMap,K=new WeakMap,B={get(e,t){if(!N.includes(t))return e[t];let a=U[t];return a||(a=U[t]=function(...e){x.set(this,K.get(this)[t](...e))}),a}};async function*O(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;let a=new Proxy(t,B);for(K.set(a,t),P.set(a,k(t));t;)yield a,t=await (x.get(a)||t.continue()),x.delete(a)}function F(e,t){return t===Symbol.asyncIterator&&q(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&q(e,[IDBIndex,IDBObjectStore])}S=(e=>({...e,get:(t,a,r)=>F(t,a)?O:e.get(t,a,r),has:(t,a)=>F(t,a)||e.has(t,a)}))(S);let M=e=>e&&"object"==typeof e?e:{handle:e};class A{handler;match;method;catchHandler;constructor(e,t,a="GET"){this.handler=M(t),this.match=e,this.method=a}setCatchHandler(e){this.catchHandler=M(e)}}class W extends A{_allowlist;_denylist;constructor(e,{allowlist:t=[/./],denylist:a=[]}={}){super(e=>this._match(e),e),this._allowlist=t,this._denylist=a}_match({url:e,request:t}){if(t&&"navigate"!==t.mode)return!1;let a=e.pathname+e.search;for(let e of this._denylist)if(e.test(a))return!1;return!!this._allowlist.some(e=>e.test(a))}}let j=(e,t=[])=>{for(let a of[...e.searchParams.keys()])t.some(e=>e.test(a))&&e.searchParams.delete(a);return e};class H extends A{constructor(e,t,a){super(({url:t})=>{let a=e.exec(t.href);if(a)return t.origin!==location.origin&&0!==a.index?void 0:a.slice(1)},t,a)}}let $=async(e,t,a)=>{let r=t.map((e,t)=>({index:t,item:e})),s=async e=>{let t=[];for(;;){let s=r.pop();if(!s)return e(t);let n=await a(s.item);t.push({result:n,index:s.index})}},n=Array.from({length:e},()=>new Promise(s));return(await Promise.all(n)).flat().sort((e,t)=>e.index<t.index?-1:1).map(e=>e.result)},G=()=>{self.__WB_DISABLE_DEV_LOGS=!0};function V(e){return"string"==typeof e?new Request(e):e}class Q{event;request;url;params;_cacheKeys={};_strategy;_handlerDeferred;_extendLifetimePromises;_plugins;_pluginStateMap;constructor(e,t){for(let a of(this.event=t.event,this.request=t.request,t.url&&(this.url=t.url,this.params=t.params),this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(a,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,a=V(e),r=await this.getPreloadResponse();if(r)return r;let s=this.hasCallback("fetchDidFail")?a.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:t})}catch(e){if(e instanceof Error)throw new n("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let i=a.clone();try{let e;for(let r of(e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await r({event:t,request:i,response:e});return e}catch(e){throw s&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:s.clone(),request:i.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),a=t.clone();return this.waitUntil(this.cachePut(e,a)),t}async cacheMatch(e){let t,a=V(e),{cacheName:r,matchOptions:s}=this._strategy,n=await this.getCacheKey(a,"read"),i={...s,cacheName:r};for(let e of(t=await caches.match(n,i),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:r,matchOptions:s,cachedResponse:t,request:n,event:this.event})||void 0;return t}async cachePut(e,t){let a=V(e);await w(0);let r=await this.getCacheKey(a,"write");if(!t)throw new n("cache-put-with-no-response",{url:i(r.url)});let s=await this._ensureResponseSafeToCache(t);if(!s)return!1;let{cacheName:l,matchOptions:o}=this._strategy,c=await self.caches.open(l),h=this.hasCallback("cacheDidUpdate"),u=h?await f(c,r.clone(),["__WB_REVISION__"],o):null;try{await c.put(r,h?s.clone():s)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await p(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:l,oldResponse:u,newResponse:s.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){let a=`${e.url} | ${t}`;if(!this._cacheKeys[a]){let r=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))r=V(await e({mode:t,request:r,event:this.event,params:this.params}));this._cacheKeys[a]=r}return this._cacheKeys[a]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let a of this.iterateCallbacks(e))await a(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let a=this._pluginStateMap.get(t),r=r=>{let s={...r,state:a};return t[e](s)};yield r}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async getPreloadResponse(){if(this.event instanceof FetchEvent&&"navigate"===this.event.request.mode&&"preloadResponse"in this.event)try{let e=await this.event.preloadResponse;if(e)return e}catch(e){}}async _ensureResponseSafeToCache(e){let t=e,a=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,a=!0,!t)break;return!a&&t&&200!==t.status&&(t=void 0),t}}class z{cacheName;plugins;fetchOptions;matchOptions;constructor(e={}){this.cacheName=h.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,a="string"==typeof e.request?new Request(e.request):e.request,r=new Q(this,e.url?{event:t,request:a,url:e.url,params:e.params}:{event:t,request:a}),s=this._getResponse(r,a,t),n=this._awaitComplete(s,r,a,t);return[s,n]}async _getResponse(e,t,a){let r;await e.runCallbacks("handlerWillStart",{event:a,request:t});try{if(r=await this._handle(t,e),void 0===r||"error"===r.type)throw new n("no-response",{url:t.url})}catch(s){if(s instanceof Error){for(let n of e.iterateCallbacks("handlerDidError"))if(void 0!==(r=await n({error:s,event:a,request:t})))break}if(!r)throw s}for(let s of e.iterateCallbacks("handlerWillRespond"))r=await s({event:a,request:t,response:r});return r}async _awaitComplete(e,t,a,r){let s,n;try{s=await e}catch(e){}try{await t.runCallbacks("handlerDidRespond",{event:r,request:a,response:s}),await t.doneWaiting()}catch(e){e instanceof Error&&(n=e)}if(await t.runCallbacks("handlerDidComplete",{event:r,request:a,response:s,error:n}),t.destroy(),n)throw n}}let J={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class X extends z{_networkTimeoutSeconds;constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(J),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,r=[],s=[];if(this._networkTimeoutSeconds){let{id:n,promise:i}=this._getTimeoutPromise({request:e,logs:r,handler:t});a=n,s.push(i)}let i=this._getNetworkPromise({timeoutId:a,request:e,logs:r,handler:t});s.push(i);let l=await t.waitUntil((async()=>await t.waitUntil(Promise.race(s))||await i)());if(!l)throw new n("no-response",{url:e.url});return l}_getTimeoutPromise({request:e,logs:t,handler:a}){let r;return{promise:new Promise(t=>{r=setTimeout(async()=>{t(await a.cacheMatch(e))},1e3*this._networkTimeoutSeconds)}),id:r}}async _getNetworkPromise({timeoutId:e,request:t,logs:a,handler:r}){let s,n;try{n=await r.fetchAndCachePut(t)}catch(e){e instanceof Error&&(s=e)}return e&&clearTimeout(e),(s||!n)&&(n=await r.cacheMatch(t)),n}}class Y extends z{_networkTimeoutSeconds;constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,r;try{let r=[t.fetch(e)];if(this._networkTimeoutSeconds){let e=w(1e3*this._networkTimeoutSeconds);r.push(e)}if(!(a=await Promise.race(r)))throw Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`)}catch(e){e instanceof Error&&(r=e)}if(!a)throw new n("no-response",{url:e.url,error:r});return a}}let Z="requests",ee="queueName";class et{_db=null;async addEntry(e){let t=(await this.getDb()).transaction(Z,"readwrite",{durability:"relaxed"});await t.store.add(e),await t.done}async getFirstEntryId(){let e=await this.getDb(),t=await e.transaction(Z).store.openCursor();return t?.value.id}async getAllEntriesByQueueName(e){let t=await this.getDb();return await t.getAllFromIndex(Z,ee,IDBKeyRange.only(e))||[]}async getEntryCountByQueueName(e){return(await this.getDb()).countFromIndex(Z,ee,IDBKeyRange.only(e))}async deleteEntry(e){let t=await this.getDb();await t.delete(Z,e)}async getFirstEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"next")}async getLastEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"prev")}async getEndEntryFromIndex(e,t){let a=await this.getDb(),r=await a.transaction(Z).store.index(ee).openCursor(e,t);return r?.value}async getDb(){return this._db||(this._db=await function(e,t,{blocked:a,upgrade:r,blocking:s,terminated:n}={}){let i=indexedDB.open(e,3),l=D(i);return r&&i.addEventListener("upgradeneeded",e=>{r(D(i.result),e.oldVersion,e.newVersion,D(i.transaction),e)}),a&&i.addEventListener("blocked",e=>a(e.oldVersion,e.newVersion,e)),l.then(e=>{n&&e.addEventListener("close",()=>n()),s&&e.addEventListener("versionchange",e=>s(e.oldVersion,e.newVersion,e))}).catch(()=>{}),l}("serwist-background-sync",0,{upgrade:this._upgradeDb})),this._db}_upgradeDb(e,t){t>0&&t<3&&e.objectStoreNames.contains(Z)&&e.deleteObjectStore(Z),e.createObjectStore(Z,{autoIncrement:!0,keyPath:"id"}).createIndex(ee,ee,{unique:!1})}}class ea{_queueName;_queueDb;constructor(e){this._queueName=e,this._queueDb=new et}async pushEntry(e){delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async unshiftEntry(e){let t=await this._queueDb.getFirstEntryId();t?e.id=t-1:delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async popEntry(){return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName))}async shiftEntry(){return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName))}async getAll(){return await this._queueDb.getAllEntriesByQueueName(this._queueName)}async size(){return await this._queueDb.getEntryCountByQueueName(this._queueName)}async deleteEntry(e){await this._queueDb.deleteEntry(e)}async _removeEntry(e){return e&&await this.deleteEntry(e.id),e}}let er=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];class es{_requestData;static async fromRequest(e){let t={url:e.url,headers:{}};for(let a of("GET"!==e.method&&(t.body=await e.clone().arrayBuffer()),e.headers.forEach((e,a)=>{t.headers[a]=e}),er))void 0!==e[a]&&(t[a]=e[a]);return new es(t)}constructor(e){"navigate"===e.mode&&(e.mode="same-origin"),this._requestData=e}toObject(){let e=Object.assign({},this._requestData);return e.headers=Object.assign({},this._requestData.headers),e.body&&(e.body=e.body.slice(0)),e}toRequest(){return new Request(this._requestData.url,this._requestData)}clone(){return new es(this.toObject())}}let en="serwist-background-sync",ei=new Set,el=e=>{let t={request:new es(e.requestData).toRequest(),timestamp:e.timestamp};return e.metadata&&(t.metadata=e.metadata),t};class eo{_name;_onSync;_maxRetentionTime;_queueStore;_forceSyncFallback;_syncInProgress=!1;_requestsAddedDuringSync=!1;constructor(e,{forceSyncFallback:t,onSync:a,maxRetentionTime:r}={}){if(ei.has(e))throw new n("duplicate-queue-name",{name:e});ei.add(e),this._name=e,this._onSync=a||this.replayRequests,this._maxRetentionTime=r||10080,this._forceSyncFallback=!!t,this._queueStore=new ea(this._name),this._addSyncListener()}get name(){return this._name}async pushRequest(e){await this._addRequest(e,"push")}async unshiftRequest(e){await this._addRequest(e,"unshift")}async popRequest(){return this._removeRequest("pop")}async shiftRequest(){return this._removeRequest("shift")}async getAll(){let e=await this._queueStore.getAll(),t=Date.now(),a=[];for(let r of e){let e=60*this._maxRetentionTime*1e3;t-r.timestamp>e?await this._queueStore.deleteEntry(r.id):a.push(el(r))}return a}async size(){return await this._queueStore.size()}async _addRequest({request:e,metadata:t,timestamp:a=Date.now()},r){let s={requestData:(await es.fromRequest(e.clone())).toObject(),timestamp:a};switch(t&&(s.metadata=t),r){case"push":await this._queueStore.pushEntry(s);break;case"unshift":await this._queueStore.unshiftEntry(s)}this._syncInProgress?this._requestsAddedDuringSync=!0:await this.registerSync()}async _removeRequest(e){let t,a=Date.now();switch(e){case"pop":t=await this._queueStore.popEntry();break;case"shift":t=await this._queueStore.shiftEntry()}if(t){let r=60*this._maxRetentionTime*1e3;return a-t.timestamp>r?this._removeRequest(e):el(t)}}async replayRequests(){let e;for(;e=await this.shiftRequest();)try{await fetch(e.request.clone())}catch(t){throw await this.unshiftRequest(e),new n("queue-replay-failed",{name:this._name})}}async registerSync(){if("sync"in self.registration&&!this._forceSyncFallback)try{await self.registration.sync.register(`${en}:${this._name}`)}catch(e){}}_addSyncListener(){"sync"in self.registration&&!this._forceSyncFallback?self.addEventListener("sync",e=>{if(e.tag===`${en}:${this._name}`){let t=async()=>{let t;this._syncInProgress=!0;try{await this._onSync({queue:this})}catch(e){if(e instanceof Error)throw e}finally{this._requestsAddedDuringSync&&!(t&&!e.lastChance)&&await this.registerSync(),this._syncInProgress=!1,this._requestsAddedDuringSync=!1}};e.waitUntil(t())}}):this._onSync({queue:this})}static get _queueNames(){return ei}}class ec{_queue;constructor(e,t){this._queue=new eo(e,t)}async fetchDidFail({request:e}){await this._queue.pushRequest({request:e})}}let eh=async(e,a)=>{let r=null;if(e.url&&(r=new URL(e.url).origin),r!==self.location.origin)throw new n("cross-origin-copy-response",{origin:r});let s=e.clone(),i={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},l=a?a(i):i,o=!function(){if(void 0===t){let e=new Response("");if("body"in e)try{new Response(e.body),t=!0}catch(e){t=!1}t=!1}return t}()?await s.blob():s.body;return new Response(o,l)};class eu extends z{_fallbackToNetwork;static defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e};static copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await eh(e):e};constructor(e={}){e.cacheName=h.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(eu.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){let a=await t.getPreloadResponse();if(a)return a;let r=await t.cacheMatch(e);return r||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let a,r=t.params||{};if(this._fallbackToNetwork){let s=r.integrity,n=e.integrity,i=!n||n===s;a=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?n||s:void 0})),s&&i&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,a.clone()))}else throw new n("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return a}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let a=await t.fetch(e);if(!await t.cachePut(e,a.clone()))throw new n("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(let[a,r]of this.plugins.entries())r!==eu.copyRedirectedCacheableResponsesPlugin&&(r===eu.defaultPrecacheCacheabilityPlugin&&(e=a),r.cacheWillUpdate&&t++);0===t?this.plugins.push(eu.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}let ed=()=>!!self.registration?.navigationPreload,ef=e=>{ed()&&self.addEventListener("activate",t=>{t.waitUntil(self.registration.navigationPreload.enable().then(()=>{e&&self.registration.navigationPreload.setHeaderValue(e)}))})},ey=e=>{h.updateDetails(e)};class ep{updatedURLs=[];notUpdatedURLs=[];handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)};cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:a})=>{if("install"===e.type&&t?.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;a?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return a}}let ew=e=>{if(!e)throw new n("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:a}=e;if(!a)throw new n("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}let r=new URL(a,location.href),s=new URL(a,location.href);return r.searchParams.set("__WB_REVISION__",t),{cacheKey:r.href,url:s.href}},eg=(e,t,a)=>{if("string"==typeof e){let r=new URL(e,location.href);return new A(({url:e})=>e.href===r.href,t,a)}if(e instanceof RegExp)return new H(e,t,a);if("function"==typeof e)return new A(e,t,a);if(e instanceof A)return e;throw new n("unsupported-route-type",{moduleName:"serwist",funcName:"parseRoute",paramName:"capture"})};class em extends A{constructor(e,t){super(({request:a})=>{let r=e.getUrlsToPrecacheKeys();for(let s of function*(e,{directoryIndex:t="index.html",ignoreURLParametersMatching:a=[/^utm_/,/^fbclid$/],cleanURLs:r=!0,urlManipulation:s}={}){let n=new URL(e,location.href);n.hash="",yield n.href;let i=j(n,a);if(yield i.href,t&&i.pathname.endsWith("/")){let e=new URL(i.href);e.pathname+=t,yield e.href}if(r){let e=new URL(i.href);e.pathname+=".html",yield e.href}if(s)for(let e of s({url:n}))yield e.href}(a.url,t)){let t=r.get(s);if(t){let a=e.getIntegrityForPrecacheKey(t);return{cacheKey:t,integrity:a}}}},e.precacheStrategy)}}let e_="www.google-analytics.com",eb="www.googletagmanager.com",ev=/^\/(\w+\/)?collect/,eq=e=>async({queue:t})=>{let a;for(;a=await t.shiftRequest();){let{request:r,timestamp:s}=a,n=new URL(r.url);try{let t="POST"===r.method?new URLSearchParams(await r.clone().text()):n.searchParams,a=s-(Number(t.get("qt"))||0),i=Date.now()-a;if(t.set("qt",String(i)),e.parameterOverrides)for(let a of Object.keys(e.parameterOverrides)){let r=e.parameterOverrides[a];t.set(a,r)}"function"==typeof e.hitFilter&&e.hitFilter.call(null,t),await fetch(new Request(n.origin+n.pathname,{body:t.toString(),method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain"}}))}catch(e){throw await t.unshiftRequest(a),e}}},eR=e=>{let t=({url:e})=>e.hostname===e_&&ev.test(e.pathname),a=new Y({plugins:[e]});return[new A(t,a,"GET"),new A(t,a,"POST")]},eE=e=>new A(({url:e})=>e.hostname===e_&&"/analytics.js"===e.pathname,new X({cacheName:e}),"GET"),eP=e=>new A(({url:e})=>e.hostname===eb&&"/gtag/js"===e.pathname,new X({cacheName:e}),"GET"),eS=e=>new A(({url:e})=>e.hostname===eb&&"/gtm.js"===e.pathname,new X({cacheName:e}),"GET"),eD=({serwist:e,cacheName:t,...a})=>{let r=h.getGoogleAnalyticsName(t),s=new ec("serwist-google-analytics",{maxRetentionTime:2880,onSync:eq(a)});for(let t of[eS(r),eE(r),eP(r),...eR(s)])e.registerRoute(t)};class ek{_fallbackUrls;_serwist;constructor({fallbackUrls:e,serwist:t}){this._fallbackUrls=e,this._serwist=t}async handlerDidError(e){for(let t of this._fallbackUrls)if("string"==typeof t){let e=await this._serwist.matchPrecache(t);if(void 0!==e)return e}else if(t.matcher(e)){let e=await this._serwist.matchPrecache(t.url);if(void 0!==e)return e}}}class eC{_precacheController;constructor({precacheController:e}){this._precacheController=e}cacheKeyWillBeUsed=async({request:e,params:t})=>{let a=t?.cacheKey||this._precacheController.getPrecacheKeyForUrl(e.url);return a?new Request(a,{headers:e.headers}):e}}let eT=(e,t={})=>{let{cacheName:a,plugins:r=[],fetchOptions:s,matchOptions:n,fallbackToNetwork:i,directoryIndex:l,ignoreURLParametersMatching:o,cleanURLs:c,urlManipulation:u,cleanupOutdatedCaches:d,concurrency:f=10,navigateFallback:y,navigateFallbackAllowlist:p,navigateFallbackDenylist:w}=t??{};return{precacheStrategyOptions:{cacheName:h.getPrecacheName(a),plugins:[...r,new eC({precacheController:e})],fetchOptions:s,matchOptions:n,fallbackToNetwork:i},precacheRouteOptions:{directoryIndex:l,ignoreURLParametersMatching:o,cleanURLs:c,urlManipulation:u},precacheMiscOptions:{cleanupOutdatedCaches:d,concurrency:f,navigateFallback:y,navigateFallbackAllowlist:p,navigateFallbackDenylist:w}}};class eI{_urlsToCacheKeys=new Map;_urlsToCacheModes=new Map;_cacheKeysToIntegrities=new Map;_concurrentPrecaching;_precacheStrategy;_routes;_defaultHandlerMap;_catchHandler;constructor({precacheEntries:e,precacheOptions:t,skipWaiting:a=!1,importScripts:r,navigationPreload:s=!1,cacheId:n,clientsClaim:i=!1,runtimeCaching:l,offlineAnalyticsConfig:o,disableDevLogs:c=!1,fallbacks:h}={}){let{precacheStrategyOptions:u,precacheRouteOptions:d,precacheMiscOptions:f}=eT(this,t);if(this._concurrentPrecaching=f.concurrency,this._precacheStrategy=new eu(u),this._routes=new Map,this._defaultHandlerMap=new Map,this.handleInstall=this.handleInstall.bind(this),this.handleActivate=this.handleActivate.bind(this),this.handleFetch=this.handleFetch.bind(this),this.handleCache=this.handleCache.bind(this),r&&r.length>0&&self.importScripts(...r),s&&ef(),void 0!==n&&ey({prefix:n}),a?self.skipWaiting():self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),i&&b(),e&&e.length>0&&this.addToPrecacheList(e),f.cleanupOutdatedCaches&&_(u.cacheName),this.registerRoute(new em(this,d)),f.navigateFallback&&this.registerRoute(new W(this.createHandlerBoundToUrl(f.navigateFallback),{allowlist:f.navigateFallbackAllowlist,denylist:f.navigateFallbackDenylist})),void 0!==o&&("boolean"==typeof o?o&&eD({serwist:this}):eD({...o,serwist:this})),void 0!==l){if(void 0!==h){let e=new ek({fallbackUrls:h.entries,serwist:this});l.forEach(t=>{t.handler instanceof z&&!t.handler.plugins.some(e=>"handlerDidError"in e)&&t.handler.plugins.push(e)})}for(let e of l)this.registerCapture(e.matcher,e.handler,e.method)}c&&G()}get precacheStrategy(){return this._precacheStrategy}get routes(){return this._routes}addEventListeners(){self.addEventListener("install",this.handleInstall),self.addEventListener("activate",this.handleActivate),self.addEventListener("fetch",this.handleFetch),self.addEventListener("message",this.handleCache)}addToPrecacheList(e){let t=[];for(let a of e){"string"==typeof a?t.push(a):a&&!a.integrity&&void 0===a.revision&&t.push(a.url);let{cacheKey:e,url:r}=ew(a),s="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(r)&&this._urlsToCacheKeys.get(r)!==e)throw new n("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(r),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new n("add-to-cache-list-conflicting-integrities",{url:r});this._cacheKeysToIntegrities.set(e,a.integrity)}this._urlsToCacheKeys.set(r,e),this._urlsToCacheModes.set(r,s),t.length>0&&console.warn(`Serwist is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`)}}handleInstall(e){return v(e,async()=>{let t=new ep;this.precacheStrategy.plugins.push(t),await $(this._concurrentPrecaching,Array.from(this._urlsToCacheKeys.entries()),async([t,a])=>{let r=this._cacheKeysToIntegrities.get(a),s=this._urlsToCacheModes.get(t),n=new Request(t,{integrity:r,cache:s,credentials:"same-origin"});await Promise.all(this.precacheStrategy.handleAll({event:e,request:n,url:new URL(n.url),params:{cacheKey:a}}))});let{updatedURLs:a,notUpdatedURLs:r}=t;return{updatedURLs:a,notUpdatedURLs:r}})}handleActivate(e){return v(e,async()=>{let e=await self.caches.open(this.precacheStrategy.cacheName),t=await e.keys(),a=new Set(this._urlsToCacheKeys.values()),r=[];for(let s of t)a.has(s.url)||(await e.delete(s),r.push(s.url));return{deletedCacheRequests:r}})}handleFetch(e){let{request:t}=e,a=this.handleRequest({request:t,event:e});a&&e.respondWith(a)}handleCache(e){if(e.data&&"CACHE_URLS"===e.data.type){let{payload:t}=e.data,a=Promise.all(t.urlsToCache.map(t=>{let a;return a="string"==typeof t?new Request(t):new Request(...t),this.handleRequest({request:a,event:e})}));e.waitUntil(a),e.ports?.[0]&&a.then(()=>e.ports[0].postMessage(!0))}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,M(e))}setCatchHandler(e){this._catchHandler=M(e)}registerCapture(e,t,a){let r=eg(e,t,a);return this.registerRoute(r),r}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new n("unregister-route-but-not-found-with-method",{method:e.method});let t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new n("unregister-route-route-not-registered")}getUrlsToPrecacheKeys(){return this._urlsToCacheKeys}getPrecachedUrls(){return[...this._urlsToCacheKeys.keys()]}getPrecacheKeyForUrl(e){let t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForPrecacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,a=this.getPrecacheKeyForUrl(t);if(a)return(await self.caches.open(this.precacheStrategy.cacheName)).match(a)}createHandlerBoundToUrl(e){let t=this.getPrecacheKeyForUrl(e);if(!t)throw new n("non-precached-url",{url:e});return a=>(a.request=new Request(e),a.params={cacheKey:t,...a.params},this.precacheStrategy.handle(a))}handleRequest({request:e,event:t}){let a,r=new URL(e.url,location.href);if(!r.protocol.startsWith("http"))return;let s=r.origin===location.origin,{params:n,route:i}=this.findMatchingRoute({event:t,request:e,sameOrigin:s,url:r}),l=i?.handler,o=e.method;if(!l&&this._defaultHandlerMap.has(o)&&(l=this._defaultHandlerMap.get(o)),!l)return;try{a=l.handle({url:r,request:e,event:t,params:n})}catch(e){a=Promise.reject(e)}let c=i?.catchHandler;return a instanceof Promise&&(this._catchHandler||c)&&(a=a.catch(async a=>{if(c)try{return await c.handle({url:r,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:r,request:e,event:t});throw a})),a}findMatchingRoute({url:e,sameOrigin:t,request:a,event:r}){for(let s of this._routes.get(a.method)||[]){let n,i=s.match({url:e,sameOrigin:t,request:a,event:r});if(i)return Array.isArray(n=i)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length?n=void 0:"boolean"==typeof i&&(n=void 0),{route:s,params:n}}return{}}}"undefined"!=typeof navigator&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent),new eI({precacheEntries:null!=(e=[{'revision':null,'url':'/_next/static/chunks/167.53e9bcda88e7c191.js'},{'revision':null,'url':'/_next/static/chunks/328-726322d8f47f6422.js'},{'revision':null,'url':'/_next/static/chunks/87-e1db2671c0390488.js'},{'revision':null,'url':'/_next/static/chunks/874.2a0adc1739427a7a.js'},{'revision':null,'url':'/_next/static/chunks/a82cbd8b-24568bb38b70bc09.js'},{'revision':null,'url':'/_next/static/chunks/app/_not-found/page-f62ef32696975708.js'},{'revision':null,'url':'/_next/static/chunks/app/layout-dfe0fcc87084544d.js'},{'revision':null,'url':'/_next/static/chunks/app/page-fa6a6bfc66579893.js'},{'revision':null,'url':'/_next/static/chunks/framework-3842b71f46c210e0.js'},{'revision':null,'url':'/_next/static/chunks/main-90fd66e765377cf9.js'},{'revision':null,'url':'/_next/static/chunks/main-app-1330ea5dfed6be90.js'},{'revision':null,'url':'/_next/static/chunks/pages/_app-bb489e26258b66dc.js'},{'revision':null,'url':'/_next/static/chunks/pages/_error-e9a43724ef2aecb3.js'},{'revision':'846118c33b2c0e922d7b3a7676f81f6f','url':'/_next/static/chunks/polyfills-42372ed130431b0a.js'},{'revision':null,'url':'/_next/static/chunks/webpack-ad401ab270b3fc7d.js'},{'revision':null,'url':'/_next/static/css/5cb5d730cdfd4ccd.css'},{'revision':'a19fcdc726286f62f19e1cbef191caaf','url':'/_next/static/hx9GondfXfrIbShSUlWEn/_buildManifest.js'},{'revision':'b6652df95db52feb4daf4eca35380933','url':'/_next/static/hx9GondfXfrIbShSUlWEn/_ssgManifest.js'},{'revision':'ef6cefb32024deac234e82f932a95cbd','url':'/_next/static/media/569ce4b8f30dc480-s.p.woff2'},{'revision':'a0761690ccf4441ace5cec893b82d4ab','url':'/_next/static/media/747892c23ea88013-s.woff2'},{'revision':'da83d5f06d825c5ae65b7cca706cb312','url':'/_next/static/media/93f479601ee12b01-s.p.woff2'},{'revision':'8ea4f719af3312a055caf09f34c89a77','url':'/_next/static/media/ba015fad6dcf6784-s.woff2'},{'revision':'d09f95206c3fa0bb9bd9fefabfd0ea71','url':'/file.svg'},{'revision':'2aaafa6a49b6563925fe440891e32717','url':'/globe.svg'},{'revision':'8e061864f388b47f33a1c3780831193e','url':'/next.svg'},{'revision':'c0af2f507b369b085b35ef4bbe3bcf1e','url':'/vercel.svg'},{'revision':'a2760511c65806022ad20adf74370ff3','url':'/window.svg'}])?e:[],skipWaiting:!0,clientsClaim:!0,navigationPreload:!0,fallbacks:{entries:[{url:"/~offline",matcher(e){let{request:t}=e;return"document"===t.destination}}]},runtimeCaching:[{matcher:()=>!0,handler:new X}]}).addEventListeners()})();
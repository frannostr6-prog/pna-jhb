// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
// Hardcoded store lookup — never overwritten by localStorage
// This ensures BT numeric codes always resolve correctly
const STORE_LIST = [
  {name:'New Market',      code:'NM',btNum:'01'},
  {name:'The Glen',        code:'GL',btNum:'02'},
  {name:'Featherbrooke',   code:'FB',btNum:'03'},
  {name:'New Redruth',     code:'NR',btNum:'04'},
  {name:'Greenstone',      code:'GS',btNum:'05'},
  {name:'Horizon',         code:'HZ',btNum:'06'},
  {name:'Bryanston',       code:'BS',btNum:'07'},
  {name:'Heathway',        code:'HW',btNum:'08'},
  {name:'Dainfern',        code:'DF',btNum:'09'},
  {name:'Mall of the South',code:'MS',btNum:'10'},
  {name:'Mall of Africa',  code:'MA',btNum:'11'},
  {name:'Ferndale',        code:'FD',btNum:'12'},
  {name:'Rosebank',        code:'RB',btNum:'13'},
  {name:'Killarney',       code:'KL',btNum:'14'},
  {name:'Hyde Park',       code:'HP',btNum:'15'},
  {name:'Fourways',        code:'FW',btNum:'16'},
  {name:'Cresta',          code:'CT',btNum:'17'},
  {name:'Cradlestone',     code:'CS',btNum:'18'},
  {name:'Bedford',         code:'BF',btNum:'19'},
  {name:'Northgate',       code:'NG',btNum:'20'},
  {name:'Clearwater',      code:'CW',btNum:'21'},
  {name:'Rivonia',         code:'RV',btNum:'22'},
  {name:'East Gate',       code:'EG',btNum:'23'},
  {name:'Linksfield',      code:'LF',btNum:'24'},
  {name:'Sandton Gate',    code:'SG',btNum:'25'},
  {name:'Kyalami',         code:'KM',btNum:'26'},
  {name:'Paper Cuts',      code:'PC',btNum:'32'},
  {name:'E-Commerce',      code:'EC',btNum:'31'},
  {name:'School Packs',    code:'SP',btNum:'33'},
  {name:'Local',           code:'LO',btNum:'34'},
  {name:'Warehouse',       code:'WH',btNum:'35'},
  {name:'DC Johannesburg', code:'DC',btNum:'00'},
  {name:'DC Johannesburg', code:'DC',btNum:'01'}
];

const A = {
  // Auth
  role: null, userName: '', userCode: '', userPin: '',
  loginRole: null, loginName: '',
  pinBuffer: '',
  // Data
  transfers: [],
  drivers: [
    {name:'Driver 1',pin:'1111'},{name:'Driver 2',pin:'2222'},
    {name:'Driver 3',pin:'3333'}
  ],
  stores: [
    {name:'New Market',      code:'NM',btNum:'01',pin:'0001'},
    {name:'The Glen',        code:'GL',btNum:'02',pin:'0002'},
    {name:'Featherbrooke',   code:'FB',btNum:'03',pin:'0003'},
    {name:'New Redruth',     code:'NR',btNum:'04',pin:'0004'},
    {name:'Greenstone',      code:'GS',btNum:'05',pin:'0005'},
    {name:'Horizon',         code:'HZ',btNum:'06',pin:'0006'},
    {name:'Bryanston',       code:'BS',btNum:'07',pin:'0007'},
    {name:'Heathway',        code:'HW',btNum:'08',pin:'0008'},
    {name:'Dainfern',        code:'DF',btNum:'09',pin:'0009'},
    {name:'Mall of the South',code:'MS',btNum:'10',pin:'0010'},
    {name:'Mall of Africa',  code:'MA',btNum:'11',pin:'0011'},
    {name:'Ferndale',        code:'FD',btNum:'12',pin:'0012'},
    {name:'Rosebank',        code:'RB',btNum:'13',pin:'0013'},
    {name:'Killarney',       code:'KL',btNum:'14',pin:'0014'},
    {name:'Hyde Park',       code:'HP',btNum:'15',pin:'0015'},
    {name:'Fourways',        code:'FW',btNum:'16',pin:'0016'},
    {name:'Cresta',          code:'CT',btNum:'17',pin:'0017'},
    {name:'Cradlestone',     code:'CS',btNum:'18',pin:'0018'},
    {name:'Bedford',         code:'BF',btNum:'19',pin:'0019'},
    {name:'Northgate',       code:'NG',btNum:'20',pin:'0020'},
    {name:'Clearwater',      code:'CW',btNum:'21',pin:'0021'},
    {name:'Rivonia',         code:'RV',btNum:'22',pin:'0022'},
    {name:'East Gate',       code:'EG',btNum:'23',pin:'0023'},
    {name:'Linksfield',      code:'LF',btNum:'24',pin:'0024'},
    {name:'Sandton Gate',    code:'SG',btNum:'25',pin:'0025'},
    {name:'Kyalami',         code:'KM',btNum:'26',pin:'0026'},
    {name:'Paper Cuts',      code:'PC',btNum:'32',pin:'0032'},
    {name:'E-Commerce',      code:'EC',btNum:'31',pin:'0031'},
    {name:'School Packs',    code:'SP',btNum:'33',pin:'0033'},
    {name:'Local',           code:'LO',btNum:'34',pin:'0034'},
    {name:'Warehouse',       code:'WH',btNum:'35',pin:'0035'}
  ],
  routes: [
    {name:'NORTH',stores:['BS','DF','FW','NG']},
    {name:'SOUTH',stores:['MS','GL','CS','CW']},
    {name:'EAST', stores:['GS','EG','LF','NR']},
    {name:'WEST', stores:['HZ','FB','BF','KM']},
    {name:'CENTRAL',stores:['RB','KL','HP','RV','SG','MA']}
  ],
  mgmtPin: '9999',
  dcPin: '8888',
  // Driver session
  driverRoute: null,
  loadedBoxes: [],
  routeStarted: false,
  currentStop: null,
  scanoutBoxes: [],
  returnBoxes: [],
  // Override PINs
  overridePins: [],
  overridePinBuffer: '',
  // Misc
  offlineQueue: [],
  fbReady: false,
  fbUnsub: null,
  tFilter: 'all',
  signCtx: null, signDraw: false,
  labels: [],
  stopsDone: [],
  pallets: [],
  nfcVerified: {},  // storeCode -> timestamp of NFC verification
  nfcRequired: false,  // OFF by default — management turns ON when ready
  deviceRole: null   // locked role for this device — null means show all roles
};

// ════════════════════════════════════════
// PERSISTENCE
// ════════════════════════════════════════
function ld(){
  try{
    const s=JSON.parse(localStorage.getItem('pnajhb4')||'{}');
    ['transfers','drivers','stores','routes','overridePins','offlineQueue','labels','pallets'].forEach(k=>{if(s[k])A[k]=s[k];});
    if(s.nfcRequired !== undefined) A.nfcRequired = (s.nfcRequired === true || s.nfcRequired === 'true');
    if(s.deviceRole) A.deviceRole = s.deviceRole;
    // nfcVerified is session-only — don't persist across logins
    if(s.mgmtPin)A.mgmtPin=s.mgmtPin;
    if(s.dcPin)A.dcPin=s.dcPin;
    // Restore session if one was active
    if(s.session&&s.session.role){
      A.role=s.session.role;
      A.userName=s.session.userName||'';
      A.userCode=s.session.userCode||'';
      A.driverRoute=s.session.driverRoute||null;
      A.loadedBoxes=s.session.loadedBoxes||[];
      A.routeStarted=s.session.routeStarted||false;
      A.currentStop=s.session.currentStop||null;
      A.scanoutBoxes=s.session.scanoutBoxes||[];
      A.stopExpected=s.session.stopExpected||[];
      A.stopsDone=s.session.stopsDone||[];
      // Don't restore nfcVerified from old sessions — must re-verify each login
      A.nfcVerified = {};
      if(s.session.nfcRequired!==undefined)A.nfcRequired=s.session.nfcRequired;
      A.returnBoxes=s.session.returnBoxes||[];
      A._sessionRestored=true;
    }
  }catch(e){}
}
function sv(){
  try{localStorage.setItem('pnajhb4',JSON.stringify({
    transfers:A.transfers,drivers:A.drivers,stores:A.stores,labels:A.labels||[],pallets:A.pallets||[],nfcRequired:A.nfcRequired===true,nfcVerified:A.nfcVerified||{},deviceRole:A.deviceRole||null,
    routes:A.routes,overridePins:A.overridePins,offlineQueue:A.offlineQueue,
    mgmtPin:A.mgmtPin,dcPin:A.dcPin,
    // Session state — survives browser close
    session:{
      role:A.role, userName:A.userName, userCode:A.userCode,
      driverRoute:A.driverRoute,
      loadedBoxes:A.loadedBoxes,
      routeStarted:A.routeStarted,
      currentStop:A.currentStop,
      scanoutBoxes:A.scanoutBoxes,
      stopExpected:A.stopExpected||[],
      stopsDone:A.stopsDone||[],
      nfcVerified:A.nfcVerified||{},
      nfcRequired:A.nfcRequired===true||A.nfcRequired==='true',
      returnBoxes:A.returnBoxes
    }
  }));}catch(e){}
}
ld();

// ── Auto-resume session if one was saved ──
// This runs after DOM is ready
window.addEventListener('DOMContentLoaded', function(){
  checkForSavedSession();
});

// ── Migration: if stored stores don't have btNum, reset to defaults ──
(function migrate(){
  const hasBtNum = A.stores.every(s => s.btNum);
  // Also check if new locations (E-Commerce, Warehouse etc) are present
  const hasNewLocations = A.stores.some(s => s.code === 'EC' || s.code === 'WH');
  if(!hasBtNum || !hasNewLocations){
    // Reset stores to defaults so all locations are loaded fresh
    const saved = JSON.parse(localStorage.getItem('pnajhb4')||'{}');
    delete saved.stores;
    localStorage.setItem('pnajhb4', JSON.stringify(saved));
    location.reload();
  }
})();

// ════════════════════════════════════════
// FIREBASE
// ════════════════════════════════════════
document.addEventListener('fbReady',()=>{
  A.fbReady=true;
  setFbStatus('✅ Connected — live sync active','var(--grn)');
  syncQ();
  A.fbUnsub=window._fb.listen('transfers',docs=>{
    docs.forEach(fd=>{
      const i=A.transfers.findIndex(t=>t.id===fd.id);
      if(i>=0)A.transfers[i]={...A.transfers[i],...fd};
      else A.transfers.unshift(fd);
    });
    sv();
    refreshCurrentView();
  });
  // Listen to pallets
  window._fb.listen('pallets',docs=>{
    docs.forEach(fd=>{
      if(!A.pallets) A.pallets=[];
      const i=A.pallets.findIndex(p=>p.id===fd.id);
      if(i>=0)A.pallets[i]={...A.pallets[i],...fd};
      else A.pallets.push(fd);
    });
    sv();
  });
  // Listen to config — syncs drivers, stores, routes across all devices
  window._fb.listen('config',docs=>{
    const cfg = docs.find(d=>d.id==='config');
    if(!cfg) return;
    // Always apply config from Firebase — it is the source of truth
    // Use savedAt to ensure we don't apply stale config over a newer local one
    const cfgTime = cfg.savedAt ? new Date(cfg.savedAt).getTime() : 0;
    const localTime = A._configSavedAt ? new Date(A._configSavedAt).getTime() : 0;
    // Apply if Firebase config is newer OR local has no timestamp
    if(cfgTime >= localTime || !A._configSavedAt){
      let updated = false;
      if(cfg.drivers){ A.drivers = cfg.drivers; updated = true; }
      if(cfg.stores){
        A.stores = cfg.stores;
        // Rebuild STORE_LIST
        cfg.stores.forEach(s=>{
          if(!STORE_LIST.find(x=>x.code===s.code)){
            STORE_LIST.push({name:s.name,code:s.code,btNum:s.btNum});
          } else {
            const idx = STORE_LIST.findIndex(x=>x.code===s.code);
            if(idx>=0){ STORE_LIST[idx].name=s.name; STORE_LIST[idx].btNum=s.btNum; }
          }
        });
        updated = true;
      }
      if(cfg.routes){ A.routes = cfg.routes; updated = true; }
      if(cfg.nfcRequired !== undefined){ A.nfcRequired = cfg.nfcRequired===true; updated = true; }
      if(cfg.mgmtPin){ A.mgmtPin = cfg.mgmtPin; updated = true; }
      if(cfg.savedAt){ A._configSavedAt = cfg.savedAt; }
      if(updated){
        sv();
        updateNFCToggleBtn();
        const active = document.querySelector('.view.active');
        if(active?.id === 'view-mgmt-setup') populateMgmtSetup();
        if(active?.id === 'view-driver-route') populateDriverRouteSelect();
        if(active?.id === 'view-store-home') renderStoreView();
        console.log('Config received from Firebase, updated:', cfg.savedAt);
      }
    }
  });

  // Also listen to override PINs so driver gets them in real time
  window._fb.listen('overridePins',docs=>{
    docs.forEach(fd=>{
      const i=A.overridePins.findIndex(p=>p.id===fd.id);
      if(i>=0)A.overridePins[i]={...A.overridePins[i],...fd};
      else A.overridePins.push(fd);
    });
    sv();
  });
});

// Save entire config (drivers, stores, routes, settings) to Firebase
// so all devices stay in sync
async function fbSaveConfig(){
  if(!window._fbReady){
    // Queue for when Firebase connects
    setTimeout(fbSaveConfig, 2000);
    return;
  }
  const config = {
    id: 'config',
    drivers: A.drivers,
    stores: A.stores,
    routes: A.routes,
    mgmtPin: A.mgmtPin||'9999',
    nfcRequired: A.nfcRequired===true,
    savedAt: new Date().toISOString(),
    savedBy: A.userName||'management'
  };
  A._configSavedAt = config.savedAt;
  await fbSave('config','config', config);
  console.log('Config synced to Firebase at', config.savedAt);
}

async function fbSave(col,id,data){
  sv();
  if(A.fbReady&&navigator.onLine){
    setSyncing(true);
    const ok=await window._fb.save(col,id,data);
    setSyncing(false);
    if(!ok)enqueue(col,id,data);
  } else enqueue(col,id,data);
  updateBanner();
}
function enqueue(col,id,data){
  A.offlineQueue=A.offlineQueue.filter(q=>!(q.col===col&&q.id===id));
  A.offlineQueue.push({col,id,data});sv();updateBanner();
}
async function syncQ(){
  if(!A.fbReady||!navigator.onLine||!A.offlineQueue.length)return;
  setSyncing(true);
  const batch=[...A.offlineQueue];let n=0;
  for(const it of batch){const ok=await window._fb.save(it.col,it.id,it.data);if(ok){A.offlineQueue=A.offlineQueue.filter(q=>!(q.col===it.col&&q.id===it.id));n++;}}
  setSyncing(false);sv();updateBanner();
  if(n)sT(`✅ ${n} records synced`,'ok');
}
function setSyncing(on){document.getElementById('odot').className='odot'+(on?' sync':navigator.onLine?'':' off');}
function setFbStatus(m,c){const el=document.getElementById('fbStatusEl');if(el){el.textContent=m;el.style.color=c;}}
function updateBanner(){
  const b=document.getElementById('sbanner'),t=document.getElementById('sbannerTxt');
  if(!b||!t)return;
  if(A.offlineQueue.length>0){b.classList.remove('hide');t.textContent=`⚠ ${A.offlineQueue.length} scan(s) queued — waiting for signal`;}
  else b.classList.add('hide');
  const qs=document.getElementById('queueStatusEl');
  if(qs)qs.textContent=A.offlineQueue.length>0?`⚠ ${A.offlineQueue.length} records pending sync`:'✅ All synced';
}
window.addEventListener('online',()=>{if(A.offlineQueue.length)syncQ();});
window.addEventListener('offline',()=>{document.getElementById('odot').className='odot off';});

// ════════════════════════════════════════
// LOGIN FLOW
// ════════════════════════════════════════
let loginStep=1;

function pickLoginRole(role){
  A.loginRole=role;
  const sel=document.getElementById('loginNameSel');
  const lbl=document.getElementById('loginStep2Label');
  sel.innerHTML='';
  if(role==='driver'){
    lbl.textContent='Select your name';
    A.drivers.forEach(d=>sel.innerHTML+=`<option value="${d.name}">${d.name}</option>`);
  } else if(role==='store'){
    lbl.textContent='Select your store';
    A.stores.forEach(s=>sel.innerHTML+=`<option value="${s.code}">${s.name}</option>`);
  } else if(role==='management'){
    // go straight to PIN
    A.loginName='Management';
    showPinStep();return;
  } else if(role==='dc'){
    A.loginName='DC Operator';
    showPinStep();return;
  }
  document.getElementById('loginStep1').style.display='none';
  document.getElementById('loginStep2').style.display='block';
}
function loginStep2Next(){
  A.loginName=document.getElementById('loginNameSel').value;
  showPinStep();
}
function showPinStep(){
  document.getElementById('loginStep1').style.display='none';
  document.getElementById('loginStep2').style.display='none';
  document.getElementById('loginStep3').style.display='block';
  A.pinBuffer='';updatePinDisplay('pinDisplay');
}
function backToStep1(){document.getElementById('loginStep2').style.display='none';document.getElementById('loginStep1').style.display='block';}
function backToStep2(){document.getElementById('loginStep3').style.display='none';document.getElementById('loginStep2').style.display='block';}

function pinKey(k){if(A.pinBuffer.length>=4)return;A.pinBuffer+=k;updatePinDisplay('pinDisplay');}
function pinDel(){A.pinBuffer=A.pinBuffer.slice(0,-1);updatePinDisplay('pinDisplay');}
function updatePinDisplay(elId){
  const el=document.getElementById(elId);if(!el)return;
  const filled=A.pinBuffer.length;
  el.textContent=['•','•','•','•'].map((d,i)=>i<filled?'•':'_').join(' ');
}
function pinSubmit(){
  const pin=A.pinBuffer;
  const role=A.loginRole;
  let valid=false;let name=A.loginName;let code='';
  if(role==='management'){valid=pin===A.mgmtPin;code='MGMT';}
  else if(role==='dc'){valid=pin===A.dcPin;code='DC';}
  else if(role==='driver'){
    const d=A.drivers.find(x=>x.name===A.loginName&&x.pin===pin);
    if(d){valid=true;code=d.name;}
  } else if(role==='store'){
    const s=A.stores.find(x=>x.code===A.loginName&&x.pin===pin);
    if(s){valid=true;name=s.name;code=s.code;}
  }
  if(!valid){
    document.getElementById('pinDisplay').style.color='var(--red)';
    setTimeout(()=>{document.getElementById('pinDisplay').style.color='var(--acc)';A.pinBuffer='';updatePinDisplay('pinDisplay');},800);
    sT('Incorrect PIN','err');return;
  }
  A.role=role;A.userName=name;A.userCode=code;A.pinBuffer='';
  document.getElementById('uchip').textContent=(role==='driver'?'🚛':role==='store'?'🏪':role==='management'?'📊':'🏭')+' '+name.split(' ')[0];
  // Sign into Firebase Auth silently using role-based email
  // This authenticates the user so Firestore security rules pass
  const fbEmail = code.toLowerCase().replace(/[^a-z0-9]/g,'')+'-pnajhb@pna-jhb.app';
  const fbPass  = 'pnajhb-' + pin + '-' + code.toLowerCase();
  if(window._fb && window._fb.signIn){
    window._fb.signIn(fbEmail, fbPass).then(res=>{
      if(!res.ok) console.warn('Firebase auth warning:', res.err);
    });
  }
  setupAfterLogin();
}
function doLogout(){
  if(A.role&&!confirm('Log out?'))return;
  if(window._fb && window._fb.signOut) window._fb.signOut();
  A.role=null;A.userName='';A.userCode='';A.driverRoute=null;A.loadedBoxes=[];A.routeStarted=false;
  document.getElementById('mainNav').style.display='none';
  document.getElementById('uchip').textContent='LOGIN';
  document.getElementById('loginStep1').style.display='block';
  document.getElementById('loginStep2').style.display='none';
  document.getElementById('loginStep3').style.display='none';
  A.loginRole=null;A.pinBuffer='';
  showView('login');
}

// ════════════════════════════════════════
// POST-LOGIN SETUP
// ════════════════════════════════════════
// ── SESSION RESUME ──
function checkForSavedSession(){
  if(A._sessionRestored && A.role){
    const roleLabel={driver:'🚛 Driver',store:'🏪 Store Mgr',management:'📊 Management',dc:'🏭 DC'}[A.role]||A.role;
    const details = A.role==='driver'
      ? `${roleLabel}: ${A.userName} · Route: ${A.driverRoute?.name||'—'} · ${A.loadedBoxes.length} boxes loaded`
      : `${roleLabel}: ${A.userName}`;
    document.getElementById('resumeDetails').textContent = details;
    document.getElementById('resumeBanner').style.display = 'block';
  }
}

function resumeSession(){
  document.getElementById('resumeBanner').style.display='none';
  const roleLabel={driver:'🚛 Driver',store:'🏪 Store Mgr',management:'📊 Management',dc:'🏭 DC'}[A.role]||A.role;
  document.getElementById('uchip').textContent = roleLabel+' · '+(A.userName||'').split(' ')[0];
  document.getElementById('view-login').style.display='none';
  document.getElementById('mainNav').style.display='flex';
  setupAfterLogin();
  setTimeout(()=>sT('✅ Session restored','ok'),400);
}

function dismissResume(){
  // Clear session state but keep transfers/data
  A.role=null;A.userName='';A.userCode='';
  A.driverRoute=null;A.loadedBoxes=[];A.routeStarted=false;
  A.currentStop=null;A.scanoutBoxes=[];A.returnBoxes=[];
  A._sessionRestored=false;
  document.getElementById('resumeBanner').style.display='none';
  sv();
}

function setupAfterLogin(){
  const nav=document.getElementById('mainNav');
  nav.style.display='flex';
  nav.innerHTML='';
  if(A.role==='driver'){
    nav.innerHTML=`
      <button class="nb" id="nb-route" onclick="gvDriver('route',this)">🗺 Route</button>
      <button class="nb" id="nb-load" onclick="gvDriver('load',this)">📦 Load</button>
      <button class="nb" id="nb-stops" onclick="gvDriver('stops',this)">🚛 Stops</button>
      <button class="nb" id="nb-label" onclick="gvDriver('label',this)">🏷 Labels</button>`;
    populateDriverRouteSelect();
    // If session was restored, go straight back to where driver was
    if(A._sessionRestored && A.driverRoute){
      // Show S2S tab if route was started
      if(A.routeStarted){
        const s2sTab=document.getElementById('nb-s2s');
        if(s2sTab)s2sTab.style.display='flex';
      }
      // Return to correct screen
      if(A.currentStop){
        // Was mid-delivery at a stop
        startScanout(A.currentStop);
        document.getElementById('nb-stops').classList.add('active');
      } else if(A.routeStarted){
        showView('driver-stops');renderStops();
        document.getElementById('nb-stops').classList.add('active');
      } else {
        showView('driver-load');renderLoadedList();updateLoadCtr();
        document.getElementById('nb-load').classList.add('active');
      }
    } else {
      // Fresh session
      A.driverRoute=null;A.loadedBoxes=[];A.routeStarted=false;A.scanoutBoxes=[];A.returnBoxes=[];A.stopsDone=[];selectedStops=[];
      showView('driver-route');
      document.getElementById('nb-route').classList.add('active');
    }
  } else if(A.role==='store'){
    nav.innerHTML=`<button class="nb active" onclick="showView('store-home');renderStoreView()">🏪 My Store</button>`;
    renderStoreView();
    showView('store-home');
  } else if(A.role==='management'){
    nav.innerHTML=`
      <button class="nb active" onclick="gvMgmt('dash',this)">📊 Live</button>
      <button class="nb" onclick="gvMgmt('transfers',this)">📋 Transfers <span class="cnt" id="missCnt" style="display:none">!</span></button>
      <button class="nb" onclick="gvMgmt('reports',this)">📄 Reports</button>
      <button class="nb" onclick="gvMgmt('labels',this)">🏷 Labels</button>
      <button class="nb" onclick="gvMgmt('setup',this)">⚙ Setup</button>`;
    populateMgmtSetup();
    renderDash();
    showView('mgmt-dash');
  } else if(A.role==='dc'){
    nav.innerHTML=`<button class="nb active" onclick="showView('dc-home');showDCTab('pallet',this)">🏭 DC Operator</button>`;
    populateDcView();
    showView('dc-home');
  }
  updateBanner();
  setTimeout(()=>focusScan(),300);
}

function gvDriver(n,el){
  if(n==='load'&&!A.driverRoute){sT('Select a route first','warn');return;}
  if((n==='stops'||n==='s2s')&&!A.routeStarted){sT('Start the route first','warn');return;}
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('active'));
  if(el)el.classList.add('active');
  if(n==='route'){showView('driver-route');populateDriverRouteSelect();renderSelectedStops();}
  else if(n==='load'){showView('driver-load');renderLoadedList();updateLoadCtr();}
  else if(n==='stops'){showView('driver-stops');renderStops();}

  else if(n==='label'){showView('label-gen');initLabelGen();}
  setTimeout(()=>focusScan(),200);
}

function gvMgmt(n,el){
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('active'));
  if(el)el.classList.add('active');
  if(n==='dash'){renderDash();showView('mgmt-dash');}
  else if(n==='transfers'){renderTransfers();showView('mgmt-transfers');}
  else if(n==='reports'){renderReports();showView('mgmt-reports');}
  else if(n==='labels'){renderAllLabels();showView('mgmt-labels');}
  else if(n==='setup'){populateMgmtSetup();showView('mgmt-setup');}
}

function showView(n){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+n)?.classList.add('active');
}
function refreshCurrentView(){
  const active=document.querySelector('.view.active');
  if(!active)return;
  const id=active.id;
  if(id==='view-mgmt-dash')renderDash();
  else if(id==='view-mgmt-transfers')renderTransfers();
  else if(id==='view-mgmt-reports')renderReports();
  else if(id==='view-store-home'){renderStoreView();renderStoreReport();}
  else if(id==='view-driver-stops')renderStops();
}

// ════════════════════════════════════════
// SCAN INPUT SETUP (Hardware Scanner)
// ════════════════════════════════════════
// ════════════════════════════════════════
// HARDWARE SCANNER INPUT
// Dead simple — each input wired directly
// ════════════════════════════════════════

function wireInput(el, fn){
  if(!el || el._wired) return;
  el._wired = true;
  el.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === 'Tab'){
      e.preventDefault();
      const v = el.value.trim().toUpperCase();
      if(v){ el.value = ''; fn(v); setTimeout(()=>el.focus(),80); }
    }
  });
  el.addEventListener('input', () => {
    clearTimeout(el._st);
    el._st = setTimeout(()=>{
      const v = el.value.trim().toUpperCase();
      if(v.length >= 4){ el.value = ''; fn(v); setTimeout(()=>el.focus(),80); }
    }, 300);
  });
}

// Called when navigating to each screen
function setupScanInput(id, cb){
  const el = document.getElementById(id);
  if(!el) return;
  if(el._wired){
    // Already wired — just update the stored callback
    el._scanCb = cb;
    return;
  }
  el._scanCb = cb;
  el._wired = true;
  el.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === 'Tab'){
      e.preventDefault();
      const v = el.value.trim().toUpperCase();
      if(v && el._scanCb){ el.value = ''; el._scanCb(v); setTimeout(()=>el.focus(),80); }
    }
  });
  el.addEventListener('input', () => {
    // Hard 16-char limit — stops double-scan barcodes combining
    if(el.value.length > 16) el.value = el.value.substring(0, 16);
    // Submit immediately at 16 chars — barcode is complete
    if(el.value.trim().length === 16){
      const v = el.value.trim().toUpperCase();
      if(el._scanCb){ el.value = ''; el._scanCb(v); setTimeout(()=>el.focus(),80); }
      return;
    }
    clearTimeout(el._st);
    el._st = setTimeout(()=>{
      const v = el.value.trim().toUpperCase();
      if(v.length >= 4 && el._scanCb){ el.value = ''; el._scanCb(v); setTimeout(()=>el.focus(),80); }
    }, 300);
  });
}

function focusScan(){
  if(document.querySelector('.mov.on')) return;
  const active = document.querySelector('.view.active');
  if(!active) return;
  // Don't steal focus from real text inputs (setup fields, name fields etc)
  const cur = document.activeElement;
  if(cur && cur.tagName === 'INPUT' && !cur.classList.contains('sinput')) return;
  if(cur && (cur.tagName === 'TEXTAREA' || cur.tagName === 'SELECT')) return;
  const inp = active.querySelector('.sinput');
  if(inp) inp.focus();
}

document.addEventListener('click', e => {
  if(['INPUT','SELECT','BUTTON','TEXTAREA','CANVAS'].includes(e.target.tagName)) return;
  if(e.target.closest('.mov')) return;
  setTimeout(focusScan, 50);
});

// Refocus every 2 seconds so scanner always has somewhere to fire into
setInterval(()=>{
  if(!document.querySelector('.mov.on')) focusScan();
}, 2000);

// ════════════════════════════════════════
// DRIVER — ROUTE SELECTION
// ════════════════════════════════════════
// Selected stores for today's custom route
let selectedStops = [];

function populateDriverRouteSelect(){
  // Populate saved route templates dropdown
  const el = document.getElementById('driverRouteSelect');
  if(el) el.innerHTML = `<option value="">— Select a template —</option>` +
    A.routes.map(r=>`<option value="${r.name}">${r.name} — ${r.stores.map(c=>stName(c)).join(', ')}</option>`).join('');
  // Build the store picker grid
  renderStorePickerGrid();
}

function filterStoreList(){
  renderStorePickerGrid();
}

function renderStorePickerGrid(){
  const el = document.getElementById('storePickerGrid');
  if(!el) return;
  const q = (document.getElementById('storeSearchInput')?.value||'').toLowerCase();
  const filtered = A.stores.filter(s => !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  el.innerHTML = filtered.map(s => {
    const isSelected = selectedStops.includes(s.code);
    return `<div onclick="toggleStop('${s.code}')"
      style="padding:9px 8px;border:1.5px solid ${isSelected?'var(--acc)':'var(--bdr)'};
      border-radius:6px;background:${isSelected?'rgba(232,132,26,.1)':'var(--bg)'};
      color:${isSelected?'var(--acc)':'var(--mut)'};font-family:var(--fh);font-size:.68rem;
      letter-spacing:1px;text-transform:uppercase;cursor:pointer;text-align:center;
      transition:all .13s;position:relative">
      ${isSelected?'<span style="position:absolute;top:3px;right:5px;font-size:.6rem">✓</span>':''}
      ${s.name}
    </div>`;
  }).join('');
}

function toggleStop(code){
  const idx = selectedStops.indexOf(code);
  if(idx >= 0) selectedStops.splice(idx, 1);
  else selectedStops.push(code);
  renderStorePickerGrid();
  renderSelectedStops();
}

function renderSelectedStops(){
  const el = document.getElementById('selectedStops');
  const countEl = document.getElementById('stopCount');
  const btn = document.getElementById('confirmRouteBtn');
  if(countEl) countEl.textContent = `(${selectedStops.length} selected)`;
  if(btn) btn.style.display = selectedStops.length > 0 ? 'flex' : 'none';
  if(!el) return;
  if(!selectedStops.length){
    el.innerHTML = '<div style="color:var(--mut);font-size:.75rem;text-align:center;padding:8px">No stores selected yet</div>';
    return;
  }
  el.innerHTML = selectedStops.map((code,i) => `
    <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--bdr)">
      <span style="font-family:var(--fh);font-size:.7rem;color:var(--mut);width:20px">${i+1}</span>
      <span style="flex:1;font-family:var(--fh);font-size:.82rem">${stName(code)}</span>
      <button onclick="moveStop(${i},-1)" style="background:none;border:none;color:var(--mut);cursor:pointer;padding:2px 6px;font-size:.9rem" ${i===0?'disabled':''}>↑</button>
      <button onclick="moveStop(${i},1)" style="background:none;border:none;color:var(--mut);cursor:pointer;padding:2px 6px;font-size:.9rem" ${i===selectedStops.length-1?'disabled':''}>↓</button>
      <button onclick="removeStop(${i})" style="background:none;border:none;color:var(--red);cursor:pointer;padding:2px 8px;font-size:.9rem">✕</button>
    </div>`).join('');
}

function moveStop(i, dir){
  const j = i + dir;
  if(j < 0 || j >= selectedStops.length) return;
  [selectedStops[i], selectedStops[j]] = [selectedStops[j], selectedStops[i]];
  renderSelectedStops();
}

function removeStop(i){
  selectedStops.splice(i, 1);
  renderStorePickerGrid();
  renderSelectedStops();
}

function loadRouteTemplate(){
  const name = document.getElementById('driverRouteSelect').value;
  if(!name) return;
  const route = A.routes.find(r=>r.name===name);
  if(!route) return;
  selectedStops = [...route.stores];
  renderStorePickerGrid();
  renderSelectedStops();
  sT('Template loaded: '+name,'ok');
}

function driverSelectRoute(){
  if(!selectedStops.length){ sT('Select at least one store','err'); return; }
  // Build a custom route object from the selected stops
  A.driverRoute = {
    name: 'CUSTOM — ' + selectedStops.map(c=>stName(c)).join(', '),
    stores: [...selectedStops]
  };
  A.loadedBoxes = [];
  A.expectedBoxes = A.transfers.filter(t=>t.status==='registered'&&selectedStops.includes(t.toStore));
  const stopNames = selectedStops.map(c=>stName(c)).join(' → ');
  sT('Route set: '+selectedStops.length+' stops','ok');
  document.getElementById('loadRouteBanner').textContent = `🗺 ${selectedStops.length} stops: ${stopNames}`;
  gvDriver('load', document.getElementById('nb-load'));
  setupScanInput('loadInput', procLoad);
  updateLoadCtr();
}

// ════════════════════════════════════════
// DRIVER — LOAD BOXES ONTO TRUCK
// ════════════════════════════════════════
function procLoad(code){
  if(!A.driverRoute){sT('No route selected','err');return;}

  // ── PALLET CODE: expand into individual BTs ──
  if(code.startsWith('PLT-')){
    const pallet = (A.pallets||[]).find(p=>p.code===code);
    if(!pallet){
      beep('fail');
      showSR('loadSR','fail','PALLET NOT FOUND ❌','No pallet found with this code',code);
      return;
    }
    if(pallet.used){
      beep('fail');
      showSR('loadSR','fail','PALLET ALREADY USED ❌','This pallet has already been loaded',code);
      return;
    }
    // Check pallet destination is on this route
    const palletDest = resolveStoreCode(pallet.dest);
    if(!A.driverRoute.stores.includes(palletDest)){
      beep('fail');
      showSR('loadSR','fail','WRONG ROUTE ❌','Pallet is for '+stName(palletDest)+' — not on your route',code);
      return;
    }
    // Load all BTs from this pallet
    let loaded = 0;
    pallet.bts.forEach(btCode=>{
      if(!A.loadedBoxes.includes(btCode)){
        procLoad(btCode);
        loaded++;
      }
    });
    // Mark pallet as used
    pallet.used = true;
    fbSave('pallets', pallet.id, pallet);
    sv();
    beep('ok');
    showSR('loadSR','ok','PALLET LOADED ✅',
      loaded+' BTs loaded for '+stName(palletDest)+' from pallet '+code, code);
    renderLoadedList(); updateLoadCtr();
    return;
  }

  // ── LABEL CODE: read destination from LBL-XX-NNNN format ──
  if(code.startsWith('LBL-')){
    // Format: LBL-XX-NNNN where XX is store BT number
    const parts = code.split('-');
    // parts[1] is the BT number, e.g. '17'
    if(parts.length >= 3){
      const btNum = parts[1];
      const labelStore = STORE_LIST.find(s=>s.btNum===btNum);
      if(labelStore){
        // Override toStore so it routes correctly
        const labelDest = labelStore.code;
        // Find or look up label record for extra info
        const labelRec = (A.labels||[]).find(l=>l.code===code);
        // Check destination is on route
        if(!A.driverRoute.stores.includes(labelDest)){
          beep('fail');
          showSR('loadSR','fail','WRONG ROUTE ❌',
            'Label is for '+stName(labelDest)+' — not on your route', code);
          return;
        }
        if(A.loadedBoxes.includes(code)){
          beep('fail');
          showSR('loadSR','fail','DUPLICATE SCAN ⚠','Already loaded — see popup',code);
          openDupModal(code,'load');
          return;
        }
        // Create transfer for this label
        let tr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
        if(!tr){
          tr = makeTr(code, A.userCode||'DC', labelDest, A.userName);
          tr.isLabel=true;
          tr.category=labelRec?.cat||'Label';
          A.transfers.unshift(tr);
        }
        A.loadedBoxes.push(code);
        tr.status='loaded';tr.loadedBy=A.userName;tr.loadedAt=new Date().toISOString();
        tr.route=A.driverRoute.name;tr.toStore=labelDest;tr.toLoc=labelDest;
        fbSave('transfers',tr.id,tr);
        beep('ok');
        showSR('loadSR','ok','LABEL LOADED ✅',
          (labelRec?.cat||'Label')+' → '+stName(labelDest), code);
        renderLoadedList();updateLoadCtr();
        return;
      }
    }
    // If we can't parse the LBL code, fall through to normal handling
  }

  if(A.loadedBoxes.includes(code)){
    beep('fail');
    showSR('loadSR','fail','DUPLICATE SCAN ⚠','Already loaded — see popup',code);
    openDupModal(code,'load');
    return;
  }

  // ── Read destination ──
  // Check if this box has a finalDest (was a S2S box returning via DC)
  // If so, use finalDest as the delivery destination for today
  let toStore = '', fromStore = 'DC';
  const existingTr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
  if(existingTr && existingTr.finalDest && existingTr.viaTransit){
    // This box came via DC — now delivering to its final destination
    toStore = existingTr.finalDest;
    fromStore = 'DC';
    // Fully reset ALL fields — treat as a brand new delivery
    existingTr.toStore = toStore;
    existingTr.toLoc = toStore;
    existingTr.viaTransit = false;
    existingTr.finalDest = '';
    existingTr.status = 'loaded';
    // Clear ALL previous delivery data so it doesn't show as already delivered
    existingTr.deliveredAt = null;
    existingTr.deliveredBy = '';
    existingTr.signedBy = '';
    existingTr.signedAt = null;
    existingTr.scannedOutAt = null;
    existingTr.scannedOutBy = '';
    existingTr.returnedAt = null;
    existingTr.returnedBy = '';
    // DON'T save to Firebase here — procLoad will save below with full context
  } else if(/^\d{8,}/.test(code)){
    const fromNum = code.substring(4,6);
    const toNum   = code.substring(6,8);
    const fromSt  = STORE_LIST.find(s=>s.btNum===fromNum);
    const toSt    = STORE_LIST.find(s=>s.btNum===toNum);
    fromStore = fromSt ? fromSt.code : (fromNum==='00'||fromNum==='01' ? 'DC' : fromNum);
    toStore   = toSt   ? toSt.code   : toNum;
  }

  // If destination unknown — reject
  if(!toStore){
    beep('fail');
    showSR('loadSR','warn','UNKNOWN DESTINATION',
      'Cannot read destination from barcode. Check BT number format or use manual entry.',code);
    return;
  }

  // If destination not on today's route — reject
  if(!A.driverRoute.stores.includes(toStore)){
    beep('fail');
    showSR('loadSR','fail','WRONG ROUTE ❌',
      'Box is for '+stName(toStore)+' — not on your stops today',code);
    return;
  }

  // Find existing transfer record — or create one on the spot
  let tr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
  const isReturn = tr && tr.status==='return';
  if(!tr){
    tr = makeTr(code, fromStore, toStore, A.userName);
    A.transfers.unshift(tr);
  }

  // Load it — update to/from in case they changed (return from store etc.)
  A.loadedBoxes.push(code);
  tr.status   = 'loaded';
  tr.loadedBy = A.userName;
  tr.loadedAt = new Date().toISOString();
  tr.route    = A.driverRoute.name;
  tr.toStore  = toStore; tr.toLoc  = toStore;
  tr.fromStore= fromStore; tr.fromLoc= fromStore;
  fbSave('transfers', tr.id, tr);
  beep('ok');

  // Show helpful message — tell driver if this is a returned box being reloaded
  const msg = (existingTr && existingTr.s2s && existingTr.finalDest && !existingTr.viaTransit)
    ? '🔄 S2S → final delivery to ' + stName(toStore)
    : isReturn
    ? 'Reloading returned box → ' + stName(toStore)
    : 'Box loaded for ' + stName(toStore);
  showSR('loadSR','ok','LOADED ✅', msg, code);
  renderLoadedList();
  updateLoadCtr();
}

// duplicates handled by duplicates.js

// ── Manual entry modal ──
function openManualModal(cb){
  A._manualCb = cb;
  document.getElementById('manualModalInput').value = '';
  document.getElementById('manualModalErr').textContent = '';
  document.getElementById('manualMod').classList.add('on');
  setTimeout(()=>document.getElementById('manualModalInput').focus(), 200);
}
function submitManualModal(){
  const val = document.getElementById('manualModalInput').value.trim().toUpperCase();
  if(!val){ document.getElementById('manualModalErr').textContent = 'Please enter a BT number.'; return; }
  cmod(null,'manualMod');
  if(A._manualCb){ A._manualCb(val); A._manualCb = null; }
}
function renderS2SList(){
  const el=document.getElementById('s2sList');if(!el)return;
  const s2s=A.transfers.filter(t=>t.s2s&&A.loadedBoxes.includes(t.btNum||t.barcode));
  if(!s2s.length){el.innerHTML='<div style="color:var(--mut);font-size:.78rem;text-align:center;padding:10px">No store-to-store boxes yet</div>';return;}
  el.innerHTML=s2s.map(t=>`<div class="drow">
    <div><span style="font-family:var(--fh);font-size:.82rem">${t.btNum}</span>
    <div style="font-size:.68rem;color:var(--mut)">${stName(t.fromStore)} → ${stName(t.toStore)}</div></div>
    <span class="badge ${t.status==='return'?'b-return':'b-loaded'}">${t.status==='return'?'RETURN DC':'ON ROUTE'}</span>
  </div>`).join('');
}
function updateLoadCtr(){
  if(!A.driverRoute) return;
  const done = A.loadedBoxes.length;
  const ctrEl = document.getElementById('loadCtrN');
  if(ctrEl) ctrEl.textContent = done;
  // Show start route button as soon as at least 1 box is loaded
  const btn = document.getElementById('startRouteBtn');
  if(btn) btn.style.display = done > 0 ? 'block' : 'none';
}

function renderLoadedList(){
  const el=document.getElementById('loadedList');
  if(!A.loadedBoxes.length){el.innerHTML='<div style="color:var(--mut);font-size:.78rem;text-align:center;padding:10px">No boxes loaded yet</div>';return;}
  // Group by base BT — only show one row per BT with qty badge
  const qtyMap={};
  const firstIdx={};
  A.loadedBoxes.forEach((c,i)=>{
    const b=c.replace(/-\d+$/,'');
    qtyMap[b]=(qtyMap[b]||0)+1;
    if(firstIdx[b]===undefined) firstIdx[b]=i; // track index of first entry for remove
  });
  // Only render the first occurrence of each base BT
  const seen=new Set();
  el.innerHTML=A.loadedBoxes.map((code,i)=>{
    const base=code.replace(/-DUP\d+$/,'');
    if(seen.has(base)) return ''; // skip copy entries — shown via qty badge
    seen.add(base);
    const qty=qtyMap[base]||1;
    const tr=A.transfers.find(t=>t.btNum===base||t.barcode===base);
    return`<div class="drow">
      <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
        <span style="font-family:var(--fh);font-size:.82rem">${base}</span>
        ${qty>1?`<span style="background:var(--acc2);color:#000;border-radius:10px;padding:1px 7px;font-size:.65rem;font-weight:700">x${qty}</span>`:''}
        <span style="font-size:.7rem;color:var(--mut)">${tr?stName(tr.toStore):'?'}</span>
      </div>
      <button onclick="removeFromLoad(${i})" style="background:none;border:1px solid var(--red);border-radius:4px;color:var(--red);padding:2px 8px;font-size:.7rem;cursor:pointer;flex-shrink:0">✕</button>
    </div>`;
  }).join('');
}

function removeFromLoad(idx){
  const code = A.loadedBoxes[idx];
  if(!confirm('Remove ' + code + ' from truck?')) return;
  A.loadedBoxes.splice(idx,1);
  // Reset transfer status back to registered
  const tr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
  if(tr && tr.status==='loaded'){tr.status='registered';fbSave('transfers',tr.id,tr);}
  sv();
  renderLoadedList();
  updateLoadCtr();
  sT('Removed: '+code,'ok');
}

// ════════════════════════════════════════
// DRIVER — STORE-TO-STORE PICKUP
// ════════════════════════════════════════
function procS2S(code){
  const route = A.driverRoute;
  if(!route){ sT('No route active','warn'); return; }

  // Parse destination from BT number
  const p = parseBT(code);
  let toStore = p ? resolveStoreCode(p.to) : '';
  const fromStore = A.currentStop || (p ? resolveStoreCode(p.from) : 'STORE');

  // Find or create transfer record
  let tr = A.transfers.find(t => t.btNum===code || t.barcode===code);
  if(!tr){
    tr = makeTr(code, fromStore, toStore, A.userName);
    tr.s2s = true;
    A.transfers.unshift(tr);
  }
  if(toStore){
    tr.toStore = toStore;
    tr.toLoc = toStore;
    if(!tr.finalDest) tr.finalDest = toStore; // save original destination
  }

  // ── Routing rules ──
  // 1. Destination on route AND not yet visited → add to that stop
  // 2. Destination on route AND already visited → goes to DC
  // 3. Destination not on route → goes to DC
  const onRoute = toStore && route.stores.includes(toStore);
  const alreadyVisited = onRoute && (A.stopsDone||[]).includes(toStore);
  const sendToDC = !onRoute || alreadyVisited;

  if(!sendToDC){
    // Will be delivered at that upcoming stop
    tr.status = 'loaded';
    tr.loadedBy = A.userName;
    tr.loadedAt = new Date().toISOString();
    tr.route = route.name;
    tr.s2s = true;
    fbSave('transfers', tr.id, tr);
    A.loadedBoxes.push(code);
    beep('ok');
    showSR('s2sSR', 'ok', 'ADDED TO ROUTE ✅',
      `Will deliver at ${stName(toStore)}`, code);
  } else {
    // Box goes to DC today, final store tomorrow
    tr.status = 'return';
    tr.returnRoute = route.name;
    tr.toStore = 'DC'; tr.toLoc = 'DC'; // TODAY: destination is DC
    tr.finalDest = toStore;             // TOMORROW: deliver here
    tr.viaTransit = true;
    tr.s2s = true;
    fbSave('transfers', tr.id, tr);

    // Only add to loadedBoxes if NOT already in there from initial load
    // This box was picked up at a store — it goes on the truck to DC
    // Do NOT push if it was already loaded from DC (would double-count)
    if(!A.loadedBoxes.includes(code)){
      A.loadedBoxes.push(code);
    }

    // Also remove from stopExpected for the already-visited store
    // so it does NOT show as missing on the scanout screen
    if(alreadyVisited && A.stopExpected){
      A.stopExpected = A.stopExpected.filter(c => c !== code);
    }

    const reason = alreadyVisited
      ? 'Already visited ' + stName(toStore) + ' — goes to DC, delivers there tomorrow'
      : stName(toStore) + ' not on route — goes to DC, delivers there tomorrow';
    beep('ok');
    showSR('s2sSR', 'warn', 'RETURN TO DC ⚠', reason, code);
  }
  renderS2SList();
}

// ════════════════════════════════════════
// DRIVER — START ROUTE
// ════════════════════════════════════════
function startRoute(){
  if(!confirm(`Start route ${A.driverRoute.name} with ${A.loadedBoxes.length} boxes?`))return;
  A.routeStarted=true;
  // Mark all loaded transfers as transit
  A.loadedBoxes.forEach(code=>{
    const tr=A.transfers.find(t=>t.btNum===code||t.barcode===code);
    if(tr&&tr.status==='loaded'){tr.status='transit';tr.routeStartedAt=new Date().toISOString();fbSave('transfers',tr.id,tr);}
  });
  sT('Route started! 🚛','ok');

  gvDriver('stops',document.getElementById('nb-stops'));
}

// ════════════════════════════════════════
// DRIVER — STOPS LIST
// ════════════════════════════════════════
function openDCStop(){
  document.getElementById('dcOpenBtn').style.display = 'none';
  document.getElementById('dcScanArea').style.display = 'block';
  setupScanInput('returnInput', procReturn);
  renderReturnList();
  renderPendingReturns();
  setTimeout(()=>document.getElementById('returnInput')?.focus(), 200);
}

function updateDCStopCounter(){
  const totalReturn = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t => t.btNum===lb||t.barcode===lb);
    return tr && tr.status==='return';
  }).length;
  const scanned = A.returnBoxes.length;
  const ctr = document.getElementById('dcCtrN');
  const bar = document.getElementById('dcCtrBar');
  const detail = document.getElementById('dcStopDetail');
  const badge = document.getElementById('dcStopBadge');
  if(ctr) ctr.textContent = scanned + ' / ' + totalReturn;
  if(bar) bar.style.width = totalReturn > 0 ? Math.min(100, scanned/totalReturn*100)+'%' : '0%';
  if(detail) detail.textContent = totalReturn > 0
    ? `${totalReturn} box${totalReturn!==1?'es':''} to return to DC`
    : 'No returns — tap to confirm';
  if(badge){
    if(scanned >= totalReturn && totalReturn > 0){
      badge.className='badge b-delivered'; badge.textContent='✅ DONE';
    } else {
      badge.className='badge b-return'; badge.textContent='RETURN';
    }
  }
}

function renderStops(){
  const el=document.getElementById('stopsList');
  const route=A.driverRoute;if(!route)return;
  document.getElementById('stopsBanner').textContent=`🗺 Route: ${route.name} — ${A.loadedBoxes.length} boxes on truck`;
  el.innerHTML=route.stores.map((code,i)=>{
    // Count by loadedBoxes entries (includes duplicates like BT-DUP1, BT-DUP2)
    const resolvedCode = resolveStoreCode(code);
    const loadedForStop = A.loadedBoxes.filter(lb => {
      const baseBT = lb.replace(/-DUP\d*$/,'');
      const tr = A.transfers.find(t=>t.btNum===baseBT||t.barcode===baseBT);
      if(tr){
        // For S2S boxes, use finalDest if viaTransit is cleared (Day 2 delivery)
        const effectiveDest = (tr.finalDest && !tr.viaTransit)
          ? tr.finalDest
          : (tr.toStore || tr.toLoc || '');
        // Never show DC-bound boxes under a store stop (only viaTransit ones go to DC)
        if((effectiveDest==='DC'||effectiveDest==='01') && tr.viaTransit) return false;
        return resolveStoreCode(effectiveDest) === resolvedCode;
      }
      const p = parseBT(baseBT);
      return p ? resolveStoreCode(p.to) === resolvedCode : false;
    });
    const total = loadedForStop.length;
    // Count delivered/short by checking each loaded entry
    const done = loadedForStop.filter(lb => {
      const baseBT = lb.replace(/-DUP\d*$/,'');
      const tr = A.transfers.find(t=>t.btNum===baseBT||t.barcode===baseBT);
      return tr && (tr.status==='delivered'||tr.status==='short');
    }).length;
    const allDone=total>0&&done===total;
    const hasShort=loadedForStop.some(lb=>{
      const baseBT=lb.replace(/-DUP\d*$/,'');
      const tr=A.transfers.find(t=>t.btNum===baseBT||t.barcode===baseBT);
      return tr&&tr.status==='short';
    });
    return`<div class="stop-item">
      <div class="stop-head">
        <div>
          <div class="stop-name">Stop ${i+1}: ${stName(code)}</div>
          <div class="stop-detail">${total} box${total!==1?'es':''} to deliver</div>
        </div>
        <div style="text-align:right">
          <div class="stop-num">${done}/${total}</div>
          ${allDone&&!hasShort?'<span class="badge b-delivered">✅ DONE</span>':''}
          ${hasShort?'<span class="badge b-short">⚠ SHORT</span>':''}
        </div>
      </div>
      ${!allDone&&total>0?`<button class="btn bp" onclick="startScanout('${code}')" style="margin-top:6px" id="scanBtn-${code}">
        ${getNFCBtnLabel('${code}')}
      </button>`:''}
      ${allDone?`<button class="btn bo" onclick="goToS2S('${code}')" style="margin-top:6px;font-size:.68rem;padding:7px">🔄 ADD STORE TRANSFERS</button>`:''}
      ${total===0?`<div style="display:flex;gap:6px;margin-top:6px"><div style="font-size:.72rem;color:var(--mut);flex:1">No boxes for this stop</div><button class="btn bo" onclick="goToS2S('${code}')" style="font-size:.68rem;padding:6px 10px;margin:0">🔄 STORE TRANSFERS</button></div>`:''}
    </div>`;
  }).join('');
  // Don't auto-setup returnInput here — only wire it when DC stop is opened
  // Only reset DC to collapsed if it wasn't already open
  const dcScan = document.getElementById('dcScanArea');
  const dcOpen = document.getElementById('dcOpenBtn');
  if(!dcScan || dcScan.style.display === 'none'){
    if(dcOpen) dcOpen.style.display = 'block';
  }
  updateDCStopCounter();
}

// ════════════════════════════════════════
// DRIVER — SCAN OUT AT STORE
// ════════════════════════════════════════
function startScanout(storeCode){
  // ── NFC CHECK FIRST — HARD GATE ──
  // This runs before ANYTHING else. If NFC required and not verified = stop.
  if(A.nfcRequired === true || A.nfcRequired === 'true'){
    const v = (A.nfcVerified || {})[storeCode];
    let canProceed = false;
    if(v){
      const isOverride = String(v).startsWith('OVERRIDE-');
      const ts = isOverride ? v.replace('OVERRIDE-','') : v;
      const age = Date.now() - new Date(ts).getTime();
      canProceed = age < 4*60*60*1000; // valid for 4 hours
    }
    if(!canProceed){
      showNFCModal(storeCode);
      return; // HARD STOP — nothing below runs
    }
  }

  // Record arrival time when NFC is off (direct scanout)
  if(!A.storeArrivals) A.storeArrivals = {};
  if(!A.storeArrivals[storeCode]) A.storeArrivals[storeCode] = new Date().toISOString();
  A.currentStop = storeCode;
  A.scanoutBoxes = [];
  // Always reset to phase 1
  const p1 = document.getElementById('scanoutPhase1');
  const p2 = document.getElementById('scanoutPhase2');
  if(p1) p1.style.display = 'block';
  if(p2) p2.style.display = 'none';

  const resolvedStop = resolveStoreCode(storeCode);

  // Build expected list directly from loadedBoxes — most reliable approach
  // For each loaded box, check its destination using:
  // 1. The transfer record's toStore (most reliable)
  // 2. Fallback to parsing the BT number directly
  A.stopExpected = A.loadedBoxes.filter(lb => {
    const base = baseBT(lb);
    // Try full slot first (catches DUP transfer records)
    const trFull = A.transfers.find(t => t.btNum===lb || t.barcode===lb);
    if(trFull){
      const d = (trFull.finalDest&&!trFull.viaTransit)?trFull.finalDest:(trFull.toStore||trFull.toLoc||'');
      if(d) return resolveStoreCode(d) === resolvedStop;
    }
    // Fall back to base BT transfer
    const trBase = A.transfers.find(t => t.btNum===base || t.barcode===base);
    if(trBase){
      const d = (trBase.finalDest&&!trBase.viaTransit)?trBase.finalDest:(trBase.toStore||trBase.toLoc||'');
      if(d) return resolveStoreCode(d) === resolvedStop;
    }
    // Parse BT number
    const p = parseBT(base);
    if(p) return resolveStoreCode(p.to) === resolvedStop;
    return false;
  });
  // Also include any labels loaded for this stop
  const labelsForStop = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t => t.btNum===lb||t.barcode===lb);
    return tr && tr.isLabel && resolveStoreCode(tr.toStore||tr.toLoc||'') === resolvedStop;
  });
  labelsForStop.forEach(lb => {
    if(!A.stopExpected.includes(lb)) A.stopExpected.push(lb);
  });

  document.getElementById('scanoutBanner').textContent =
    `📦 Delivering at: ${stName(storeCode)} — ${A.stopExpected.length} box${A.stopExpected.length!==1?'es':''} expected`;
  showView('driver-scanout');
  setupScanInput('scanoutInput', procScanout);
  // Render lists immediately so labels show TAP buttons even before first scan
  renderScanoutList();
  updateScanoutCtr();
  setTimeout(()=>document.getElementById('scanoutInput')?.focus(), 200);
}

function procScanout(code){
  const resolvedStop = resolveStoreCode(A.currentStop||'');
  if(!A.stopExpected || !A.stopExpected.length){
    A.stopExpected = A.loadedBoxes.filter(lb=>{
      const base=baseBT(lb);
      const trFull=A.transfers.find(t=>t.btNum===lb||t.barcode===lb);
      if(trFull){const d=(trFull.finalDest&&!trFull.viaTransit)?trFull.finalDest:(trFull.toStore||trFull.toLoc||'');if(d)return resolveStoreCode(d)===resolvedStop;}
      const trBase=A.transfers.find(t=>t.btNum===base||t.barcode===base);
      if(trBase){const d=(trBase.finalDest&&!trBase.viaTransit)?trBase.finalDest:(trBase.toStore||trBase.toLoc||'');if(d)return resolveStoreCode(d)===resolvedStop;}
      const p=parseBT(base);
      return p?resolveStoreCode(p.to)===resolvedStop:false;
    });
  }
  const result = consumeScanSlot(code);
  if(!result.accepted){
    beep('fail');
    const title = result.reason==='ALL_SCANNED'?'ALL '+result.total+' SCANNED ✅':'NOT LOADED ❌';
    showSR('scanoutSR','fail',title,result.message,baseBT(code));
    return;
  }
  beep('ok');
  showSR('scanoutSR','ok','SCANNED OUT ✅',result.detail,result.base);
  updateScanoutCtr();
  renderScanoutList();
}
function updateScanoutCtr(){
  const resolvedStop = resolveStoreCode(A.currentStop||'');
  // Count labels for this stop separately
  const labelsForStop = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t => t.btNum===lb||t.barcode===lb);
    return tr && tr.isLabel && resolveStoreCode(tr.toStore||tr.toLoc||'') === resolvedStop;
  });
  const expected = (A.stopExpected||[]).length;
  const done = A.scanoutBoxes.length;
  const labelsScanned = labelsForStop.filter(lb => A.scanoutBoxes.includes(lb)).length;
  const allLabelsScanned = labelsForStop.length === labelsScanned;

  document.getElementById('scanoutCtrN').textContent = done + ' / ' + Math.max(expected, labelsForStop.length);
  const total = Math.max(expected, labelsForStop.length);
  const pct = total > 0 ? Math.min(100, done / total * 100) : 0;
  const b = document.getElementById('scanoutCtrBar');
  b.style.width = pct + '%';
  b.className = 'ctr-fill' + (pct < 50 ? ' low' : pct < 90 ? ' warn' : '');

  // Show override if some BTs scanned but not all (not for label-only stops)
  document.getElementById('overrideBtn').style.display =
    (expected > 0 && done > 0 && done < expected) ? 'block' : 'none';

  // Show done button when:
  // - All BT boxes scanned (or none expected) AND all labels scanned (or none)
  const btsDone = (expected === 0 || done >= expected);
  const labelsDone = (labelsForStop.length === 0 || allLabelsScanned);
  const canFinish = btsDone && labelsDone && (done > 0 || labelsForStop.length > 0);
  document.getElementById('scanoutDoneBtn').style.display = canFinish ? 'block' : 'none';
}

function renderScanoutList(){
  // Scanned out list
  const el = document.getElementById('scanoutList');
  if(el) el.innerHTML = A.scanoutBoxes.map(c => {
    const base = c.replace(/-DUP\d+$/,'');
    return `<div class="drow"><span style="font-family:var(--fh);font-size:.82rem">${base}</span><span class="badge b-delivered">OUT ✅</span></div>`;
  }).join('') || '<div style="color:var(--mut);font-size:.75rem;padding:6px 0">Nothing scanned yet</div>';

  // Show label codes that need to be scanned out at this stop
  const resolvedStop = resolveStoreCode(A.currentStop||'');
  const labelsForStop = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t => t.btNum===lb||t.barcode===lb);
    return tr && tr.isLabel && resolveStoreCode(tr.toStore||tr.toLoc||'') === resolvedStop;
  });
  const labelWrap = document.getElementById('labelsOnTruckWrap');
  const labelList = document.getElementById('labelsOnTruckList');
  if(labelWrap) labelWrap.style.display = labelsForStop.length > 0 ? 'block' : 'none';
  if(labelList) labelList.innerHTML = labelsForStop.map(lb => {
    const tr = A.transfers.find(t => t.btNum===lb||t.barcode===lb);
    const scanned = A.scanoutBoxes.includes(lb);
    return `<div style="background:${scanned?'rgba(63,185,80,.06)':'rgba(245,200,66,.1)'};border:1px solid ${scanned?'rgba(63,185,80,.3)':'rgba(245,200,66,.4)'};border-radius:6px;padding:10px;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${scanned?'0':'8px'}">
        <div>
          <div style="font-family:var(--fh);font-size:1.1rem;letter-spacing:3px;color:${scanned?'var(--grn)':'var(--acc2)'}">${lb}</div>
          <div style="font-size:.68rem;color:var(--mut)">${tr?.category||'Label'}</div>
        </div>
        <span class="badge ${scanned?'b-delivered':'b-missing'}">${scanned?'✅ DONE':'REQUIRED'}</span>
      </div>
      ${!scanned ? `<button onclick="procScanout('${lb}')" 
        style="width:100%;padding:10px;background:var(--acc);border:none;border-radius:6px;
        color:#fff;font-family:var(--fh);font-size:.78rem;letter-spacing:1.5px;cursor:pointer;text-transform:uppercase">
        ✅ TAP TO SCAN OUT THIS LABEL
      </button>` : ''}
    </div>`;
  }).join('');

  // Remaining BTs — what has NOT been scanned out yet
  // Remaining = exact slot matching — only slots not yet in scanoutBoxes
  const remaining = (A.stopExpected||[]).filter(slot => !A.scanoutBoxes.includes(slot));
  const rWrap = document.getElementById('remainingWrap');
  const rList = document.getElementById('remainingList');
  if(rWrap) rWrap.style.display = remaining.length > 0 ? 'block' : 'none';
  // Group remaining by base BT — show how many still need scanning
  const remGroups={};
  remaining.forEach(c=>{
    const b=c.replace(/-DUP\d+$/,'');
    if(!remGroups[b]) remGroups[b]={total:0,scanned:0};
    remGroups[b].total++;
  });
  // Count how many of each base BT have been scanned out
  A.scanoutBoxes.forEach(c=>{
    const b=c.replace(/-DUP\d+$/,'');
    if(remGroups[b]) remGroups[b].scanned++; // won't exist since remaining = not yet scanned
  });
  // Also check stopExpected to get total loaded qty per BT
  const loadedQty={};
  (A.stopExpected||[]).forEach(c=>{
    const b=c.replace(/-DUP\d+$/,'');
    loadedQty[b]=(loadedQty[b]||0)+1;
  });
  // Show each remaining slot — exact slot names from stopExpected
  if(rList) rList.innerHTML = remaining.length === 0 ? '' : remaining.map(slot => {
    const base    = baseBT(slot);
    const isDup   = slot !== base;
    const copyLbl = isDup ? slot.replace(base+'-DUP','copy ') : '';
    return `<div class="drow" style="background:rgba(245,200,66,.08);border:1px solid rgba(245,200,66,.2);border-radius:6px;padding:8px 10px;margin-bottom:4px">
      <div>
        <div style="font-family:var(--fh);font-size:.9rem;letter-spacing:2px;color:var(--acc2)">${base}${isDup?' <span style="font-size:.65rem;opacity:.8">('+copyLbl+')</span>':''}</div>
        ${isDup?'<div style="font-size:.62rem;color:var(--mut)">Scan same barcode again for this copy</div>':''}
      </div>
      <span class="badge b-missing">SCAN REQUIRED</span>
    </div>`;
  }).join('');
}

function goToS2S(storeCode){
  // Driver wants to go back to S2S for a store they already delivered to
  A.currentStop = storeCode;
  proceedToS2S();
  showView('driver-scanout');
}

function proceedToS2S(){
  // Hide phase 1, show phase 2
  document.getElementById('scanoutPhase1').style.display = 'none';
  document.getElementById('scanoutPhase2').style.display = 'block';
  const storeName = stName(A.currentStop);
  document.getElementById('s2sPhaseBanner').textContent =
    `🔄 Delivery signed ✅ — Now scan any boxes ${storeName} wants to send out`;
  // Wire s2sInput directly here — same view so no navigation needed
  // Use setupScanInput to wire the phase2 input
  setupScanInput('s2sPhaseInput', procS2S);
  setTimeout(()=>{
    const el = document.getElementById('s2sPhaseInput');
    if(el) el.focus();
  }, 200);
  renderS2SList();
}

// ════════════════════════════════════════
// NFC STORE VERIFICATION
// ════════════════════════════════════════
let _nfcPendingStore = null;
let _nfcReader = null;

async function goToScanoutDirect(storeCode){
  // Record store arrival time — this is when timing starts
  if(!A.storeArrivals) A.storeArrivals = {};
  A.storeArrivals[storeCode] = new Date().toISOString();
  A.currentStop = storeCode;
  A.scanoutBoxes = [];
  const p1 = document.getElementById('scanoutPhase1');
  const p2 = document.getElementById('scanoutPhase2');
  if(p1) p1.style.display = 'block';
  if(p2) p2.style.display = 'none';

  const resolvedStop = resolveStoreCode(storeCode);

  // Build stopExpected
  A.stopExpected = A.loadedBoxes.filter(lb => {
    const baseBT = lb.replace(/-DUP\d*$/, '');
    const tr = A.transfers.find(t => t.btNum===baseBT||t.barcode===baseBT);
    if(tr){
      if(tr.isLabel) return resolveStoreCode(tr.toStore||tr.toLoc||'') === resolvedStop;
      const effectiveDest = (tr.finalDest && !tr.viaTransit) ? tr.finalDest : (tr.toStore||tr.toLoc||'');
      return resolveStoreCode(effectiveDest) === resolvedStop;
    }
    const p = parseBT(baseBT);
    return p ? resolveStoreCode(p.to) === resolvedStop : false;
  });

  // Add labels
  const labelsForStop = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t=>t.btNum===lb||t.barcode===lb);
    return tr && tr.isLabel && resolveStoreCode(tr.toStore||tr.toLoc||'') === resolvedStop;
  });
  labelsForStop.forEach(lb => { if(!A.stopExpected.includes(lb)) A.stopExpected.push(lb); });

  document.getElementById('scanoutBanner').textContent =
    '📦 Delivering at: ' + stName(storeCode) + ' — ' + A.stopExpected.length + ' box' + (A.stopExpected.length!==1?'es':'') + ' expected';
  showView('driver-scanout');
  setupScanInput('scanoutInput', procScanout);
  renderScanoutList();
  updateScanoutCtr();
  setTimeout(()=>document.getElementById('scanoutInput')?.focus(), 200);
}

function getNFCBtnLabel(storeCode){
  if(!A.nfcRequired) return '📦 SCAN OUT AT THIS STOP';
  const v = A.nfcVerified && A.nfcVerified[storeCode];
  if(!v) return '📡 TAP NFC TAG + SCAN OUT';
  const isOverride = String(v).startsWith('OVERRIDE-');
  const age = Date.now() - new Date(isOverride ? v.replace('OVERRIDE-','') : v).getTime();
  if(age < 4*60*60*1000) return '📦 SCAN OUT AT THIS STOP'; // verified within 4 hours
  return '📡 TAP NFC TAG + SCAN OUT'; // expired
}

async function showNFCModal(storeCode){
  _nfcPendingStore = storeCode;
  const resolvedStore = resolveStoreCode(storeCode) || storeCode;
  document.getElementById('nfcStatus').textContent = 'HOLD TAG TO SCANNER';
  document.getElementById('nfcStatus').style.color = 'var(--blu)';
  document.getElementById('nfcSubStatus').textContent = 'Hold NFC tag to back of scanner · Expected tag: PNA-NFC-' + (_nfcPendingStore||'').toUpperCase();
  document.getElementById('nfcMod').classList.add('on');

  // Check Web NFC API support
  if(!('NDEFReader' in window)){
    document.getElementById('nfcStatus').textContent = 'NFC NOT SUPPORTED';
    document.getElementById('nfcStatus').style.color = 'var(--red)';
    document.getElementById('nfcSubStatus').textContent = 'This device does not support Web NFC. Use override.';
    return;
  }

  try{
    _nfcReader = new NDEFReader();
    // Request NFC permission and start scanning
    await _nfcReader.scan({ signal: undefined });
    document.getElementById('nfcStatus').textContent = 'SCANNING — HOLD TAG NEAR SCANNER';
    document.getElementById('nfcSubStatus').textContent = 'NFC active · Hold tag to the BACK of scanner · Expected: PNA-NFC-' + (_nfcPendingStore||'').toUpperCase();

    _nfcReader.addEventListener('reading', ({message, serialNumber}) => {
      let tagText = '';
      for(const record of message.records){
        if(record.recordType === 'text'){
          const decoder = new TextDecoder(record.encoding || 'utf-8');
          tagText = decoder.decode(record.data).trim().toUpperCase();
          break;
        }
      }
      processNFCTag(tagText, serialNumber);
    });

    _nfcReader.addEventListener('readingerror', () => {
      document.getElementById('nfcStatus').textContent = 'READ ERROR — TRY AGAIN';
      document.getElementById('nfcStatus').style.color = 'var(--acc2)';
    });

  } catch(e){
    document.getElementById('nfcStatus').textContent = 'NFC ERROR';
    document.getElementById('nfcStatus').style.color = 'var(--red)';
    document.getElementById('nfcSubStatus').textContent = e.message || 'Could not start NFC. Use override.';
  }
}

function processNFCTag(tagText, serialNumber){
  if(!_nfcPendingStore) return;

  // Show what was read so driver can see (helps debugging)
  document.getElementById('nfcSubStatus').textContent = 'Read: ' + (tagText||'(empty)');

  // Build expected codes — accept multiple formats
  const storeCode = (_nfcPendingStore||'').toUpperCase();
  const storeObj  = A.stores.find(s=>s.code===_nfcPendingStore);
  const storeName = storeObj ? storeObj.name.toUpperCase() : '';
  const expected  = [
    'PNA-NFC-' + storeCode,          // e.g. PNA-NFC-CT
    'PNA-NFC-' + storeCode.replace(/[^A-Z0-9]/g,''), // clean version
    storeCode,                        // just the code e.g. CT
    'NFC-' + storeCode,              // NFC-CT
  ];

  const match = tagText && expected.some(e => tagText.toUpperCase() === e.toUpperCase());

  if(match){
    // ✅ Correct store
    if(!A.nfcVerified) A.nfcVerified = {};
    A.nfcVerified[_nfcPendingStore] = new Date().toISOString();
    sv();
    document.getElementById('nfcStatus').textContent = '✅ VERIFIED — ' + stName(_nfcPendingStore).toUpperCase();
    document.getElementById('nfcStatus').style.color = 'var(--grn)';
    document.getElementById('nfcSubStatus').textContent = 'Location confirmed. Opening scan-out...';
    beep('ok');
    sT('✅ NFC verified at ' + stName(_nfcPendingStore), 'ok');
    // Stop reader
    try{ if(_nfcReader) _nfcReader.abort && _nfcReader.abort(); }catch(e){}
    // Capture store before clearing pending
    const _verifiedStore = _nfcPendingStore;
    // Proceed — close modal and go to scanout
    setTimeout(()=>{
      cmod(null,'nfcMod');
      _nfcPendingStore = null;
      // Double-check nfcVerified is set (in case sv() was slow)
      if(!A.nfcVerified) A.nfcVerified = {};
      A.nfcVerified[_verifiedStore] = A.nfcVerified[_verifiedStore] || new Date().toISOString();
      // Go directly to scanout — skip NFC check since we just verified
      goToScanoutDirect(_verifiedStore);
    }, 800);
  } else {
    // ❌ Wrong store
    beep('fail');
    document.getElementById('nfcStatus').textContent = '❌ WRONG STORE TAG';
    document.getElementById('nfcStatus').style.color = 'var(--red)';
    document.getElementById('nfcSubStatus').textContent =
      'Tag says: ' + tagText + ' — Expected tag for: ' + stName(_nfcPendingStore);
  }
}

function requestNFCOverride(){
  // Stop NFC reader
  try{ if(_nfcReader) _nfcReader.abort && _nfcReader.abort(); }catch(e){}
  cmod(null,'nfcMod');
  // Open override PIN modal
  A.overridePinBuffer = '';
  updateOverridePinDisplay();
  document.getElementById('overrideMod').classList.add('on');
  // Flag that this override is for NFC
  document.getElementById('overrideMod')._nfcOverride = true;
  document.getElementById('overrideMod')._nfcStore = _nfcPendingStore;
  sT('Enter management override PIN to bypass NFC check', 'warn');
}

// oPinSubmit handles both NFC override and short delivery override
function oPinSubmit(){
  const entered = A.overridePinBuffer;
  const modal   = document.getElementById('overrideMod');
  const isNFC   = modal && modal._nfcOverride;
  const valid   = A.overridePins.find(p=>p.pin===entered&&!p.used);
  if(!valid){
    document.getElementById('overridePinDisplay').style.color='var(--red)';
    setTimeout(()=>{document.getElementById('overridePinDisplay').style.color='var(--acc)';A.overridePinBuffer='';updateOverridePinDisplay();},700);
    sT('Invalid or already used PIN','err');return;
  }
  valid.used=true;valid.usedBy=A.userName;valid.usedAt=new Date().toISOString();
  if(isNFC) valid.overrideReason='NFC bypass at '+stName(modal._nfcStore||_nfcPendingStore);
  fbSave('overridePins',valid.id,valid);
  sv();
  cmod(null,'overrideMod');
  if(isNFC){
    modal._nfcOverride = false;
    const store = modal._nfcStore || _nfcPendingStore;
    modal._nfcStore = null;
    _nfcPendingStore = null;
    // Mark as verified with override flag
    if(!A.nfcVerified) A.nfcVerified = {};
    A.nfcVerified[store] = 'OVERRIDE-' + new Date().toISOString();
    sv();
    sT('Override accepted — NFC bypassed. This is logged.','warn');
    goToScanoutDirect(store);
  } else {
    // Original override logic for short delivery
    const remaining=A.transfers.filter(t=>(t.toStore===A.currentStop||t.toLoc===A.currentStop)&&A.loadedBoxes.includes(t.btNum||t.barcode)&&t.status==='transit'&&!A.scanoutBoxes.includes(t.btNum||t.barcode));
    remaining.forEach(t=>{t.status='short';t.shortAt=new Date().toISOString();t.shortBy=A.userName;t.overridePin=entered;t.overrideReason=valid.reason;fbSave('transfers',t.id,t);});
    cmod(null,'overrideMod');
    sT('Override accepted — '+remaining.length+' box(es) marked SHORT DELIVERY','warn');
    document.getElementById('scanoutDoneBtn').style.display='block';
    document.getElementById('overrideBtn').style.display='none';
    showSR('scanoutSR','warn','OVERRIDE ACCEPTED',''+remaining.length+' box(es) marked as short delivery','');
  }
}

function finishStop(){
  // Record this stop as visited
  if(A.currentStop && !(A.stopsDone||[]).includes(A.currentStop)){
    if(!A.stopsDone) A.stopsDone = [];
    A.stopsDone.push(A.currentStop);
  }
  A.currentStop = null;
  sv();
  showView('driver-stops');
  renderStops();
  sT('Stop complete — continue route','ok');
}

function backToStops(){showView('driver-stops');renderStops();}

// ════════════════════════════════════════
// OVERRIDE PIN FLOW
// ════════════════════════════════════════
function requestOverride(){
  A.overridePinBuffer='';
  updateOverridePinDisplay();
  document.getElementById('overrideMod').classList.add('on');
}
function oPinKey(k){if(A.overridePinBuffer.length>=4)return;A.overridePinBuffer+=k;updateOverridePinDisplay();}
function oPinDel(){A.overridePinBuffer=A.overridePinBuffer.slice(0,-1);updateOverridePinDisplay();}
function updateOverridePinDisplay(){
  const el=document.getElementById('overridePinDisplay');if(!el)return;
  el.textContent=A.overridePinBuffer.split('').map(()=>'•').join(' ').padEnd(7,'_').replace(/ /g,' ');
  const f=A.overridePinBuffer.length;
  el.textContent=['_','_','_','_'].map((d,i)=>i<f?'•':d).join(' ');
}
// oPinSubmit merged into NFC-aware version above

function generateOverridePIN(){
  const driver=document.getElementById('overrideDriverSel').value;
  const reason=document.getElementById('overrideReason').value.trim()||'No reason given';
  const pin=String(Math.floor(1000+Math.random()*9000));
  const entry={pin,driver,reason,created:new Date().toISOString(),used:false,usedBy:'',usedAt:'',id:'OVR-'+Date.now()};
  A.overridePins.push(entry);
  // Save to Firebase so driver's device gets the PIN via live sync
  fbSave('overridePins', entry.id, entry);
  sv();
  document.getElementById('overridePINVal').textContent=pin;
  document.getElementById('overridePINDisplay').style.display='block';
  document.getElementById('overrideReason').value='';
  renderOverrideLog();
  sT('Override PIN generated: '+pin,'warn');
  // Build WhatsApp notification link
  const msg = encodeURIComponent(
    'PNA JHB Override PIN\n' +
    'Driver: ' + driver + '\n' +
    'PIN: ' + pin + '\n' +
    'Reason: ' + reason + '\n' +
    'Generated: ' + new Date().toLocaleString('en-ZA')
  );
  const waLink = document.getElementById('waNotifyLink');
  if(waLink){
    waLink.href = 'https://wa.me/?text=' + msg;
    waLink.style.display = 'flex';
  }
}
function renderOverrideLog(){
  const el=document.getElementById('overrideLog');if(!el)return;
  if(!A.overridePins.length){el.innerHTML='<div style="color:var(--mut);font-size:.75rem">No override PINs generated</div>';return;}
  el.innerHTML=A.overridePins.slice().reverse().slice(0,10).map(p=>`
    <div class="drow">
      <div><div style="font-family:var(--fh);font-size:.85rem;letter-spacing:2px;color:${p.used?'var(--mut)':'var(--red)'}">${p.pin} ${p.used?'(USED)':''}</div>
      <div style="font-size:.68rem;color:var(--mut)">${p.driver} · ${p.reason}</div>
      ${p.used?`<div style="font-size:.65rem;color:var(--mut)">Used by ${p.usedBy} at ${stName(p.stopCode)} · ${fD(p.usedAt)}</div>`:''}
      </div>
      <span style="font-size:.65rem;color:var(--mut)">${fD(p.created)}</span>
    </div>`).join('');
}

// ════════════════════════════════════════
// SIGNATURE
// ════════════════════════════════════════
function openSignModal(){
  // Always clear the name field — never remember previous name
  const nameEl = document.getElementById('signName');
  if(nameEl) nameEl.value = '';
  document.getElementById('signMod').classList.add('on');
  initSign();
}
function initSign(){
  const c=document.getElementById('signC');A.signCtx=c.getContext('2d');
  A.signCtx.clearRect(0,0,c.width,c.height);A.signCtx.strokeStyle='#e8841a';A.signCtx.lineWidth=2.5;A.signDraw=false;
  const gp=e=>{const r=c.getBoundingClientRect();const s=e.touches?e.touches[0]:e;return[s.clientX-r.left,s.clientY-r.top];};
  c.onmousedown=e=>{A.signDraw=true;A.signCtx.beginPath();A.signCtx.moveTo(...gp(e));};
  c.onmousemove=e=>{if(!A.signDraw)return;A.signCtx.lineTo(...gp(e));A.signCtx.stroke();};
  c.onmouseup=()=>A.signDraw=false;
  c.ontouchstart=e=>{e.preventDefault();A.signDraw=true;A.signCtx.beginPath();A.signCtx.moveTo(...gp(e));};
  c.ontouchmove=e=>{e.preventDefault();if(!A.signDraw)return;A.signCtx.lineTo(...gp(e));A.signCtx.stroke();};
  c.ontouchend=()=>A.signDraw=false;
}
function clrSign(){if(A.signCtx)A.signCtx.clearRect(0,0,340,148);}
function confSign(){
  const name = document.getElementById('signName').value.trim();
  // ── REQUIRE name ──
  if(!name){
    document.getElementById('signName').style.borderColor='var(--red)';
    document.getElementById('signName').placeholder='⚠ Name is required';
    sT('Manager name is required before confirming','err');
    return;
  }
  // ── REQUIRE signature drawing ──
  const canvas = document.getElementById('signC');
  const ctx = canvas.getContext('2d');
  const blank = document.createElement('canvas');
  blank.width = canvas.width; blank.height = canvas.height;
  if(canvas.toDataURL() === blank.toDataURL()){
    sT('Signature is required — please sign before confirming','err');
    return;
  }
  // Reset field styling
  document.getElementById('signName').style.borderColor='';
  // Mark all scanned-out boxes as delivered
  const departureAt = new Date().toISOString();
  const arrivalAt = (A.storeArrivals||{})[A.currentStop];
  const storeMinutes = arrivalAt
    ? Math.round((new Date(departureAt) - new Date(arrivalAt)) / 60000)
    : null;
  A.scanoutBoxes.forEach(code=>{
    const tr=A.transfers.find(t=>t.btNum===code||t.barcode===code);
    if(tr){
      tr.status='delivered';
      tr.deliveredAt=departureAt;
      tr.deliveredBy=A.userName;
      tr.signedBy=name;
      tr.signedAt=departureAt;
      tr.storeArrivalAt=arrivalAt||null;
      tr.storeMinutes=storeMinutes;  // time at store in minutes
      fbSave('transfers',tr.id,tr);
    }
  });
  cmod(null,'signMod');
  sT('✅ Delivery signed by '+name,'ok');
  A.loadedBoxes=A.loadedBoxes.filter(c=>!A.scanoutBoxes.includes(c));
  A.scanoutBoxes=[];
  proceedToS2S();
}

// ════════════════════════════════════════
// DRIVER — RETURN TO DC
// ════════════════════════════════════════
function procReturn(code){
  // ── Check it was actually loaded on the truck ──
  const onTruck = A.loadedBoxes.some(lb => {
    const baseBT = lb.replace(/-DUP\d*$/,'');
    return baseBT === code || lb === code;
  });
  if(!onTruck){
    beep('fail');
    showSR('returnSR','fail','NOT ON TRUCK ❌','This box was not loaded on your truck today',code);
    return;
  }
  // ── Check it is a return box (status=return) ──
  const tr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
  if(tr && tr.status !== 'return' && !tr.viaTransit){
    beep('fail');
    showSR('returnSR','fail','NOT A RETURN ❌','This box is for a store — scan it out at the store stop',code);
    return;
  }
  // ── Duplicate check ──
  if(A.returnBoxes.includes(code)){
    beep('fail');
    showSR('returnSR','fail','DUPLICATE SCAN ⚠','Already scanned in — see popup',code);
    openDupModal(code,'return');
    return;
  }
  // ── Accept ──
  A.returnBoxes.push(code);
  if(tr){
    tr.status='return';
    tr.returnedAt=new Date().toISOString();
    tr.returnedBy=A.userName;
    fbSave('transfers',tr.id,tr);
  }
  beep('ok');
  const remaining = A.loadedBoxes.filter(lb=>{
    const tr2=A.transfers.find(t=>t.btNum===lb||t.barcode===lb);
    return tr2&&tr2.status==='return'&&tr2.viaTransit!==false&&!A.returnBoxes.includes(lb);
  }).length;
  showSR('returnSR','ok','SCANNED IN AT DC ✅',
    remaining > 0 ? remaining+' more box'+(remaining!==1?'es':'')+' to scan' : 'All return boxes scanned! ✅',
    code);
  renderReturnList();
  renderPendingReturns();
  updateDCStopCounter();
}
function getPendingReturns(){
  // Boxes that are returning to DC and have NOT been scanned in yet
  // Exclude boxes that are now loaded for final delivery (viaTransit cleared)
  return A.transfers.filter(t =>
    t.status === 'return' &&
    t.viaTransit !== false &&  // exclude ones already cleared for final delivery
    A.loadedBoxes.includes(t.btNum||t.barcode) &&
    !A.returnBoxes.includes(t.btNum||t.barcode)
  );
}

function renderReturnList(){
  // ── Remaining to scan ──
  const remaining = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t=>t.btNum===lb||t.barcode===lb);
    return tr && tr.status==='return' && tr.viaTransit!==false && !A.returnBoxes.includes(lb);
  });
  const remWrap = document.getElementById('pendingReturnsWrap');
  const remList = document.getElementById('pendingReturnsList');
  if(remWrap) remWrap.style.display = remaining.length > 0 ? 'block' : 'none';
  if(remList) remList.innerHTML = remaining.map(lb => {
    const tr = A.transfers.find(t=>t.btNum===lb||t.barcode===lb);
    return `<div style="background:rgba(248,81,73,.08);border:1px solid rgba(248,81,73,.3);border-radius:6px;padding:8px 10px;margin-bottom:4px">
      <div style="font-family:var(--fh);font-size:.95rem;letter-spacing:2px;color:var(--red)">${lb}</div>
      <div style="font-size:.68rem;color:var(--mut)">From: ${stName(tr?.fromStore||tr?.fromLoc||'Store')}</div>
    </div>`;
  }).join('');

  // ── Already scanned list ──
  const el = document.getElementById('returnList');
  if(el) el.innerHTML = A.returnBoxes.map(c =>
    `<div class="drow"><span style="font-family:var(--fh)">${c}</span><span class="badge b-delivered">IN AT DC ✅</span></div>`
  ).join('') || '';

  renderPendingReturns();
}

function renderPendingReturns(){
  const pending = getPendingReturns();
  const wrap = document.getElementById('pendingReturnsWrap');
  const list = document.getElementById('pendingReturnsList');
  const allDone = document.getElementById('allReturnsScanned');
  const endBtn = document.getElementById('endDayBtn');
  const blocked = document.getElementById('endDayBlocked');
  const cntEl = document.getElementById('pendingCount');

  // Count ALL return boxes including those not yet in transfers (still in loadedBoxes)
  const returnOnTruck = A.loadedBoxes.filter(lb => {
    const tr = A.transfers.find(t => t.btNum===lb||t.barcode===lb);
    // Exclude boxes that have been cleared for final delivery (no longer returning to DC)
    return tr && tr.status==='return' && tr.viaTransit !== false && !A.returnBoxes.includes(lb);
  });

  if(returnOnTruck.length > 0){
    if(wrap) wrap.style.display = 'block';
    if(allDone) allDone.style.display = 'none';
    if(endBtn) endBtn.style.display = 'none';
    if(blocked) blocked.style.display = 'block';
    if(cntEl) cntEl.textContent = returnOnTruck.length;
    if(list) list.innerHTML = returnOnTruck.map(c => {
      const tr = A.transfers.find(t=>t.btNum===c||t.barcode===c);
      return `<div class="drow" style="background:rgba(248,81,73,.06);border-radius:4px;padding:6px 8px;margin-bottom:3px">
        <div>
          <div style="font-family:var(--fh);font-size:.85rem;letter-spacing:1.5px;color:var(--red)">${c}</div>
          ${tr?`<div style="font-size:.68rem;color:var(--mut)">From: ${stName(tr.fromStore||tr.fromLoc)}</div>`:''}
        </div>
        <span class="badge b-missing">ON TRUCK</span>
      </div>`;
    }).join('');
  } else {
    // No pending returns — show end day button
    if(wrap) wrap.style.display = 'none';
    if(blocked) blocked.style.display = 'none';
    // Only show "all done" and end button if driver has actually been on a route
    if(A.routeStarted){
      if(allDone) allDone.style.display = 'block';
      if(endBtn) endBtn.style.display = 'block';
    } else {
      // No returns at all — just show end day button
      if(allDone) allDone.style.display = 'none';
      if(endBtn) endBtn.style.display = 'block';
    }
  }
}
function endDayConfirm(){
  const pending = getPendingReturns();
  if(pending.length > 0){
    sT(`⚠ ${pending.length} return box(es) still on truck — scan them first`, 'err');
    return;
  }
  if(!confirm(`End day for ${A.userName}? This will log you out and clear your session.`)) return;

  // Clear ONLY this driver's session — transfers/reports stay intact
  const saved = JSON.parse(localStorage.getItem('pnajhb4')||'{}');
  delete saved.session; // clear session so no resume banner on next login
  localStorage.setItem('pnajhb4', JSON.stringify(saved));

  sT('Day ended — logged out. See you tomorrow! 👋','ok');

  // Complete wipe — driver gets a totally fresh start
  A.role=null; A.userName=''; A.userCode='';
  A.driverRoute=null; A.loadedBoxes=[]; A.routeStarted=false;
  A.scanoutBoxes=[]; A.returnBoxes=[]; A.stopsDone=[]; A.stopExpected=[];
  A._sessionRestored=false;
  // Clear selected stops so route screen is blank
  selectedStops=[];
  // Clear transfers from local display — already in Firebase
  A.transfers=[];
  A.labels=[];
  // Wipe the entire localStorage session for this driver
  try{
    const saved = JSON.parse(localStorage.getItem('pnajhb4')||'{}');
    // Keep drivers, stores, routes, mgmt settings — wipe session and transfers
    delete saved.session;
    saved.transfers=[];
    saved.labels=[];
    localStorage.setItem('pnajhb4', JSON.stringify(saved));
  }catch(e){}

  // Sign out of Firebase then reload for clean start
  setTimeout(async ()=>{
    if(window._fb && window._fb.signOut) await window._fb.signOut();
    window.location.reload();
  }, 1500);
}

// ════════════════════════════════════════
// REGISTER BOX (DC + Management)
// ════════════════════════════════════════
function setupRegInputs(){
  setupScanInput('regInput',code=>procRegister(code,document.getElementById('regDestStore')?.value));
  setupScanInput('dcRegInput',code=>procRegister(code,document.getElementById('dcDestStore')?.value,'dc'));
}
function manualRegister(){
  const code=document.getElementById('regInput').value.trim().toUpperCase();
  const dest=document.getElementById('regDestStore').value;
  if(code)procRegister(code,dest);
}
function procRegister(code,destStore,src='mgmt'){
  if(!code){return;}
  const srEl=src==='dc'?'dcRegSR':'regSR';
  const p=parseBT(code);
  // Use override store if provided, otherwise read from BT number
  const toStore=destStore||p?.to||'';
  const fromStore=p?.from||'01';
  const ex=A.transfers.find(t=>t.btNum===code||t.barcode===code);
  if(ex){beep('fail');showSR(srEl,'warn','DUPLICATE','Already registered. Using existing record.',code);return;}
  const tr=makeTr(code,fromStore,toStore,A.userName);
  A.transfers.unshift(tr);
  fbSave('transfers',tr.id,tr);
  beep('ok');
  showSR(srEl,'ok','REGISTERED ✅','Box registered for '+stName(toStore),code);
  renderRegLog(src);
  sT('Registered: '+code,'ok');
}
function renderRegLog(src='mgmt'){
  const el=document.getElementById(src==='dc'?'dcRegLog':'regLog');if(!el)return;
  const recent=A.transfers.filter(t=>t.status==='registered').slice(0,10);
  if(!recent.length){el.innerHTML='<div style="color:var(--mut);font-size:.75rem;text-align:center;padding:8px">None yet</div>';return;}
  el.innerHTML=recent.map(t=>`<div class="drow"><span style="font-family:var(--fh);font-size:.82rem">${t.btNum}</span><span style="font-size:.7rem;color:var(--mut)">${stName(t.toStore)} · ${fD(t.dispatchedAt)}</span></div>`).join('');
}
// ── Duplicate slot helpers ──
function baseBT(code){
  return String(code||'').replace(/-DUP\d+$/,'').replace(/-\d+$/,'');
}
function nextLoadedSlot(code){
  const base = baseBT(code);
  const count = A.loadedBoxes.filter(c => baseBT(c) === base).length;
  return count === 0 ? base : base + '-DUP' + (count + 1);
}
function nextUnscannedSlot(code){
  const base = baseBT(code);
  return (A.stopExpected||[]).find(slot =>
    baseBT(slot) === base && !A.scanoutBoxes.includes(slot)
  );
}

function makeTr(code,from,to,by){
  return{id:'TR-'+Date.now()+Math.random().toString(36).slice(2,6).toUpperCase(),btNum:code,barcode:code,fromLoc:from,toLoc:to,toStore:to,fromStore:from,status:'registered',dispatchedAt:new Date().toISOString(),dispatchedBy:by,deliveredAt:null,deliveredBy:null,signedBy:'',signedAt:null,route:'',shortAt:null,shortBy:'',overridePin:'',overrideReason:'',s2s:false,fragile:false,damageNotes:''};
}
function parseBT(c){
  // Accept numeric BT format: 4-digit ID + 2-digit from + 2-digit to + date
  if(!/^\d{8,}/.test(c))return null;
  const fromNum=c.substring(4,6);
  const toNum=c.substring(6,8);
  // Resolve numeric BT codes to store letter codes
  const fromStore=A.stores.find(s=>s.btNum===fromNum);
  const toStore=A.stores.find(s=>s.btNum===toNum);
  return{
    id:c.substring(0,4),
    fromNum,toNum,
    from:fromStore?fromStore.code:fromNum,
    to:toStore?toStore.code:toNum,
    fromName:fromStore?fromStore.name:'DC ('+fromNum+')',
    toName:toStore?toStore.name:'Unknown ('+toNum+')'
  };
}

// ════════════════════════════════════════
// STORE VIEW
// ════════════════════════════════════════
let storeRptFilter = 'all';

function setStoreTab(tab, el){
  ['inbound','history','search'].forEach(t=>{
    const el2 = document.getElementById('storeTab'+t.charAt(0).toUpperCase()+t.slice(1));
    if(el2) el2.style.display = t===tab?'block':'none';
  });
  document.querySelectorAll('.ftab').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  if(tab==='history') renderStoreReport();
}

function setStoreRptFilter(f, el){
  storeRptFilter = f;
  document.querySelectorAll('#storeTabHistory .ftab').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  renderStoreReport();
}

function renderStoreView(){
  const code = A.userCode;
  const todayStr = new Date().toISOString().slice(0,10);

  // All transfers for this store excluding DUPs
  const all = A.transfers.filter(t=>
    resolveStoreCode(t.toStore||t.toLoc||'')===code && !t.btNum?.includes('-DUP')
  );

  // Today only for live counts
  const todayAll = all.filter(t=>(t.loadedAt||t.dispatchedAt||'').slice(0,10)===todayStr);

  const inbound   = all.filter(t=>['transit','loaded'].includes(t.status));
  const delivered = todayAll.filter(t=>t.status==='delivered');
  const short     = all.filter(t=>t.status==='short');

  document.getElementById('storeInTransit').textContent = inbound.length;
  document.getElementById('storeDelivered').textContent = delivered.length;
  document.getElementById('storeShort').textContent     = short.length;
  document.getElementById('storeTotal').textContent     = all.length;
  document.getElementById('storeHomeBanner').textContent = '🏪 ' + A.userName;

  // Default report dates
  const rFrom = document.getElementById('storeRptFrom');
  const rTo   = document.getElementById('storeRptTo');
  if(rFrom && !rFrom.value) rFrom.value = new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  if(rTo && !rTo.value) rTo.value = new Date().toISOString().slice(0,10);

  // ── INBOUND — group by driver ──
  const inEl = document.getElementById('storeInboundList');
  if(!inbound.length){
    inEl.innerHTML = '<div class="empty"><div class="ei">📦</div><p>Nothing on the way yet</p><p style="font-size:.65rem;color:var(--mut);margin-top:4px">Updates automatically when driver loads your boxes</p></div>';
  } else {
    const byDriver = {};
    inbound.forEach(t=>{
      const d = t.loadedBy||t.dispatchedBy||'Driver';
      if(!byDriver[d]) byDriver[d] = {name:d, route:t.route||'', boxes:[]};
      byDriver[d].boxes.push(t);
    });
    inEl.innerHTML = Object.values(byDriver).map(d=>`
      <div class="stop-item" style="border-left:3px solid var(--acc)">
        <div class="stop-head">
          <div>
            <div class="stop-name">🚛 ${d.name}</div>
            <div class="stop-detail">${d.route||'En route'} · ${d.boxes.length} box${d.boxes.length!==1?'es':''} for you</div>
          </div>
          <span class="badge b-transit">${d.boxes.length} INBOUND</span>
        </div>
        ${d.boxes.map(t=>`
          <div class="drow" style="padding:4px 0">
            <span style="font-family:var(--fh);font-size:.82rem;letter-spacing:1px">${t.btNum}</span>
            ${stBdg(t.status)}
          </div>`).join('')}
      </div>`).join('');
  }

  // ── DELIVERED TODAY ──
  const delEl = document.getElementById('storeDeliveredList');
  if(!delivered.length){
    delEl.innerHTML = '<div style="color:var(--mut);font-size:.75rem;text-align:center;padding:10px">No deliveries today yet</div>';
  } else {
    delEl.innerHTML = `<div style="font-family:var(--fh);font-size:.6rem;letter-spacing:1.5px;color:var(--grn);margin-bottom:8px;text-transform:uppercase">✅ Delivered Today (${delivered.length})</div>` +
    delivered.map(t=>`
      <div class="ti delivered">
        <div class="ti-top">
          <div>
            <div class="ti-bt">${t.btNum}</div>
            <div class="ti-route">By: ${t.deliveredBy||'—'} · Signed: ${t.signedBy||'—'}</div>
          </div>
          ${stBdg(t.status)}
        </div>
        <div class="ti-meta"><span>${fD(t.deliveredAt)}</span></div>
      </div>`).join('');
  }

  // ── SHORT DELIVERIES ──
  if(short.length){
    delEl.innerHTML += `<div style="font-family:var(--fh);font-size:.6rem;letter-spacing:1.5px;color:var(--red);margin:10px 0 6px;text-transform:uppercase">⚠ Short Deliveries (${short.length})</div>` +
    short.map(t=>`
      <div class="ti" style="border-left:3px solid var(--red)">
        <div class="ti-top">
          <div>
            <div class="ti-bt">${t.btNum}</div>
            <div class="ti-route">${t.overrideReason||'Short delivery'}</div>
          </div>
          ${stBdg('short')}
        </div>
        <div class="ti-meta"><span>${t.deliveredBy||'—'}</span><span>${fD(t.shortAt||t.deliveredAt)}</span></div>
      </div>`).join('');
  }
}

function renderStoreReport(){
  const code = A.userCode;
  const from = document.getElementById('storeRptFrom')?.value||'';
  const to   = document.getElementById('storeRptTo')?.value||'';
  const tbody = document.getElementById('storeRptBody');
  if(!tbody) return;

  // Get all transfers for this store — exclude DUP records
  let rows = A.transfers.filter(t => {
    if(t.btNum?.includes('-DUP')) return false; // DUPs are same physical box
    const dest = resolveStoreCode(t.toStore||t.toLoc||'');
    if(dest !== code) return false;
    if(storeRptFilter !== 'all' && t.status !== storeRptFilter) return false;
    // Use the most relevant date for filtering
    const date = t.deliveredAt || t.loadedAt || t.dispatchedAt || '';
    if(from && date < from) return false;
    if(to   && date > to+'T23:59:59') return false;
    return true;
  }).sort((a,b) => {
    const da = a.deliveredAt||a.loadedAt||a.dispatchedAt||'';
    const db = b.deliveredAt||b.loadedAt||b.dispatchedAt||'';
    return db.localeCompare(da); // newest first
  });

  // Summary stats for this store
  const delivered = rows.filter(t=>t.status==='delivered').length;
  const short     = rows.filter(t=>t.status==='short').length;
  const inbound   = rows.filter(t=>['transit','loaded'].includes(t.status)).length;

  tbody.innerHTML = rows.length ? rows.map(t => {
    const date = t.deliveredAt || t.loadedAt || t.dispatchedAt;
    const statusRow = t.status==='delivered'
      ? `style="background:rgba(63,185,80,.03)"`
      : t.status==='short'
      ? `style="background:rgba(248,81,73,.04)"`
      : '';
    return `<tr ${statusRow}>
      <td style="font-family:var(--fh);font-size:.82rem;letter-spacing:1px">${t.btNum}</td>
      <td>${stBdg(t.status)}</td>
      <td style="font-size:.68rem">${t.deliveredBy||t.dispatchedBy||'—'}</td>
      <td style="font-size:.65rem">${fD(date)}</td>
      <td style="font-size:.68rem">${t.signedBy||'—'}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--mut);padding:10px">No records found for this period</td></tr>';
}

function searchMgmtBT(){
  const q = (document.getElementById('mgmtBTSearch')?.value||'').trim().toUpperCase();
  const el = document.getElementById('mgmtBTResult');
  if(!el) return;
  if(q.length < 3){
    el.innerHTML = '<div style="color:var(--mut);font-size:.78rem">Type at least 3 characters</div>';
    return;
  }
  const results = A.transfers.filter(t => {
    const bt = (t.btNum||t.barcode||'').toUpperCase();
    // Match anywhere in BT — but first 4 digits are the unique ID
    return bt.includes(q) || bt.substring(0,4) === q;
  });
  if(!results.length){
    el.innerHTML = `<div class="alert al-r">❌ No record found for "${q}"</div>`;
    return;
  }
  el.innerHTML = results.map(t => {
    const dest = t.finalDest && !t.viaTransit ? t.finalDest : (t.toStore||t.toLoc||'');
    const date = t.deliveredAt||t.loadedAt||t.dispatchedAt||'';
    return `<div class="card" style="margin-bottom:8px">
      <div style="font-family:var(--fh);font-size:1rem;letter-spacing:2px;color:var(--acc);margin-bottom:8px">${t.btNum}</div>
      <div class="drow"><span class="dk">Status</span><span>${stBdg(t.status)}</span></div>
      <div class="drow"><span class="dk">From</span><span class="dv">${stName(t.fromStore||t.fromLoc||'DC')}</span></div>
      <div class="drow"><span class="dk">To</span><span class="dv">${stName(dest)}</span></div>
      ${t.viaTransit?`<div class="drow"><span class="dk">Via DC</span><span class="dv" style="color:var(--acc2)">Yes — final dest: ${stName(t.finalDest)}</span></div>`:''}
      <div class="drow"><span class="dk">Driver</span><span class="dv">${t.deliveredBy||t.loadedBy||t.dispatchedBy||'—'}</span></div>
      <div class="drow"><span class="dk">Route</span><span class="dv">${t.route||'—'}</span></div>
      <div class="drow"><span class="dk">Loaded</span><span class="dv">${fD(t.loadedAt||t.dispatchedAt)}</span></div>
      <div class="drow"><span class="dk">Delivered</span><span class="dv">${t.deliveredAt?fD(t.deliveredAt):'Not yet'}</span></div>
      <div class="drow"><span class="dk">Signed By</span><span class="dv">${t.signedBy||'—'}</span></div>
      ${t.status==='return'?`<div class="drow"><span class="dk">Returned At</span><span class="dv">${fD(t.returnedAt)}</span></div>`:''}
      ${t.status==='short'?`<div class="alert al-r" style="margin-top:6px">⚠ Short delivery: ${t.overrideReason||'No reason given'}</div>`:''}
      ${t.s2s?`<div class="alert al-b" style="margin-top:6px">🔄 Store-to-store transfer</div>`:''}
    </div>`;
  }).join('');
}

function searchStoreBT(){
  const q = (document.getElementById('storeBTSearch')?.value||'').trim().toUpperCase();
  const el = document.getElementById('storeBTResult');
  if(!el) return;
  if(q.length < 4){ el.innerHTML='<div style="color:var(--mut);font-size:.78rem">Type at least 4 characters</div>'; return; }
  const code = A.userCode;
  const results = A.transfers.filter(t=>{
    const dest = resolveStoreCode(t.toStore||t.toLoc||'');
    if(dest !== code) return false;
    const bt = (t.btNum||t.barcode||'').toUpperCase();
    return bt.includes(q) || bt.substring(0,4) === q;
  });
  if(!results.length){
    el.innerHTML=`<div class="alert al-r">❌ No record found for "${q}" at your store</div>`;
    return;
  }
  el.innerHTML = results.map(t=>`
    <div class="card" style="margin-bottom:8px">
      <div style="font-family:var(--fh);font-size:1rem;letter-spacing:2px;color:var(--acc);margin-bottom:8px">${t.btNum}</div>
      <div class="drow"><span class="dk">Status</span><span>${stBdg(t.status)}</span></div>
      <div class="drow"><span class="dk">From</span><span class="dv">${stName(t.fromStore||t.fromLoc)}</span></div>
      <div class="drow"><span class="dk">Driver</span><span class="dv">${t.deliveredBy||t.dispatchedBy||'—'}</span></div>
      <div class="drow"><span class="dk">Dispatched</span><span class="dv">${fD(t.dispatchedAt)}</span></div>
      <div class="drow"><span class="dk">Delivered</span><span class="dv">${t.deliveredAt?fD(t.deliveredAt):'Not yet'}</span></div>
      <div class="drow"><span class="dk">Signed By</span><span class="dv">${t.signedBy||'—'}</span></div>
      ${t.status==='short'?`<div class="alert al-r" style="margin-top:6px">⚠ Short delivery: ${t.overrideReason||'No reason given'}</div>`:''}
    </div>`).join('');
}

function printStoreReport(){
  renderStoreReport();
  const code = A.userCode;
  const rows = document.getElementById('storeRptBody')?.innerHTML||'';
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Transfer Report — ${A.userName}</title>
  <style>body{font-family:Arial,sans-serif;padding:20px;font-size:12px}
  h2{margin-bottom:4px}p{color:#666;margin-bottom:14px}
  table{width:100%;border-collapse:collapse}
  th{background:#f0f0f0;padding:6px 8px;text-align:left;border-bottom:2px solid #ccc;font-size:11px}
  td{padding:5px 8px;border-bottom:1px solid #eee}
  .badge{padding:2px 6px;border-radius:10px;font-size:10px;font-weight:bold}
  @media print{button{display:none}}</style></head><body>
  <h2>PNA JHB — Transfer Report</h2>
  <p>Store: ${A.userName} | Printed: ${new Date().toLocaleString('en-ZA')}</p>
  <table><thead><tr><th>BT Number</th><th>Status</th><th>Driver</th><th>Date</th><th>Signed By</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <br><button onclick="window.print()">🖨 Print</button>
  </body></html>`);
  w.document.close();
  setTimeout(()=>w.print(), 400);
}

// ════════════════════════════════════════
// MANAGEMENT — DASHBOARD
// ════════════════════════════════════════
function renderDash(){
  // ── Filter to TODAY only ──
  const todayStr = new Date().toISOString().slice(0,10);
  const todayAll = A.transfers.filter(t => {
    if(t.btNum?.includes('-DUP')) return false;
    const date = (t.loadedAt||t.dispatchedAt||'').slice(0,10);
    return date === todayStr;
  });

  // Date banner
  const banner = document.getElementById('dashDateBanner');
  if(banner) banner.textContent = '📅 TODAY: ' + new Date().toLocaleDateString('en-ZA',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  // Stats
  document.getElementById('mgTotal').textContent     = todayAll.length;
  document.getElementById('mgTransit').textContent   = todayAll.filter(t=>['transit','loaded'].includes(t.status)).length;
  document.getElementById('mgDelivered').textContent = todayAll.filter(t=>t.status==='delivered').length;
  document.getElementById('mgReturns').textContent   = todayAll.filter(t=>t.status==='return').length;
  document.getElementById('mgMissing').textContent   = todayAll.filter(t=>t.status==='short').length;

  const el = document.getElementById('liveTracker');
  const noAct = document.getElementById('dashNoActivity');

  if(!todayAll.length){
    el.innerHTML = '';
    if(noAct) noAct.style.display = 'block';
    chkMiss(); return;
  }
  if(noAct) noAct.style.display = 'none';

  // ── Group by driver ──
  const driverMap = {};
  todayAll.forEach(t => {
    const driver = t.deliveredBy || t.loadedBy || t.dispatchedBy || 'Unknown Driver';
    if(!driverMap[driver]) driverMap[driver] = {
      name: driver, route: t.route||'Custom',
      loaded:[], delivered:[], short:[], returns:[], enRoute:[], overrides:[]
    };
    driverMap[driver].loaded.push(t);
    if(t.status==='delivered')  driverMap[driver].delivered.push(t);
    if(t.status==='short')      driverMap[driver].short.push(t);
    if(t.status==='return')     driverMap[driver].returns.push(t);
    if(['transit','loaded'].includes(t.status)) driverMap[driver].enRoute.push(t);
    if(t.overridePin)           driverMap[driver].overrides.push(t);
  });

  el.innerHTML = Object.values(driverMap).map(d => {
    const pct = d.loaded.length > 0 ? Math.round(d.delivered.length/d.loaded.length*100) : 0;
    const barCol = pct===100?'var(--grn)':pct>60?'var(--acc2)':'var(--acc)';
    // Last delivery
    const lastDel = d.delivered.sort((a,b)=>new Date(b.deliveredAt)-new Date(a.deliveredAt))[0];
    // Stores delivered to today
    const storesDone = [...new Set(d.delivered.map(t=>stName(t.toStore||t.toLoc)))].join(', ');

    return `<div class="card" style="margin-bottom:8px;border-left:4px solid ${pct===100?'var(--grn)':d.short.length?'var(--red)':'var(--acc)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-family:var(--fh);font-size:.9rem;letter-spacing:1px">🚛 ${d.name}</div>
          <div style="font-size:.7rem;color:var(--mut);margin-top:2px">Route: ${d.route}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--fh);font-size:1.4rem;color:${barCol}">${d.delivered.length}/${d.loaded.length}</div>
          <div style="font-size:.65rem;color:var(--mut)">delivered</div>
        </div>
      </div>
      <!-- Progress bar -->
      <div style="background:var(--sur2);border-radius:4px;height:6px;margin-bottom:8px">
        <div style="background:${barCol};width:${pct}%;height:100%;border-radius:4px;transition:width .4s"></div>
      </div>
      <!-- Stats row -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
        <div style="font-size:.7rem;color:var(--grn)">✅ ${d.delivered.length} delivered</div>
        <div style="font-size:.7rem;color:var(--acc2)">🚛 ${d.enRoute.length} en route</div>
        ${d.returns.length?`<div style="font-size:.7rem;color:var(--pur)">🔄 ${d.returns.length} return to DC</div>`:''}
        ${d.short.length?`<div style="font-size:.7rem;color:var(--red)">⚠ ${d.short.length} short</div>`:''}
        ${d.overrides.length?`<div style="font-size:.7rem;color:var(--acc2)">🔑 ${d.overrides.length} override${d.overrides.length>1?'s':''}</div>`:''}
      </div>
      ${d.returns.length?`<div style="background:rgba(130,80,255,.08);border-radius:4px;padding:5px 8px;margin-top:4px;font-size:.68rem;color:var(--pur)">
        🔄 Returns to DC: ${d.returns.map(t=>t.btNum).join(', ')}
      </div>`:''}
      ${lastDel?`<div style="font-size:.68rem;color:var(--mut)">Last delivery: ${stName(lastDel.toStore||lastDel.toLoc)} at ${fD(lastDel.deliveredAt)}</div>`:''}
      ${storesDone?`<div style="font-size:.65rem;color:var(--mut);margin-top:2px">Stores: ${storesDone}</div>`:''}
      ${d.short.length?`<div style="background:rgba(248,81,73,.08);border-radius:4px;padding:5px 8px;margin-top:6px;font-size:.68rem;color:var(--red)">
        ⚠ Short deliveries: ${d.short.map(t=>stName(t.toStore||t.toLoc)).join(', ')}
      </div>`:''}
    </div>`;
  }).join('');

  chkMiss();
}

// ════════════════════════════════════════
// MANAGEMENT — TRANSFERS LIST
// ════════════════════════════════════════
let TF='all';
function setTF(f,el){TF=f;document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderTransfers();}
function renderTransfers(){
  const q=(document.getElementById('srch')?.value||'').toLowerCase();
  const list=A.transfers.filter(t=>{
    const mf=TF==='all'||t.status===TF;
    const ms=!q||t.btNum?.toLowerCase().includes(q)||(t.toStore||'').toLowerCase().includes(q)||(t.route||'').toLowerCase().includes(q)||(t.dispatchedBy||'').toLowerCase().includes(q);
    return mf&&ms;
  });
  const el=document.getElementById('trList');
  if(!list.length){el.innerHTML='<div class="empty"><div class="ei">📋</div><p>No transfers found</p></div>';return;}
  el.innerHTML=list.map(t=>`
    <div class="ti ${t.status}" onclick='openDet(${JSON.stringify(t).replace(/'/g,"&#39;")})'>
      <div class="ti-top">
        <div><div class="ti-bt">${t.btNum}</div>
        <div class="ti-route">${stName(t.fromStore||t.fromLoc)} → ${stName(t.toStore||t.toLoc)}</div>
        ${t.route?`<div style="font-size:.62rem;color:var(--mut)">Route: ${t.route}</div>`:''}
        ${t.status==='short'?`<div style="font-size:.62rem;color:var(--red)">⚠ Short: ${t.overrideReason||'—'}</div>`:''}
        </div>
        ${stBdg(t.status)}
      </div>
      <div class="ti-meta"><span>${t.dispatchedBy||''}</span><span>${fD(t.dispatchedAt)}</span></div>
    </div>`).join('');
}

// ════════════════════════════════════════
// MANAGEMENT — REPORTS
// ════════════════════════════════════════
let rptTab = 'summary';

function setRptTab(tab, el){
  rptTab = tab;
  ['summary','timing','detail','short','returns','btsearch'].forEach(t => {
    const el2 = document.getElementById('rptTab'+t.charAt(0).toUpperCase()+t.slice(1));
    if(el2) el2.style.display = t===tab ? 'block' : 'none';
  });
  document.querySelectorAll('#view-mgmt-reports .ftab').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  renderReports();
}

function getFilteredTransfers(){
  const from = document.getElementById('rFrom')?.value||'';
  const to   = document.getElementById('rTo')?.value||'';
  const q    = (document.getElementById('rptSearch')?.value||'').toLowerCase();
  // Exclude DUP records from counts — they are duplicates of the same physical box
  return A.transfers.filter(t => {
    if(t.btNum?.includes('-DUP')) return false; // skip dup records in reports
    if(from && (t.loadedAt||t.dispatchedAt||'') < from) return false;
    if(to   && (t.loadedAt||t.dispatchedAt||'') > to+'T23:59:59') return false;
    if(q && !t.btNum?.toLowerCase().includes(q) &&
            !stName(t.toStore).toLowerCase().includes(q) &&
            !(t.deliveredBy||t.dispatchedBy||'').toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderReports(){
  const f = getFilteredTransfers();

  // ── Stats ──
  const delivered = f.filter(t=>t.status==='delivered');
  const inTransit = f.filter(t=>['transit','loaded'].includes(t.status));
  const shorts    = f.filter(t=>t.status==='short');
  const returns   = f.filter(t=>t.status==='return');
  const statsEl   = document.getElementById('rptStats');
  if(statsEl) statsEl.innerHTML = [
    [delivered.length,'Delivered','var(--grn)'],
    [inTransit.length,'En Route','var(--acc)'],
    [shorts.length,'⚠ Short','var(--red)'],
    [returns.length,'Returned','var(--pur)']
  ].map(([n,l,c])=>`<div class="sc"><div class="sn" style="color:${c}">${n}</div><div class="sl">${l}</div></div>`).join('');

  // ── By store summary ──
  const storeRepEl = document.getElementById('storeRep');
  if(storeRepEl){
    // Group by destination store
    const storeMap = {};
    f.forEach(t => {
      const s = resolveStoreCode(t.toStore||t.toLoc||'');
      if(!s) return;
      // Use 'DC' as a valid destination — boxes intentionally sent to DC
      const displayKey = (s==='DC'||s==='01'||s==='00') ? 'DC' : s;
      if(!storeMap[displayKey]) storeMap[displayKey] = {loaded:0,delivered:0,short:0,returned:0};
      if(['loaded','transit'].includes(t.status)) storeMap[displayKey].loaded++;
      if(t.status==='delivered') storeMap[displayKey].delivered++;
      if(t.status==='short')     storeMap[displayKey].short++;
      if(t.status==='return')    storeMap[displayKey].returned++;
    });
    const storeRows = Object.entries(storeMap)
      .sort((a,b)=>stName(a[0]).localeCompare(stName(b[0])))
      .map(([code,d])=>{
        const total = d.delivered + d.short + d.loaded;
        const pct   = total > 0 ? Math.round(d.delivered/total*100) : 0;
        return `<tr>
          <td style="font-size:.75rem">${stName(code)}</td>
          <td style="text-align:center">${d.loaded||0}</td>
          <td style="text-align:center;color:var(--grn);font-weight:600">${d.delivered}</td>
          <td style="text-align:center;color:${d.short>0?'var(--red)':'var(--mut)'}">${d.short}</td>
          <td style="text-align:center;color:var(--pur)">${d.returned}</td>
          <td style="text-align:center;color:${pct===100?'var(--grn)':pct>70?'var(--acc2)':'var(--red)'}">${pct}%</td>
        </tr>`;
      }).join('');
    storeRepEl.innerHTML = storeRows || '<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:10px">No data</td></tr>';
  }

  // ── By driver summary ──
  const driverRepEl = document.getElementById('driverRep');
  if(driverRepEl){
    const driverMap = {};
    f.forEach(t => {
      const d = t.deliveredBy || t.loadedBy || t.dispatchedBy || '';
      if(!d) return;
      if(!driverMap[d]) driverMap[d] = {loaded:0,delivered:0,short:0,times:[]};
      driverMap[d].loaded++;
      if(t.status==='delivered'){
        driverMap[d].delivered++;
        if(t.deliveredAt && t.loadedAt){
          driverMap[d].times.push(Math.round((new Date(t.deliveredAt)-new Date(t.loadedAt))/60000));
        }
      }
      if(t.status==='short') driverMap[d].short++;
    });
    const driverRows = Object.entries(driverMap)
      .sort((a,b)=>b[1].delivered-a[1].delivered)
      .map(([name,d])=>{
        const avg = d.times.length ? Math.round(d.times.reduce((a,b)=>a+b,0)/d.times.length) : 0;
        const avgStr = avg > 60 ? Math.round(avg/60)+'h '+(avg%60)+'m' : avg+'m';
        return `<tr>
          <td style="font-size:.75rem">${name}</td>
          <td style="text-align:center">${d.loaded}</td>
          <td style="text-align:center;color:var(--grn);font-weight:600">${d.delivered}</td>
          <td style="text-align:center;color:${d.short>0?'var(--red)':'var(--mut)'}">${d.short}</td>
          <td style="text-align:center;color:var(--mut);font-size:.7rem">${d.times.length?avgStr:'—'}</td>
        </tr>`;
      }).join('');
    driverRepEl.innerHTML = driverRows || '<tr><td colspan="5" style="text-align:center;color:var(--mut);padding:10px">No data</td></tr>';
  }

  // ── Detail table ──
  const allRepEl = document.getElementById('allRep');
  if(allRepEl){
    allRepEl.innerHTML = f.map(t=>{
      const loaded = t.loadedAt || t.dispatchedAt;
      const delta = t.deliveredAt && loaded
        ? (() => { const m=Math.round((new Date(t.deliveredAt)-new Date(loaded))/60000); return m>60?Math.round(m/60)+'h '+(m%60)+'m':m+'m'; })()
        : '—';
      return `<tr>
        <td style="font-family:var(--fh);font-size:.78rem">${t.btNum}</td>
        <td style="font-size:.7rem">${stName(t.toStore||t.toLoc)}</td>
        <td>${stBdg(t.status)}</td>
        <td style="font-size:.68rem">${t.deliveredBy||t.dispatchedBy||'—'}</td>
        <td style="font-size:.62rem">${fD(loaded)}</td>
        <td style="font-size:.62rem">${t.deliveredAt?fD(t.deliveredAt):'—'}</td>
        <td style="font-size:.65rem;color:var(--acc2)">${delta}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--mut);padding:10px">No transfers found</td></tr>';
  }

  // ── Short deliveries ──
  const shortEl = document.getElementById('shortRep');
  if(shortEl){
    const shortRows = f.filter(t=>t.status==='short');
    shortEl.innerHTML = shortRows.map(t=>`<tr>
      <td style="font-family:var(--fh);font-size:.78rem">${t.btNum}</td>
      <td style="font-size:.7rem">${stName(t.toStore)}</td>
      <td style="font-size:.68rem">${t.deliveredBy||t.dispatchedBy||'—'}</td>
      <td style="font-size:.62rem">${fD(t.shortAt||t.deliveredAt)}</td>
      <td style="font-size:.7rem">${t.overrideReason||'—'}</td>
    </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--mut);padding:10px">No short deliveries ✅</td></tr>';
  }

  // ── Timing: per driver per store ──
  const timingEl = document.getElementById('timingRep');
  const storeTimingEl = document.getElementById('storeTimingRep');
  if(timingEl || storeTimingEl){
    // Build map: driverName → storeName → [minutes]
    const driverStoreMap = {};
    const storeOnlyMap   = {};
    f.forEach(t => {
      if(t.status !== 'delivered') return;
      if(!t.deliveredAt || !t.loadedAt) return;
      const mins = Math.round((new Date(t.deliveredAt) - new Date(t.loadedAt)) / 60000);
      if(mins <= 0 || mins > 600) return; // ignore obviously wrong values
      const driver = t.deliveredBy || t.loadedBy || '—';
      const store  = stName(resolveStoreCode(t.toStore||t.toLoc||''));
      // Per driver per store
      const key = driver + '||' + store;
      if(!driverStoreMap[key]) driverStoreMap[key] = {driver, store, times:[]};
      driverStoreMap[key].times.push(mins);
      // Per store only
      if(!storeOnlyMap[store]) storeOnlyMap[store] = {times:[], byDriver:{}};
      storeOnlyMap[store].times.push(mins);
      if(!storeOnlyMap[store].byDriver[driver]) storeOnlyMap[store].byDriver[driver] = [];
      storeOnlyMap[store].byDriver[driver].push(mins);
    });

    const fmtMin = m => m >= 60 ? Math.floor(m/60)+'h '+(m%60)+'m' : m+'m';
    const avg = arr => Math.round(arr.reduce((a,b)=>a+b,0)/arr.length);

    if(timingEl){
      const rows = Object.values(driverStoreMap)
        .sort((a,b) => a.driver.localeCompare(b.driver) || a.store.localeCompare(b.store))
        .map(d => {
          const a = avg(d.times);
          const fast = Math.min(...d.times);
          const slow = Math.max(...d.times);
          const colour = a < 60 ? 'var(--grn)' : a < 120 ? 'var(--acc2)' : 'var(--red)';
          return `<tr>
            <td style="font-size:.72rem">${d.driver}</td>
            <td style="font-size:.72rem">${d.store}</td>
            <td style="text-align:center">${d.times.length}</td>
            <td style="text-align:center;font-weight:600;color:${colour}">${fmtMin(a)}</td>
            <td style="text-align:center;color:var(--grn);font-size:.68rem">${fmtMin(fast)}</td>
            <td style="text-align:center;color:var(--red);font-size:.68rem">${fmtMin(slow)}</td>
          </tr>`;
        }).join('');
      timingEl.innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:10px">No store timing data yet — requires NFC to be enabled and deliveries completed</td></tr>';
    }

    if(storeTimingEl){
      const rows = Object.entries(storeOnlyMap)
        .sort((a,b) => avg(b[1].times) - avg(a[1].times)) // slowest stores first
        .map(([store, d]) => {
          const a = avg(d.times);
          const fast = Math.min(...d.times);
          const slow = Math.max(...d.times);
          const colour = a < 60 ? 'var(--grn)' : a < 120 ? 'var(--acc2)' : 'var(--red)';
          // Find best driver for this store
          const bestDriver = Object.entries(d.byDriver)
            .sort((a,b) => avg(a[1]) - avg(b[1]))[0];
          const bestStr = bestDriver ? `${bestDriver[0]} (${fmtMin(avg(bestDriver[1]))})` : '—';
          return `<tr>
            <td style="font-size:.72rem">${store}</td>
            <td style="text-align:center">${d.times.length}</td>
            <td style="text-align:center;font-weight:600;color:${colour}">${fmtMin(a)}</td>
            <td style="text-align:center;color:var(--grn);font-size:.68rem">${fmtMin(fast)}</td>
            <td style="text-align:center;color:var(--red);font-size:.68rem">${fmtMin(slow)}</td>
            <td style="font-size:.68rem;color:var(--mut)">${bestStr}</td>
          </tr>`;
        }).join('');
      storeTimingEl.innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--mut);padding:10px">No delivery time data yet</td></tr>';
    }
  }

  // ── Returns ──
  const retEl = document.getElementById('returnsRep');
  if(retEl){
    const retRows = f.filter(t=>t.status==='return');
    retEl.innerHTML = retRows.map(t=>`<tr>
      <td style="font-family:var(--fh);font-size:.78rem">${t.btNum}</td>
      <td style="font-size:.7rem">${stName(t.fromStore||t.fromLoc)}</td>
      <td style="font-size:.7rem">${t.s2s?'S2S Transfer':'Undelivered'}</td>
      <td style="font-size:.68rem">${t.returnedBy||t.dispatchedBy||'—'}</td>
      <td style="font-size:.62rem">${fD(t.returnedAt||t.dispatchedAt)}</td>
    </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--mut);padding:10px">No returns</td></tr>';
  }
}

function printTimingReport(){
  const timingTable = document.getElementById('timingRep')?.innerHTML||'';
  const storeTimingTable = document.getElementById('storeTimingRep')?.innerHTML||'';
  const from = document.getElementById('rFrom')?.value||'';
  const to   = document.getElementById('rTo')?.value||'';
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>PNA JHB — Delivery Times Report</title>
  <style>body{font-family:Arial,sans-serif;padding:20px;font-size:12px}
  h2{margin-bottom:2px}p{color:#666;margin-bottom:14px}h3{margin:16px 0 6px;font-size:13px;border-bottom:1px solid #ccc;padding-bottom:4px}
  table{width:100%;border-collapse:collapse;margin-bottom:16px}
  th{background:#f0f0f0;padding:5px 7px;text-align:left;border-bottom:2px solid #ccc;font-size:10px;text-transform:uppercase}
  td{padding:4px 7px;border-bottom:1px solid #eee;font-size:11px}
  @media print{button{display:none}}</style></head><body>
  <h2>PNA JHB — Delivery Times Report</h2>
  <p>Period: ${from||'All time'} to ${to||'today'} | Printed: ${new Date().toLocaleString('en-ZA')}</p>
  <h3>Time per Driver per Store</h3>
  <table><thead><tr><th>Driver</th><th>Store</th><th>Deliveries</th><th>Avg Time</th><th>Fastest</th><th>Slowest</th></tr></thead>
  <tbody>${timingTable}</tbody></table>
  <h3>Average Time per Store (All Drivers)</h3>
  <table><thead><tr><th>Store</th><th>Deliveries</th><th>Avg Time</th><th>Fastest</th><th>Slowest</th><th>Best Driver</th></tr></thead>
  <tbody>${storeTimingTable}</tbody></table>
  <button onclick="window.print()">🖨 Print</button>
  </body></html>`);
  w.document.close();
  setTimeout(()=>w.print(),400);
}

function printMgmtReport(){
  const from = document.getElementById('rFrom')?.value||'';
  const to   = document.getElementById('rTo')?.value||'';
  const storeTable = document.getElementById('storeRep')?.innerHTML||'';
  const driverTable = document.getElementById('driverRep')?.innerHTML||'';
  const w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>PNA JHB Transfer Report</title>
  <style>body{font-family:Arial,sans-serif;padding:20px;font-size:12px}
  h2{margin-bottom:2px}p{color:#666;margin-bottom:16px}
  h3{margin:16px 0 6px;font-size:13px;border-bottom:1px solid #ccc;padding-bottom:4px}
  table{width:100%;border-collapse:collapse;margin-bottom:16px}
  th{background:#f0f0f0;padding:5px 7px;text-align:left;border-bottom:2px solid #ccc;font-size:10px;text-transform:uppercase}
  td{padding:4px 7px;border-bottom:1px solid #eee;font-size:11px}
  @media print{button{display:none}}</style></head><body>
  <h2>PNA JHB — Transfer Report</h2>
  <p>Period: ${from||'All time'} to ${to||'today'} | Printed: ${new Date().toLocaleString('en-ZA')}</p>
  <h3>Deliveries by Store</h3>
  <table><thead><tr><th>Store</th><th>Expected</th><th>Delivered</th><th>Short</th><th>Returned</th><th>%</th></tr></thead>
  <tbody>${storeTable}</tbody></table>
  <h3>Deliveries by Driver</h3>
  <table><thead><tr><th>Driver</th><th>Loaded</th><th>Delivered</th><th>Short</th><th>Avg Time</th></tr></thead>
  <tbody>${driverTable}</tbody></table>
  <button onclick="window.print()">🖨 Print</button>
  </body></html>`);
  w.document.close();
  setTimeout(()=>w.print(),400);
}

// ════════════════════════════════════════
// MANAGEMENT SETUP
// ════════════════════════════════════════
function buildDriverList(){
  let html = '';
  A.drivers.forEach(function(d,i){
    html += '<div class="drow" style="flex-direction:column;align-items:stretch;gap:6px;padding:8px 0">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center">';
    html += '<div><span style="font-family:var(--fh);font-size:.85rem">' + d.name + '</span>';
    html += '<span style="color:var(--mut);font-size:.7rem;margin-left:8px">PIN: ' + d.pin + '</span></div>';
    html += '<div style="display:flex;gap:5px">';
    html += '<button class="btn bb bsm" onclick="editDriverToggle(' + i + ')">&#9998;</button>';
    html += '<button class="btn br bsm" onclick="rmDriver(' + i + ')">&#10005;</button>';
    html += '</div></div>';
    html += '<div id="driverEdit' + i + '" style="display:none;flex-direction:column;gap:6px">';
    html += '<input type="text" id="editDriverName' + i + '" value="' + d.name.replace(/"/g,'&quot;') + '" placeholder="Name" style="font-size:.85rem;padding:6px 9px">';
    html += '<input type="text" id="editDriverPin' + i + '" value="' + d.pin + '" placeholder="4-digit PIN" maxlength="4" inputmode="numeric" style="font-size:.85rem;padding:6px 9px">';
    html += '<div style="display:flex;gap:5px">';
    html += '<button class="btn bg bsm" style="flex:1;margin:0" onclick="saveDriver(' + i + ')">SAVE</button>';
    html += '<button class="btn bo bsm" style="flex:1;margin:0" onclick="editDriverToggle(' + i + ')">CANCEL</button>';
    html += '</div></div></div>';
  });
  return html;
}

function buildStoreList(){
  let html = '';
  A.stores.forEach(function(s,i){
    html += '<div class="drow" style="flex-direction:column;align-items:stretch;gap:6px;padding:8px 0">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center">';
    html += '<div><span style="font-family:var(--fh);font-size:.82rem">' + s.name + '</span>';
    html += '<span style="color:var(--mut);font-size:.68rem;margin-left:6px">(' + s.code + ') PIN: ' + s.pin + '</span></div>';
    html += '<div style="display:flex;gap:5px">';
    html += '<button class="btn bb bsm" onclick="editStoreToggle(' + i + ')">&#9998;</button>';
    html += '<button class="btn br bsm" onclick="rmStore(' + i + ')">&#10005;</button>';
    html += '</div></div>';
    html += '<div id="storeEdit' + i + '" style="display:none;flex-direction:column;gap:6px">';
    html += '<input type="text" id="editStoreName' + i + '" value="' + s.name.replace(/"/g,'&quot;') + '" placeholder="Store name" style="font-size:.82rem;padding:6px 9px">';
    html += '<input type="text" id="editStorePin' + i + '" value="' + s.pin + '" placeholder="4-digit PIN" maxlength="4" inputmode="numeric" style="font-size:.82rem;padding:6px 9px">';
    html += '<div style="display:flex;gap:5px">';
    html += '<button class="btn bg bsm" style="flex:1;margin:0" onclick="saveStore(' + i + ')">SAVE</button>';
    html += '<button class="btn bo bsm" style="flex:1;margin:0" onclick="editStoreToggle(' + i + ')">CANCEL</button>';
    html += '</div></div></div>';
  });
  return html;
}

function populateMgmtSetup(){
  setTimeout(updateNFCToggleBtn, 50);
  // Show current device lock
  const el = document.getElementById('currentDeviceLock');
  if(el) el.textContent = A.deviceRole
    ? '✅ This device is locked to: ' + A.deviceRole.toUpperCase()
    : '🔓 No lock — all roles visible on this device';
  // Drivers list
  document.getElementById('driverList').innerHTML = buildDriverList();
  // Routes list
  document.getElementById('routeList').innerHTML=A.routes.map((r,i)=>`
    <div class="drow"><div><span style="font-family:var(--fh)">${r.name}</span>
    <div style="font-size:.68rem;color:var(--mut)">${r.stores.map(c=>stName(c)).join(' → ')}</div></div>
    <button class="btn br bsm" onclick="rmRoute(${i})">✕</button></div>`).join('');
  // Stores list
  document.getElementById('storeListMgmt').innerHTML = buildStoreList();
  // Override driver select
  const od=document.getElementById('overrideDriverSel');
  od.innerHTML=A.drivers.map(d=>`<option value="${d.name}">${d.name}</option>`).join('');
  // Route stores multi-select
  const nrs=document.getElementById('newRouteStores');
  if(nrs)nrs.innerHTML=A.stores.map(s=>`<option value="${s.code}">${s.name}</option>`).join('');
  renderOverrideLog();
}
function populateDcView(){
  // Populate pallet destination
  const pd = document.getElementById('palletDest');
  if(pd) pd.innerHTML = A.stores.map(s=>`<option value="${s.code}">${s.name} (${s.code})</option>`).join('');
  setupScanInput('palletScanInput', addBTtoPallet);
  renderPalletList();
}

function showDCTab(tab, el){
  document.getElementById('dcTabPallet').style.display = tab==='pallet' ? 'block' : 'none';
  document.getElementById('dcTabPallets').style.display = tab==='pallets' ? 'block' : 'none';
  document.querySelectorAll('#dcNav .nb').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  if(tab==='pallets') renderPalletList();
}

function addDriver(){
  const n=document.getElementById('newDriverName').value.trim();
  const p=document.getElementById('newDriverPin').value.trim();
  if(!n||p.length!==4){sT('Enter name and 4-digit PIN','err');return;}
  A.drivers.push({name:n,pin:p});sv();
  document.getElementById('newDriverName').value='';document.getElementById('newDriverPin').value='';
  populateMgmtSetup();sT('Driver added','ok');
}
function rmDriver(i){
  if(confirm('Remove '+A.drivers[i].name+'?')){
    A.drivers.splice(i,1);sv();fbSaveConfig();populateMgmtSetup();
  }
}

function editDriverToggle(i){
  const el = document.getElementById('driverEdit'+i);
  if(!el) return;
  const visible = el.style.display === 'flex';
  el.style.display = visible ? 'none' : 'flex';
}

function saveDriver(i){
  const name = document.getElementById('editDriverName'+i)?.value.trim();
  const pin  = document.getElementById('editDriverPin'+i)?.value.trim();
  if(!name){ sT('Name cannot be empty','err'); return; }
  if(pin && pin.length !== 4){ sT('PIN must be 4 digits','err'); return; }
  if(name) A.drivers[i].name = name;
  if(pin)  A.drivers[i].pin  = pin;
  sv();fbSaveConfig();
  document.getElementById('driverList').innerHTML = '';
  populateMgmtSetup();
  sT('Driver updated — syncing to all devices','ok');
}

function addRoute(){
  const n=document.getElementById('newRouteName').value.trim().toUpperCase();
  const sel=document.getElementById('newRouteStores');
  const stores=Array.from(sel.selectedOptions).map(o=>o.value);
  if(!n||!stores.length){sT('Enter route name and select at least one store','err');return;}
  A.routes.push({name:n,stores});sv();
  document.getElementById('newRouteName').value='';
  populateMgmtSetup();sT('Route added: '+n,'ok');
}
function rmRoute(i){if(confirm('Remove route?')){A.routes.splice(i,1);sv();fbSaveConfig();populateMgmtSetup();}}

function addStore(){
  const n=document.getElementById('newStoreName').value.trim();
  const c=document.getElementById('newStoreCode').value.trim().toUpperCase();
  const p=document.getElementById('newStorePin').value.trim();
  if(!n||!c||!p){sT('Enter name, code and PIN','err');return;}
  A.stores.push({name:n,code:c,pin:p});sv();
  document.getElementById('newStoreName').value='';document.getElementById('newStoreCode').value='';document.getElementById('newStorePin').value='';
  populateMgmtSetup();sT('Store added: '+n,'ok');
}
function rmStore(i){
  if(confirm('Remove '+A.stores[i].name+'?')){
    A.stores.splice(i,1);sv();fbSaveConfig();populateMgmtSetup();
  }
}

function editStoreToggle(i){
  const el = document.getElementById('storeEdit'+i);
  if(!el) return;
  el.style.display = el.style.display==='flex' ? 'none' : 'flex';
}

function saveStore(i){
  const name = document.getElementById('editStoreName'+i)?.value.trim();
  const pin  = document.getElementById('editStorePin'+i)?.value.trim();
  if(!name){ sT('Name cannot be empty','err'); return; }
  if(pin && pin.length !== 4){ sT('PIN must be 4 digits','err'); return; }
  if(name) A.stores[i].name = name;
  if(pin)  A.stores[i].pin  = pin;
  sv();fbSaveConfig();
  document.getElementById('storeListMgmt').innerHTML = '';
  populateMgmtSetup();
  sT('Store updated — syncing to all devices','ok');
}

// ════════════════════════════════════════
// DETAIL MODAL
// ════════════════════════════════════════
function openDet(t){
  if(typeof t==='string')t=JSON.parse(t);
  document.getElementById('modTit').textContent='BT: '+t.btNum;
  const rows=[
    ['Status',stBdg(t.status)],['From',stName(t.fromStore||t.fromLoc)],['To',stName(t.toStore||t.toLoc)],
    ['Route',t.route||'—'],['Loaded By',t.loadedBy||'—'],['Loaded At',fD(t.loadedAt)],
    ['Dispatched',fD(t.dispatchedAt)],['By',t.dispatchedBy||'—'],
    ['Delivered',fD(t.deliveredAt)],['Signed By',t.signedBy||'—'],
    ['Short Delivery',t.status==='short'?`⚠ Yes · ${t.overrideReason||'—'}`:'No'],
    ['Override PIN',t.overridePin||'—'],['S2S Transfer',t.s2s?'Yes':'No'],
    ['Returned',t.status==='return'?fD(t.returnedAt):'—'],['Transfer ID',t.id]
  ];
  document.getElementById('modCont').innerHTML=rows.map(([k,v])=>`<div class="drow"><span class="dk">${k}</span><span class="dv">${v}</span></div>`).join('');
  document.getElementById('modActs').innerHTML='';
  document.getElementById('detMod').classList.add('on');
}
function cmod(e,id){if(!id){['detMod','signMod','overrideMod','manualMod','dlvMod','dupMod','nfcMod'].forEach(x=>document.getElementById(x)?.classList.remove('on'));return;}if(!e||e.target===document.getElementById(id))document.getElementById(id).classList.remove('on');}

// ════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════
// ════════════════════════════════════════
// LABEL GENERATOR
// ════════════════════════════════════════
const LABEL_CATS = ['Banking','E-Commerce','Marketing','Internal Mail','Maintenance','Damages','Return to DC','Store-to-Store Transfer'];
let currentLabel = null;
let labelFilter = 'all';

function initLabelGen(){
  // Build category grid
  const cg = document.getElementById('labelCatGrid');
  if(cg){
    cg.innerHTML = LABEL_CATS.map(c =>
      `<div class="catbtn" onclick="selectLabelCat('${c}',this)"
        style="padding:10px 8px;border:1px solid var(--bdr);border-radius:6px;background:var(--bg);
        color:var(--mut);font-family:var(--fh);font-size:.68rem;letter-spacing:1px;
        text-transform:uppercase;cursor:pointer;text-align:center;transition:all .13s">${c}</div>`
    ).join('');
  }
  // Populate destination
  const ld = document.getElementById('labelDest');
  if(ld){
    ld.innerHTML = `<option value="DC">DC Johannesburg</option>` +
      A.stores.map(s=>`<option value="${s.code}">${s.name}</option>`).join('');
  }
  document.getElementById('labelResult').style.display='none';
  renderRecentLabels();
}

function selectLabelCat(cat, el){
  document.querySelectorAll('.catbtn').forEach(b=>{
    b.style.borderColor='var(--bdr)';b.style.color='var(--mut)';b.style.background='var(--bg)';
  });
  el.style.borderColor='var(--acc)';el.style.color='var(--acc)';el.style.background='rgba(232,132,26,.08)';
  currentLabel=currentLabel||{};
  currentLabel.cat=cat;
}

function generateLabel(){
  const cat = currentLabel?.cat;
  if(!cat){sT('Select a category first','err');return;}
  const dest = document.getElementById('labelDest').value;
  const notes = document.getElementById('labelNotes').value.trim();
  // Generate unique code: LBL-XX-NNNN
  // XX = store BT number (e.g. 17 for Cresta) so scanner knows destination
  const destStore = STORE_LIST.find(s=>s.code===dest||s.btNum===dest);
  const btNum = destStore ? destStore.btNum : '00';
  const num = String(Math.floor(1000 + Math.random()*9000));
  const code = 'LBL-' + btNum + '-' + num;
  const destName = stName(dest);
  currentLabel = {
    id: 'LBL-' + Date.now(),
    code, cat, dest, destName, notes,
    createdAt: new Date().toISOString(),
    createdBy: A.userName,
    usedOnTruck: false,
    route: A.driverRoute?.name || ''
  };
  // Save label
  if(!A.labels) A.labels = [];
  A.labels.unshift(currentLabel);
  fbSave('labels', currentLabel.id, currentLabel);
  sv();
  // Show result
  document.getElementById('labelGenCat').textContent = cat;
  document.getElementById('labelGenCode').textContent = code;
  document.getElementById('labelGenDest').textContent = '→ ' + destName + (notes?' · '+notes:'');
  document.getElementById('labelBarcodeText').textContent = code;
  // Render simple visual barcode (text-based using thin/thick bars)
  renderVisualBarcode(code);
  document.getElementById('labelResult').style.display='block';
  document.getElementById('labelAddBtn').style.display =
    (A.driverRoute && A.driverRoute.stores.includes(dest) || dest==='DC') ? 'flex' : 'none';
  renderRecentLabels();
  sT('Label generated: ' + code, 'ok');
}

function renderVisualBarcode(code){
  const el = document.getElementById('labelBarcode');
  if(!el) return;
  // Use JsBarcode to render a real scannable Code 128 barcode
  el.innerHTML = '<svg id="labelBarcodesvg"></svg>';
  try{
    JsBarcode('#labelBarcodesvg', code, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 14,
      margin: 6,
      background: '#ffffff',
      lineColor: '#000000'
    });
  } catch(e){
    // Fallback if JsBarcode not loaded
    el.innerHTML = `<div style="font-family:monospace;font-size:22px;font-weight:bold;letter-spacing:4px;padding:16px;color:#000">${code}</div>`;
  }
}

function addLabelToTruck(){
  if(!currentLabel){return;}
  const code = currentLabel.code;
  // Create a transfer record for this label
  const dest = currentLabel.dest;
  const tr = makeTr(code, A.userCode||A.driverRoute?.name||'STORE', dest, A.userName);
  tr.category = currentLabel.cat;
  tr.isLabel = true;
  tr.labelId = currentLabel.id;
  tr.status = 'loaded';
  tr.loadedAt = new Date().toISOString();
  tr.loadedBy = A.userName;
  tr.route = A.driverRoute?.name || '';
  A.transfers.unshift(tr);
  A.loadedBoxes.push(code);
  currentLabel.usedOnTruck = true;
  fbSave('transfers', tr.id, tr);
  fbSave('labels', currentLabel.id, currentLabel);
  sv();
  sT('✅ ' + code + ' added to truck', 'ok');
  document.getElementById('labelAddBtn').style.display = 'none';
  if(A.driverRoute) updateLoadCtr();
}

function printLabel(){
  if(!currentLabel) return;
  const code  = currentLabel.code;
  const cat   = currentLabel.cat;
  const dest  = stName(currentLabel.dest);
  const notes = currentLabel.notes||'';
  const w = window.open('','_blank','width=400,height=380');
  w.document.write(`<!DOCTYPE html><html><head><title>Label: ${code}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js"><\/script>
  <style>
    body{font-family:Arial,sans-serif;margin:0;padding:16px;text-align:center;background:#fff}
    .cat{font-size:11px;text-transform:uppercase;color:#888;letter-spacing:2px;margin-bottom:4px}
    .code{font-size:26px;font-weight:bold;letter-spacing:5px;margin:6px 0;color:#c0283b}
    .dest{font-size:15px;font-weight:bold;margin:4px 0}
    .notes{font-size:11px;color:#999;margin:2px 0 8px}
    hr{border:none;border-top:1px dashed #ddd;margin:10px 0}
    .footer{font-size:9px;color:#ccc;margin-top:8px}
    @media print{.noprint{display:none}}
  </style></head><body>
  <div class="cat">PNA JHB — ${cat}</div>
  <div class="dest">→ ${dest}</div>
  <div class="code">${code}</div>
  ${notes?`<div class="notes">${notes}</div>`:''}
  <hr>
  <svg id="printBarcode"></svg>
  <div class="footer">Generated ${new Date().toLocaleString('en-ZA')}</div>
  <br>
  <button class="noprint" onclick="window.print()" style="padding:8px 20px;font-size:14px;cursor:pointer;margin:4px">🖨 Print</button>
  <button class="noprint" onclick="downloadLabelImg('${code}')" style="padding:8px 20px;font-size:14px;cursor:pointer;margin:4px">📥 Download Image</button>
  <script>
    JsBarcode('#printBarcode', '${code}', {format:'CODE128',width:2.5,height:70,displayValue:true,fontSize:15,margin:8});
    function downloadLabelImg(code){
      const svg = document.getElementById('printBarcode');
      const canvas = document.createElement('canvas');
      canvas.width=400; canvas.height=200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle='#fff'; ctx.fillRect(0,0,400,200);
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      img.onload = ()=>{ctx.drawImage(img,0,0);const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=code+'.png';a.click();};
      img.src = 'data:image/svg+xml;base64,'+btoa(svgData);
    }
  <\/script>
  </body></html>`);
  w.document.close();
}

function downloadLabelDirect(){
  if(!currentLabel) return;
  const code = currentLabel.code;
  // Create a canvas and render the barcode to it for download
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 200;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,400,200);
  // Draw label text
  ctx.fillStyle = '#c0283b';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(code, 200, 30);
  ctx.fillStyle = '#333';
  ctx.font = '13px Arial';
  ctx.fillText('→ ' + stName(currentLabel.dest), 200, 50);
  ctx.fillText(currentLabel.cat, 200, 68);
  // Draw barcode using JsBarcode on a temp SVG then render to canvas
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  document.body.appendChild(svg);
  try{
    JsBarcode(svg, code, {format:'CODE128',width:2,height:80,displayValue:true,fontSize:13,margin:4});
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = ()=>{
      ctx.drawImage(img, 40, 80, 320, 110);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = code + '.png';
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }catch(e){ sT('Download failed — try Print instead','err'); }
  finally{ document.body.removeChild(svg); }
}

function generateAnother(){
  document.getElementById('labelResult').style.display='none';
  document.getElementById('labelNotes').value='';
  currentLabel=null;
  document.querySelectorAll('.catbtn').forEach(b=>{
    b.style.borderColor='var(--bdr)';b.style.color='var(--mut)';b.style.background='var(--bg)';
  });
}

function renderRecentLabels(){
  const el = document.getElementById('recentLabels'); if(!el) return;
  const labels = (A.labels||[]).slice(0,10);
  if(!labels.length){el.innerHTML='<div style="color:var(--mut);font-size:.75rem;text-align:center;padding:10px">No labels generated yet</div>';return;}
  el.innerHTML = labels.map(l=>`
    <div class="drow">
      <div><div style="font-family:var(--fh);font-size:.88rem;letter-spacing:2px;color:var(--acc)">${l.code}</div>
      <div style="font-size:.68rem;color:var(--mut)">${l.cat} → ${stName(l.dest)}${l.notes?' · '+l.notes:''}</div></div>
      <span class="badge ${l.usedOnTruck?'b-loaded':'b-reg'}">${l.usedOnTruck?'ON TRUCK':'GENERATED'}</span>
    </div>`).join('');
}

function setLabelFilter(f, el){
  labelFilter=f;
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  renderAllLabels();
}

function renderAllLabels(){
  const el = document.getElementById('allLabelsList'); if(!el) return;
  const labels = (A.labels||[]).filter(l=>labelFilter==='all'||l.cat===labelFilter);
  if(!labels.length){el.innerHTML='<div class="empty"><div class="ei">🏷</div><p>No labels found</p></div>';return;}
  el.innerHTML = labels.map(l=>`
    <div class="drow">
      <div><div style="font-family:var(--fh);font-size:.88rem;letter-spacing:2px">${l.code}</div>
      <div style="font-size:.68rem;color:var(--mut)">${l.cat} → ${stName(l.dest)}</div>
      <div style="font-size:.65rem;color:var(--mut)">${l.createdBy} · ${fD(l.createdAt)}${l.notes?' · '+l.notes:''}</div></div>
      <span class="badge ${l.usedOnTruck?'b-loaded':'b-reg'}">${l.usedOnTruck?'ON TRUCK':'PENDING'}</span>
    </div>`).join('');
}

function expSummaryCSV(){
  const f = getFilteredTransfers();
  const storeMap = {};
  f.forEach(t=>{
    const s = resolveStoreCode(t.toStore||t.toLoc||'');
    if(!s) return;
    const k = (s==='DC'||s==='01'||s==='00')?'DC':s;
    if(!storeMap[k]) storeMap[k]={store:stName(k),loaded:0,delivered:0,short:0,returned:0};
    if(['loaded','transit'].includes(t.status)) storeMap[k].loaded++;
    if(t.status==='delivered') storeMap[k].delivered++;
    if(t.status==='short') storeMap[k].short++;
    if(t.status==='return') storeMap[k].returned++;
  });
  const h=['Store','Expected','Delivered','Short','Returned','Delivery %'];
  const rows=Object.values(storeMap).map(d=>{
    const total=d.delivered+d.short+d.loaded;
    const pct=total>0?Math.round(d.delivered/total*100)+'%':'—';
    return[d.store,d.loaded,d.delivered,d.short,d.returned,pct].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',');
  });
  // By driver
  const driverMap={};
  f.forEach(t=>{
    const d=t.deliveredBy||t.loadedBy||t.dispatchedBy||'';
    if(!d) return;
    if(!driverMap[d]) driverMap[d]={driver:d,loaded:0,delivered:0,short:0};
    driverMap[d].loaded++;
    if(t.status==='delivered') driverMap[d].delivered++;
    if(t.status==='short') driverMap[d].short++;
  });
  const h2=['','Driver','Loaded','Delivered','Short'];
  const rows2=Object.values(driverMap).map(d=>[d.driver,d.loaded,d.delivered,d.short].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  dlCSV([h.join(','),...rows,h2.join(','),...rows2],`pna-summary-${today()}`);
}

function expShortCSV(){
  const f = getFilteredTransfers().filter(t=>t.status==='short');
  if(!f.length){sT('No short deliveries to export','err');return;}
  const h=['BT Number','Store','Driver','Date','Reason'];
  const rows=f.map(t=>[t.btNum,stName(t.toStore),t.deliveredBy||t.dispatchedBy||'',fD(t.shortAt||t.deliveredAt),t.overrideReason||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  dlCSV([h.join(','),...rows],`pna-short-deliveries-${today()}`);
}

function expReturnsCSV(){
  const f = getFilteredTransfers().filter(t=>t.status==='return');
  if(!f.length){sT('No returns to export','err');return;}
  const h=['BT Number','From Store','Reason','Driver','Date'];
  const rows=f.map(t=>[t.btNum,stName(t.fromStore||t.fromLoc),t.s2s?'S2S Transfer':'Undelivered',t.returnedBy||t.dispatchedBy||'',fD(t.returnedAt||t.dispatchedAt)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  dlCSV([h.join(','),...rows],`pna-returns-${today()}`);
}

function expTimingCSV(){
  const f = getFilteredTransfers();
  const driverStoreMap={};
  f.forEach(t=>{
    if(t.status!=='delivered'||!t.deliveredAt||!t.loadedAt) return;
    const mins=Math.round((new Date(t.deliveredAt)-new Date(t.loadedAt))/60000);
    if(mins<=0||mins>600) return;
    const driver=t.deliveredBy||t.loadedBy||'—';
    const store=stName(resolveStoreCode(t.toStore||t.toLoc||''));
    const key=driver+'||'+store;
    if(!driverStoreMap[key]) driverStoreMap[key]={driver,store,times:[]};
    driverStoreMap[key].times.push(mins);
  });
  const fmtMin=m=>m>=60?Math.floor(m/60)+'h '+(m%60)+'m':m+'m';
  const avg=arr=>Math.round(arr.reduce((a,b)=>a+b,0)/arr.length);
  const h=['Driver','Store','Deliveries','Avg Time','Fastest','Slowest'];
  const rows=Object.values(driverStoreMap).map(d=>[
    d.driver,d.store,d.times.length,fmtMin(avg(d.times)),fmtMin(Math.min(...d.times)),fmtMin(Math.max(...d.times))
  ].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  if(!rows.length){sT('No timing data to export','err');return;}
  dlCSV([h.join(','),...rows],`pna-timing-${today()}`);
}

function expBTSearchCSV(){
  const q=(document.getElementById('mgmtBTSearch')?.value||'').trim().toUpperCase();
  if(q.length<3){sT('Search for a BT first','err');return;}
  const results=A.transfers.filter(t=>t.btNum?.toUpperCase().includes(q)||t.barcode?.toUpperCase().includes(q));
  if(!results.length){sT('No results to export','err');return;}
  const h=['BT Number','Status','From','To','Driver','Route','Loaded','Delivered','Signed By','Short Reason'];
  const rows=results.map(t=>{
    const dest=t.finalDest&&!t.viaTransit?t.finalDest:(t.toStore||t.toLoc||'');
    return[t.btNum,t.status,stName(t.fromStore||t.fromLoc||'DC'),stName(dest),t.deliveredBy||t.dispatchedBy||'',t.route||'',fD(t.loadedAt||t.dispatchedAt),t.deliveredAt?fD(t.deliveredAt):'',t.signedBy||'',t.overrideReason||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',');
  });
  dlCSV([h.join(','),...rows],`pna-bt-search-${today()}`);
}

// Helper: download CSV
function dlCSV(lines, filename){
  const a=Object.assign(document.createElement('a'),{
    href:URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'})),
    download:filename+'.csv'
  });
  a.click();
  sT('CSV exported','ok');
}

function today(){return new Date().toISOString().slice(0,10);}

function expLabelsCSV(){
  if(!A.labels?.length){sT('No labels to export','err');return;}
  const h=['Code','Category','Destination','Notes','Created By','Created At','On Truck','Route'];
  const rows=A.labels.map(l=>[l.code,l.cat,stName(l.dest),l.notes||'',l.createdBy,l.createdAt,l.usedOnTruck?'Yes':'No',l.route||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([[h.join(','),...rows].join('\n')],{type:'text/csv'})),download:`pna-labels-${new Date().toISOString().slice(0,10)}.csv`});
  a.click();sT('Labels exported','ok');
}

// ════════════════════════════════════════
// PALLET CONSOLIDATION SYSTEM
// ════════════════════════════════════════
let currentPallet = { dest: '', bts: [] };

function palletDestChanged(){
  // nothing needed — just reads value on use
}

function startPalletBuild(){
  const dest = document.getElementById('palletDest')?.value;
  if(!dest){ sT('Select a destination first','err'); return; }
  currentPallet = { dest, bts: [] };
  document.getElementById('palletStep1').style.display = 'none';
  document.getElementById('palletStep2').style.display = 'block';
  document.getElementById('palletStep3').style.display = 'none';
  document.getElementById('palletBanner').textContent =
    '📦 Building pallet for: ' + stName(dest) + ' — scan BT barcodes';
  renderPalletBTList();
  setTimeout(()=>document.getElementById('palletScanInput')?.focus(), 200);
}

function addBTtoPallet(code){
  if(!code) return;
  const dest = currentPallet.dest;

  // ── Check destination matches selected store ──
  // Read destination from BT barcode digits 6-7
  if(/^\d{8,}/.test(code)){
    const toNum = code.substring(6,8);
    const toSt  = STORE_LIST.find(s=>s.btNum===toNum);
    const toCode = toSt ? toSt.code : toNum;
    const resolvedDest = resolveStoreCode(dest);
    if(toCode && toCode !== resolvedDest && toCode !== 'DC'){
      beep('fail');
      showSR('palletSR','fail','WRONG STORE ❌',
        'This BT is for '+stName(toCode)+' — pallet is for '+stName(dest), code);
      setTimeout(()=>document.getElementById('palletScanInput')?.focus(),80);
      return;
    }
  }

  // ── Duplicate check — show popup so operator can add qty ──
  if(currentPallet.bts.includes(code)){
    beep('fail');
    showSR('palletSR','fail','DUPLICATE SCAN ⚠','Already on pallet — see popup to add more',code);
    // Open dup modal with pallet context
    openPalletDupModal(code);
    return;
  }

  // ── Accept ──
  let tr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
  if(!tr){
    tr = makeTr(code, 'DC', dest, 'DC Operator');
    A.transfers.unshift(tr);
    fbSave('transfers', tr.id, tr);
  }
  currentPallet.bts.push(code);
  beep('ok');
  showSR('palletSR','ok','ADDED TO PALLET ✅',
    currentPallet.bts.length+' BT'+(currentPallet.bts.length!==1?'s':'')+' on pallet', code);
  renderPalletBTList();
  setTimeout(()=>document.getElementById('palletScanInput')?.focus(),80);
}

// ── Pallet duplicate modal (reuses dup modal with pallet context) ──
let _palletDupCode = '';
let _palletDupQty  = 1;

function openPalletDupModal(code){
  _palletDupCode = code;
  _palletDupQty  = 1;
  const existingCount = currentPallet.bts.filter(c=>c===code||c.startsWith(code+'-DUP')).length;
  document.getElementById('dupCode').textContent  = code;
  document.getElementById('dupDest').textContent  = stName(currentPallet.dest);
  document.getElementById('dupCount').textContent = 'Already on pallet: '+existingCount+'x';
  document.getElementById('dupQtyDisplay').textContent = '1';
  document.getElementById('dupQtyBtn').textContent     = '1';
  // Override dup modal buttons to use pallet context
  document.getElementById('dupMod')._palletMode = true;
  document.getElementById('dupMod').classList.add('on');
}

// Patch confirmDuplicate to handle pallet mode
const _origConfirmDuplicate = typeof confirmDuplicate === 'function' ? confirmDuplicate : null;
function confirmDuplicate(){
  const modal = document.getElementById('dupMod');
  if(modal && modal._palletMode){
    // Pallet context
    modal._palletMode = false;
    cmod(null,'dupMod');
    const qty = dupState.qty;
    for(let i=0;i<qty;i++){
      const dupCode = _palletDupCode+'-DUP'+(currentPallet.bts.filter(c=>c===_palletDupCode||c.startsWith(_palletDupCode+'-DUP')).length+1);
      currentPallet.bts.push(dupCode);
      // Create a transfer for each dup
      const tr = makeTr(dupCode, 'DC', currentPallet.dest, 'DC Operator');
      tr.isDuplicate=true; tr.originalBT=_palletDupCode;
      A.transfers.unshift(tr);
      fbSave('transfers',tr.id,tr);
    }
    renderPalletBTList();
    sT('Added '+qty+' more of '+_palletDupCode,'ok');
    setTimeout(()=>document.getElementById('palletScanInput')?.focus(),100);
    return;
  }
  // Original context (load/scanout/return)
  const {code, context, qty} = dupState;
  cmod(null,'dupMod');
  if(context==='load'){
    A.loadedBoxes.push(code);
    const tr = A.transfers.find(t=>t.btNum===code||t.barcode===code);
    const toStore = tr?.toStore||tr?.toLoc||'';
    const fromStore = tr?.fromStore||tr?.fromLoc||'01';
    const suffix = '-DUP'+(A.loadedBoxes.filter(c=>c===code).length);
    const newTr = makeTr(code+suffix, fromStore, toStore, A.userName);
    newTr.status='loaded';newTr.loadedBy=A.userName;newTr.loadedAt=new Date().toISOString();
    newTr.route=A.driverRoute?.name||'';newTr.isDuplicate=true;newTr.originalBT=code;
    A.transfers.unshift(newTr);
    fbSave('transfers',newTr.id,newTr);
    for(let i=1;i<qty;i++){
      const s2='-DUP'+(A.loadedBoxes.filter(c=>c===code).length+1);
      const t2=makeTr(code+s2,fromStore,toStore,A.userName);
      t2.status='loaded';t2.loadedBy=A.userName;t2.loadedAt=new Date().toISOString();
      t2.route=A.driverRoute?.name||'';t2.isDuplicate=true;t2.originalBT=code;
      A.transfers.unshift(t2);fbSave('transfers',t2.id,t2);
      A.loadedBoxes.push(code+s2);
    }
  } else if(context==='scanout'){
    const baseBT = code.replace(/-DUP\d*$/,'');
    const allLoaded = A.loadedBoxes.filter(lb=>lb===baseBT||lb.startsWith(baseBT+'-DUP'));
    for(let i=0;i<qty;i++){
      const unscanned = allLoaded.find(lb=>!A.scanoutBoxes.includes(lb));
      if(unscanned) A.scanoutBoxes.push(unscanned);
      else A.scanoutBoxes.push(code+'-DUP'+Date.now());
    }
  } else if(context==='return'){
    for(let i=0;i<qty;i++) A.returnBoxes.push(code+'-DUP'+i);
  }
  sv();
  if(context==='load'){renderLoadedList();updateLoadCtr();}
  if(context==='scanout'){renderScanoutList();updateScanoutCtr();}
  if(context==='return'){renderReturnList();renderPendingReturns();}
  sT('Added '+qty+' more: '+code,'ok');
  setTimeout(focusScan,100);
}

function removeBTfromPallet(idx){
  currentPallet.bts.splice(idx,1);
  renderPalletBTList();
}

function renderPalletBTList(){
  const el = document.getElementById('palletBTList');
  const ctr = document.getElementById('palletCtrN');
  const btn = document.getElementById('generatePalletBtn');
  if(ctr) ctr.textContent = currentPallet.bts.length;
  if(btn) btn.style.display = currentPallet.bts.length > 0 ? 'block' : 'none';
  if(!el) return;
  if(!currentPallet.bts.length){
    el.innerHTML = '<div style="color:var(--mut);font-size:.78rem;text-align:center;padding:10px">No BTs scanned yet</div>';
    return;
  }
  el.innerHTML = currentPallet.bts.map((code,i) =>
    `<div class="drow">
      <span style="font-family:var(--fh);font-size:.85rem;letter-spacing:1.5px">${code}</span>
      <button onclick="removeBTfromPallet(${i})"
        style="background:none;border:1px solid var(--red);border-radius:4px;color:var(--red);padding:2px 8px;font-size:.68rem;cursor:pointer">
        ✕
      </button>
    </div>`
  ).join('');
}

function generatePallet(){
  if(!currentPallet.bts.length){ sT('Scan at least one BT first','err'); return; }
  // Generate unique pallet code
  const num = String(Math.floor(1000 + Math.random()*9000));
  const pltCode = 'PLT-' + num;
  const pallet = {
    id: 'PAL-' + Date.now(),
    code: pltCode,
    dest: currentPallet.dest,
    bts: [...currentPallet.bts],
    createdAt: new Date().toISOString(),
    createdBy: A.userName || 'DC Operator',
    used: false
  };
  if(!A.pallets) A.pallets = [];
  A.pallets.unshift(pallet);
  fbSave('pallets', pallet.id, pallet);
  sv();
  // Show result
  document.getElementById('palletStep2').style.display = 'none';
  document.getElementById('palletStep3').style.display = 'block';
  document.getElementById('palletGenDest').textContent = 'Pallet for: ' + stName(pallet.dest);
  document.getElementById('palletGenCode').textContent = pltCode;
  document.getElementById('palletGenCount').textContent = pallet.bts.length + ' BT' + (pallet.bts.length!==1?'s':'') + ' on this pallet';
  document.getElementById('palletBarcodeText').textContent = pltCode;
  renderPalletBarcode(pltCode);
  sT('Pallet generated: ' + pltCode, 'ok');
}

function renderPalletBarcode(code){
  const el = document.getElementById('palletBarcode');
  if(!el) return;
  el.innerHTML = '<svg id="palletBarcodesvg"></svg>';
  try{
    JsBarcode('#palletBarcodesvg', code, {
      format: 'CODE128',
      width: 2,
      height: 64,
      displayValue: true,
      fontSize: 15,
      margin: 6,
      background: '#ffffff',
      lineColor: '#000000'
    });
  } catch(e){
    el.innerHTML = `<div style="font-family:monospace;font-size:24px;font-weight:bold;letter-spacing:4px;padding:16px;color:#000">${code}</div>`;
  }
}

function printPallet(){
  const pallet = A.pallets?.[0];
  if(!pallet) return;
  const w = window.open('','_blank','width=500,height=500');
  w.document.write(`<!DOCTYPE html><html><head><title>Pallet: ${pallet.code}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js"><\/script>
  <style>
    body{font-family:Arial,sans-serif;margin:0;padding:20px;text-align:center;background:#fff}
    .title{font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:4px}
    .code{font-size:34px;font-weight:bold;letter-spacing:7px;margin:6px 0;color:#c0283b}
    .dest{font-size:17px;font-weight:bold;margin:4px 0}
    .count{font-size:12px;color:#999;margin-bottom:10px}
    hr{border:none;border-top:1px dashed #ccc;margin:10px 0}
    .bt-list{text-align:left;font-family:monospace;font-size:10px;columns:2;column-gap:16px;margin-top:6px}
    .bt-item{padding:2px 0;border-bottom:1px solid #f0f0f0}
    @media print{.noprint{display:none}}
  </style></head><body>
  <div class="title">PNA JHB — Pallet Label</div>
  <div class="dest">→ ${stName(pallet.dest)}</div>
  <div class="code">${pallet.code}</div>
  <div class="count">${pallet.bts.length} BT${pallet.bts.length!==1?'s':''} on this pallet</div>
  <svg id="palletPrintSvg"></svg>
  <hr>
  <div style="font-size:11px;color:#666;text-align:left;margin-bottom:4px">BT Numbers on this pallet:</div>
  <div class="bt-list">${pallet.bts.map(b=>`<div class="bt-item">${b}</div>`).join('')}</div>
  <div style="font-size:9px;color:#ccc;margin-top:10px">Created: ${new Date(pallet.createdAt).toLocaleString('en-ZA')} by ${pallet.createdBy}</div>
  <br>
  <button class="noprint" onclick="window.print()" style="padding:8px 20px;font-size:14px;cursor:pointer;margin:4px">🖨 Print</button>
  <script>JsBarcode('#palletPrintSvg','${pallet.code}',{format:'CODE128',width:2.5,height:72,displayValue:true,fontSize:15,margin:8});<\/script>
  </body></html>`);
  w.document.close();
}

function newPallet(){
  currentPallet = { dest: '', bts: [] };
  document.getElementById('palletStep1').style.display = 'block';
  document.getElementById('palletStep2').style.display = 'none';
  document.getElementById('palletStep3').style.display = 'none';
  // Reset destination to blank
  const pd = document.getElementById('palletDest');
  if(pd) pd.selectedIndex = 0;
}

function cancelPallet(){
  currentPallet = { dest: '', bts: [] };
  document.getElementById('palletStep1').style.display = 'block';
  document.getElementById('palletStep2').style.display = 'none';
  document.getElementById('palletStep3').style.display = 'none';
  sT('Pallet cancelled','info');
}

function renderPalletList(){
  const el = document.getElementById('palletList');
  if(!el) return;
  const q = (document.getElementById('palletSearch')?.value||'').toLowerCase();
  const pallets = (A.pallets||[]).filter(p=>
    !q || p.code.toLowerCase().includes(q) || stName(p.dest).toLowerCase().includes(q)
  );
  if(!pallets.length){
    el.innerHTML = '<div class="empty"><div class="ei">📦</div><p>No pallets generated yet</p></div>';
    return;
  }
  el.innerHTML = pallets.map(p=>`
    <div class="card" style="margin-bottom:8px;border-left:3px solid ${p.used?'var(--grn)':'var(--acc)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div>
          <div style="font-family:var(--fh);font-size:1rem;letter-spacing:3px;color:var(--acc)">${p.code}</div>
          <div style="font-size:.72rem;color:var(--mut)">→ ${stName(p.dest)} · ${p.bts.length} BTs · ${fD(p.createdAt)}</div>
        </div>
        <span class="badge ${p.used?'b-delivered':'b-loaded'}">${p.used?'USED':'READY'}</span>
      </div>
      <div style="font-size:.68rem;color:var(--mut);font-family:monospace">${p.bts.join(' · ')}</div>
    </div>`).join('');
}

function expStoreCSV(){
  const code = A.userCode;
  const from = document.getElementById('storeRptFrom')?.value||'';
  const to   = document.getElementById('storeRptTo')?.value||'';
  const rows = A.transfers.filter(t=>{
    if(t.btNum?.includes('-DUP')) return false;
    const dest = resolveStoreCode(t.toStore||t.toLoc||'');
    if(dest !== code) return false;
    const date = t.deliveredAt||t.loadedAt||t.dispatchedAt||'';
    if(from && date < from) return false;
    if(to   && date > to+'T23:59:59') return false;
    return true;
  });
  if(!rows.length){sT('No data to export','err');return;}
  const h=['BT Number','Status','Driver','Date','Signed By','Short Reason'];
  const data=rows.map(t=>[
    t.btNum,t.status,
    t.deliveredBy||t.dispatchedBy||'',
    t.deliveredAt||t.dispatchedAt||'',
    t.signedBy||'',
    t.overrideReason||''
  ].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  const a=Object.assign(document.createElement('a'),{
    href:URL.createObjectURL(new Blob([[h.join(','),...data].join('\n')],{type:'text/csv'})),
    download:`${A.userName}-transfers-${new Date().toISOString().slice(0,10)}.csv`
  });
  a.click();sT('CSV exported','ok');
}

function showLabelsForStop(){
  const wrap = document.getElementById('storeLabelsForStop');
  const list = document.getElementById('storeLabelsForStopList');
  if(!wrap||!list) return;
  // Show all labels that are loaded on the truck for this stop
  const labelsOnTruck = A.loadedBoxes
    .map(code => A.transfers.find(t=>(t.btNum===code||t.barcode===code)&&t.isLabel))
    .filter(Boolean);
  if(!labelsOnTruck.length){
    list.innerHTML='<div style="color:var(--mut);font-size:.75rem">No labels on truck for this stop</div>';
  } else {
    list.innerHTML = labelsOnTruck.map(t=>`
      <div style="background:var(--sur2);border-radius:6px;padding:10px;margin-bottom:6px;text-align:center">
        <div style="font-family:var(--fh);font-size:1.2rem;letter-spacing:3px;color:var(--acc)">${t.btNum}</div>
        <div style="font-size:.72rem;color:var(--mut);margin-top:2px">${t.category||'Label'} → ${stName(t.toStore)}</div>
      </div>`).join('');
  }
  wrap.style.display = wrap.style.display==='none' ? 'block' : 'none';
}

function expCSV(){
  const h=['ID','BT Number','From','To','Status','Route','Dispatched','By','Loaded At','Delivered','Signed By','Short Delivery','Override Reason','S2S','Returned At'];
  const rows=A.transfers.map(t=>[t.id,t.btNum,stName(t.fromStore||t.fromLoc),stName(t.toStore||t.toLoc),t.status,t.route||'',t.dispatchedAt||'',t.dispatchedBy||'',t.loadedAt||'',t.deliveredAt||'',t.signedBy||'',t.status==='short'?'Yes':'No',t.overrideReason||'',t.s2s?'Yes':'No',t.returnedAt||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([[h.join(','),...rows].join('\n')],{type:'text/csv'})),download:`pna-jhb-${new Date().toISOString().slice(0,10)}.csv`});
  a.click();sT('CSV exported','ok');
}
function toggleNFCRequired(){
  // Force to explicit boolean
  A.nfcRequired = !(A.nfcRequired === true || A.nfcRequired === 'true');
  sv();fbSaveConfig();
  updateNFCToggleBtn();
  // Re-render stops so button labels update
  if(document.querySelector('#view-driver-stops.active')) renderStops();
  sT('NFC verification ' + (A.nfcRequired ? 'ENABLED 🔒' : 'DISABLED 🔓'), A.nfcRequired ? 'ok' : 'warn');
}

function lockDevice(role){
  const lockMsg = 'Lock this device to ' + (role||'').toUpperCase() + ' role only? Drivers/stores will not be able to access other roles. Management PIN required to unlock.';
  if(role && !confirm(lockMsg)){
    return;
  }
  A.deviceRole = role || null;
  sv();
  applyDeviceLock();
  const el = document.getElementById('currentDeviceLock');
  if(el) el.textContent = role ? '✅ This device is locked to: ' + role.toUpperCase() : '🔓 No lock — all roles visible';
  sT(role ? 'Device locked to ' + role.toUpperCase() : 'Device lock removed', 'ok');
}

function updateNFCToggleBtn(){
  const btn = document.getElementById('nfcToggleBtn');
  if(!btn) return;
  const on = A.nfcRequired === true || A.nfcRequired === 'true';
  btn.textContent = on ? 'ON' : 'OFF';
  btn.style.background = on ? 'var(--grn)' : 'var(--red)';
  btn.style.color = '#fff';
}

function clearLocalData(){
  if(!confirm('Clear local cache? This removes data from this device only. Firebase data is kept.')) return;
  A.transfers=[];A.offlineQueue=[];A.labels=[];sv();
  sT('Local cache cleared','ok');
}

async function fullReset(){
  if(!confirm('⚠ FULL RESET\n\nThis will permanently delete ALL transfer data from BOTH this device AND Firebase.\n\nType YES to confirm — this cannot be undone.')) return;
  const ans = prompt('Type YES to confirm full reset:');
  if(ans !== 'YES'){ sT('Reset cancelled','info'); return; }
  sT('Wiping all data...','warn');
  // Clear local
  A.transfers=[]; A.offlineQueue=[]; A.labels=[]; A.overridePins=[];
  sv();
  // Delete from Firebase — delete each transfer doc
  if(window._fbReady){
    try{
      // Use Firebase batch delete via the listen snapshot
      const { getFirestore, collection, getDocs, deleteDoc } =
        await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      const db = getFirestore();
      const snap = await getDocs(collection(db,'transfers'));
      const lsnap = await getDocs(collection(db,'labels'));
      let count = 0;
      for(const d of snap.docs){ await deleteDoc(d.ref); count++; }
      for(const d of lsnap.docs){ await deleteDoc(d.ref); count++; }
      sT(`✅ Full reset complete — ${count} records deleted`,'ok');
    } catch(e){
      sT('Firebase wipe failed — local data cleared only','warn');
      console.error(e);
    }
  } else {
    sT('✅ Local data wiped. Firebase offline — clear manually.','warn');
  }
}

// ════════════════════════════════════════
// UTILS
// ════════════════════════════════════════
function stName(code){
  if(!code)return'—';
  if(code==='00'||code==='01'||code==='DC')return'DC Johannesburg';
  // Use STORE_LIST (hardcoded, never overwritten) for reliable lookup
  const s=STORE_LIST.find(x=>x.code===code||x.btNum===code);
  if(s)return s.name;
  // Fallback to A.stores
  const s2=A.stores.find(x=>x.code===code||x.btNum===code);
  return s2?s2.name:code;
}
// Resolve a numeric BT code ('10') or letter code ('MS') to letter code ('MS')
function resolveStoreCode(code){
  if(!code)return'';
  if(code==='00'||code==='01'||code==='DC')return'DC';
  const s=STORE_LIST.find(x=>x.code===code||x.btNum===code);
  if(s)return s.code;
  const s2=A.stores.find(x=>x.code===code||x.btNum===code);
  return s2?s2.code:code;
}
function chkMiss(){const n=A.transfers.filter(t=>t.status==='short').length;const d=document.getElementById('missCnt');if(d){d.style.display=n>0?'inline-block':'none';d.textContent=n;}}
function stBdg(s){
  const m={registered:'b-reg',loaded:'b-loaded',transit:'b-transit',delivered:'b-delivered',missing:'b-missing',short:'b-short',return:'b-return'};
  const l={registered:'REGISTERED',loaded:'LOADED',transit:'EN ROUTE',delivered:'DELIVERED',missing:'⚠ MISSING',short:'⚠ SHORT',return:'RETURN DC'};
  return`<span class="badge ${m[s]||'b-reg'}">${l[s]||s?.toUpperCase()||'?'}</span>`;
}
function showSR(id,type,lbl,rsn,num){
  const el=document.getElementById(id);if(!el)return;
  el.className='sr '+type;el.style.display='block';
  el.querySelector('.sr-lbl').textContent=lbl;el.querySelector('.sr-lbl').className='sr-lbl '+type;
  el.querySelector('.sr-num').textContent=num;el.querySelector('.sr-rsn').textContent=rsn;
}
function fD(iso){if(!iso)return'—';const d=new Date(iso);return d.toLocaleDateString('en-ZA')+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
function beep(t='ok'){try{const ac=new AudioContext(),o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);if(t==='ok'){o.frequency.value=1200;g.gain.setValueAtTime(.2,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.1);o.start();o.stop(ac.currentTime+.1);}else{o.frequency.value=200;o.type='sawtooth';g.gain.setValueAtTime(.25,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.3);o.start();o.stop(ac.currentTime+.3);}}catch(e){}}
let tT;function sT(msg,type='info'){const el=document.getElementById('toast');el.textContent=msg;el.className='toast '+type;clearTimeout(tT);setTimeout(()=>el.classList.add('show'),10);tT=setTimeout(()=>el.classList.remove('show'),2800);}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
document.getElementById('rFrom').value=new Date(Date.now()-7*864e5).toISOString().slice(0,10);
document.getElementById('rTo').value=new Date().toISOString().slice(0,10);
updateBanner();
setFbStatus('⏳ Connecting to Firebase...','var(--acc2)');

// Set up all scan inputs immediately on page load
// so scanner works as soon as the driver navigates to any screen
window.addEventListener('DOMContentLoaded', () => {
  // Wire all scan inputs at page load so scanner works immediately on any screen
  setupScanInput('loadInput',    procLoad);
  setupScanInput('scanoutInput', procScanout);
  setupScanInput('returnInput',  procReturn);
  setupScanInput('s2sPhaseInput',procS2S);

});
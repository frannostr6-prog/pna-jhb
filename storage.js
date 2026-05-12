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
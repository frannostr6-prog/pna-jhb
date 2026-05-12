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
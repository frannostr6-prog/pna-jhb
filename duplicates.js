// ════════════════════════════════════════════════════════
// DUPLICATE SCAN HANDLER — Slot-based system
//
// RULES:
//   Loading:      BT1234  first copy
//                 BT1234-DUP2  second copy
//                 BT1234-DUP3  third copy
//
//   Scan-out:     Driver always scans physical barcode BT1234
//                 System consumes next open slot automatically
//                 Cannot scan more than was loaded
// ════════════════════════════════════════════════════════

// ── Helpers ──────────────────────────────────────────────
function baseBT(code){
  return String(code||'').replace(/-DUP\d+$/,'');
}
function nextLoadSlot(code){
  const base = baseBT(code);
  const count = A.loadedBoxes.filter(c=>baseBT(c)===base).length;
  return count===0 ? base : base+'-DUP'+(count+1);
}
function nextUnscannedSlot(code){
  const base = baseBT(code);
  return (A.stopExpected||[]).find(slot=>
    baseBT(slot)===base && !A.scanoutBoxes.includes(slot)
  );
}
function slotsRemaining(code){
  const base = baseBT(code);
  return (A.stopExpected||[]).filter(s=>
    baseBT(s)===base && !A.scanoutBoxes.includes(s)
  ).length;
}
function slotsLoaded(code){
  return A.loadedBoxes.filter(c=>baseBT(c)===baseBT(code)).length;
}

// ── Duplicate modal ───────────────────────────────────────
let dupState = {code:'', context:'', qty:1};

function openDupModal(code, context){
  dupState = {code, context, qty:1};
  const base    = baseBT(code);
  const already = slotsLoaded(code);
  const tr = A.transfers.find(t=>t.btNum===base||t.barcode===base);
  document.getElementById('dupCode').textContent  = base;
  document.getElementById('dupDest').textContent  = tr ? stName(tr.toStore||tr.toLoc||'') : '';
  document.getElementById('dupCount').textContent = already+' cop'+(already===1?'y':'ies')+' already loaded';
  document.getElementById('dupQtyDisplay').textContent = '1';
  document.getElementById('dupQtyBtn').textContent     = '1';
  document.getElementById('dupMod').classList.add('on');
}
function dupQtyUp(){
  dupState.qty = Math.min(dupState.qty+1, 10);
  document.getElementById('dupQtyDisplay').textContent = dupState.qty;
  document.getElementById('dupQtyBtn').textContent     = dupState.qty;
}
function dupQtyDown(){
  dupState.qty = Math.max(dupState.qty-1, 1);
  document.getElementById('dupQtyDisplay').textContent = dupState.qty;
  document.getElementById('dupQtyBtn').textContent     = dupState.qty;
}

function confirmDuplicate(){
  const {code, context, qty} = dupState;
  cmod(null,'dupMod');

  if(context==='load'){
    const tr = A.transfers.find(t=>t.btNum===baseBT(code)||t.barcode===baseBT(code));
    const toStore   = tr?.toStore||tr?.toLoc||'';
    const fromStore = tr?.fromStore||tr?.fromLoc||'01';
    for(let i=0;i<qty;i++){
      const slot = nextLoadSlot(code);
      A.loadedBoxes.push(slot);
      const newTr = makeTr(slot, fromStore, toStore, A.userName);
      newTr.status='loaded'; newTr.loadedBy=A.userName;
      newTr.loadedAt=new Date().toISOString();
      newTr.route=A.driverRoute?.name||'';
      newTr.isDuplicate=true; newTr.originalBT=baseBT(slot);
      A.transfers.unshift(newTr);
      fbSave('transfers',newTr.id,newTr);
    }
    sv(); renderLoadedList(); updateLoadCtr();
    sT('✅ '+slotsLoaded(code)+'x '+baseBT(code)+' on truck','ok');

  } else if(context==='scanout'){
    for(let i=0;i<qty;i++){
      const slot = nextUnscannedSlot(code);
      if(slot) A.scanoutBoxes.push(slot);
    }
    sv(); renderScanoutList(); updateScanoutCtr();

  } else if(context==='return'){
    for(let i=0;i<qty;i++) A.returnBoxes.push(baseBT(code)+'-RET'+i);
    sv(); renderReturnList();
  }
  setTimeout(focusScan,100);
}

function ignoreDuplicate(){
  cmod(null,'dupMod');
  sT('Duplicate ignored','info');
  setTimeout(focusScan,100);
}

// ── consumeScanSlot — called by procScanout ───────────────
function consumeScanSlot(code){
  const slot = nextUnscannedSlot(code);
  if(!slot){
    const base = baseBT(code);
    const inExp = (A.stopExpected||[]).some(s=>baseBT(s)===base);
    if(inExp){
      const total = (A.stopExpected||[]).filter(s=>baseBT(s)===base).length;
      return {accepted:false, reason:'ALL_SCANNED', total,
        message:'All '+total+' cop'+(total===1?'y':'ies')+' of this BT already scanned out. No more loaded copies exist.'};
    }
    return {accepted:false, reason:'NOT_LOADED',
      message:'This BT was not loaded for '+stName(A.currentStop||'')+' today.'};
  }
  A.scanoutBoxes.push(slot);
  const remaining = slotsRemaining(code);
  const totalLeft = (A.stopExpected||[]).length - A.scanoutBoxes.length;
  let detail = remaining>0
    ? 'Scan-out '+(slotsLoaded(code)-remaining)+' of '+slotsLoaded(code)+' completed. '+remaining+' still remaining.'
    : totalLeft>0 ? totalLeft+' more box'+(totalLeft!==1?'es':'')+' to scan'
    : 'All boxes scanned! ✅';
  return {accepted:true, slot, base:baseBT(code), remaining, totalLeft, detail};
}

'use strict';

const USERS = [
  {u:'admin', p:'admin123', role:'Administrator', init:'A'},
  {u:'kasir', p:'kasir123', role:'Kasir Toko',    init:'K'},
];
const KP = 'mj_produk', KT = 'mj_trans';
let CU = null, ePId = null, eTId = null, vPId = null, vTId = null;

/* ─── STORAGE ─── */
const gd = k => { try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]} };
const sd = (k,v) => localStorage.setItem(k,JSON.stringify(v));
const gid = (pfx,d) => pfx+String((d.length?Math.max(...d.map(x=>parseInt(x.id.replace(pfx,''))||0)):0)+1).padStart(3,'0');

/* ─── SEED ─── */
function initSeed(){
  if(gd(KP).length>0)return;
  sd(KP,[
    {id:'P001',nama:'Laptop ASUS VivoBook 14 A1404',kategori:'Laptop',harga:6500000,stok:12,merek:'ASUS',deskripsi:'Intel Core i5-1235U, 8GB RAM, SSD 512GB, layar 14" FHD IPS, Windows 11 Home'},
    {id:'P002',nama:'PC Desktop HP ProDesk 400 G9',kategori:'PC Desktop',harga:4200000,stok:5,merek:'HP',deskripsi:'Intel Core i3-12100, 8GB RAM, HDD 1TB, DVD-RW, Windows 11 Pro'},
    {id:'P003',nama:'Printer Canon PIXMA G2020',kategori:'Printer',harga:950000,stok:20,merek:'Canon',deskripsi:'Printer inkjet warna, sistem infus tinta, cetak & scan, resolusi 4800x1200 dpi'},
    {id:'P004',nama:'Keyboard Logitech MX Keys',kategori:'Keyboard',harga:1200000,stok:30,merek:'Logitech',deskripsi:'Wireless mechanical keyboard, backlit, multi-device (3 perangkat), USB-C rechargeable'},
    {id:'P005',nama:'Mouse Logitech M235',kategori:'Mouse',harga:185000,stok:45,merek:'Logitech',deskripsi:'Wireless optical mouse, USB nano receiver, 3 tombol, resolusi 1000 DPI'},
    {id:'P006',nama:'Monitor LG 22MN430M 22"',kategori:'Monitor',harga:1750000,stok:8,merek:'LG',deskripsi:'22 inch IPS, Full HD 1080p, 75Hz, AMD FreeSync, HDMI & VGA, bezel tipis'},
    {id:'P007',nama:'Headset Gaming Rexus HX3',kategori:'Aksesoris',harga:120000,stok:3,merek:'Rexus',deskripsi:'Headset gaming dengan mikrofon, jack 3.5mm, LED backlight, driver 40mm'},
  ]);
  sd(KT,[
    {id:'T001',pId:'P001',pN:'Laptop ASUS VivoBook 14 A1404',pl:'Budi Santoso',qty:1,total:6500000,tgl:'2024-06-10',st:'Lunas'},
    {id:'T002',pId:'P003',pN:'Printer Canon PIXMA G2020',pl:'Siti Rahayu',qty:2,total:1900000,tgl:'2024-06-11',st:'Lunas'},
    {id:'T003',pId:'P004',pN:'Keyboard Logitech MX Keys',pl:'Ahmad Fauzi',qty:1,total:1200000,tgl:'2024-06-12',st:'Pending'},
    {id:'T004',pId:'P005',pN:'Mouse Logitech M235',pl:'Dewi Kusuma',qty:3,total:555000,tgl:'2024-06-13',st:'Lunas'},
    {id:'T005',pId:'P002',pN:'PC Desktop HP ProDesk 400 G9',pl:'Reza Pratama',qty:1,total:4200000,tgl:'2024-06-14',st:'Dibatalkan'},
    {id:'T006',pId:'P006',pN:'Monitor LG 22MN430M 22"',pl:'Hendra Wijaya',qty:2,total:3500000,tgl:'2024-06-15',st:'Lunas'},
    {id:'T007',pId:'P007',pN:'Headset Gaming Rexus HX3',pl:'Rina Oktavia',qty:5,total:600000,tgl:'2024-06-16',st:'Pending'},
  ]);
}

/* ─── AUTH ─── */
function doLogin(){
  const u=document.getElementById('inp-user').value.trim();
  const p=document.getElementById('inp-pass').value;
  const f=USERS.find(x=>x.u===u&&x.p===p);
  const err=document.getElementById('login-err');
  if(!f){err.style.display='flex';return;}
  err.style.display='none';
  CU=f;
  document.getElementById('main-screen').classList.add('active');
  document.getElementById('login-screen').classList.remove('active');
  // set user info
  ['user-avatar','sp-avatar'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=f.init;});
  ['user-name-top','sp-name'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=f.u;});
  ['user-role-top','sp-role'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=f.role;});
  initSeed();
  updateGreeting();
  applyRolePermissions();
  showPanel('dashboard');
}

function doLogout(){
  if(!confirm('Yakin ingin logout dari sistem?'))return;
  CU=null;
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('inp-user').value='';
  document.getElementById('inp-pass').value='';
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ─── ROLE / PERMISSION ─── */
function isAdmin(){ return CU && CU.u === 'admin'; }
function denyAccess(msg){ toast(msg || 'Akses ditolak — hanya Admin yang bisa melakukan ini', 'err'); }

function applyRolePermissions(){
  const admin=isAdmin();
  // Produk: tambah & detail edit/hapus hanya admin
  const elAdd=document.getElementById('btn-add-produk');
  if(elAdd)elAdd.style.display=admin?'inline-flex':'none';
  const elEditD=document.getElementById('btn-edit-produk-detail');
  if(elEditD)elEditD.style.display=admin?'inline-flex':'none';
  const elDelD=document.getElementById('btn-del-produk-detail');
  if(elDelD)elDelD.style.display=admin?'inline-flex':'none';
  // Transaksi: edit & hapus detail hanya admin (tambah tetap boleh kasir)
  const elEditT=document.getElementById('btn-edit-trans-detail');
  if(elEditT)elEditT.style.display=admin?'inline-flex':'none';
  const elDelT=document.getElementById('btn-del-trans-detail');
  if(elDelT)elDelT.style.display=admin?'inline-flex':'none';
}

/* ─── PANEL NAV ─── */
function showPanel(name){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('active'));
  const panel=document.getElementById('panel-'+name);
  if(panel)panel.classList.add('active');
  const root=name.replace(/-detail$/,'');
  const navEl=document.getElementById('nav-'+root);
  if(navEl)navEl.classList.add('active');
  if(name==='dashboard')renderDash();
  if(name==='produk')renderProduk();
  if(name==='transaksi')renderTrans();
  applyRolePermissions();
}

/* ─── GREETING ─── */
function updateGreeting(){
  const h=new Date().getHours();
  const greet=h<12?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam';
  const el=document.getElementById('greeting-text');
  if(el)el.textContent=greet+', '+CU.u+'!';
  const de=document.getElementById('today-date');
  if(de){
    const now=new Date();
    de.innerHTML=now.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  }
}

/* ─── FORMAT ─── */
function fmtRp(n){return'Rp '+Number(n).toLocaleString('id-ID')}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function escA(s){return String(s).replace(/'/g,"\\'")}

function stockBadge(s){
  if(s===0)return`<span class="badge b-red">Habis</span>`;
  if(s<=5)return`<span class="badge b-amber">Menipis (${s})</span>`;
  return`<span class="badge b-green">${s} unit</span>`;
}
function stBadge(s){
  const m={Lunas:'b-green',Pending:'b-amber',Dibatalkan:'b-red'};
  return`<span class="badge ${m[s]||'b-gray'}">${s}</span>`;
}

/* ─── DASHBOARD ─── */
function renderDash(){
  const P=gd(KP),T=gd(KT);
  const rev=T.filter(t=>t.st==='Lunas').reduce((a,b)=>a+b.total,0);
  const low=P.filter(p=>p.stok<=5).length;
  const lunas=T.filter(t=>t.st==='Lunas').length;
  document.getElementById('dash-stats').innerHTML=`
    <div class="stat-card">
      <div class="stat-icon-wrap blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></div>
      <div><div class="stat-label">Total Produk</div><div class="stat-value">${P.length}</div><div class="stat-sub">item terdaftar</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon-wrap green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <div><div class="stat-label">Total Transaksi</div><div class="stat-value">${T.length}</div><div class="stat-sub">${lunas} transaksi lunas</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon-wrap amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg></div>
      <div><div class="stat-label">Total Pendapatan</div><div class="stat-value" style="font-size:18px">${fmtRp(rev)}</div><div class="stat-sub">dari transaksi lunas</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon-wrap ${low>0?'red':'green'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
      <div><div class="stat-label">Stok Menipis</div><div class="stat-value" style="color:${low>0?'#dc2626':'#2e7d32'}">${low}</div><div class="stat-sub">produk stok ≤ 5</div></div>
    </div>
  `;
  const rP=[...P].slice(-5).reverse();
  document.getElementById('dash-ptbl').innerHTML=rP.length
    ?rP.map(p=>`<tr><td>${esc(p.nama)}</td><td>${stockBadge(p.stok)}</td></tr>`).join('')
    :`<tr><td colspan="2" style="text-align:center;color:#ccc;padding:1.5rem">Belum ada produk</td></tr>`;
  const rT=[...T].slice(-5).reverse();
  document.getElementById('dash-ttbl').innerHTML=rT.length
    ?rT.map(t=>`<tr><td>${esc(t.pl)}</td><td>${stBadge(t.st)}</td></tr>`).join('')
    :`<tr><td colspan="2" style="text-align:center;color:#ccc;padding:1.5rem">Belum ada transaksi</td></tr>`;
}

/* ─── PRODUK TABLE ─── */
function renderProduk(){
  const q=(document.getElementById('search-produk').value||'').toLowerCase();
  const kat=document.getElementById('filter-kat').value;
  let data=gd(KP);
  if(q)data=data.filter(p=>p.nama.toLowerCase().includes(q)||p.kategori.toLowerCase().includes(q)||(p.merek||'').toLowerCase().includes(q));
  if(kat)data=data.filter(p=>p.kategori===kat);
  const tbody=document.getElementById('produk-tbody');
  const empty=document.getElementById('produk-empty');
  if(!data.length){tbody.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  const canEdit=isAdmin();
  tbody.innerHTML=data.map(p=>`
    <tr>
      <td><code class="mono">${p.id}</code></td>
      <td><strong style="color:#0d1b3e;font-size:13px">${esc(p.nama)}</strong>${p.merek?`<br><span style="font-size:11px;color:#aaa">${esc(p.merek)}</span>`:''}</td>
      <td><span class="badge b-blue">${p.kategori}</span></td>
      <td style="font-weight:600;color:#0d1b3e">${fmtRp(p.harga)}</td>
      <td>${stockBadge(p.stok)}</td>
      <td>${p.stok>0?'<span class="badge b-green">Tersedia</span>':'<span class="badge b-red">Habis</span>'}</td>
      <td>
        <div class="tbl-actions">
          <button class="act-btn view" title="Detail" onclick="viewProduk('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          ${canEdit?`<button class="act-btn edit" title="Edit" onclick="openProdukModal('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="act-btn del" title="Hapus" onclick="confirmDel('produk','${p.id}','${escA(p.nama)}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>`:`<span class="badge b-gray" style="font-size:10px" title="Hanya Admin yang dapat mengubah produk">View Only</span>`}
        </div>
      </td>
    </tr>`).join('');
}

/* ─── PRODUK DETAIL ─── */
function viewProduk(id){
  vPId=id;
  const p=gd(KP).find(x=>x.id===id);if(!p)return;
  document.getElementById('produk-detail-body').innerHTML=[
    ['ID Produk',`<code class="mono">${p.id}</code>`],
    ['Nama Produk',`<strong>${esc(p.nama)}</strong>`],
    ['Kategori',`<span class="badge b-blue">${p.kategori}</span>`],
    ['Merek / Brand',esc(p.merek||'-')],
    ['Harga Jual',`<strong style="color:#1558b0;font-size:15px">${fmtRp(p.harga)}</strong>`],
    ['Stok',stockBadge(p.stok)],
    ['Status Ketersediaan',p.stok>0?'<span class="badge b-green">Tersedia</span>':'<span class="badge b-red">Habis</span>'],
    ['Deskripsi',`<span style="line-height:1.7;color:#555">${esc(p.deskripsi||'-')}</span>`],
  ].map(([k,v])=>`<div class="detail-row"><div class="d-key">${k}</div><div class="d-val">${v}</div></div>`).join('');
  showPanel('produk-detail');
}
function editProdukFromDetail(){if(vPId)openProdukModal(vPId);}
function deleteProdukFromDetail(){const p=gd(KP).find(x=>x.id===vPId);if(p)confirmDel('produk',p.id,p.nama,true);}

/* ─── PRODUK MODAL ─── */
function openProdukModal(id){
  if(!isAdmin()){denyAccess('Hanya Admin yang dapat menambah/mengubah produk');return;}
  ePId=id||null;
  document.getElementById('modal-produk-title').textContent=id?'Edit Produk':'Tambah Produk Baru';
  resetF(['f-nama','f-kategori','f-harga','f-stok','f-merek','f-deskripsi']);
  clearE(['err-nama','err-kategori','err-harga','err-stok']);
  if(id){
    const p=gd(KP).find(x=>x.id===id);
    if(p){sv('f-nama',p.nama);sv('f-kategori',p.kategori);sv('f-harga',p.harga);sv('f-stok',p.stok);sv('f-merek',p.merek||'');sv('f-deskripsi',p.deskripsi||'');}
  }
  openModal('modal-produk');
}
function saveProduk(){
  if(!isAdmin()){denyAccess('Hanya Admin yang dapat menyimpan data produk');return;}
  const nama=gv('f-nama').trim(),kat=gv('f-kategori'),harga=parseFloat(gv('f-harga')),stok=parseInt(gv('f-stok'));
  const merek=gv('f-merek').trim(),deskr=gv('f-deskripsi').trim();
  let ok=true;
  ok=val('f-nama','err-nama',nama.length>0)&&ok;
  ok=val('f-kategori','err-kategori',kat!='')&&ok;
  ok=val('f-harga','err-harga',!isNaN(harga)&&harga>0)&&ok;
  ok=val('f-stok','err-stok',!isNaN(stok)&&stok>=0)&&ok;
  if(!ok)return;
  const data=gd(KP);
  if(ePId){const i=data.findIndex(x=>x.id===ePId);if(i>=0)data[i]={...data[i],nama,kategori:kat,harga,stok,merek,deskripsi:deskr};toast('Produk berhasil diperbarui','ok');}
  else{data.push({id:gid('P',data),nama,kategori:kat,harga,stok,merek,deskripsi:deskr});toast('Produk baru ditambahkan','ok');}
  sd(KP,data);closeModal('modal-produk');renderProduk();renderDash();
}

/* ─── TRANSAKSI TABLE ─── */
function renderTrans(){
  const q=(document.getElementById('search-trans').value||'').toLowerCase();
  const st=document.getElementById('filter-status').value;
  let data=gd(KT);
  if(q)data=data.filter(t=>t.pl.toLowerCase().includes(q)||t.pN.toLowerCase().includes(q)||t.id.toLowerCase().includes(q));
  if(st)data=data.filter(t=>t.st===st);
  const tbody=document.getElementById('trans-tbody');
  const empty=document.getElementById('trans-empty');
  if(!data.length){tbody.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  const canEdit=isAdmin();
  tbody.innerHTML=data.map(t=>`
    <tr>
      <td><code class="mono">${t.id}</code></td>
      <td style="max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(t.pN)}">${esc(t.pN)}</td>
      <td><strong style="color:#0d1b3e">${esc(t.pl)}</strong></td>
      <td style="text-align:center"><span class="badge b-gray">${t.qty}x</span></td>
      <td style="font-weight:600;color:#0d1b3e">${fmtRp(t.total)}</td>
      <td style="color:#888">${t.tgl}</td>
      <td>${stBadge(t.st)}</td>
      <td>
        <div class="tbl-actions">
          <button class="act-btn view" title="Detail" onclick="viewTrans('${t.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          ${canEdit?`<button class="act-btn edit" title="Edit" onclick="openTransModal('${t.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="act-btn del" title="Hapus" onclick="confirmDel('trans','${t.id}','transaksi ${t.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>`:''}
        </div>
      </td>
    </tr>`).join('');
}

/* ─── TRANSAKSI DETAIL ─── */
function viewTrans(id){
  vTId=id;
  const t=gd(KT).find(x=>x.id===id);if(!t)return;
  document.getElementById('trans-detail-body').innerHTML=[
    ['ID Transaksi',`<code class="mono">${t.id}</code>`],
    ['Produk',`<strong>${esc(t.pN)}</strong>`],
    ['ID Produk',`<code class="mono">${t.pId}</code>`],
    ['Nama Pelanggan',`<strong>${esc(t.pl)}</strong>`],
    ['Jumlah (Qty)',`<span class="badge b-gray">${t.qty} unit</span>`],
    ['Total Harga',`<strong style="color:#1558b0;font-size:16px">${fmtRp(t.total)}</strong>`],
    ['Tanggal Transaksi',`<span style="color:#555">${t.tgl}</span>`],
    ['Status Pembayaran',stBadge(t.st)],
  ].map(([k,v])=>`<div class="detail-row"><div class="d-key">${k}</div><div class="d-val">${v}</div></div>`).join('');
  showPanel('trans-detail');
}
function editTransFromDetail(){if(!isAdmin()){denyAccess('Hanya Admin yang dapat mengedit transaksi');return;}if(vTId)openTransModal(vTId);}
function deleteTransFromDetail(){if(!isAdmin()){denyAccess('Hanya Admin yang dapat menghapus transaksi');return;}confirmDel('trans',vTId,'transaksi '+vTId,true);}

/* ─── TRANSAKSI MODAL ─── */
function openTransModal(id){
  if(id && !isAdmin()){denyAccess('Hanya Admin yang dapat mengedit transaksi');return;}
  eTId=id||null;
  document.getElementById('modal-trans-title').textContent=id?'Edit Transaksi':'Tambah Transaksi Baru';
  const produk=gd(KP);
  const sel=document.getElementById('t-produk');
  sel.innerHTML='<option value="">Pilih produk...</option>'+produk.map(p=>`<option value="${p.id}" data-h="${p.harga}">${esc(p.nama)} — ${fmtRp(p.harga)}</option>`).join('');
  resetF(['t-produk','t-pelanggan','t-qty','t-total','t-tanggal']);
  clearE(['err-t-produk','err-t-pelanggan','err-t-qty','err-t-tanggal']);
  sv('t-qty',1);sv('t-status','Lunas');sv('t-total','');
  sv('t-tanggal',new Date().toISOString().split('T')[0]);
  if(id){
    const t=gd(KT).find(x=>x.id===id);
    if(t){sv('t-produk',t.pId);sv('t-pelanggan',t.pl);sv('t-qty',t.qty);sv('t-total',fmtRp(t.total));sv('t-tanggal',t.tgl);sv('t-status',t.st);}
  }
  openModal('modal-trans');
}
function calcTotal(){
  const sel=document.getElementById('t-produk');
  const opt=sel.options[sel.selectedIndex];
  const h=opt?parseFloat(opt.dataset.h||0):0;
  const q=parseInt(document.getElementById('t-qty').value)||0;
  document.getElementById('t-total').value=(h>0&&q>0)?fmtRp(h*q):'';
}
function saveTrans(){
  const sel=document.getElementById('t-produk');
  const pId=sel.value;
  const opt=sel.options[sel.selectedIndex];
  const h=opt?parseFloat(opt.dataset.h||0):0;
  const pl=gv('t-pelanggan').trim(),qty=parseInt(gv('t-qty')),tgl=gv('t-tanggal'),st=gv('t-status');
  let ok=true;
  ok=val('t-produk','err-t-produk',pId!='')&&ok;
  ok=val('t-pelanggan','err-t-pelanggan',pl.length>0)&&ok;
  ok=val('t-qty','err-t-qty',!isNaN(qty)&&qty>=1)&&ok;
  ok=val('t-tanggal','err-t-tanggal',tgl!='')&&ok;
  if(!ok)return;
  const pN=opt?opt.textContent.split(' — ')[0]:'';
  const total=h*qty;
  const data=gd(KT);
  if(eTId){const i=data.findIndex(x=>x.id===eTId);if(i>=0)data[i]={...data[i],pId,pN,pl,qty,total,tgl,st};toast('Transaksi berhasil diperbarui','ok');}
  else{data.push({id:gid('T',data),pId,pN,pl,qty,total,tgl,st});toast('Transaksi baru ditambahkan','ok');}
  sd(KT,data);closeModal('modal-trans');renderTrans();renderDash();
}

/* ─── DELETE ─── */
function confirmDel(type,id,name,fromDetail=false){
  if(!isAdmin()){denyAccess(type==='produk'?'Hanya Admin yang dapat menghapus produk':'Hanya Admin yang dapat menghapus transaksi');return;}
  document.getElementById('confirm-msg').textContent=`Data "${name}" akan dihapus permanen.`;
  document.getElementById('btn-confirm-ok').onclick=()=>{
    if(type==='produk'){sd(KP,gd(KP).filter(x=>x.id!==id));toast('Produk dihapus','ok');closeModal('modal-confirm');if(fromDetail)showPanel('produk');else renderProduk();}
    else{sd(KT,gd(KT).filter(x=>x.id!==id));toast('Transaksi dihapus','ok');closeModal('modal-confirm');if(fromDetail)showPanel('transaksi');else renderTrans();}
    renderDash();
  };
  openModal('modal-confirm');
}

/* ─── MODAL ─── */
const openModal=id=>document.getElementById(id).classList.add('open');
const closeModal=id=>document.getElementById(id).classList.remove('open');
function oClose(e,id){if(e.target===document.getElementById(id))closeModal(id);}

/* ─── FORM HELPERS ─── */
const gv=id=>{const el=document.getElementById(id);return el?el.value:''};
const sv=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v;};
function resetF(ids){ids.forEach(id=>{const el=document.getElementById(id);if(el){el.value='';el.classList.remove('inv');}});}
function clearE(ids){ids.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});}
function val(inpId,errId,cond){
  const inp=document.getElementById(inpId),err=document.getElementById(errId);
  if(!cond){if(inp)inp.classList.add('inv');if(err)err.style.display='block';return false;}
  if(inp)inp.classList.remove('inv');if(err)err.style.display='none';return true;
}

/* ─── TOAST ─── */
function toast(msg,type='ok'){
  const t=document.getElementById('toast');
  t.textContent=(type==='ok'?'✓ ':'✕ ')+msg;
  t.className='toast '+type+' show';
  setTimeout(()=>t.className='toast',3500);
}

/* ─── KEYBOARD ─── */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')['modal-produk','modal-trans','modal-confirm'].forEach(closeModal);
});

// script.js — all the front-end JS for Finance Book in one file.
// Kept it in three logical sections (data / views / router) rather than
// splitting into separate files — one script tag is simpler for a
// prototype this size and easier to drop into any static host.

// data.js — all the mock/seed data lives here for now.
// TODO: once the API is ready, swap these consts for fetch() calls and
// drop this file. Kept it separate from views.js on purpose so it's easy
// to see what's "real" data vs what's just markup.

/* ---------------------------- MOCK DATA ---------------------------- */

const SETTINGS = {
  emi_frequency:'NO', day_scroll_protect:'NO', auto_date:'YES',
  out_payment_interest:0, od_interest:0.1, settlement_interest:0, consultancy_interest:18,
  handloan_type:'Type 1', emi_report_cb_clr:'No',
  hp_rcpt_series:'00', hphl_rcpt_series:'00', hpop_rcpt_series:'00', hp_od_rcpt_series:'00', hl_rcpt_series:'HL',
  hp_op_due_date:'YES', messages_count:31383,
  city:'TADEPALLIGUDEM', street:'TANUKU ROAD', mobile:'9014596648', alternate_mobile:'9346912432', state:'Andhra Pradesh',
  bank_acc_no:'62447611080', bank_name:'STATE BANK OF INDIA', ifsc_code:'SBIN0020342', branch_name:'TADEPALLIGUDEM'
};

const CUSTOMERS = [
  {id:4817, hp_no:'TYRE0025', name:'GOLLAPALLI JEEVA', mobile:'9948693719', alt_mobile:'9346912432',
    reg_no:'825-20 FIFTY PLAS R / TR', village:'TADEPALLIGUDEM', makers_no:'MRF', model:'2026',
    chasis_no:'ASDF', eng_no:'ASDF', cb:false, clr:false, clr_hpn_date:'2026-06-29', emi_date:'2026-08-05',
    emi_period:6, emi_amount:8213, loan_amount:44000, interest_rate:12, seized:'NO', closed:'NO',
    city:'tadepalligudem', street:'tanuku road', state:'andhra pradesh'},
  {id:4818, hp_no:'FCSAFTPG0049', name:'NEKKALAPUDI MOHAN NAGA AN', mobile:'9948412510', alt_mobile:'',
    reg_no:'TR', village:'CHEBROLU', makers_no:'HERO', model:'2023', chasis_no:'HRX2231', eng_no:'ENG9981',
    cb:true, clr:false, clr_hpn_date:'2025-11-10', emi_date:'2025-12-05', emi_period:12, emi_amount:6533,
    loan_amount:70000, interest_rate:14, seized:'NO', closed:'NO', city:'chebrolu', street:'main road', state:'andhra pradesh'},
  {id:4819, hp_no:'SAFNDD0386', name:'TRIPURARI NISSI KUMARI', mobile:'9705256995', alt_mobile:'',
    reg_no:'AP40CS4173', village:'BUTTAYAGUDEM', makers_no:'BAJAJ', model:'2024', chasis_no:'BJZ4471', eng_no:'ENG4471',
    cb:false, clr:true, clr_hpn_date:'2026-01-18', emi_date:'2026-02-05', emi_period:18, emi_amount:3362,
    loan_amount:55000, interest_rate:13, seized:'NO', closed:'NO', city:'buttayagudem', street:'bus stand road', state:'andhra pradesh'},
  {id:4820, hp_no:'SAFTNK0091', name:'GUNTU SRINU', mobile:'9440017735', alt_mobile:'',
    reg_no:'AP04AD4966', village:'TANUKU', makers_no:'TVS', model:'2022', chasis_no:'TVS9021', eng_no:'ENG9021',
    cb:true, clr:true, clr_hpn_date:'2025-08-02', emi_date:'2025-09-05', emi_period:10, emi_amount:7800,
    loan_amount:60000, interest_rate:12.5, seized:'NO', closed:'YES', city:'tanuku', street:'rly station road', state:'andhra pradesh'},
  {id:4821, hp_no:'SAFNDD0142', name:'KOTHAPALLI VENKATESH', mobile:'9963587412', alt_mobile:'',
    reg_no:'AP37BX2210', village:'ELURU', makers_no:'HONDA', model:'2021', chasis_no:'HND1102', eng_no:'ENG1102',
    cb:false, clr:false, clr_hpn_date:'2025-04-11', emi_date:'2025-05-05', emi_period:24, emi_amount:2954,
    loan_amount:64000, interest_rate:15, seized:'YES', closed:'NO', city:'eluru', street:'ring road', state:'andhra pradesh'},
  {id:4822, hp_no:'TYRE0031', name:'PASUPULETI LAKSHMI', mobile:'9866521470', alt_mobile:'',
    reg_no:'AP05CX9981', village:'NIDADAVOLU', makers_no:'YAMAHA', model:'2025', chasis_no:'YAM3391', eng_no:'ENG3391',
    cb:true, clr:false, clr_hpn_date:'2026-05-20', emi_date:'2026-06-05', emi_period:6, emi_amount:9450,
    loan_amount:50000, interest_rate:11, seized:'NO', closed:'NO', city:'nidadavolu', street:'market road', state:'andhra pradesh'},
];

function genEmiSchedule(cust){
  const rows = [];
  let cum = 0;
  const interestComp = +((cust.loan_amount * (cust.interest_rate/100) / cust.emi_period)).toFixed(2);
  const start = new Date(cust.emi_date);
  for(let i=0;i<cust.emi_period;i++){
    const due = new Date(start); due.setMonth(start.getMonth()+i);
    cum += cust.emi_amount;
    rows.push({
      sno:i+1,
      due_date: due.toISOString().slice(0,10),
      amount: cust.emi_amount,
      interest_component: interestComp,
      paid_interest: 0,
      paid_amount: 0,
      balance: cust.emi_amount,
      cumulative_balance: cum
    });
  }
  return rows;
}

const MODULES = {
  handloans: {
    label:'HandLoans', icon:'fa-solid fa-handshake', color:'var(--green)', extra:['village','balance'],
    rows:[
      {id:1,name:'CHINTA RAMESH',village:'TADEPALLIGUDEM',balance:22000},
      {id:2,name:'BODDU SATISH',village:'NIDADAVOLU',balance:15500},
      {id:3,name:'YERRA PRASAD',village:'TANUKU',balance:8000},
    ]
  },
  'hand-loans-2': {
    label:'Hand Loans Type 2', icon:'fa-solid fa-handshake', color:'var(--green)', extra:['village','balance'],
    rows:[
      {id:1,name:'KOTA SRINIVAS',village:'ELURU',balance:12500},
    ]
  },
  capitals: {
    label:'Capitals', icon:'fa-solid fa-coins', color:'var(--amber)', extra:['village','balance'],
    rows:[
      {id:1,name:'CH. CHANDU (MD)',village:'TADEPALLIGUDEM',balance:500000},
      {id:2,name:'K. SRI ADITYA',village:'TADEPALLIGUDEM',balance:350000},
    ]
  },
  deposits: {
    label:'Deposits', icon:'fa-solid fa-sack-dollar', color:'var(--blue)', extra:['village','balance'],
    rows:[ {id:1,name:'MADDI SUBBARAO',village:'CHEBROLU',balance:40000} ]
  },
  'deposits-dp': {
    label:'Deposits(DP) New', icon:'fa-solid fa-sack-dollar', color:'var(--blue)', extra:['village','balance'], rows:[]
  },
  'deposits-2': {
    label:'Deposits Type 2', icon:'fa-solid fa-sack-dollar', color:'var(--blue)', extra:['village','balance'], rows:[]
  },
  cheques: {
    label:'Cheques', icon:'fa-solid fa-file-invoice', color:'var(--purple)', extra:['cheque_no','description','date','amount','status'],
    rows:[
      {id:1,name:'—',cheque_no:'004821',description:'Vehicle repurchase advance',date:'2026-06-12',amount:18000,status:'Cleared'},
      {id:2,name:'—',cheque_no:'004822',description:'Agent commission',date:'2026-07-02',amount:5000,status:'Pending'},
    ]
  },
  banks: {
    label:'Bank', icon:'fa-solid fa-building-columns', color:'var(--teal-700)', extra:['balance'],
    rows:[
      {id:1,name:'SBI - Current A/c',village:'-',balance:412300},
      {id:2,name:'GooglePay',village:'-',balance:5200},
      {id:3,name:'PhonePe',village:'-',balance:8900},
    ]
  },
  chits: {
    label:'Chits', icon:'fa-solid fa-bullseye', color:'var(--orange-600)', extra:['village','balance'],
    rows:[ {id:1,name:'Chit Group A - 25 Months',village:'TADEPALLIGUDEM',balance:125000} ]
  },
  loans: {
    label:'Loans', icon:'fa-solid fa-clipboard-list', color:'var(--teal-700)', extra:['village','mobile'],
    rows:[ {id:1,name:'PYDI KOTESWARA RAO',village:'TANUKU',mobile:'9866112233'} ]
  },
  'credit-transactions': {
    label:'Credit Transactions', icon:'fa-solid fa-credit-card', color:'var(--purple)', extra:['village','balance'], rows:[]
  },
  investments: {
    label:'Investments', icon:'fa-solid fa-arrow-trend-up', color:'var(--green)', extra:['village','balance'],
    rows:[ {id:1,name:'Fixed Deposit - SBI',village:'-',balance:200000} ]
  },
  assets: {
    label:'Assets', icon:'fa-solid fa-box-archive', color:'var(--amber)', extra:['village','balance'],
    rows:[
      {id:1,name:'Office Furniture',village:'-',balance:45000},
      {id:2,name:'Two-Wheeler (Field Staff)',village:'-',balance:60000},
    ]
  },
  'inc-exp': {
    label:'Inc & Exp Accounts', icon:'fa-solid fa-book', color:'var(--teal-700)', extra:['village','balance'],
    rows:[
      {id:1,name:'SALARIES',village:'-',balance:0},
      {id:2,name:'RENTALS',village:'-',balance:0},
      {id:3,name:'COMMISSIONS',village:'-',balance:0},
      {id:4,name:'PROFIT OR LOSS',village:'-',balance:25054331},
    ]
  },
  journels: {
    label:'Journels', icon:'fa-solid fa-book-open', color:'var(--muted)', extra:['village','balance'], rows:[]
  },
  agents: {
    label:'Agents', icon:'fa-solid fa-user-tie', color:'var(--blue)', extra:['date','description'],
    rows:[
      {id:1,name:'RAJA',date:'13-03-2025',description:'Field collection - Tadepalligudem line'},
      {id:2,name:'KISHORE',date:'01-03-2022',description:'Field collection - Eluru line'},
    ]
  },
};

const BIKE_PURCHASES = [
  {id:201, rc_no:'AP39NF0499', makers:'HONDA ACTIVA 125', model:'2022', date:'19-06-2026', amount:45000, repair:2800, selled:0},
  {id:202, rc_no:'AP39DC2190', makers:'ACTIVA 5G', model:'2019', date:'26-06-2026', amount:27000, repair:11000, selled:48000},
];

const USERS = [
  {id:1,name:'RAJA',mobile:'9347222370',type:'LINE EXECUTIVE',date:'13-03-2025'},
  {id:2,name:'DURGA',mobile:'6301549033',type:'CLERK',date:'20-06-2024'},
  {id:3,name:'TEJA',mobile:'7013945700',type:'CLERK',date:'20-06-2024'},
  {id:4,name:'NANDH',mobile:'9014596648',type:'CLERK',date:'14-06-2024'},
  {id:5,name:'NABHI',mobile:'8074045692',type:'CLERK',date:'13-06-2024'},
  {id:6,name:'JANARDAN',mobile:'9398311141',type:'LINE EXECUTIVE',date:'12-02-2024'},
  {id:7,name:'KISHORE',mobile:'7780697177',type:'LINE EXECUTIVE',date:'01-03-2022'},
];

const DASH_STATS = { income:500, expenses:0, emi_collection:565205, hphl_collection:0.00, od_collection:500.00, closed_hps:14 };

const REPORT_GROUPS = {
  'Finance Reports': ['Line Report','Line Report Print','Line Report(HP)','Demand Collection Report','Line Report Print(XL)',
    'Line Report Print(S)','Line Report (AC)','Line Report(SPL)','Line Report Print(Zero)','Line Report Print(Today)',
    'C Book Report(HP)','Vehicles Report','Bike Purchases Report','Bike Repairs Report','Collection Report',
    'HL Type 2 Collection Report','OD Report','Reminders','Non Closed Report','Handloan Report','Hp Handloan Report',
    'Deposits Report','capitals Report','Closed HP Report','Seized HP Report','HP Insurance Pending Report',
    'HP Tax Pending Report','HP Pollution Report','HP RTA Token Report','HP Interest Report','C Book Report(ALL)',
    "Customer's Mobiles",'Delinquency Bucket Report'],
  'Finance Line Reports (Type 2)': ['Line Report 2','Line Report Print 2','Line Report(HP) 2','Line Report Print(S) 2',
    'Line Report (AC) 2','Line Report Print(XL) 2','Line Report Print(Zero) 2','Line Report Print(Today) 2'],
  'Accounts Reports': ['Day Report','Multi Day Report','Ledgers Balance Report','Trading Account','Monthly P&L Report',
    'P&L Report (Trail Preview)','P&L Report(Final)','Trail Balance Sheet','Balance Sheet']
};

const PNL = {
  income:[
    ['RECEIVED INTEREST',2314136.5],['AGREEMENTS',23],["OD'S",9],["EMI TA's",191293.4],['RTA',0],['Consultancy',0],['SALE PROFIT',0],
  ],
  expenses:[
    ['HL RECEIVED INTEREST',0],['CAPITALS INTEREST',0],['DEPOSITS INTEREST',0],['SALARIES',0],['RENTALS',0],['COMMISSIONS',0],['ADVERTISEMENTS',0],
  ]
};

const BALANCE_SHEET = {
  liabilities:[['CAPITAL',0],['DEPOSITS DP',0],['LOANS',0],['SUNDRY CREDITORS',0],['UNSECURED LOANS',0],
    ['INTEREST RECEIVABLE',1513362.9],['RTA',0],['CASH IN HAND',411840.8],['CHEQUES',0],['PROFIT',2505433.1],['GST Payable',0],['Difference',2912119.6]],
  assets:[['ASSETS',0],['BANKS',0],['CHITS',0],['HANDLOANS',0],['OTHER',0],['SUNDRY DEBTORS',0],['HP OUTSTANDING',7300000],['CONSULTANCY STOCK',0],['Product Stock',0]]
};


// views.js — everything that turns data into HTML strings: the navbar,
// the stat bar, and one render function per screen. app.js just decides
// *which* of these to call based on the URL.

/* ---------------------------- HELPERS ---------------------------- */

function money(n){
  n = Number(n)||0;
  return n.toLocaleString('en-IN', {minimumFractionDigits: (n%1!==0)?2:0, maximumFractionDigits:2});
}
function fmtDate(iso){
  if(!iso) return '--';
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}
function esc(s){ return String(s??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function initials(name){
  return name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function findCustomer(id){ return CUSTOMERS.find(c=>String(c.id)===String(id)); }
function go(hash){ location.hash = hash; }

/* ---------------------------- NAVBAR ---------------------------- */

function renderNavbar(){
  const el = document.getElementById('navbar');
  el.innerHTML = `
  <div class="navbar">
    <a class="brand" href="#/dashboard">
      <span class="mark"><i class="fa-solid fa-book-open mark-icon"></i></span> Finance Book
    </a>
    <div class="nav-item" data-menu="transactions">
      <button class="nav-btn active-orange" onclick="toggleMenu('transactions')">Transactions <i class="fa-solid fa-chevron-down caret"></i></button>
      <div class="dropdown">
        <a href="#/module/handloans">HandLoans</a>
        <a href="#/module/consultancy">Consultancy</a>
        <a href="#/module/capitals">Capitals</a>
        <a href="#/module/deposits">Deposits</a>
        <a href="#/module/cheques">Cheques</a>
        <a href="#/module/banks">Bank</a>
        <a href="#/module/chits">Chits</a>
        <a href="#/module/loans">Loans</a>
        <a href="#/module/credit-transactions">Credit Transactions</a>
        <a href="#/module/investments">Investments</a>
        <a href="#/module/assets">Assets</a>
        <a href="#/module/deposits-dp">Deposits(DP) New</a>
        <a href="#/module/inc-exp">Inc &amp; Exp Accounts</a>
        <a href="#/module/journels">Journels</a>
        <a href="#/module/deposits-2">Deposits Type 2</a>
        <a href="#/module/hand-loans-2">Hand Loans Type 2</a>
      </div>
    </div>
    <div class="nav-item" data-menu="others">
      <button class="nav-btn" onclick="toggleMenu('others')">Others <i class="fa-solid fa-chevron-down caret"></i></button>
      <div class="dropdown">
        <a href="#/module/inc-exp">Income &amp; Expense</a>
        <a href="#/module/rta">RTA</a>
        <a href="#/module/all-accounts">All Accounts</a>
        <a href="#/module/masters">Masters</a>
        <a href="#/module/sub-masters">Sub Masters</a>
        <a href="#/module/routes">Lines</a>
        <a href="#/module/branch-points">Branch Points</a>
        <a href="#/users">Agents</a>
        <a href="#/module/bike-types">Bike Types</a>
        <a href="#/module/branches">Branches</a>
        <a href="#/module/blacklist">Blacklist</a>
      </div>
    </div>
    <a href="#/finances"><button class="nav-btn">Finance's</button></a>
    <div class="nav-search">
      <div class="search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input id="globalSearch" type="text" placeholder="Search customers, HP no, mobile..." onkeydown="if(event.key==='Enter') doGlobalSearch()" />
      </div>
      <button class="icon-btn" title="Messages"><i class="fa-regular fa-envelope"></i></button>
      <button class="icon-btn" title="Notifications"><i class="fa-regular fa-bell"></i></button>
      <a href="#/settings" class="icon-btn" title="Settings" style="text-decoration:none;"><i class="fa-solid fa-gear"></i></a>
      <div class="user-chip"><span class="avatar">SA</span><span>Sri Aditya</span><i class="fa-solid fa-chevron-down" style="font-size:10px;opacity:.7;"></i></div>
    </div>
  </div>`;
}
function toggleMenu(name){
  document.querySelectorAll('.nav-item').forEach(item=>{
    if(item.dataset.menu===name){ item.classList.toggle('open'); }
    else item.classList.remove('open');
  });
}
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.nav-item')) document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('open'));
});
function doGlobalSearch(){
  const q = document.getElementById('globalSearch').value.trim();
  if(!q) return;
  go('#/finances?q='+encodeURIComponent(q));
}

/* ---------------------------- STAT BAR ---------------------------- */

function renderStatbar(){
  const el = document.getElementById('statbar');
  el.innerHTML = `
  <div class="statbar">
    <div class="stat"><span class="label">Income :</span><b>${money(DASH_STATS.income)}</b></div>
    <div class="stat"><span class="label">Expenses :</span><b>${money(DASH_STATS.expenses)}</b></div>
    <div class="stat good"><span class="label">EMI Collection :</span><b>${money(DASH_STATS.emi_collection)}</b></div>
    <div class="stat"><span class="label">HP HL Collection :</span><b>${DASH_STATS.hphl_collection.toFixed(2)}</b></div>
    <div class="stat"><span class="label">OD Collection :</span><b>${DASH_STATS.od_collection.toFixed(2)}</b></div>
    <div class="stat warn"><span class="label">Closed HP's :</span><b>${DASH_STATS.closed_hps}</b></div>
  </div>`;
}

/* ---------------------------- FOOTER ---------------------------- */

function renderFooter(){
  document.getElementById('footer').innerHTML = `
  <div class="footer">
    Dear Customer's, Call to this number for doubts or queries: 7382179386
    <div class="copy">Copyright © 2026 Finance Book. All rights reserved.</div>
  </div>`;
}

/* ---------------------------- BREADCRUMB ---------------------------- */

function crumb(parts){
  return `<div class="breadcrumb">${parts.map((p,i)=>{
    if(i===parts.length-1) return `<span>${esc(p.label)}</span>`;
    return `<a href="${p.href}">${esc(p.label)}</a> / `;
  }).join('')}</div>`;
}

/* ---------------------------- DASHBOARD ---------------------------- */

const DASH_CARDS = [
  {icon:'fa-solid fa-headset', color:'var(--muted)', title:'Support', desc:"Details of the Software provider and payment contacts.", href:'#/support'},
  {icon:'fa-solid fa-book', color:'var(--teal-700)', title:"Finance's", desc:"All Finances based on EMI you can enter here and can collect monthly.", href:'#/finances'},
  {icon:'fa-solid fa-handshake', color:'var(--green)', title:'Handloans', desc:'Loans given by note or on trust.', href:'#/module/handloans'},
  {icon:'fa-solid fa-file-lines', color:'var(--red)', title:'Day Report', desc:'A daily report is a document that contains information relevant to transactions happened on that particular day.', href:'#/reports/day-report'},
  {icon:'fa-solid fa-clipboard-list', color:'var(--amber)', title:'Reports', desc:'All reports that you require on daily basis.', href:'#/reports'},
  {icon:'fa-solid fa-book-open', color:'var(--red)', title:'Ledger Reports', desc:'All ledgers you can access here.', href:'#/module/all-accounts'},
  {icon:'fa-solid fa-chart-simple', color:'var(--blue)', title:'Charts', desc:'Graphical representation of your business — both graphical and non-graphical.', href:'#/charts'},
  {icon:'fa-solid fa-motorcycle', color:'var(--green)', title:'Consultancy', desc:'Vehicle purchase and sale.', href:'#/module/consultancy'},
  {icon:'fa-solid fa-users', color:'var(--blue)', title:'Users', desc:'You can share your account with family and employees by creating a user profile for each person.', href:'#/users'},
  {icon:'fa-solid fa-coins', color:'var(--amber)', title:'Capitals', desc:'Investments made by the share holders.', href:'#/module/capitals'},
  {icon:'fa-solid fa-building-columns', color:'var(--teal-700)', title:"Bank's", desc:'Transactions that are made through Bank, Googlepay, Phonepe etc.', href:'#/module/banks'},
  {icon:'fa-solid fa-users', color:'var(--red)', title:'Finance Collection', desc:'The report that shows the details of the credit sale collection.', href:'#/reports'},
  {icon:'fa-solid fa-box-archive', color:'var(--muted)', title:'Assets', desc:'Assets owned by the business.', href:'#/module/assets'},
  {icon:'fa-solid fa-money-bill-wave', color:'var(--amber)', title:'Expenses', desc:'Track and manage your business expenses.', href:'#/module/inc-exp'},
  {icon:'fa-solid fa-gear', color:'var(--muted)', title:'Settings', desc:'Configure interest rates, receipt series and business details.', href:'#/settings'},
  {icon:'fa-solid fa-bullseye', color:'var(--orange-600)', title:'Chits', desc:'Manage chit fund groups and subscriptions.', href:'#/module/chits'},
  {icon:'fa-solid fa-user-tie', color:'var(--blue)', title:'Agents', desc:'Field agents who collect EMIs and manage customers.', href:'#/users'},
  {icon:'fa-solid fa-chart-line', color:'var(--green)', title:'Profit & Loss', desc:'This report shows the details of your business profit and loss.', href:'#/reports/pnl'},
];

function renderDashboard(){
  return `
  <div class="grid">
    ${DASH_CARDS.map(c=>`
      <div class="mcard" onclick="go('${c.href}')">
        <div class="micon" style="background:${c.color}1a;color:${c.color}"><i class="${c.icon}"></i></div>
        <div><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p></div>
      </div>
    `).join('')}
  </div>`;
}

/* ---------------------------- FINANCES LIST ---------------------------- */

function renderFinancesList(params){
  const q = (params.get('q')||'').toLowerCase();
  let rows = CUSTOMERS.filter(c => !q ||
    c.name.toLowerCase().includes(q) || c.hp_no.toLowerCase().includes(q) ||
    c.mobile.includes(q) || c.village.toLowerCase().includes(q));

  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's"}])}
  <div class="page-head">
    <div class="page-title">Finance's <span class="count">( ${CUSTOMERS.length} )</span></div>
    <button class="btn btn-primary" onclick="go('#/finances/new')">+ New Finance</button>
  </div>
  <div class="card">
    <div class="toolbar">
      <input type="text" id="finSearch" placeholder="Search by name, HP No, mobile, village..." value="${esc(q)}"
        onkeydown="if(event.key==='Enter'){go('#/finances?q='+encodeURIComponent(this.value))}" />
      <button class="btn btn-outline btn-sm" onclick="go('#/finances?q='+encodeURIComponent(document.getElementById('finSearch').value))">Search</button>
      ${q?`<button class="btn btn-outline btn-sm" onclick="go('#/finances')">Clear</button>`:''}
    </div>
    <div class="table-scroll">
    <table>
      <thead><tr>
        <th>SNO</th><th>HP No</th><th>Name</th><th>Mobile</th><th>Reg No</th><th>Village</th>
        <th>EMI Period</th><th>EMI Amount</th><th>Status</th><th></th>
      </tr></thead>
      <tbody>
        ${rows.length ? rows.map((c,i)=>`
          <tr>
            <td>${i+1}</td>
            <td class="mono">${esc(c.hp_no)}</td>
            <td><a class="link-cell" href="#/finances/${c.id}">${esc(c.name)}</a></td>
            <td><a href="tel:${c.mobile}">${esc(c.mobile)}</a></td>
            <td>${esc(c.reg_no)}</td>
            <td>${esc(c.village)}</td>
            <td>${c.emi_period}</td>
            <td class="mono">₹${money(c.emi_amount)}</td>
            <td>${statusPill(c)}</td>
            <td><a class="btn btn-outline btn-sm" href="#/finances/${c.id}">Open</a></td>
          </tr>`).join('') : `<tr class="empty-row"><td colspan="10">No finances match your search.</td></tr>`}
      </tbody>
    </table>
    </div>
    <div class="pagination"><button class="active">1</button></div>
  </div>`;
}
function statusPill(c){
  if(c.closed==='YES') return `<span class="pill pill-green">Closed</span>`;
  if(c.seized==='YES') return `<span class="pill pill-red">Seized</span>`;
  return `<span class="pill pill-amber">Active</span>`;
}

/* ---------------------------- CUSTOMER SUB-NAV ---------------------------- */

function custActionBar(id, current){
  const items = [
    ['payment','Receipt'], ['out-payments','Out Payment'], ['handloans-c','Hand Loans'],
    ['emi-reports','Emi Reports'], ['bills','Bills'], ['clearance','STM'], ['reminders','RMD'],
  ];
  return `<div class="action-bar">
    ${items.map(([key,label])=>`<button class="${current===key?'current':''}" onclick="go('#/finances/${id}/${key}')">${label}</button>`).join('')}
  </div>`;
}

/* ---------------------------- CUSTOMER DETAIL ---------------------------- */

function section(id, title, bodyHtml, open){
  return `
  <div class="section ${open?'':'closed'}" id="sec-${id}">
    <div class="section-head" onclick="document.getElementById('sec-${id}').classList.toggle('closed')">
      <span>${esc(title)}</span><i class="fa-solid fa-chevron-down chev"></i>
    </div>
    <div class="section-body">${bodyHtml}</div>
  </div>`;
}

function renderCustomerDetail(id){
  const c = findCustomer(id);
  if(!c) return notFound("Finance not found");
  return `
  ${custActionBar(id,'')}
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's",href:'#/finances'},{label:c.name}])}
  <div class="page-head"><div class="page-title">${esc(c.name)} <span class="badge-scheme">${esc(c.hp_no)}</span></div></div>

  ${section('vehicle','Vehicle Details', `
    <div class="form-grid">
      <div class="field"><label>HP #</label><input value="${esc(c.hp_no)}" readonly></div>
      <div class="field"><label>Reg. No</label><input value="${esc(c.reg_no)}" readonly></div>
      <div class="field"><label>Makers #</label><input value="${esc(c.makers_no)}" readonly></div>
      <div class="field"><label>Model</label><input value="${esc(c.model)}" readonly></div>
      <div class="field"><label>Chasis No</label><input value="${esc(c.chasis_no)}" readonly></div>
      <div class="field"><label>Eng No</label><input value="${esc(c.eng_no)}" readonly></div>
      <div class="field"><label>C.L.R / H.P.N. Date</label><input value="${esc(fmtDate(c.clr_hpn_date))}" readonly></div>
      <div class="field"><label>EMI Date</label><input value="${esc(fmtDate(c.emi_date))}" readonly></div>
      <div class="field check"><input type="checkbox" ${c.cb?'checked':''} disabled><label>C-Book Received</label></div>
      <div class="field"><label>Seized</label><input value="${c.seized}" readonly></div>
      <div class="field"><label>Closed</label><input value="${c.closed}" readonly></div>
      <div class="field"><label>Village</label><input value="${esc(c.village)}" readonly></div>
    </div>
  `, true)}

  ${section('finance','Finance Information', `
    <div class="form-grid">
      <div class="field"><label>Loan Amount</label><input value="₹${money(c.loan_amount)}" readonly></div>
      <div class="field"><label>Interest Rate</label><input value="${c.interest_rate}% p.a." readonly></div>
      <div class="field"><label>EMI Period</label><input value="${c.emi_period} months" readonly></div>
      <div class="field"><label>EMI Amount</label><input value="₹${money(c.emi_amount)}" readonly></div>
    </div>
  `, false)}

  ${section('comm','Communications', `<div class="empty-state">No SMS or call logs recorded yet.</div>`, false)}
  ${section('attach','Attachments', `<div class="empty-state">No KYC documents or vehicle photos uploaded yet.</div>`, false)}

  <button class="btn btn-teal" onclick="showToast('Finance details updated')">Update</button>
  `;
}

/* ---------------------------- PAYMENT ---------------------------- */

function renderPayment(id){
  const c = findCustomer(id);
  if(!c) return notFound("Finance not found");
  return `
  ${custActionBar(id,'payment')}
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's",href:'#/finances'},{label:c.name,href:'#/finances/'+id},{label:'Payment'}])}
  <div class="card card-pad" style="max-width:480px;">
    <div class="page-title" style="margin-bottom:4px;">EMI Payment</div>
    <div style="color:var(--muted);font-size:13px;margin-bottom:18px;">HP No: <b class="mono">${esc(c.hp_no)}</b></div>
    <div class="form-grid" style="grid-template-columns:1fr;gap:14px;">
      <div class="field"><label>Date</label><input type="date" id="payDate" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="field"><label>Amount</label><input type="number" id="payAmt" value="${c.emi_amount}" oninput="updatePayTotal()"></div>
      <div class="field"><label>TA (Travelling Allowance)</label><input type="number" id="payTA" value="0" oninput="updatePayTotal()"></div>
      <div class="field"><label>Total</label><input type="text" id="payTotal" value="₹${money(c.emi_amount)}" readonly></div>
    </div>
    <button class="btn btn-primary" style="margin-top:16px;" onclick="submitPayment('${id}')">Submit</button>
  </div>`;
}
function updatePayTotal(){
  const a = +document.getElementById('payAmt').value || 0;
  const t = +document.getElementById('payTA').value || 0;
  document.getElementById('payTotal').value = '₹'+money(a+t);
}
function submitPayment(id){
  showToast('Receipt recorded successfully');
  go('#/finances/'+id+'/emi-reports');
}

/* ---------------------------- EMI REPORTS ---------------------------- */

function renderEmiReports(id){
  const c = findCustomer(id);
  if(!c) return notFound("Finance not found");
  const rows = genEmiSchedule(c);
  const totalLoan = c.loan_amount;
  const totalBalance = rows.length ? rows[rows.length-1].cumulative_balance : 0;
  return `
  ${custActionBar(id,'emi-reports')}
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's",href:'#/finances'},{label:c.name,href:'#/finances/'+id},{label:'EMI Reports'}])}
  <div class="page-title" style="margin-bottom:14px;">EMI's — HP No: <span class="mono">${esc(c.hp_no)}</span></div>

  <div class="stat-cards">
    <div class="stat-card"><div class="k">Paid Amount</div><div class="v">₹0</div></div>
    <div class="stat-card"><div class="k">Pending Balance</div><div class="v">₹0</div></div>
    <div class="stat-card"><div class="k">Total Balance</div><div class="v">₹${money(totalBalance)}</div></div>
    <div class="stat-card"><div class="k">Total Loan</div><div class="v">₹${money(totalLoan)}</div></div>
    <div class="stat-card"><div class="k">Total EMI's</div><div class="v">${rows.length}</div></div>
    <div class="stat-card"><div class="k">Paid EMI's</div><div class="v">0</div></div>
    <div class="stat-card"><div class="k">Remaining EMI's</div><div class="v">${rows.length}</div></div>
    <div class="stat-card"><div class="k">EMI Amount</div><div class="v">₹${money(c.emi_amount)}</div></div>
  </div>

  <div class="card">
    <div class="table-scroll">
    <table>
      <thead><tr><th>SNO</th><th>Due Date</th><th>Amount (Interest)</th><th>Paid Interest</th><th>Paid Amount</th><th>Balance (Cumulative)</th></tr></thead>
      <tbody>
        ${rows.map(r=>`
          <tr>
            <td><a class="link-cell" href="#/finances/${id}/payment">${r.sno}</a></td>
            <td>${fmtDate(r.due_date)}</td>
            <td class="mono">₹${money(r.amount)} <span style="color:var(--muted)">(${money(r.interest_component)})</span></td>
            <td>${money(r.paid_interest)}</td>
            <td><a class="link-cell" href="#/finances/${id}/bills">${money(r.paid_amount)}</a></td>
            <td class="mono">₹${money(r.balance)} <span style="color:var(--muted)">(${money(r.cumulative_balance)})</span></td>
          </tr>`).join('')}
      </tbody>
    </table>
    </div>
  </div>`;
}

/* ---------------------------- OUT PAYMENTS / OTHER SIMPLE SUBPAGES ---------------------------- */

function renderOutPayments(id){
  const c = findCustomer(id);
  if(!c) return notFound("Finance not found");
  return `
  ${custActionBar(id,'out-payments')}
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's",href:'#/finances'},{label:c.name,href:'#/finances/'+id},{label:'Out Payments'}])}
  <div class="page-title" style="margin-bottom:14px;">Out Payment's — HP No: <span class="mono">${esc(c.hp_no)}</span></div>
  <div class="card">
    <table>
      <thead><tr><th>SNO</th><th>Amount</th><th>Date</th><th>Interest</th><th>Paid Amt</th><th>Status</th></tr></thead>
      <tbody><tr class="empty-row"><td colspan="6">No out payment records found.</td></tr></tbody>
    </table>
  </div>`;
}

function renderCustSimple(id, key, title){
  const c = findCustomer(id);
  if(!c) return notFound("Finance not found");
  return `
  ${custActionBar(id,key)}
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's",href:'#/finances'},{label:c.name,href:'#/finances/'+id},{label:title}])}
  <div class="page-title" style="margin-bottom:14px;">${esc(title)} — HP No: <span class="mono">${esc(c.hp_no)}</span></div>
  <div class="card"><div class="empty-state"><i class="fa-regular fa-file-lines em-icon"></i>No records found for this section yet.</div></div>`;
}

/* ---------------------------- NEW FINANCE FORM ---------------------------- */

function renderNewFinance(){
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:"Finance's",href:'#/finances'},{label:'New'}])}
  <div class="page-title" style="margin-bottom:16px;">New Finance</div>

  ${section('nvehicle','Vehicle Details', `
    <div class="form-grid">
      <div class="field"><label>HP #</label><input placeholder="e.g. TYRE0032"></div>
      <div class="field"><label>Reg. No</label><input placeholder="AP39XX0000"></div>
      <div class="field"><label>Makers #</label><input placeholder="e.g. HONDA"></div>
      <div class="field"><label>Model</label><input placeholder="e.g. 2026"></div>
      <div class="field"><label>Chasis No</label><input></div>
      <div class="field"><label>Eng No</label><input></div>
      <div class="field"><label>H.P.N. Date</label><input type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="field"><label>EMI Date</label><input type="date"></div>
      <div class="field check"><input type="checkbox"><label>C-Book Received</label></div>
    </div>`, true)}

  ${section('nfinance','Finance Information', `
    <div class="form-grid">
      <div class="field"><label>Loan Amount</label><input type="number" placeholder="0"></div>
      <div class="field"><label>Interest Rate (%)</label><input type="number" placeholder="0"></div>
      <div class="field"><label>EMI Period (months)</label><input type="number" placeholder="0"></div>
      <div class="field"><label>EMI Amount</label><input type="number" placeholder="0"></div>
    </div>`, false)}

  ${section('ncomm','Communications', `<div class="empty-state">Add contact notes after the finance is created.</div>`, false)}
  ${section('nattach','Attachments', `<div class="empty-state">Upload KYC documents and vehicle photos after saving.</div>`, false)}

  <button class="btn btn-primary" onclick="showToast('New finance saved'); go('#/finances')">Submit</button>`;
}

/* ---------------------------- GENERIC MODULE LIST ---------------------------- */

function renderModule(key){
  if(key==='consultancy') return renderConsultancy();
  const mod = MODULES[key];
  if(!mod) return renderGenericEmptyModule(key);
  const cols = mod.extra;
  const colLabels = {
    village:'Village', balance:'Balance', mobile:'Mobile', date:'Date', description:'Description',
    cheque_no:'Cheque', status:'Status', amount:'Amount'
  };
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:mod.label}])}
  <div class="page-head">
    <div class="page-title"><i class="${mod.icon}" style="color:${mod.color};font-size:18px;"></i> ${mod.label}</div>
    <button class="btn btn-primary" onclick="showToast('New account form would open here')">+ New Account</button>
  </div>
  <div class="card">
    <div class="table-scroll">
    <table>
      <thead><tr><th>SNO</th><th>Name</th>${cols.map(c=>`<th>${colLabels[c]||c}</th>`).join('')}</tr></thead>
      <tbody>
        ${mod.rows.length ? mod.rows.map((r,i)=>`
          <tr>
            <td>${i+1}</td>
            <td><a class="link-cell" href="#/module/${key}/${r.id}">${esc(r.name)}</a></td>
            ${cols.map(c=>{
              let v = r[c];
              if(c==='balance'||c==='amount') v = '₹'+money(v||0);
              if(c==='date') v = v||'--';
              if(c==='status') v = `<span class="pill ${v==='Cleared'?'pill-green':'pill-amber'}">${v}</span>`;
              return `<td>${v==null?'--':v}</td>`;
            }).join('')}
          </tr>`).join('') : `<tr class="empty-row"><td colspan="${cols.length+2}">No accounts found in this module yet.</td></tr>`}
      </tbody>
    </table>
    </div>
  </div>`;
}

function renderGenericEmptyModule(key){
  const titles = {
    rta:'RTA', 'all-accounts':'All Accounts', masters:'Masters', 'sub-masters':'Sub Masters',
    routes:'Lines', 'branch-points':'Branch Points', 'bike-types':'Bike Types', branches:'Branches', blacklist:'Blacklist'
  };
  const title = titles[key] || key;
  let body = `<div class="empty-state"><i class="fa-solid fa-inbox em-icon"></i>No records to show yet.</div>`;
  if(key==='sub-masters'){
    const items = ['CAPITAL','UNSECURED LOANS','BANKS','CHITS','LOANS','SUNDRY DEBTORS','SUNDRY CREDITORS','DEPOSITS DP','ASSETS','PROFIT & EXPENSES','HANDLOANS','OTHER'];
    body = `<table><thead><tr><th>SNO</th><th>Type</th></tr></thead><tbody>
      ${items.map((t,i)=>`<tr><td>${i+1}</td><td>${t}</td></tr>`).join('')}</tbody></table>`;
  }
  if(key==='masters'){
    body = `<table><thead><tr><th>SNO</th><th>Master</th></tr></thead><tbody>
      <tr><td>1</td><td>ASSETS</td></tr><tr><td>2</td><td>LIABILITIES</td></tr></tbody></table>`;
  }
  if(key==='all-accounts'){
    const allRows = Object.entries(MODULES).flatMap(([k,m])=> m.rows.map(r=>({...r, type:m.label})));
    body = allRows.length ? `<table><thead><tr><th>SNO</th><th>Name</th><th>Village</th><th>Mobile</th><th>Account Type</th></tr></thead><tbody>
      ${allRows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.name)}</td><td>${esc(r.village||'-')}</td><td>${esc(r.mobile||'-')}</td><td>${esc(r.type)}</td></tr>`).join('')}
      </tbody></table>` : body;
  }
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:title}])}
  <div class="page-head"><div class="page-title">${title}</div></div>
  <div class="card ${key==='sub-masters'||key==='masters'||key==='all-accounts'?'':'card-pad'}">${body}</div>`;
}

function renderConsultancy(){
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:'Consultancy'}])}
  <div class="page-head">
    <div class="page-title">Consultancy</div>
    <button class="btn btn-primary" onclick="showToast('New bike purchase form would open here')">+ New Bike</button>
  </div>
  <div class="card">
    <div class="table-scroll">
    <table>
      <thead><tr><th>SNO</th><th>RC No</th><th>Makers</th><th>Model</th><th>Date</th><th>Amount</th><th>Repair</th><th>Selled</th></tr></thead>
      <tbody>
        ${BIKE_PURCHASES.map((b,i)=>`
          <tr>
            <td>${i+1}</td>
            <td><a class="link-cell" href="#/module/consultancy">${esc(b.rc_no)}</a></td>
            <td>${esc(b.makers)}</td><td>${b.model}</td><td>${b.date}</td>
            <td class="mono">₹${money(b.amount)}</td><td class="mono">₹${money(b.repair)}</td>
            <td class="mono">${b.selled?('₹'+money(b.selled)):'<span class="pill pill-amber">Unsold</span>'}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    </div>
  </div>`;
}

/* ---------------------------- USERS ---------------------------- */

function renderUsers(){
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:'Users'}])}
  <div class="page-head"><div class="page-title">Users</div><button class="btn btn-primary" onclick="showToast('New user form would open here')">+ New User</button></div>
  <div class="card">
    <table>
      <thead><tr><th>SNO</th><th>Name</th><th>Mobile</th><th>Type</th><th>Date</th></tr></thead>
      <tbody>
        ${USERS.map((u,i)=>`<tr><td>${i+1}</td><td><a class="link-cell" href="#/users">${esc(u.name)}</a></td><td>${esc(u.mobile)}</td><td>${esc(u.type)}</td><td>${u.date}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ---------------------------- REPORTS MENU ---------------------------- */

function renderReportsMenu(){
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:'Reports'}])}
  <div class="page-title" style="margin-bottom:18px;">Reports</div>
  ${Object.entries(REPORT_GROUPS).map(([g,items])=>`
    <div class="report-group">
      <h3>${g}</h3>
      <div class="report-chips">
        ${items.map(r=>`<button class="report-chip" onclick="openReport('${esc(r).replace(/'/g,"\\'")}')">${esc(r)}</button>`).join('')}
      </div>
    </div>
  `).join('')}`;
}
function openReport(name){
  if(name==='Balance Sheet') return go('#/reports/balance-sheet');
  if(name.startsWith('P&L Report')) return go('#/reports/pnl');
  if(name==='Day Report') return go('#/reports/day-report');
  showToast(name + ' — report preview not yet wired up');
}

/* ---------------------------- BALANCE SHEET ---------------------------- */

function renderBalanceSheet(){
  const totalL = BALANCE_SHEET.liabilities.reduce((s,[,v])=>s+v,0);
  const totalA = BALANCE_SHEET.assets.reduce((s,[,v])=>s+v,0);
  return `
  ${crumb([{label:'Reports',href:'#/reports'},{label:'Balance Sheet'}])}
  <div class="page-head">
    <div class="page-title">Balance Sheet</div>
    <div style="display:flex;gap:8px;"><button class="btn btn-outline btn-sm">XL</button><button class="btn btn-outline btn-sm" onclick="window.print()">Print</button></div>
  </div>
  <div class="card card-pad">
    <div class="bs-wrap">
      <div class="bs-col">
        <h4>Liabilities</h4>
        ${BALANCE_SHEET.liabilities.map(([k,v])=>`<div class="bs-row"><span>${k}</span><span class="mono">₹${money(v)}</span></div>`).join('')}
        <div class="bs-row total"><span>TOTAL</span><span class="mono">₹${money(totalL)}</span></div>
      </div>
      <div class="bs-col">
        <h4>Assets</h4>
        ${BALANCE_SHEET.assets.map(([k,v])=>`<div class="bs-row"><span>${k}</span><span class="mono">₹${money(v)}</span></div>`).join('')}
        <div class="bs-row total"><span>TOTAL</span><span class="mono">₹${money(totalA)}</span></div>
      </div>
    </div>
  </div>`;
}

/* ---------------------------- P&L ---------------------------- */

function renderPnl(){
  const totalIncome = PNL.income.reduce((s,[,v])=>s+v,0);
  const totalExp = PNL.expenses.reduce((s,[,v])=>s+v,0);
  const rowsCount = Math.max(PNL.income.length, PNL.expenses.length);
  let rows = '';
  for(let i=0;i<rowsCount;i++){
    const inc = PNL.income[i];
    const exp = PNL.expenses[i];
    rows += `<tr>
      <td>${inc?inc[0]:''}</td><td class="mono">${inc?('₹'+money(inc[1])):''}</td>
      <td>${exp?exp[0]:''}</td><td class="mono">${exp?('₹'+money(exp[1])):''}</td>
    </tr>`;
  }
  return `
  ${crumb([{label:'Reports',href:'#/reports'},{label:'P & L Report'}])}
  <div class="page-head">
    <div class="page-title">P&amp;L Report</div>
    <div style="display:flex;gap:8px;"><button class="btn btn-outline btn-sm">XL</button><button class="btn btn-outline btn-sm" onclick="window.print()">Print</button></div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Income Particulars</th><th>Amount</th><th>Expense Particulars</th><th>Amount</th></tr></thead>
      <tbody>${rows}
        <tr style="font-weight:800;background:#f6f8f7;">
          <td>TOTAL</td><td class="mono">₹${money(totalIncome)}</td>
          <td>TOTAL</td><td class="mono">₹${money(totalExp)}</td>
        </tr>
        <tr style="font-weight:800;">
          <td colspan="4">PROFIT: <span class="mono" style="color:var(--green)">₹${money(totalIncome-totalExp)}</span></td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

/* ---------------------------- DAY REPORT ---------------------------- */

function renderDayReport(){
  const today = fmtDate(new Date().toISOString());
  return `
  ${crumb([{label:'Reports',href:'#/reports'},{label:'Day Report'}])}
  <div class="page-head">
    <div class="page-title">Day Report Details</div>
    <div style="display:flex;gap:8px;"><button class="btn btn-outline btn-sm">XL</button><button class="btn btn-outline btn-sm" onclick="window.print()">Print</button></div>
  </div>
  <div class="card card-pad" style="text-align:center;margin-bottom:16px;">
    <div style="font-weight:800;font-size:16px;">SRI ADITYA FINANCE</div>
    <div style="color:var(--muted);font-size:13px;">TADEPALLIGUDEM</div>
    <div style="color:var(--muted);font-size:13px;">Day Report Details — ${today}</div>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>SNO</th><th>Name</th><th>Rc No</th><th>HP</th><th>Description</th><th>Collected By</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>OPENING BALANCE</td><td>--</td><td>--</td><td>--</td><td>--</td><td class="mono">₹${money(4118408)}</td></tr>
        ${CUSTOMERS.slice(0,4).map((c,i)=>`
          <tr>
            <td>${i+2}</td>
            <td><a class="link-cell" href="#/finances/${c.id}">${esc(c.name)}</a></td>
            <td class="mono">00/${47700+i}</td>
            <td class="mono">${c.hp_no}</td>
            <td>EMI - ${c.reg_no}</td>
            <td>${USERS[i%USERS.length].name}</td>
            <td class="mono">₹${money(c.emi_amount)}</td>
          </tr>`).join('')}
        <tr style="font-weight:800;background:#f6f8f7;"><td colspan="6">EMI Collection</td><td class="mono">₹${money(DASH_STATS.emi_collection)}</td></tr>
        <tr style="font-weight:800;"><td colspan="6">OD Collection</td><td class="mono">₹${money(DASH_STATS.od_collection)}</td></tr>
      </tbody>
    </table>
  </div>`;
}

/* ---------------------------- CHARTS ---------------------------- */

let __chartInstance = null;
function renderCharts(){
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:'Charts'}])}
  <div class="page-title" style="margin-bottom:16px;">Charts</div>
  <div class="action-bar">
    <button class="current" id="chartBtnHp" onclick="loadChart('hp')">HP's</button>
    <button id="chartBtnAmt" onclick="loadChart('amount')">Financed Amount</button>
    <button id="chartBtnColl" onclick="loadChart('collection')">Collection</button>
  </div>
  <div class="card card-pad">
    <canvas id="chartCanvas" height="110"></canvas>
  </div>`;
}
function loadChart(type){
  ['chartBtnHp','chartBtnAmt','chartBtnColl'].forEach(id=>document.getElementById(id)?.classList.remove('current'));
  const map = {hp:'chartBtnHp', amount:'chartBtnAmt', collection:'chartBtnColl'};
  document.getElementById(map[type])?.classList.add('current');
  const ctx = document.getElementById('chartCanvas');
  if(!ctx || typeof Chart==='undefined') return;
  if(__chartInstance) __chartInstance.destroy();
  const villages = [...new Set(CUSTOMERS.map(c=>c.village))];
  let data, label, color;
  if(type==='hp'){
    data = villages.map(v=>CUSTOMERS.filter(c=>c.village===v).length);
    label='Number of HPs'; color='#125a53';
  } else if(type==='amount'){
    data = villages.map(v=>CUSTOMERS.filter(c=>c.village===v).reduce((s,c)=>s+c.loan_amount,0));
    label='Financed Amount (₹)'; color='#e2841f';
  } else {
    data = villages.map(v=>CUSTOMERS.filter(c=>c.village===v).reduce((s,c)=>s+c.emi_amount,0));
    label='Monthly Collection (₹)'; color='#2f9e6e';
  }
  __chartInstance = new Chart(ctx, {
    type:'bar',
    data:{ labels: villages, datasets:[{ label, data, backgroundColor: color, borderRadius:6 }] },
    options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
  });
}

/* ---------------------------- SETTINGS ---------------------------- */

function renderSettings(){
  const s = SETTINGS;
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:'Settings'}])}
  <div class="page-title" style="margin-bottom:16px;">Settings</div>
  <div class="card card-pad">
    <div class="form-grid">
      <div class="field"><label>EMI Frequency</label><select><option ${s.emi_frequency==='NO'?'selected':''}>NO</option><option ${s.emi_frequency==='YES'?'selected':''}>YES</option></select></div>
      <div class="field"><label>Day Scroll Protect</label><select><option ${s.day_scroll_protect==='NO'?'selected':''}>NO</option><option ${s.day_scroll_protect==='YES'?'selected':''}>YES</option></select></div>
      <div class="field"><label>Auto Date</label><select><option ${s.auto_date==='YES'?'selected':''}>YES</option><option ${s.auto_date==='NO'?'selected':''}>NO</option></select></div>
      <div class="field"><label>Out Payment Interest</label><input type="number" value="${s.out_payment_interest}"></div>
      <div class="field"><label>OD Interest</label><input type="number" step="0.1" value="${s.od_interest}"></div>
      <div class="field"><label>Settlement Interest</label><input type="number" value="${s.settlement_interest}"></div>
      <div class="field"><label>Consultancy Interest</label><input type="number" value="${s.consultancy_interest}"></div>
      <div class="field"><label>Handloan Type</label><select><option ${s.handloan_type==='Type 1'?'selected':''}>Type 1</option><option ${s.handloan_type==='Type 2'?'selected':''}>Type 2</option></select></div>
      <div class="field"><label>Emi Report (CB, CLR)</label><select><option ${s.emi_report_cb_clr==='No'?'selected':''}>No</option><option ${s.emi_report_cb_clr==='Yes'?'selected':''}>Yes</option></select></div>
      <div class="field"><label>HP Rcpt Series</label><input value="${s.hp_rcpt_series}"></div>
      <div class="field"><label>HPHL Rcpt Series</label><input value="${s.hphl_rcpt_series}"></div>
      <div class="field"><label>HPOP Rcpt Series</label><input value="${s.hpop_rcpt_series}"></div>
      <div class="field"><label>HP OD Rcpt Series</label><input value="${s.hp_od_rcpt_series}"></div>
      <div class="field"><label>HL Rcpt Series</label><input value="${s.hl_rcpt_series}"></div>
      <div class="field"><label>HP OP Due Date</label><select><option ${s.hp_op_due_date==='YES'?'selected':''}>YES</option><option ${s.hp_op_due_date==='NO'?'selected':''}>NO</option></select></div>
      <div class="field"><label>Messages Count</label><input value="${s.messages_count}" readonly></div>
    </div>
    <hr style="border:none;border-top:1px solid var(--border);margin:22px 0;">
    <div style="font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);margin-bottom:14px;">Business Address</div>
    <div class="form-grid">
      <div class="field"><label>City / Town</label><input value="${s.city}"></div>
      <div class="field"><label>Street</label><input value="${s.street}"></div>
      <div class="field"><label>Mobile</label><input value="${s.mobile}"></div>
      <div class="field"><label>Alternate Mobile</label><input value="${s.alternate_mobile}"></div>
      <div class="field"><label>State</label><input value="${s.state}"></div>
    </div>
    <hr style="border:none;border-top:1px solid var(--border);margin:22px 0;">
    <div style="font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);margin-bottom:14px;">Bank Details</div>
    <div class="form-grid">
      <div class="field"><label>Bank Acc No</label><input value="${s.bank_acc_no}"></div>
      <div class="field"><label>Bank Name</label><input value="${s.bank_name}"></div>
      <div class="field"><label>IFSC Code</label><input value="${s.ifsc_code}"></div>
      <div class="field"><label>Branch Name</label><input value="${s.branch_name}"></div>
    </div>
    <button class="btn btn-primary" style="margin-top:20px;" onclick="showToast('Settings saved')">Submit</button>
  </div>`;
}

/* ---------------------------- SUPPORT ---------------------------- */

function renderSupport(){
  return `
  ${crumb([{label:'Dashboard',href:'#/dashboard'},{label:'Support'}])}
  <div class="page-title" style="margin-bottom:16px;">Support</div>
  <div class="card card-pad" style="max-width:520px;">
    <div style="font-weight:800;font-size:16px;margin-bottom:14px;">Chilukuri Software Solutions</div>
    <div class="bs-row"><span>Founder &amp; MD</span><span>Chandu Chilukuri</span></div>
    <div class="bs-row"><span>Support Number</span><span>7382179386</span></div>
    <div class="bs-row"><span>Sales Manager</span><span>8985889196</span></div>
    <div class="bs-row"><span>PhonePe</span><span>7382179386 | 9494120779</span></div>
    <div class="bs-row"><span>Google Pay</span><span>7382179386 | 9494120779</span></div>
    <div class="bs-row"><span>Account No</span><span>33220261048</span></div>
    <div class="bs-row"><span>Bank</span><span>SBI</span></div>
    <div class="bs-row"><span>Branch</span><span>Elamanchili</span></div>
    <div class="bs-row"><span>IFSC Code</span><span>SBIN0002713</span></div>
  </div>`;
}

/* ---------------------------- 404 ---------------------------- */

function notFound(msg){
  return `<div class="card"><div class="empty-state"><i class="fa-solid fa-triangle-exclamation em-icon"></i>${esc(msg||'Page not found')}</div></div>`;
}


// app.js — hash router + boot sequence.
// Nothing fancy, just reads location.hash and swaps out #app's innerHTML.
// Runs renderNavbar/renderStatbar/renderFooter once, then render() on every
// hashchange. Good enough for a prototype this size — would reach for
// something heavier if this grows past ~20 screens.

function parseHash(){
  const raw = location.hash.replace(/^#/,'') || '/dashboard';
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart||'');
  const segs = pathPart.split('/').filter(Boolean);
  return {segs, params};
}

function render(){
  const {segs, params} = parseHash();
  let html = '';
  const [root, a, b, c] = segs;

  if(!root || root==='dashboard'){ html = renderDashboard(); }
  else if(root==='finances'){
    if(a==='new') html = renderNewFinance();
    else if(a && b==='payment') html = renderPayment(a);
    else if(a && b==='emi-reports') html = renderEmiReports(a);
    else if(a && b==='out-payments') html = renderOutPayments(a);
    else if(a && b==='handloans-c') html = renderCustSimple(a,'handloans-c','Hand Loans');
    else if(a && b==='bills') html = renderCustSimple(a,'bills','Bills');
    else if(a && b==='clearance') html = renderCustSimple(a,'clearance','Clearance / STM');
    else if(a && b==='reminders') html = renderCustSimple(a,'reminders','Reminders');
    else if(a) html = renderCustomerDetail(a);
    else html = renderFinancesList(params);
  }
  else if(root==='module'){ html = renderModule(a); }
  else if(root==='users'){ html = renderUsers(); }
  else if(root==='reports'){
    if(a==='balance-sheet') html = renderBalanceSheet();
    else if(a==='pnl') html = renderPnl();
    else if(a==='day-report') html = renderDayReport();
    else html = renderReportsMenu();
  }
  else if(root==='charts'){ html = renderCharts(); }
  else if(root==='settings'){ html = renderSettings(); }
  else if(root==='support'){ html = renderSupport(); }
  else { html = notFound('Page not found: #/'+segs.join('/')); }

  document.getElementById('app').innerHTML = html;
  if(root==='charts') setTimeout(()=>loadChart('hp'), 30);
  window.scrollTo({top:0, behavior:'instant'});
}

/* ---------------------------- INIT ---------------------------- */

renderNavbar();
renderStatbar();
renderFooter();
window.addEventListener('hashchange', render);
render();

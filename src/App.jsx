import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  CartesianGrid, Line,
} from "recharts";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const { VITE_GOOGLE_CLIENT_ID, VITE_SPREADSHEET_ID } = import.meta.env;

const CONFIG = {
  CLIENT_ID: VITE_GOOGLE_CLIENT_ID,
  SPREADSHEET_ID: VITE_SPREADSHEET_ID,
  sheets: {
    raw_data: "raw_data",          // ← your exact tab name
    daily:    "daily_consumption", // ← your exact tab name
    posts:    "posts",             // ← your exact tab name
  }
};
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";

// ─── TYPES ───────────────────────────────────────────────────────────────────
const PRODUCT_TYPES = ["Matcha","Hojicha","Gyokuro","Sencha","Other Tea","Appliance","Accessory","Tool","Other"];
const CONSUMABLE_TYPES = ["Matcha","Hojicha","Gyokuro","Sencha","Other Tea"];

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  ink:"#1a1a18", stone:"#3d3d38", moss:"#4a5c3f", sage:"#7a9467",
  mist:"#b8c4aa", cream:"#f5f2eb", parchment:"#ede9df", warm:"#d4c9b0",
  accent:"#6b8f52", red:"#c0392b", gold:"#c8a84b", amber:"#d4854a",
};
const PIE_COLORS = [C.moss,C.sage,C.mist,C.warm,C.gold,C.stone,"#8fa882","#d4b896"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseGrams(v) { return parseFloat(v)||0; }
function parsePrice(v) { return parseFloat((v||"").replace(/[$,]/g,""))||0; }

function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d) ? null : d;
}

// Full date with year when year differs from current
function fmtDate(v, forceYear = false) {
  if (!v) return "";
  const d = parseDate(v);
  if (!d) return String(v);
  const thisYear = new Date().getFullYear();
  if (forceYear || d.getFullYear() !== thisYear) {
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
  }
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

function weekLabel(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  const jan1 = new Date(d.getFullYear(),0,1);
  return `W${Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7)}`;
}
function today() { return new Date().toLocaleDateString("en-US"); }
function todayDate() { const d = new Date(); d.setHours(0,0,0,0); return d; }

function generateTinId(brand, name) {
  const slug = s => s.toUpperCase().replace(/[^A-Z0-9]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
  const d = new Date();
  return `${slug(brand)}-${slug(name)}-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
}

function filterEmpty(rows) {
  return rows.filter(r => Object.values(r).some(v => v && String(v).trim() !== ""));
}
function isSelfConsumption(row) {
  const v = row["For_someone_else"] || row["For_someone_else?"] || "";
  return v.toLowerCase() !== "y";
}
function isConsumable(r) { return CONSUMABLE_TYPES.includes(r.Product_Type); }

// Affiliate column: treat "Code", "Affiliate Code", any non-empty value as "has affiliate"
function hasAffiliate(r) {
  const v = (r["Affiliate?"] || r["Affiliate"] || "").trim().toLowerCase();
  return v !== "" && v !== "n" && v !== "no";
}

// Days since a date
function daysSince(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return Math.floor((todayDate() - d) / 86400000);
}

// Days until a date (negative = already passed)
function daysUntil(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return null;
  return Math.ceil((d - todayDate()) / 86400000);
}

// Computed expiry: for opened tins with no explicit expiry, estimate 3.5 months from Date_received
// Returns { date, estimated: true/false } or null
function getExpiry(tin) {
  if (tin.Expiration_Date?.trim()) {
    const d = parseDate(tin.Expiration_Date);
    return d ? { date: d, estimated: false } : null;
  }
  if (tin.Status === "Opened" && tin.Date_received?.trim()) {
    const d = parseDate(tin.Date_received);
    if (!d) return null;
    const est = new Date(d);
    est.setDate(est.getDate() + 105); // 3.5 months
    return { date: est, estimated: true };
  }
  return null;
}

// Priority score for tin (lower = more urgent)
// 1. Opened tins always come first (already degrading)
// 2. Unopened/Pending: sorted by expiration date ascending (soonest first)
// 3. No expiration date = lowest priority within each group
function tinPriority(tin) {
  // Flat sort by days until expiry — no status grouping
  // Finished / Gave Away always last
  if (tin.Status==="Finished"||tin.Status==="Gave Away") return 9999999;
  const exp = getExpiry(tin);
  if (!exp) return 99999; // no expiry info = deprioritize
  return Math.ceil((exp.date - todayDate()) / 86400000);
}

function rowsToObjects(rows) {
  if (!rows||rows.length<2) return [];
  const headers = rows[0].map(h=>h.trim());
  return filterEmpty(rows.slice(1).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]??""]))));
}
function objectToRow(obj, headers) { return headers.map(h=>obj[h]??""); }

// ─── STATUS SYNC ─────────────────────────────────────────────────────────────
function computeStatusUpdates(raw_data, daily) {
  const updates = [];
  const tinIdsInLog = new Set(daily.map(d=>d.Tin_ID).filter(Boolean));
  const finishedTinIds = new Set(daily.filter(d=>d["Finished_tin_today"]?.toLowerCase()==="y").map(d=>d.Tin_ID).filter(Boolean));
  for (const tin of raw_data) {
    if (!isConsumable(tin)) continue;
    if (tin.Status==="Gave Away") continue;
    const id = tin.Tin_ID, cur = tin.Status;
    let next = cur;
    if (tin.Date_received && !tinIdsInLog.has(id) && cur!=="Finished") next = "Unopened";
    if (tinIdsInLog.has(id) && (cur==="Unopened"||cur==="Pending"||!cur)) next = "Opened";
    if (finishedTinIds.has(id) && cur!=="Finished") next = "Finished";
    if (next !== cur && next) updates.push({ tin, newStatus: next, selected: true, reason: next==="Finished"?"Finished_tin_today marked":next==="Opened"?"Appears in consumption log":"Has Date_received, not in log" });
  }
  return updates;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
function getMockData() {
  const brands = ["Ippodo","Yamamasa Koyamaen","Marukyu Koyamaen","Kettl","Daylight Matcha","Rikuien"];
  const products = ["Ummon","Shikibu no Mukashi","Aoarashi","Morning Light","Yugen","Tasting"];
  const raw_data = Array.from({length:30},(_,i)=>({
    Tin_ID:`TIN-${i+1}`, Brand:brands[i%brands.length],
    Product_Name:i>=26?["Matcha Whisk","Scale","Chasen Holder","Electric Frother"][i-26]:products[i%products.length],
    Product_Type:i>=26?["Appliance","Appliance","Accessory","Appliance"][i-26]:i%7===5?"Hojicha":"Matcha",
    How_I_obtained:i%3===0?"Gifted (brand)":i%3===1?"Purchased":"PR",
    Retail_Price:`$${(15+(i*7)%45).toFixed(2)}`, "Price/g":i>=26?"":`$${(0.4+(i*0.1)%1.2).toFixed(2)}`,
    Tin_Weight_g:i>=26?"":String(30+(i*10)%70),
    Status:i<10?"Finished":i<17?"Opened":i<22?"Unopened":i<24?"Pending":i>=26?"":"Gave Away",
    "Obligation?":i%3===0?"Post":"", "Affiliate?":i%4===0?"Affiliate Code":i%6===0?"Code":"",
    Date_received:`${i<15?"2024":"2025"}/${String((i%12)+1).padStart(2,"0")}/15`,
    Date_of_contact:i%3===0?`2025/${String((i%12)+1).padStart(2,"0")}/01`:"",
    Expiration_Date:i%5===0?`2026/${String(((i*3)%12)+1).padStart(2,"0")}/01`:"",
    Origin:["Kyoto","Uji","Nishio","Kagoshima"][i%4],
    "_Ceremonial_advertised?_(Matcha)":i%2===0?"y":"n",
  }));
  const daily = Array.from({length:50},(_,i)=>{
    const d = new Date("2026-01-01"); d.setDate(d.getDate()+Math.floor(i*0.86));
    // cap at today
    const cap = todayDate();
    if (d > cap) return null;
    return { Tin_ID:raw_data[i%20].Tin_ID, Date:d.toLocaleDateString("en-US"),
      Brand:brands[i%brands.length], Type:i%7===6?"Hojicha":"Matcha",
      Name:products[i%products.length], Grams_Used:String(1+(i%4)),
      "For_someone_else":i%7===0?"y":"", Latte:i%2===0?"y":"", Usucha:i%3===0?"y":"", Combo:i%11===0?"y":"",
      "New_tin_opened":i%6===0?"y":"", "Finished_tin_today":i%9===0?"y":"", Notes:"" };
  }).filter(Boolean);
  const posts = Array.from({length:20},(_,i)=>{
    const d = new Date("2025-03-01"); d.setDate(d.getDate()+i*7);
    return { post_id:`POST-${i}`, post_date:d.toLocaleDateString("en-US"),
      content_type:["carousel","reel","static"][i%3], post_category:["recipe","review","recap","haul"][i%4],
      on_main_feed:"y", views:String(5000+i*1800+(i%3)*4000), likes:String(300+i*60),
      saves:String(80+i*25), shares:String(20+i*8), comments:String(5+i*2), follows:String(10+i*4) };
  });
  return { raw_data, daily, posts };
}

// ─── GOOGLE SHEETS HOOK ───────────────────────────────────────────────────────
function useGoogleSheets() {
  const [signedIn, setSignedIn] = useState(false);
  const tokenClientRef = useRef(null);
  useEffect(() => {
    if (CONFIG.clientId.startsWith("YOUR_")) return;
    const load = src => new Promise(res => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script"); s.src=src; s.onload=res; document.head.appendChild(s);
    });
    Promise.all([load("https://apis.google.com/js/api.js"),load("https://accounts.google.com/gsi/client")]).then(()=>{
      window.gapi.load("client", async () => {
        await window.gapi.client.init({discoveryDocs:[DISCOVERY_DOC]});
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id:CONFIG.clientId, scope:SCOPES, callback:(r)=>{if(!r.error)setSignedIn(true)},
        });
      });
    });
  },[]);
  const signIn = useCallback(()=>tokenClientRef.current?.requestAccessToken({prompt:"consent"}),[]);
  const signOut = useCallback(()=>{
    const t=window.gapi?.client?.getToken();
    if(t){window.google.accounts.oauth2.revoke(t.access_token);window.gapi.client.setToken("");}
    setSignedIn(false);
  },[]);
  const readSheet = useCallback(async n=>{
    const r=await window.gapi.client.sheets.spreadsheets.values.get({spreadsheetId:CONFIG.spreadsheetId,range:n});
    return rowsToObjects(r.result.values||[]);
  },[]);
  const getHeaders = useCallback(async n=>{
    const r=await window.gapi.client.sheets.spreadsheets.values.get({spreadsheetId:CONFIG.spreadsheetId,range:`${n}!1:1`});
    return (r.result.values?.[0]||[]).map(h=>h.trim());
  },[]);
  const appendRow = useCallback(async(n,obj)=>{
    const h=await getHeaders(n);
    await window.gapi.client.sheets.spreadsheets.values.append({spreadsheetId:CONFIG.spreadsheetId,range:n,valueInputOption:"USER_ENTERED",resource:{values:[objectToRow(obj,h)]}});
  },[getHeaders]);
  const updateRow = useCallback(async(n,idx,obj)=>{
    const h=await getHeaders(n);
    await window.gapi.client.sheets.spreadsheets.values.update({spreadsheetId:CONFIG.spreadsheetId,range:`${n}!A${idx}`,valueInputOption:"USER_ENTERED",resource:{values:[objectToRow(obj,h)]}});
  },[getHeaders]);
  const deleteRow = useCallback(async(n,idx)=>{
    const meta=await window.gapi.client.sheets.spreadsheets.get({spreadsheetId:CONFIG.spreadsheetId});
    const sheet=meta.result.sheets.find(s=>s.properties.title===n);
    if(!sheet)throw new Error(`Sheet "${n}" not found`);
    await window.gapi.client.sheets.spreadsheets.batchUpdate({spreadsheetId:CONFIG.spreadsheetId,resource:{requests:[{deleteDimension:{range:{sheetId:sheet.properties.sheetId,dimension:"ROWS",startIndex:idx-1,endIndex:idx}}}]}});
  },[]);
  return {signedIn,signIn,signOut,readSheet,appendRow,updateRow,deleteRow};
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Stat({label,value,sub,accent}) {
  return (
    <div style={{borderTop:`1px solid ${C.warm}`,paddingTop:16,paddingBottom:8}}>
      <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.stone,marginBottom:6}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,color:accent||C.ink,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:C.stone,marginTop:4}}>{sub}</div>}
    </div>
  );
}
function SectionTitle({children,right}) {
  return (
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",borderBottom:`1px solid ${C.ink}`,paddingBottom:8,marginBottom:18}}>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,fontWeight:700,color:C.ink,margin:0}}>{children}</h2>
      {right&&<span style={{fontSize:10,color:C.stone,letterSpacing:"0.08em"}}>{right}</span>}
    </div>
  );
}
const TT=({active,payload,label,fmt})=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:C.ink,color:C.cream,padding:"10px 14px",fontSize:11,borderRadius:2,lineHeight:1.7}}>
    <div style={{opacity:0.6,marginBottom:4}}>{label}</div>
    {payload.map((p,i)=><div key={i}>{p.name}: <strong>{fmt?fmt(p.value):p.value}</strong></div>)}
  </div>;
};
function Modal({title,onClose,children,danger}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,26,24,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.cream,width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",borderRadius:2}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 28px 16px",borderBottom:`1px solid ${danger?C.red:C.warm}`}}>
          <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:700,color:danger?C.red:C.ink}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.stone}}>×</button>
        </div>
        <div style={{padding:"24px 28px"}}>{children}</div>
      </div>
    </div>
  );
}
function Field({label,children,required}) {
  return <div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,marginBottom:6}}>
      {label}{required&&<span style={{color:C.red}}> *</span>}
    </label>{children}
  </div>;
}
const inp={width:"100%",padding:"8px 10px",border:`1px solid ${C.warm}`,background:C.parchment,color:C.ink,fontSize:12,borderRadius:1,outline:"none"};
const sel={background:C.cream,border:`1px solid ${C.warm}`,color:C.ink,padding:"6px 10px",fontSize:11,borderRadius:1,cursor:"pointer"};
const btnP={background:C.ink,color:C.cream,border:"none",padding:"10px 22px",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:1};
const btnS={background:"transparent",color:C.stone,border:`1px solid ${C.warm}`,padding:"10px 22px",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:1};
const btnD={background:C.red,color:C.cream,border:"none",padding:"10px 22px",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:1};

// ─── SORTABLE TABLE HEADER ────────────────────────────────────────────────────
function Th({label, col, sortCol, sortDir, onSort}) {
  const active = sortCol===col;
  return (
    <th onClick={()=>onSort(col)} style={{textAlign:"left",padding:"10px 14px",color:active?C.cream:C.mist,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:400,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:active?"rgba(255,255,255,0.08)":"transparent"}}>
      {label} {active?(sortDir==="asc"?"↑":"↓"):""}
    </th>
  );
}

// ─── LOG ENTRY MODAL ──────────────────────────────────────────────────────────
function LogEntryModal({tins,onSave,onClose,saving}) {
  const active = tins.filter(t=>isConsumable(t)&&(t.Status==="Opened"||t.Status==="Unopened"));
  const [form,setForm]=useState({Tin_ID:active[0]?.Tin_ID||"",Date:today(),Brand:active[0]?.Brand||"",Type:active[0]?.Product_Type||"Matcha",Name:active[0]?.Product_Name||"",Grams_Used:"2","For_someone_else":"",Latte:"",Usucha:"",Combo:"","New_tin_opened":"","Finished_tin_today":"",Notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const tog=k=>set(k,form[k]==="y"?"":"y");
  const onTin=id=>{const t=tins.find(t=>t.Tin_ID===id);if(t)setForm(f=>({...f,Tin_ID:id,Brand:t.Brand,Type:t.Product_Type,Name:t.Product_Name||""}));};
  const Tog=({field,label})=><button type="button" onClick={()=>tog(field)} style={{padding:"6px 14px",fontSize:11,border:`1px solid ${form[field]==="y"?C.moss:C.warm}`,background:form[field]==="y"?C.moss:"transparent",color:form[field]==="y"?C.cream:C.stone,cursor:"pointer",borderRadius:1,marginRight:8,marginBottom:8}}>{label}</button>;
  return <Modal title="Log Consumption Entry" onClose={onClose}>
    <Field label="Tin" required>
      <select value={form.Tin_ID} onChange={e=>onTin(e.target.value)} style={{...inp}}>
        {active.map(t=><option key={t.Tin_ID} value={t.Tin_ID}>{t.Brand} — {t.Product_Name} ({t.Status})</option>)}
        <option value="">Other / Not in list</option>
      </select>
    </Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Date" required><input value={form.Date} onChange={e=>set("Date",e.target.value)} style={inp} placeholder="MM/DD/YYYY"/></Field>
      <Field label="Grams" required><input type="number" step="0.5" value={form.Grams_Used} onChange={e=>set("Grams_Used",e.target.value)} style={inp}/></Field>
    </div>
    <Field label="Prep"><Tog field="Latte" label="Latte"/><Tog field="Usucha" label="Usucha"/><Tog field="Combo" label="Combo"/></Field>
    <Field label="Other"><Tog field="For_someone_else" label="For someone else"/><Tog field="New_tin_opened" label="Opened new tin"/><Tog field="Finished_tin_today" label="Finished tin today"/></Field>
    <Field label="Notes"><input value={form.Notes} onChange={e=>set("Notes",e.target.value)} style={inp} placeholder="Optional…"/></Field>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Save Entry"}</button>
    </div>
  </Modal>;
}

// ─── ADD ITEM MODAL ───────────────────────────────────────────────────────────
function AddTinModal({onSave,onClose,saving}) {
  const [form,setForm]=useState({Tin_ID:"",Brand:"",Product_Name:"",Product_Type:"Matcha",Origin:"",Retail_Price:"","Price/g":"",Tin_Weight_g:"",How_I_obtained:"Purchased",Method_of_contact:"","Obligation?":"","Affiliate?":"",Date_received:today(),Status:"Unopened","_Ceremonial_advertised?_(Matcha)":"n","Organic?_(Matcha)":"n","First-harvest?_(Matcha)":"n",URL:"",Expiration_Date:""});
  const set=(k,v)=>{const u={...form,[k]:v};if((k==="Brand"||k==="Product_Name")&&u.Brand&&u.Product_Name)u.Tin_ID=generateTinId(u.Brand,u.Product_Name);setForm(u);};
  const cons=isConsumable(form);
  return <Modal title="Add New Item" onClose={onClose}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Brand" required><input style={inp} value={form.Brand} onChange={e=>set("Brand",e.target.value)}/></Field>
      <Field label="Product Name" required><input style={inp} value={form.Product_Name} onChange={e=>set("Product_Name",e.target.value)}/></Field>
    </div>
    <Field label="ID (auto-generated)"><input style={{...inp,color:C.stone}} value={form.Tin_ID} onChange={e=>set("Tin_ID",e.target.value)}/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Type" required><select style={{...inp}} value={form.Product_Type} onChange={e=>set("Product_Type",e.target.value)}>{PRODUCT_TYPES.map(t=><option key={t}>{t}</option>)}</select></Field>
      {cons?<Field label="Origin"><input style={inp} value={form.Origin} onChange={e=>set("Origin",e.target.value)} placeholder="Kyoto, Uji…"/></Field>
           :<Field label="URL"><input style={inp} value={form.URL} onChange={e=>set("URL",e.target.value)} placeholder="https://…"/></Field>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:cons?"1fr 1fr 1fr":"1fr 1fr",gap:12}}>
      <Field label="Price"><input style={inp} value={form.Retail_Price} onChange={e=>set("Retail_Price",e.target.value)} placeholder="$29.99"/></Field>
      {cons&&<Field label="Price/g"><input style={inp} value={form["Price/g"]} onChange={e=>set("Price/g",e.target.value)} placeholder="$1.00"/></Field>}
      {cons&&<Field label="Weight (g)"><input style={inp} value={form.Tin_Weight_g} onChange={e=>set("Tin_Weight_g",e.target.value)}/></Field>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="How Obtained"><select style={{...inp}} value={form.How_I_obtained} onChange={e=>set("How_I_obtained",e.target.value)}>{["Purchased","Gifted (brand)","Gifted (friend)","PR","Other"].map(o=><option key={o}>{o}</option>)}</select></Field>
      {cons&&<Field label="Status"><select style={{...inp}} value={form.Status} onChange={e=>set("Status",e.target.value)}>{["Unopened","Opened","Pending","Gave Away","Finished"].map(s=><option key={s}>{s}</option>)}</select></Field>}
    </div>
    {form.How_I_obtained!=="Purchased"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Obligation"><input style={inp} value={form["Obligation?"]} onChange={e=>set("Obligation?",e.target.value)} placeholder="Post, Story…"/></Field>
      <Field label="Affiliate"><input style={inp} value={form["Affiliate?"]} onChange={e=>set("Affiliate?",e.target.value)} placeholder="Code, Affiliate Code…"/></Field>
    </div>}
    {cons&&<Field label="Expiration Date"><input style={inp} value={form.Expiration_Date} onChange={e=>set("Expiration_Date",e.target.value)} placeholder="MM/DD/YYYY"/></Field>}
    <Field label="Date Received"><input style={inp} value={form.Date_received} onChange={e=>set("Date_received",e.target.value)}/></Field>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Add Item"}</button>
    </div>
  </Modal>;
}

// ─── EDIT / DELETE MODAL ──────────────────────────────────────────────────────
function EditRowModal({row,onSave,onDelete,onClose,saving}) {
  const [form,setForm]=useState({...row});
  const [confirm,setConfirm]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const keys=Object.keys(form).filter(k=>k!=="__rowIndex");
  if(confirm)return <Modal title="Delete this row?" onClose={()=>setConfirm(false)} danger>
    <p style={{color:C.stone,marginBottom:24,fontSize:13}}>This permanently deletes this row from your Google Sheet.</p>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={()=>setConfirm(false)}>Cancel</button>
      <button style={btnD} onClick={()=>onDelete(form)} disabled={saving}>{saving?"Deleting…":"Yes, Delete"}</button>
    </div>
  </Modal>;
  return <Modal title="Edit Entry" onClose={onClose}>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {keys.map(k=><Field key={k} label={k}><input style={inp} value={form[k]} onChange={e=>set(k,e.target.value)}/></Field>)}
    </div>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"space-between"}}>
      <button style={{...btnD,padding:"8px 16px"}} onClick={()=>setConfirm(true)}>Delete</button>
      <div style={{display:"flex",gap:10}}>
        <button style={btnS} onClick={onClose}>Cancel</button>
        <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Save"}</button>
      </div>
    </div>
  </Modal>;
}

// ─── STATUS SYNC MODAL (with per-item select) ─────────────────────────────────
function StatusSyncModal({updates,onApply,onClose,saving}) {
  const [items,setItems]=useState(updates.map(u=>({...u,selected:true})));
  const toggle=i=>setItems(prev=>prev.map((it,j)=>j===i?{...it,selected:!it.selected}:it));
  const selected=items.filter(i=>i.selected);
  return <Modal title={`${updates.length} Status Update${updates.length>1?"s":""} Detected`} onClose={onClose}>
    <p style={{color:C.stone,fontSize:12,marginBottom:16}}>Uncheck any you don't want to apply.</p>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24,maxHeight:320,overflowY:"auto"}}>
      {items.map((u,i)=>(
        <div key={i} onClick={()=>toggle(i)} style={{padding:"10px 14px",background:u.selected?C.parchment:C.cream,borderLeft:`3px solid ${u.selected?C.moss:C.warm}`,fontSize:11,cursor:"pointer",opacity:u.selected?1:0.5,display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:16,color:u.selected?C.moss:C.mist,flexShrink:0}}>{u.selected?"☑":"☐"}</span>
          <div>
            <div style={{fontWeight:600}}>{u.tin.Brand} — {u.tin.Product_Name}</div>
            <div style={{color:C.stone,marginTop:3}}>
              <span style={{color:C.red}}>{u.tin.Status||"—"}</span>{" → "}
              <span style={{color:C.moss,fontWeight:600}}>{u.newStatus}</span>
              <span style={{opacity:0.6,marginLeft:8}}>({u.reason})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:11,color:C.stone}}>{selected.length} of {items.length} selected</span>
      <div style={{display:"flex",gap:10}}>
        <button style={btnS} onClick={onClose}>Skip</button>
        <button style={{...btnP,background:C.moss}} onClick={()=>onApply(selected)} disabled={saving||selected.length===0}>{saving?"Updating…":"Apply Selected"}</button>
      </div>
    </div>
  </Modal>;
}

// ─── PENDING ITEMS PANEL ──────────────────────────────────────────────────────
function PendingPanel({items,onEdit}) {
  const [collapsed,setCollapsed]=useState(false);
  // Only show consumable items (appliances/accessories never have pending status)
  const consumableItems=items; // already filtered upstream
  if(!consumableItems.length)return null;
  return <div style={{background:"#fdf8ee",border:`1px solid ${C.gold}`,borderRadius:2,marginBottom:24}}>
    <div onClick={()=>setCollapsed(c=>!c)} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 22px",cursor:"pointer",userSelect:"none"}}>
      <span style={{fontSize:14,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,color:C.ink}}>Pending Items</span>
      <span style={{fontSize:10,background:C.gold,color:C.cream,padding:"2px 8px",borderRadius:1,letterSpacing:"0.06em"}}>{consumableItems.length}</span>
      <span style={{fontSize:10,color:C.stone}}>Awaiting response / delivery</span>
      <span style={{marginLeft:"auto",fontSize:12,color:C.stone}}>{collapsed?"▸ Show":"▾ Hide"}</span>
    </div>
    {!collapsed&&<div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 22px 18px"}}>
      {consumableItems.map((r,i)=>{
        const ds=daysSince(r.Date_of_contact||r.Date_received);
        const urgent=ds!==null&&ds>30;
        return <div key={i} onClick={()=>onEdit(r)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:C.cream,borderLeft:`3px solid ${urgent?C.amber:C.warm}`,cursor:"pointer",borderRadius:"0 2px 2px 0"}}>
          <div>
            <span style={{fontWeight:600,fontSize:12}}>{r.Brand}</span>
            <span style={{color:C.stone,fontSize:11,marginLeft:8}}>{r.Product_Name}</span>
            {r["Obligation?"]&&<span style={{fontSize:10,background:C.parchment,border:`1px solid ${C.warm}`,padding:"1px 6px",marginLeft:8,borderRadius:1}}>{r["Obligation?"]}</span>}
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:16}}>
            {ds!==null&&<div style={{fontSize:11,color:urgent?C.amber:C.stone,fontWeight:urgent?700:400}}>{ds}d since contact{urgent?" ⚠":""}</div>}
            {r.Date_received&&<div style={{fontSize:10,color:C.mist}}>Received: {fmtDate(r.Date_received,true)}</div>}
          </div>
        </div>;
      })}
    </div>}
  </div>;
}

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────
function exportCSV(data,filename) {
  if(!data.length)return;
  const headers=Object.keys(data[0]).filter(k=>k!=="__rowIndex");
  const csv=[headers,...data.map(r=>headers.map(h=>r[h]??""))].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=filename;a.click();
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MatchaDashboard() {
  const [sheetData,setSheetData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [usingMock,setUsingMock]=useState(false);
  const [activeTab,setActiveTab]=useState("overview");
  const [modal,setModal]=useState(null);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const [lastRefresh,setLastRefresh]=useState(null);
  const [pendingSyncs,setPendingSyncs]=useState([]);

  // Inventory filters & sort
  const [invSearch,setInvSearch]=useState("");
  const [invBrand,setInvBrand]=useState("All");
  const [invStatus,setInvStatus]=useState("All");
  const [invType,setInvType]=useState("All");
  const [invSort,setInvSort]=useState({col:"Date_received",dir:"desc"});
  const [chartSort,setChartSort]=useState("priority"); // priority | brand | pctUsed

  // Consumption filters
  const [conRange,setConRange]=useState("30"); // days, or "all"
  const [vizType,setVizType]=useState("All"); // type filter for charts/stats
  const [conSort,setConSort]=useState({col:"Date",dir:"desc"});
  const [conBrand,setConBrand]=useState("All");
  const [conType,setConType]=useState("All");
  const [conSelf,setConSelf]=useState("All"); // All / Self / Shared

  // Posts sort
  const [postSort,setPostSort]=useState({col:"post_date",dir:"desc"});

  const {signedIn,signIn,signOut,readSheet,appendRow,updateRow,deleteRow}=useGoogleSheets();
  const isConfigured=!CONFIG.clientId.startsWith("YOUR_");

  function showToast(msg,type="success"){setToast({msg,type});setTimeout(()=>setToast(null),3500);}

  const loadData=useCallback(async()=>{
    setLoading(true);
    try {
      let raw_data,daily,posts;
      if(isConfigured&&signedIn){
        [raw_data,daily,posts]=await Promise.all([readSheet(CONFIG.sheets.raw_data),readSheet(CONFIG.sheets.daily),readSheet(CONFIG.sheets.posts)]);
        raw_data.forEach((r,i)=>{r.__rowIndex=i+2;});
        daily.forEach((r,i)=>{r.__rowIndex=i+2;});
        posts.forEach((r,i)=>{r.__rowIndex=i+2;});
        setUsingMock(false);
      } else {
        ({raw_data,daily,posts}=getMockData()); setUsingMock(true);
      }
      setSheetData({raw_data,daily,posts});
      setLastRefresh(new Date());
      const updates=computeStatusUpdates(raw_data,daily);
      if(updates.length)setPendingSyncs(updates);
    } catch(e){console.error(e);const m=getMockData();setSheetData(m);setUsingMock(true);}
    setLoading(false);
  },[isConfigured,signedIn,readSheet]);

  useEffect(()=>{loadData();},[loadData]);

  // Sort helper
  function sortRows(rows, col, dir) {
    return [...rows].sort((a,b)=>{
      let av=a[col]??"", bv=b[col]??"";
      const ad=parseDate(av), bd=parseDate(bv);
      if(ad&&bd) return dir==="asc"?ad-bd:bd-ad;
      const an=parseFloat(av), bn=parseFloat(bv);
      if(!isNaN(an)&&!isNaN(bn)) return dir==="asc"?an-bn:bn-an;
      return dir==="asc"?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av));
    });
  }
  function toggleSort(current,col,set){
    set(cur=>({col,dir:cur.col===col&&cur.dir==="asc"?"desc":"asc"}));
  }

  async function handleApplySync(selected){
    setSaving(true);
    try {
      const updatedRaw=[...sheetData.raw_data];
      for(const u of selected){
        const idx=updatedRaw.findIndex(r=>r.Tin_ID===u.tin.Tin_ID);
        if(idx===-1)continue;
        const updated={...updatedRaw[idx],Status:u.newStatus};
        if(!usingMock&&updated.__rowIndex)await updateRow(CONFIG.sheets.raw_data,updated.__rowIndex,updated);
        updatedRaw[idx]=updated;
      }
      setSheetData(d=>({...d,raw_data:updatedRaw}));
      setPendingSyncs([]);
      showToast(`${selected.length} status${selected.length>1?"es":""} updated ✓`);
    } catch(e){showToast("Error updating statuses","error");}
    setSaving(false);
  }

  async function handleLogSave(form){
    setSaving(true);
    try {
      if(!usingMock)await appendRow(CONFIG.sheets.daily,form);
      let updatedRaw=sheetData.raw_data;
      if(form.Tin_ID){
        const inLog=sheetData.daily.some(d=>d.Tin_ID===form.Tin_ID);
        if(!inLog){
          const idx=updatedRaw.findIndex(r=>r.Tin_ID===form.Tin_ID);
          if(idx!==-1&&updatedRaw[idx].Status==="Unopened"){
            const u={...updatedRaw[idx],Status:"Opened"};
            if(!usingMock&&u.__rowIndex)await updateRow(CONFIG.sheets.raw_data,u.__rowIndex,u);
            updatedRaw=updatedRaw.map((r,i)=>i===idx?u:r);
          }
        }
        if(form["Finished_tin_today"]==="y"){
          const idx=updatedRaw.findIndex(r=>r.Tin_ID===form.Tin_ID);
          if(idx!==-1&&updatedRaw[idx].Status!=="Finished"){
            const u={...updatedRaw[idx],Status:"Finished"};
            if(!usingMock&&u.__rowIndex)await updateRow(CONFIG.sheets.raw_data,u.__rowIndex,u);
            updatedRaw=updatedRaw.map((r,i)=>i===idx?u:r);
          }
        }
      }
      setSheetData(d=>({...d,daily:[...d.daily,{...form,__rowIndex:d.daily.length+2}],raw_data:updatedRaw}));
      setModal(null);showToast("Entry logged ✓");
    } catch(e){showToast("Error saving","error");console.error(e);}
    setSaving(false);
  }

  async function handleAddTinSave(form){
    setSaving(true);
    try {
      if(!usingMock)await appendRow(CONFIG.sheets.raw_data,form);
      setSheetData(d=>({...d,raw_data:[...d.raw_data,{...form,__rowIndex:d.raw_data.length+2}]}));
      setModal(null);showToast("Item added ✓");
    } catch(e){showToast("Error saving","error");}
    setSaving(false);
  }

  async function handleEditSave(form){
    setSaving(true);
    try {
      const {sheetKey,sheetName}=modal;
      if(!usingMock&&form.__rowIndex)await updateRow(sheetName,form.__rowIndex,form);
      setSheetData(d=>({...d,[sheetKey]:d[sheetKey].map(r=>r.__rowIndex===form.__rowIndex?form:r)}));
      setModal(null);showToast("Saved ✓");
    } catch(e){showToast("Error saving","error");}
    setSaving(false);
  }

  async function handleDeleteRow(form){
    setSaving(true);
    try {
      const {sheetKey,sheetName}=modal;
      if(!usingMock&&form.__rowIndex)await deleteRow(sheetName,form.__rowIndex);
      setSheetData(d=>({...d,[sheetKey]:d[sheetKey].filter(r=>r.__rowIndex!==form.__rowIndex)}));
      setModal(null);showToast("Row deleted");
    } catch(e){showToast("Error deleting","error");}
    setSaving(false);
  }

  const {raw_data=[], daily=[], posts=[]}=sheetData||{};
  const today_d=todayDate();

  // Filter daily to only past/today entries (no future)
  const pastDaily=daily.filter(d=>{const dt=parseDate(d.Date);return dt&&dt<=today_d;});
  const selfDaily=pastDaily.filter(isSelfConsumption);
  const vizSelfDaily=vizType==="All"?selfDaily:selfDaily.filter(d=>d.Type===vizType);
  const consumableTins=raw_data.filter(isConsumable);
  const pendingItems=raw_data.filter(r=>r.Status==="Pending"&&!r.Date_received?.trim());

  // ── Stats
  const totalTins=raw_data.length;
  const gifted=raw_data.filter(r=>r.How_I_obtained?.toLowerCase().includes("gift")||r.How_I_obtained?.toLowerCase().includes("pr")).length;
  const purchased=totalTins-gifted;
  const totalSpend=raw_data.filter(r=>r.How_I_obtained?.toLowerCase().includes("purchas")).reduce((s,r)=>s+parsePrice(r.Retail_Price),0);
  const avgPricePerG=(()=>{const v=consumableTins.map(r=>parseFloat((r["Price/g"]||"").replace("$",""))).filter(n=>n>0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):"—";})();
  const totalGrams=vizSelfDaily.reduce((s,d)=>s+parseGrams(d.Grams_Used),0);
  const sharedGrams=(vizType==="All"?pastDaily.filter(d=>!isSelfConsumption(d)):pastDaily.filter(d=>!isSelfConsumption(d)&&d.Type===vizType)).reduce((s,d)=>s+parseGrams(d.Grams_Used),0);
  const uniqueDays=[...new Set(vizSelfDaily.map(d=>d.Date))].length;
  const avgDailyG=uniqueDays>0?(totalGrams/uniqueDays).toFixed(1):0;

  // Stock counts (consumable only)
  const stockCounts=["Opened","Unopened","Finished","Pending","Gave Away"].reduce((acc,s)=>{
    const n=consumableTins.filter(r=>r.Status===s).length;
    if(n>0)acc[s]=n; return acc;
  },{});

  // Weekly (self, past only)
  const weekMap={};
  vizSelfDaily.forEach(d=>{const w=weekLabel(d.Date);if(w)weekMap[w]=(weekMap[w]||0)+parseGrams(d.Grams_Used);});
  const weeklyData=Object.entries(weekMap).sort((a,b)=>parseInt(a[0].slice(1))-parseInt(b[0].slice(1))).map(([week,grams])=>({week,grams:+grams.toFixed(1)}));

  // Daily trend with time range filter — never show before 2026
  const YEAR_START=new Date("2026-01-01");
  const rangeMs=conRange==="all"?Infinity:parseInt(conRange)*86400000;
  const cutoff=conRange==="all"?YEAR_START:new Date(Math.max(today_d-rangeMs,YEAR_START.getTime()));
  const dayMap={};
  vizSelfDaily.filter(d=>{const dt=parseDate(d.Date);return dt&&dt>=cutoff;}).forEach(d=>{
    if(!d.Date)return; const k=fmtDate(d.Date,true); dayMap[k]=(dayMap[k]||0)+parseGrams(d.Grams_Used);
  });
  const dailyTrend=Object.entries(dayMap).map(([date,grams])=>({date,grams:+grams.toFixed(1)}));

  // Brand consumption (self)
  const brandGrams={};
  vizSelfDaily.forEach(d=>{if(!d.Brand)return;brandGrams[d.Brand]=(brandGrams[d.Brand]||0)+parseGrams(d.Grams_Used);});
  const brandConsumption=Object.entries(brandGrams).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([brand,grams])=>({brand:brand.length>16?brand.slice(0,14)+"…":brand,grams}));

  const obtainMap={};
  raw_data.forEach(r=>{const k=r.How_I_obtained||"Unknown";obtainMap[k]=(obtainMap[k]||0)+1;});
  const obtainPie=Object.entries(obtainMap).map(([name,value])=>({name,value}));

  // Inventory with sort + filter
  const allBrands=[...new Set(raw_data.map(r=>r.Brand).filter(Boolean))].sort();
  const allStatuses=[...new Set(consumableTins.map(r=>r.Status).filter(Boolean))].sort();
  const allTypes=[...new Set(raw_data.map(r=>r.Product_Type).filter(Boolean))].sort();

  const filteredRaw=useMemo(()=>{
    let rows=raw_data.filter(r=>{
      // When filtering by a status, only show consumable items (non-consumables have no status)
      if(invStatus!=="All"&&!isConsumable(r))return false;
      return (invBrand==="All"||r.Brand===invBrand)&&
        (invStatus==="All"||r.Status===invStatus)&&
        (invType==="All"||r.Product_Type===invType)&&
        (!invSearch||Object.values(r).some(v=>v?.toLowerCase?.().includes(invSearch.toLowerCase())));
    });
    // Special sort: priority
    if(invSort.col==="priority"){
      rows=[...rows].sort((a,b)=>tinPriority(a)-tinPriority(b));
      if(invSort.dir==="desc")rows.reverse();
    } else {
      rows=sortRows(rows,invSort.col,invSort.dir);
    }
    return rows;
  },[raw_data,invBrand,invStatus,invType,invSearch,invSort]);

  // Consumption log sorted
  const displayDaily=useMemo(()=>pastDaily.filter(d=>{const dt=parseDate(d.Date);if(!dt||dt<YEAR_START)return false;
    if(conBrand!=="All"&&d.Brand!==conBrand)return false;
    if(conType!=="All"&&d.Type!==conType)return false;
    if(conSelf==="Self"&&!isSelfConsumption(d))return false;
    if(conSelf==="Shared"&&isSelfConsumption(d))return false;
    return true;
  }),[pastDaily,conBrand,conType,conSelf]);
  const sortedDaily=useMemo(()=>sortRows(displayDaily,conSort.col,conSort.dir),[displayDaily,conSort]);

  // Posts
  const totalViews=posts.reduce((s,p)=>s+(parseInt(p.views)||0),0);
  const postTimeline=posts.slice(-20).map(p=>({date:fmtDate(p.post_date),views:parseInt(p.views)||0,saves:parseInt(p.saves)||0}));
  const postTypeMap={};
  posts.forEach(p=>{const t=p.content_type||"unknown";if(!postTypeMap[t])postTypeMap[t]={type:t,views:0,likes:0,saves:0,count:0};postTypeMap[t].views+=parseInt(p.views)||0;postTypeMap[t].likes+=parseInt(p.likes)||0;postTypeMap[t].saves+=parseInt(p.saves)||0;postTypeMap[t].count++;});
  const postTypeData=Object.values(postTypeMap).map(p=>({...p,avg_views:Math.round(p.views/p.count),engagement:p.count?+((p.likes+p.saves)/Math.max(p.views,1)*100).toFixed(2):0}));
  const sortedPosts=useMemo(()=>sortRows(posts,postSort.col,postSort.dir),[posts,postSort]);

  // ── Tin grams chart data (opened + unopened, with Tin_Weight_g, consumable only)
  const tinGramsData = useMemo(() => {
    const eligible = raw_data.filter(r =>
      isConsumable(r) &&
      (r.Status === "Opened" || r.Status === "Unopened") &&
      parseFloat(r.Tin_Weight_g) > 0
    );
    return eligible.map(r => {
      const total = parseFloat(r.Tin_Weight_g);
      // Count ALL daily entries for this tin (including for_someone_else — it came from the tin)
      const used = daily
        .filter(d => d.Tin_ID === r.Tin_ID)
        .reduce((s, d) => s + parseGrams(d.Grams_Used), 0);
      const remaining = Math.max(0, total - used);
      const usedCapped = Math.min(used, total); // cap at total in case of data issues
      return { tin: r, brand: r.Brand, name: r.Product_Name, total, used: usedCapped, remaining, pctUsed: Math.round(usedCapped / total * 100) };
    }).sort((a, b) => {
      if (chartSort === "brand") return a.brand.localeCompare(b.brand);
      if (chartSort === "pctUsed") return b.pctUsed - a.pctUsed;
      return tinPriority(a.tin) - tinPriority(b.tin); // priority = consume-by date
    });
  }, [raw_data, daily, chartSort]);

  // ── Styles
  const tabStyle=t=>({padding:"8px 18px",border:"none",background:activeTab===t?C.ink:"transparent",color:activeTab===t?C.cream:C.stone,cursor:"pointer",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",borderRadius:1,transition:"all 0.15s"});
  const card={background:C.parchment,padding:"22px 26px",borderRadius:2};

  const thProps=(col,sort,setSort)=>({col,sortCol:sort.col,sortDir:sort.dir,onSort:()=>toggleSort(sort,col,setSort)});

  if(loading) return <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
    <div style={{fontSize:32,fontFamily:"'Playfair Display',Georgia,serif",color:C.ink}}>抹茶</div>
    <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:C.stone}}>Loading…</div>
  </div>;

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.parchment}}::-webkit-scrollbar-thumb{background:${C.warm}}
      .hrow:hover{background:${C.parchment}!important;cursor:pointer;}
    `}</style>

    {toast&&<div style={{position:"fixed",top:20,right:24,zIndex:2000,background:toast.type==="error"?C.red:C.moss,color:C.cream,padding:"12px 20px",fontSize:12,borderRadius:2,letterSpacing:"0.06em"}}>{toast.msg}</div>}

    {pendingSyncs.length>0&&<StatusSyncModal updates={pendingSyncs} onApply={handleApplySync} onClose={()=>setPendingSyncs([])} saving={saving}/>}
    {modal==="log"&&<LogEntryModal tins={raw_data} onSave={handleLogSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal==="addTin"&&<AddTinModal onSave={handleAddTinSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal?.type==="edit"&&<EditRowModal row={modal.row} onSave={handleEditSave} onDelete={handleDeleteRow} onClose={()=>setModal(null)} saving={saving}/>}

    <div style={{minHeight:"100vh",background:C.cream,color:C.ink}}>
      <header style={{borderBottom:`1px solid ${C.ink}`}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18,paddingBottom:14,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"baseline",gap:16}}>
            <span style={{fontSize:24,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,letterSpacing:"-0.02em"}}>抹茶 Analytics</span>
            <span style={{fontSize:11,color:C.stone,letterSpacing:"0.1em",textTransform:"uppercase"}}>Personal Dashboard</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            {usingMock&&<span style={{fontSize:10,color:C.gold,background:"#f9f3e3",padding:"4px 10px",border:`1px solid ${C.gold}`,letterSpacing:"0.08em"}}>{isConfigured?"Sign in to load your data":"Demo Mode"}</span>}
            {isConfigured&&!signedIn&&<button style={{...btnP,padding:"6px 14px"}} onClick={signIn}>Sign in with Google</button>}
            {isConfigured&&signedIn&&<button style={{...btnS,padding:"6px 14px"}} onClick={signOut}>Sign out</button>}
            {lastRefresh&&<span style={{fontSize:10,color:C.stone}}>↺ {lastRefresh.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>}
            <button onClick={loadData} style={{...sel,background:C.ink,color:C.cream,border:"none",padding:"6px 14px"}}>↻ Refresh</button>
            <button onClick={()=>setModal("log")} style={{...btnP,padding:"7px 16px",background:C.moss}}>+ Log Entry</button>
            <button onClick={()=>setModal("addTin")} style={{...btnP,padding:"7px 16px"}}>+ Add Item</button>
          </div>
        </div>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 40px"}}><nav style={{display:"flex",gap:4}}>
          {[{id:"overview",label:"Overview"},{id:"consumption",label:"Consumption"},{id:"inventory",label:"Inventory"},{id:"pr",label:"PR & Cost"},{id:"social",label:"Social"}]
            .map(t=><button key={t.id} style={tabStyle(t.id)} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}
        </nav></div>
      </header>

      <main style={{padding:"32px 40px",maxWidth:1400,margin:"0 auto",width:"100%"}}>

        {/* ── OVERVIEW ───────────────────────────────────────────────── */}
        {activeTab==="overview"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          {pendingItems.length>0&&<PendingPanel items={pendingItems} onEdit={r=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:CONFIG.sheets.raw_data})}/>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:20}}>
            <Stat label="Total Items" value={totalTins} sub={`${consumableTins.length} tea products`}/>
            <Stat label="Gifted/PR" value={gifted} sub={`${Math.round(gifted/totalTins*100)}%`} accent={C.moss}/>
            <Stat label="Purchased" value={purchased} sub={`$${totalSpend.toFixed(0)} total`}/>
            <Stat label="Avg $/g" value={`$${avgPricePerG}`} sub="tea only"/>
            <Stat label="My Grams" value={`${totalGrams.toFixed(0)}g`} sub={`+${sharedGrams.toFixed(0)}g shared`}/>
            <Stat label="My Daily Avg" value={`${avgDailyG}g`} sub="self-consumption"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
            <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <SectionTitle>Weekly Intake</SectionTitle>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {["All",...[...new Set(selfDaily.map(d=>d.Type).filter(Boolean))].sort()].map(t=><button key={t} onClick={()=>setVizType(t)} style={{padding:"3px 9px",fontSize:10,border:`1px solid ${vizType===t?C.moss:C.warm}`,background:vizType===t?C.moss:"transparent",color:vizType===t?C.cream:C.stone,cursor:"pointer",borderRadius:1,textTransform:"capitalize"}}>{t}</button>)}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs><linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.moss} stopOpacity={0.25}/><stop offset="95%" stopColor={C.moss} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid stroke={C.warm} strokeDasharray="3 3"/>
                  <XAxis dataKey="week" tick={{fontSize:10,fill:C.stone}}/><YAxis tick={{fontSize:10,fill:C.stone}}/>
                  <Tooltip content={<TT fmt={v=>`${v}g`}/>}/>
                  <Area type="monotone" dataKey="grams" stroke={C.moss} fill="url(#gG)" strokeWidth={2} dot={{r:3,fill:C.moss}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <SectionTitle>How Obtained</SectionTitle>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart><Pie data={obtainPie} cx="50%" cy="50%" innerRadius={44} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {obtainPie.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie><Tooltip content={<TT/>}/></PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexWrap:"wrap",gap:"4px 12px",marginTop:6}}>
                {obtainPie.map((item,i)=><span key={i} style={{fontSize:10,color:C.stone,display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],display:"inline-block"}}/>{item.name} ({item.value})
                </span>)}
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:24}}>
            <div style={card}>
              <SectionTitle>Stock (tea only)</SectionTitle>
              {Object.entries(stockCounts).map(([s,n])=>(
                <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.warm}`}}>
                  <span style={{fontSize:12,color:C.stone}}>{s}</span>
                  <span style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif"}}>{n}</span>
                </div>
              ))}
            </div>
            <div style={card}>
              <SectionTitle right="self-consumption">Top Brands by Grams</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={brandConsumption} layout="vertical" margin={{left:8}}>
                  <XAxis type="number" tick={{fontSize:9,fill:C.stone}}/>
                  <YAxis type="category" dataKey="brand" tick={{fontSize:10,fill:C.stone}} width={120}/>
                  <Tooltip content={<TT fmt={v=>`${v}g`}/>}/>
                  <Bar dataKey="grams" fill={C.sage} radius={[0,2,2,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>}

        {/* ── CONSUMPTION ────────────────────────────────────────────── */}
        {activeTab==="consumption"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:20}}>
            <Stat label="My Sessions" value={vizSelfDaily.length} sub={vizType==="All"?`${pastDaily.length-selfDaily.length} shared excluded`:`filtered to ${vizType}`}/>
            <Stat label="My Grams" value={`${totalGrams.toFixed(0)}g`} sub="self only"/>
            <Stat label="Shared" value={`${sharedGrams.toFixed(0)}g`} sub="made for others"/>
            <Stat label="My Daily Avg" value={`${avgDailyG}g`}/>
            <Stat label="Active Days" value={uniqueDays}/>
          </div>

          {/* Daily chart with range toggle */}
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <SectionTitle>Daily Grams</SectionTitle>
                {/* Type toggle */}
                <div style={{display:"flex",gap:4,marginLeft:8}}>
                  {["All",...[...new Set(pastDaily.map(d=>d.Type).filter(Boolean))].sort()].map(t=>(
                    <button key={t} onClick={()=>setVizType(t)} style={{padding:"3px 10px",fontSize:10,border:`1px solid ${vizType===t?C.moss:C.warm}`,background:vizType===t?C.moss:"transparent",color:vizType===t?C.cream:C.stone,cursor:"pointer",borderRadius:1,letterSpacing:"0.04em",textTransform:"capitalize"}}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {[["7","7d"],["14","14d"],["30","30d"],["90","90d"],["all","All"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setConRange(v)} style={{padding:"4px 10px",fontSize:10,border:`1px solid ${conRange===v?C.ink:C.warm}`,background:conRange===v?C.ink:"transparent",color:conRange===v?C.cream:C.stone,cursor:"pointer",borderRadius:1,letterSpacing:"0.06em"}}>{l}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyTrend}>
                <defs><linearGradient id="dG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={0.2}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke={C.warm} strokeDasharray="4 4"/>
                <XAxis dataKey="date" tick={{fontSize:9,fill:C.stone}} interval={Math.max(Math.floor(dailyTrend.length/8),0)}/>
                <YAxis tick={{fontSize:9,fill:C.stone}}/>
                <Tooltip content={<TT fmt={v=>`${v}g`}/>}/>
                <Area type="monotone" dataKey="grams" stroke={C.accent} fill="url(#dG)" strokeWidth={1.5} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={card}>
              <SectionTitle>Prep Method (self only)</SectionTitle>
              {[["Latte","Latte"],["Usucha","Usucha"],["Combo","Combo"],["other","Other/Unknown"]].map(([f,l])=>{
                const count=f==="other"?vizSelfDaily.filter(d=>!d.Latte&&!d.Usucha&&!d.Combo).length:vizSelfDaily.filter(d=>d[f]==="y").length;
                return <div key={f} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.warm}`,alignItems:"center"}}>
                  <span style={{fontSize:12}}>{l}</span>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:80,height:4,background:C.warm,borderRadius:2}}>
                      <div style={{width:`${Math.round(count/Math.max(vizSelfDaily.length,1)*100)}%`,height:4,background:C.moss,borderRadius:2}}/>
                    </div>
                    <span style={{fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",width:28,textAlign:"right"}}>{count}</span>
                  </div>
                </div>;
              })}
            </div>
            <div style={card}>
              <SectionTitle>Brand Intake (self)</SectionTitle>
              <div style={{overflowY:"auto",maxHeight:220}}>
                {brandConsumption.map((b,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.warm}`,alignItems:"center"}}>
                  <span style={{fontSize:11,color:C.stone}}>{b.brand}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:60,height:3,background:C.warm,borderRadius:2}}>
                      <div style={{width:`${Math.round(b.grams/brandConsumption[0].grams*100)}%`,height:3,background:C.sage,borderRadius:2}}/>
                    </div>
                    <span style={{fontSize:11,fontWeight:700}}>{b.grams}g</span>
                  </div>
                </div>)}
              </div>
            </div>
          </div>

          {/* Full log */}
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <SectionTitle right={`${displayDaily.length} shown · ${pastDaily.length} total`}>Consumption Log</SectionTitle>
              <button style={{...btnS,padding:"5px 12px",fontSize:10}} onClick={()=>exportCSV(displayDaily,"consumption-log.csv")}>↓ Export CSV</button>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${C.warm}`}}>
              <select value={conBrand} onChange={e=>setConBrand(e.target.value)} style={sel}><option value="All">All brands</option>{allBrands.map(b=><option key={b}>{b}</option>)}</select>
              <select value={conType} onChange={e=>setConType(e.target.value)} style={sel}>
                <option value="All">All types</option>
                {[...new Set(pastDaily.map(d=>d.Type).filter(Boolean))].sort().map(t=><option key={t}>{t}</option>)}
              </select>
              <select value={conSelf} onChange={e=>setConSelf(e.target.value)} style={sel}>
                <option value="All">Self + Shared</option>
                <option value="Self">Self only</option>
                <option value="Shared">Shared only</option>
              </select>
              {(conBrand!=="All"||conType!=="All"||conSelf!=="All")&&
                <button style={{...btnS,padding:"5px 10px",fontSize:10,color:C.red,borderColor:C.red}} onClick={()=>{setConBrand("All");setConType("All");setConSelf("All");}}>Clear</button>}
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:`1px solid ${C.warm}`,background:C.ink}}>
                  {[["Date","Date"],["Brand","Brand"],["Name","Name"],["Type","Type"],["Grams_Used","Grams"],["method","Prep"],["For_someone_else","For Self?"],["Notes","Notes"],["",""]].map(([col,label])=>(
                    col?<Th key={col} label={label} {...thProps(col,conSort,setConSort)}/>
                       :<th key="act" style={{padding:"10px 14px",color:C.mist,fontSize:9}}></th>
                  ))}
                </tr></thead>
                <tbody>
                  {sortedDaily.map((d,i)=>(
                    <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.parchment}`,background:i%2===0?C.cream:"transparent",opacity:isSelfConsumption(d)?1:0.55}}
                      onClick={()=>setModal({type:"edit",row:d,sheetKey:"daily",sheetName:CONFIG.sheets.daily})}>
                      <td style={{padding:"7px 10px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(d.Date,true)}</td>
                      <td style={{padding:"7px 10px"}}>{d.Brand}</td>
                      <td style={{padding:"7px 10px",color:C.stone}}>{d.Name}</td>
                      <td style={{padding:"7px 10px"}}>{d.Type}</td>
                      <td style={{padding:"7px 10px",fontWeight:700}}>{d.Grams_Used}g</td>
                      <td style={{padding:"7px 10px",color:C.stone}}>{d.Latte==="y"?"Latte":d.Usucha==="y"?"Usucha":d.Combo==="y"?"Combo":"—"}</td>
                      <td style={{padding:"7px 10px"}}>{isSelfConsumption(d)?<span style={{color:C.moss}}>✓</span>:<span style={{color:C.mist}}>Shared</span>}</td>
                      <td style={{padding:"7px 10px",color:C.stone,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.Notes||"—"}</td>
                      <td style={{padding:"7px 10px",color:C.mist,fontSize:10}}>edit →</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>}

        {/* ── INVENTORY ──────────────────────────────────────────────── */}
        {activeTab==="inventory"&&<div style={{display:"flex",flexDirection:"column",gap:24}}>
          {pendingItems.length>0&&<PendingPanel items={pendingItems} onEdit={r=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:CONFIG.sheets.raw_data})}/>}

          {/* ── Grams Remaining Chart */}
          {tinGramsData.length>0&&(()=>{
            const BAR_W=72;
            const chartW=Math.max(600,tinGramsData.length*BAR_W);
            const TwoLineTick=({x,y,payload,index})=>{
              const d=tinGramsData[index];
              if(!d)return null;
              // Wrap long strings across up to 2 lines at ~16 chars
              const wrap=(s,max)=>{
                if(s.length<=max)return[s];
                const idx=s.lastIndexOf(" ",max);
                return idx>0?[s.slice(0,idx),s.slice(idx+1)]:[s.slice(0,max),s.slice(max)];
              };
              const bLines=wrap(d.brand,16);
              const nLines=wrap(d.name,16);
              let dy=0;
              const lines=[
                ...bLines.map(l=>({text:l,fill:C.stone,size:9})),
                ...nLines.map(l=>({text:l,fill:C.mist,size:8})),
              ];
              return <g transform={`translate(${x},${y+6})`}>
                {lines.map((l,i)=><text key={i} textAnchor="middle" fill={l.fill} fontSize={l.size} dy={i*13}>{l.text}</text>)}
              </g>;
            };
            return <div style={{...card}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
                <SectionTitle>Grams Remaining by Tin</SectionTitle>
                <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                  {/* Sort pills */}
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <span style={{fontSize:9,color:C.stone,letterSpacing:"0.08em",textTransform:"uppercase"}}>Sort</span>
                    {[["priority","⚑ Priority"],["pctUsed","% Used"],["brand","Brand"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setChartSort(v)} style={{padding:"3px 9px",fontSize:10,border:`1px solid ${chartSort===v?C.ink:C.warm}`,background:chartSort===v?C.ink:"transparent",color:chartSort===v?C.cream:C.stone,cursor:"pointer",borderRadius:1}}>{l}</button>
                    ))}
                  </div>
                  {/* Legend */}
                  <div style={{display:"flex",gap:12,fontSize:10,color:C.stone}}>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:C.moss,display:"inline-block",borderRadius:1}}/> Remaining</span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:C.warm,display:"inline-block",borderRadius:1}}/> Used</span>
                    <span style={{display:"flex",alignItems:"center",gap:4,color:C.mist,fontStyle:"italic"}}>Dashed = Unopened</span>
                  </div>
                </div>
              </div>
              {/* Only this inner div scrolls */}
              <div style={{overflowX:"auto",overflowY:"hidden"}}>
                <div style={{width:chartW,height:300}}>
                  <BarChart width={chartW} height={300} data={tinGramsData}
                    margin={{top:4,right:16,left:0,bottom:70}} barCategoryGap="20%">
                    <CartesianGrid stroke={C.warm} strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="brand" tick={<TwoLineTick/>} interval={0} height={70}/>
                    <YAxis tick={{fontSize:9,fill:C.stone}} tickFormatter={v=>`${v}g`} width={36}/>
                    <Tooltip content={({active,payload})=>{
                      if(!active||!payload?.length)return null;
                      const d=payload[0]?.payload;
                      const exp=getExpiry(d?.tin);
                      const du=exp?Math.ceil((exp.date-todayDate())/86400000):null;
                      return <div style={{background:C.ink,color:C.cream,padding:"10px 14px",fontSize:11,borderRadius:2,lineHeight:1.8,minWidth:160}}>
                        <div style={{fontWeight:600,marginBottom:2}}>{d?.tin?.Brand}</div>
                        <div style={{opacity:0.7,fontSize:10,marginBottom:6}}>{d?.tin?.Product_Name}</div>
                        <div><span style={{color:C.mist}}>Total: </span>{d?.total}g</div>
                        <div><span style={{color:C.warm}}>Used: </span>{d?.used}g ({d?.pctUsed}%)</div>
                        <div><span style={{color:"#8fa882"}}>Remaining: </span>{d?.remaining}g</div>
                        <div style={{fontSize:10,opacity:0.6,marginTop:4,display:"flex",justifyContent:"space-between",gap:12}}>
                          <span>{d?.tin?.Status}</span>
                          {exp&&<span style={{color:du<30?C.red:du<120?C.amber:C.mist}}>{exp.estimated?"est. ":""}{fmtDate(exp.date,true)}{du<0?" ✕":du<120?` (${du}d)`:""}</span>}
                        </div>
                      </div>;
                    }}/>
                    <Bar dataKey="remaining" stackId="a" name="Remaining" fill={C.moss}
                      shape={(props)=>{
                        const {x,y,width,height,payload}=props;
                        const isUnopened=payload?.tin?.Status==="Unopened";
                        return <g>
                          <rect x={x} y={y} width={width} height={height} fill={C.moss} rx={2}
                            fillOpacity={isUnopened?0.4:1}/>
                          {isUnopened&&<rect x={x} y={y} width={width} height={height} fill="none"
                            stroke={C.moss} strokeWidth={1.5} strokeDasharray="3 2" rx={2}/>}
                        </g>;
                      }}/>
                    <Bar dataKey="used" stackId="a" name="Used" fill={C.warm}
                      shape={(props)=>{
                        const {x,y,width,height,payload}=props;
                        const isUnopened=payload?.tin?.Status==="Unopened";
                        return <rect x={x} y={y} width={width} height={height} fill={isUnopened?"#e8e0cc":C.warm} rx={0}/>;
                      }}/>
                  </BarChart>
                </div>
              </div>
            </div>;
          })()}

          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <input value={invSearch} onChange={e=>setInvSearch(e.target.value)} placeholder="Search…"
              style={{...sel,padding:"7px 12px",width:200,background:C.parchment,border:`1px solid ${C.warm}`}}/>
            <select value={invBrand} onChange={e=>setInvBrand(e.target.value)} style={sel}><option>All</option>{allBrands.map(b=><option key={b}>{b}</option>)}</select>
            <select value={invStatus} onChange={e=>setInvStatus(e.target.value)} style={sel}><option>All</option>{allStatuses.map(s=><option key={s}>{s}</option>)}</select>
            <select value={invType} onChange={e=>setInvType(e.target.value)} style={sel}><option>All</option>{allTypes.map(t=><option key={t}>{t}</option>)}</select>
            {/* Quick sort presets */}
            <select value={invSort.col==="priority"?"priority":""} onChange={e=>{if(e.target.value==="priority")setInvSort({col:"priority",dir:"asc"});else if(e.target.value==="expiry")setInvSort({col:"Expiration_Date",dir:"asc"});else if(e.target.value==="received")setInvSort({col:"Date_received",dir:"desc"});}} style={{...sel,borderColor:C.moss,color:C.moss}}>
              <option value="">Sort: Default</option>
              <option value="priority">⚑ Priority (consume soon)</option>
              <option value="expiry">Expiration date</option>
              <option value="received">Recently received</option>
            </select>
            <span style={{fontSize:10,color:C.stone}}>{filteredRaw.length} items</span>
            {(invBrand!=="All"||invStatus!=="All"||invType!=="All"||invSearch)&&
              <button style={{...btnS,padding:"5px 12px",fontSize:10,color:C.red,borderColor:C.red}} onClick={()=>{setInvBrand("All");setInvStatus("All");setInvType("All");setInvSearch("");}}>Clear</button>}
            <button style={{...btnS,padding:"5px 12px",fontSize:10,marginLeft:"auto"}} onClick={()=>exportCSV(filteredRaw,"inventory.csv")}>↓ Export CSV</button>
          </div>
          <div style={{...card,padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:C.ink}}>
                {[["Brand","Brand"],["Product_Name","Product"],["Product_Type","Type"],["Status","Status"],["Price/g","$/g"],["Tin_Weight_g","Weight"],["How_I_obtained","Obtained"],["Date_received","Received"],["Expiration_Date","Expires"],["",""]].map(([col,label])=>(
                  col?<Th key={col} label={label} {...thProps(col,invSort,setInvSort)}/>
                     :<th key="act" style={{padding:"10px 14px",color:C.mist,fontSize:9}}></th>
                ))}
              </tr></thead>
              <tbody>
                {filteredRaw.map((r,i)=>{
                  const sc=r.Status==="Finished"?C.mist:r.Status==="Opened"?C.moss:r.Status==="Unopened"?C.accent:r.Status==="Pending"?C.gold:C.stone;
                  const cons=isConsumable(r);
                  // expiry computed inline via getExpiry()
                  return <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}
                    onClick={()=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:CONFIG.sheets.raw_data})}>
                    <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                    <td style={{padding:"9px 14px",color:C.stone,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.Product_Name}</td>
                    <td style={{padding:"9px 14px"}}><span style={{fontSize:9,padding:"2px 6px",background:cons?C.parchment:"#f0f0e8",border:`1px solid ${C.warm}`,borderRadius:1}}>{r.Product_Type}</span></td>
                    <td style={{padding:"9px 14px"}}>{cons?<span style={{color:sc,fontWeight:600}}>{r.Status}</span>:<span style={{color:C.mist,fontSize:10}}>—</span>}</td>
                    <td style={{padding:"9px 14px"}}>{r["Price/g"]||"—"}</td>
                    <td style={{padding:"9px 14px"}}>{r.Tin_Weight_g?`${r.Tin_Weight_g}g`:"—"}</td>
                    <td style={{padding:"9px 14px",color:C.stone,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.How_I_obtained||"—"}</td>
                    <td style={{padding:"9px 14px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(r.Date_received,true)}</td>
                    {(()=>{
                      const exp=getExpiry(r);
                      const du2=exp?Math.ceil((exp.date-todayDate())/86400000):null;
                      const past2=du2!==null&&du2<0;
                      const urgent2=du2!==null&&du2>=0&&du2<120;
                      return <td style={{padding:"9px 14px",whiteSpace:"nowrap",color:past2?C.red:urgent2?C.amber:C.stone,fontWeight:urgent2||past2?700:400}}>
                        {exp?<>{fmtDate(exp.date,true)}{exp.estimated&&<span style={{fontSize:9,color:C.mist,marginLeft:4,fontStyle:"italic"}}>est.</span>}{past2?" ✕":urgent2?<span style={{fontSize:10,marginLeft:4}}>({du2}d)</span>:""}</>:"—"}
                      </td>;
                    })()}
                    <td style={{padding:"9px 14px",color:C.mist,fontSize:10}}>edit →</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>}

        {/* ── PR & COST ──────────────────────────────────────────────── */}
        {activeTab==="pr"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          {pendingItems.length>0&&<PendingPanel items={pendingItems} onEdit={r=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:CONFIG.sheets.raw_data})}/>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            <Stat label="PR/Gifted" value={gifted} sub={`${Math.round(gifted/totalTins*100)}%`} accent={C.moss}/>
            <Stat label="Purchased" value={purchased} sub={`$${totalSpend.toFixed(0)} total`}/>
            <Stat label="Obligations" value={raw_data.filter(r=>r["Obligation?"]?.trim()).length} sub="required posts"/>
            <Stat label="Affiliates" value={raw_data.filter(hasAffiliate).length} sub="active codes"/>
          </div>
          <div style={card}>
            <SectionTitle right="click to edit">PR Obligations Tracker</SectionTitle>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{borderBottom:`1px solid ${C.warm}`}}>
                {["Brand","Product","Type","Obligation","Affiliate","Due Date","Received","Status",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"6px 10px",color:C.stone,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:400}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {raw_data.filter(r=>r["Obligation?"]?.trim()||hasAffiliate(r)).map((r,i)=>{
                  const dueDate=r["Due_date-Post"]||r["Due_date-Post2"]||"";
                  const du=daysUntil(dueDate);
                  const overdue=du!==null&&du<0;
                  const soon=du!==null&&du>=0&&du<14;
                  return <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.parchment}`,background:i%2===0?C.cream:"transparent"}}
                    onClick={()=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:CONFIG.sheets.raw_data})}>
                    <td style={{padding:"8px 10px",fontWeight:600}}>{r.Brand}</td>
                    <td style={{padding:"8px 10px",color:C.stone}}>{r.Product_Name}</td>
                    <td style={{padding:"8px 10px",fontSize:10,color:C.stone}}>{r.Product_Type}</td>
                    <td style={{padding:"8px 10px"}}>{r["Obligation?"]||"—"}</td>
                    <td style={{padding:"8px 10px"}}>{hasAffiliate(r)?<span style={{color:C.moss,fontWeight:600}}>{r["Affiliate?"]}</span>:<span style={{color:C.mist}}>—</span>}</td>
                    <td style={{padding:"8px 10px",color:overdue?C.red:soon?C.amber:C.stone,fontWeight:overdue||soon?700:400,whiteSpace:"nowrap"}}>
                      {dueDate?`${fmtDate(dueDate,true)}${overdue?" ✕":soon?` (${du}d)`:""}` :"—"}
                    </td>
                    <td style={{padding:"8px 10px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(r.Date_received,true)}</td>
                    <td style={{padding:"8px 10px"}}><span style={{color:r.Status==="Finished"?C.mist:r.Status==="Opened"?C.moss:C.accent}}>{r.Status||"—"}</span></td>
                    <td style={{padding:"8px 10px",color:C.mist,fontSize:10}}>edit →</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>}

        {/* ── SOCIAL ─────────────────────────────────────────────────── */}
        {activeTab==="social"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            <Stat label="Posts" value={posts.length}/>
            <Stat label="Total Views" value={totalViews>=1000?`${(totalViews/1000).toFixed(0)}K`:totalViews} accent={C.moss}/>
            <Stat label="Total Likes" value={posts.reduce((s,p)=>s+(parseInt(p.likes)||0),0).toLocaleString()}/>
            <Stat label="Total Saves" value={posts.reduce((s,p)=>s+(parseInt(p.saves)||0),0).toLocaleString()}/>
          </div>
          <div style={card}>
            <SectionTitle right="recent posts">Views Over Time</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={postTimeline}>
                <defs><linearGradient id="vG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.moss} stopOpacity={0.2}/><stop offset="95%" stopColor={C.moss} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke={C.warm} strokeDasharray="4 4"/>
                <XAxis dataKey="date" tick={{fontSize:9,fill:C.stone}} interval={2}/>
                <YAxis tick={{fontSize:9,fill:C.stone}} tickFormatter={v=>v>=1000?`${v/1000}K`:v}/>
                <Tooltip content={<TT fmt={v=>v.toLocaleString()}/>}/>
                <Area type="monotone" dataKey="views" stroke={C.moss} fill="url(#vG)" strokeWidth={1.5} dot={false} name="Views"/>
                <Line type="monotone" dataKey="saves" stroke={C.gold} strokeWidth={1} dot={false} name="Saves"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={card}>
              <SectionTitle>Avg Views by Format</SectionTitle>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={postTypeData}>
                  <CartesianGrid stroke={C.warm} strokeDasharray="3 3"/>
                  <XAxis dataKey="type" tick={{fontSize:10,fill:C.stone}}/>
                  <YAxis tick={{fontSize:10,fill:C.stone}} tickFormatter={v=>v>=1000?`${v/1000}K`:v}/>
                  <Tooltip content={<TT fmt={v=>v.toLocaleString()}/>}/>
                  <Bar dataKey="avg_views" name="Avg Views" fill={C.sage} radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <SectionTitle>Engagement Rate</SectionTitle>
              {postTypeData.map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.warm}`,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,textTransform:"capitalize"}}>{p.type}</div>
                  <div style={{fontSize:10,color:C.stone,marginTop:2}}>{p.count} posts · avg {(p.avg_views/1000).toFixed(1)}K views</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:C.moss}}>{p.engagement}%</div>
                  <div style={{fontSize:9,color:C.stone,letterSpacing:"0.06em"}}>ENG RATE</div>
                </div>
              </div>)}
            </div>
          </div>
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <SectionTitle right={`${posts.length} posts`}>Post Log</SectionTitle>
              <button style={{...btnS,padding:"5px 12px",fontSize:10}} onClick={()=>exportCSV(posts,"posts.csv")}>↓ Export CSV</button>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:C.ink}}>
                {[["post_date","Date"],["content_type","Type"],["post_category","Category"],["views","Views"],["likes","Likes"],["saves","Saves"],["shares","Shares"],["follows","Follows"],["",""]].map(([col,label])=>(
                  col?<Th key={col} label={label} {...thProps(col,postSort,setPostSort)}/>
                     :<th key="act" style={{padding:"10px 14px"}}></th>
                ))}
              </tr></thead>
              <tbody>
                {sortedPosts.map((p,i)=>(
                  <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.parchment}`,background:i%2===0?C.cream:"transparent"}}
                    onClick={()=>setModal({type:"edit",row:p,sheetKey:"posts",sheetName:CONFIG.sheets.posts})}>
                    <td style={{padding:"7px 10px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(p.post_date,true)}</td>
                    <td style={{padding:"7px 10px",textTransform:"capitalize"}}>{p.content_type}</td>
                    <td style={{padding:"7px 10px",color:C.stone,textTransform:"capitalize"}}>{p.post_category}</td>
                    <td style={{padding:"7px 10px",fontWeight:600}}>{parseInt(p.views)?.toLocaleString()||"—"}</td>
                    <td style={{padding:"7px 10px"}}>{parseInt(p.likes)?.toLocaleString()||"—"}</td>
                    <td style={{padding:"7px 10px"}}>{parseInt(p.saves)?.toLocaleString()||"—"}</td>
                    <td style={{padding:"7px 10px",color:C.stone}}>{parseInt(p.shares)?.toLocaleString()||"—"}</td>
                    <td style={{padding:"7px 10px",color:C.stone}}>{parseInt(p.follows)?.toLocaleString()||"—"}</td>
                    <td style={{padding:"7px 10px",color:C.mist,fontSize:10}}>edit →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </main>

      <footer style={{borderTop:`1px solid ${C.warm}`,marginTop:32}}><div style={{maxWidth:1400,margin:"0 auto",padding:"16px 40px",display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:10,color:C.mist,letterSpacing:"0.1em"}}>抹茶 ANALYTICS · PERSONAL DASHBOARD</span>
        <span style={{fontSize:10,color:C.mist}}>Google Sheets API · Live two-way sync</span>
      </div></footer>
    </div>
  </>;
}

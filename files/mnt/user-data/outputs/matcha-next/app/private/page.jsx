"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Line,
} from "recharts";
import {
  C, PIE_COLORS, PRODUCT_TYPES, CONSUMABLE_TYPES, isConsumable,
  isSelfConsumption, hasAffiliate, parseGrams, parsePrice, parseDate,
  fmtDate, todayDate, today, daysSince, daysUntil, weekLabel,
  getExpiry, tinPriority, generateTinId, sortRows,
  inp, sel, btnP, btnS, btnD, YEAR_START,
} from "../components/shared";

// ── API helpers (calls go to /api/private-data on the server) ─────────────────
async function apiGet() {
  const r = await fetch("/api/private-data");
  if (!r.ok) throw new Error("Unauthorized");
  return r.json();
}
async function apiAppend(sheetName, row) {
  await fetch("/api/private-data", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({sheetName,row}) });
}
async function apiUpdate(sheetName, rowIndex, row) {
  await fetch("/api/private-data", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({sheetName,rowIndex,row}) });
}
async function apiDelete(sheetName, rowIndex) {
  await fetch("/api/private-data", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({sheetName,rowIndex}) });
}

// ── Sheet names ───────────────────────────────────────────────────────────────
const SHEETS = { raw_data:"raw_data", daily:"Daily consumption", posts:"Posts" };

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Stat({label,value,sub,accent}) {
  return <div style={{borderTop:`1px solid ${C.warm}`,paddingTop:16,paddingBottom:8}}>
    <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.stone,marginBottom:6}}>{label}</div>
    <div style={{fontSize:28,fontWeight:700,color:accent||C.ink,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:10,color:C.stone,marginTop:4}}>{sub}</div>}
  </div>;
}
function SectionTitle({children,right}) {
  return <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",borderBottom:`1px solid ${C.ink}`,paddingBottom:8,marginBottom:18}}>
    <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,fontWeight:700,color:C.ink,margin:0}}>{children}</h2>
    {right&&<span style={{fontSize:10,color:C.stone,letterSpacing:"0.08em"}}>{right}</span>}
  </div>;
}
const TT=({active,payload,label,fmt})=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:C.ink,color:C.cream,padding:"10px 14px",fontSize:11,borderRadius:2,lineHeight:1.7}}>
    <div style={{opacity:0.6,marginBottom:4}}>{label}</div>
    {payload.map((p,i)=><div key={i}>{p.name}: <strong>{fmt?fmt(p.value):p.value}</strong></div>)}
  </div>;
};
function Modal({title,onClose,children,danger}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(26,26,24,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:C.cream,width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",borderRadius:2}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 28px 16px",borderBottom:`1px solid ${danger?C.red:C.warm}`}}>
        <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:700,color:danger?C.red:C.ink}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.stone}}>×</button>
      </div>
      <div style={{padding:"24px 28px"}}>{children}</div>
    </div>
  </div>;
}
function Field({label,children,required}) {
  return <div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,marginBottom:6}}>
      {label}{required&&<span style={{color:C.red}}> *</span>}
    </label>{children}
  </div>;
}
function Th({label,col,sortCol,sortDir,onSort}) {
  const active=sortCol===col;
  return <th onClick={()=>onSort(col)} style={{textAlign:"left",padding:"10px 14px",color:active?C.cream:C.mist,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:400,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:active?"rgba(255,255,255,0.08)":"transparent"}}>
    {label} {active?(sortDir==="asc"?"↑":"↓"):""}
  </th>;
}

// ── Modals ────────────────────────────────────────────────────────────────────
function LogEntryModal({tins,onSave,onClose,saving}) {
  const active=tins.filter(t=>isConsumable(t)&&(t.Status==="Opened"||t.Status==="Unopened"));
  const [form,setForm]=useState({Tin_ID:active[0]?.Tin_ID||"",Date:today(),Brand:active[0]?.Brand||"",Type:active[0]?.Product_Type||"Matcha",Name:active[0]?.Product_Name||"",Grams_Used:"2","For_someone_else":"",Latte:"",Usucha:"",Combo:"","New_tin_opened":"","Finished_tin_today":"",Notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const tog=k=>set(k,form[k]==="y"?"":"y");
  const onTin=id=>{const t=tins.find(t=>t.Tin_ID===id);if(t)setForm(f=>({...f,Tin_ID:id,Brand:t.Brand,Type:t.Product_Type,Name:t.Product_Name||""}));};
  const Tog=({field,label})=><button type="button" onClick={()=>tog(field)} style={{padding:"6px 14px",fontSize:11,border:`1px solid ${form[field]==="y"?C.moss:C.warm}`,background:form[field]==="y"?C.moss:"transparent",color:form[field]==="y"?C.cream:C.stone,cursor:"pointer",borderRadius:1,marginRight:8,marginBottom:8}}>{label}</button>;
  return <Modal title="Log Consumption Entry" onClose={onClose}>
    <Field label="Tin" required><select value={form.Tin_ID} onChange={e=>onTin(e.target.value)} style={{...inp}}>{active.map(t=><option key={t.Tin_ID} value={t.Tin_ID}>{t.Brand} — {t.Product_Name} ({t.Status})</option>)}<option value="">Other</option></select></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Date" required><input value={form.Date} onChange={e=>set("Date",e.target.value)} style={inp}/></Field>
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

function AddTinModal({onSave,onClose,saving}) {
  const [form,setForm]=useState({Tin_ID:"",Brand:"",Product_Name:"",Product_Type:"Matcha",Origin:"",Retail_Price:"","Price/g":"",Tin_Weight_g:"",How_I_obtained:"Purchased",Method_of_contact:"","Obligation?":"","Affiliate?":"",Date_received:today(),Status:"Unopened","_Ceremonial_advertised?_(Matcha)":"n","Organic?_(Matcha)":"n","First-harvest?_(Matcha)":"n",URL:"",Expiration_Date:""});
  const set=(k,v)=>{const u={...form,[k]:v};if((k==="Brand"||k==="Product_Name")&&u.Brand&&u.Product_Name)u.Tin_ID=generateTinId(u.Brand,u.Product_Name);setForm(u);};
  const cons=isConsumable(form);
  return <Modal title="Add New Item" onClose={onClose}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Brand" required><input style={inp} value={form.Brand} onChange={e=>set("Brand",e.target.value)}/></Field>
      <Field label="Product Name" required><input style={inp} value={form.Product_Name} onChange={e=>set("Product_Name",e.target.value)}/></Field>
    </div>
    <Field label="ID"><input style={{...inp,color:C.stone}} value={form.Tin_ID} onChange={e=>set("Tin_ID",e.target.value)}/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Type" required><select style={{...inp}} value={form.Product_Type} onChange={e=>set("Product_Type",e.target.value)}>{PRODUCT_TYPES.map(t=><option key={t}>{t}</option>)}</select></Field>
      {cons?<Field label="Origin"><input style={inp} value={form.Origin} onChange={e=>set("Origin",e.target.value)}/></Field>:<Field label="URL"><input style={inp} value={form.URL} onChange={e=>set("URL",e.target.value)}/></Field>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:cons?"1fr 1fr 1fr":"1fr 1fr",gap:12}}>
      <Field label="Price"><input style={inp} value={form.Retail_Price} onChange={e=>set("Retail_Price",e.target.value)}/></Field>
      {cons&&<Field label="Price/g"><input style={inp} value={form["Price/g"]} onChange={e=>set("Price/g",e.target.value)}/></Field>}
      {cons&&<Field label="Weight (g)"><input style={inp} value={form.Tin_Weight_g} onChange={e=>set("Tin_Weight_g",e.target.value)}/></Field>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="How Obtained"><select style={{...inp}} value={form.How_I_obtained} onChange={e=>set("How_I_obtained",e.target.value)}>{["Purchased","Gifted (brand)","Gifted (friend)","PR","Other"].map(o=><option key={o}>{o}</option>)}</select></Field>
      {cons&&<Field label="Status"><select style={{...inp}} value={form.Status} onChange={e=>set("Status",e.target.value)}>{["Unopened","Opened","Pending","Gave Away","Finished"].map(s=><option key={s}>{s}</option>)}</select></Field>}
    </div>
    {form.How_I_obtained!=="Purchased"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Obligation"><input style={inp} value={form["Obligation?"]} onChange={e=>set("Obligation?",e.target.value)}/></Field>
      <Field label="Affiliate"><input style={inp} value={form["Affiliate?"]} onChange={e=>set("Affiliate?",e.target.value)}/></Field>
    </div>}
    {cons&&<Field label="Expiration Date"><input style={inp} value={form.Expiration_Date} onChange={e=>set("Expiration_Date",e.target.value)}/></Field>}
    <Field label="Date Received"><input style={inp} value={form.Date_received} onChange={e=>set("Date_received",e.target.value)}/></Field>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Add Item"}</button>
    </div>
  </Modal>;
}

function EditRowModal({row,onSave,onDelete,onClose,saving}) {
  const [form,setForm]=useState({...row});
  const [confirm,setConfirm]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const keys=Object.keys(form).filter(k=>k!=="__rowIndex");
  if(confirm)return <Modal title="Delete this row?" onClose={()=>setConfirm(false)} danger>
    <p style={{color:C.stone,marginBottom:24,fontSize:13}}>Permanently deletes this row from your Google Sheet.</p>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={()=>setConfirm(false)}>Cancel</button>
      <button style={btnD} onClick={()=>onDelete(form)} disabled={saving}>{saving?"Deleting…":"Yes, Delete"}</button>
    </div>
  </Modal>;
  return <Modal title="Edit Entry" onClose={onClose}>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{keys.map(k=><Field key={k} label={k}><input style={inp} value={form[k]} onChange={e=>set(k,e.target.value)}/></Field>)}</div>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"space-between"}}>
      <button style={{...btnD,padding:"8px 16px"}} onClick={()=>setConfirm(true)}>Delete</button>
      <div style={{display:"flex",gap:10}}>
        <button style={btnS} onClick={onClose}>Cancel</button>
        <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Save"}</button>
      </div>
    </div>
  </Modal>;
}

function StatusSyncModal({updates,onApply,onClose,saving}) {
  const [items,setItems]=useState(updates.map(u=>({...u,selected:true})));
  const toggle=i=>setItems(prev=>prev.map((it,j)=>j===i?{...it,selected:!it.selected}:it));
  const selected=items.filter(i=>i.selected);
  return <Modal title={`${updates.length} Status Update${updates.length>1?"s":""} Detected`} onClose={onClose}>
    <p style={{color:C.stone,fontSize:12,marginBottom:16}}>Uncheck any you don't want to apply.</p>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24,maxHeight:320,overflowY:"auto"}}>
      {items.map((u,i)=><div key={i} onClick={()=>toggle(i)} style={{padding:"10px 14px",background:u.selected?C.parchment:C.cream,borderLeft:`3px solid ${u.selected?C.moss:C.warm}`,fontSize:11,cursor:"pointer",opacity:u.selected?1:0.5,display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:16,color:u.selected?C.moss:C.mist}}>{u.selected?"☑":"☐"}</span>
        <div>
          <div style={{fontWeight:600}}>{u.tin.Brand} — {u.tin.Product_Name}</div>
          <div style={{color:C.stone,marginTop:3}}><span style={{color:C.red}}>{u.tin.Status||"—"}</span>{" → "}<span style={{color:C.moss,fontWeight:600}}>{u.newStatus}</span><span style={{opacity:0.6,marginLeft:8}}>({u.reason})</span></div>
        </div>
      </div>)}
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

function PendingPanel({items,onEdit}) {
  const [collapsed,setCollapsed]=useState(false);
  const consumableItems=items.filter(r=>!r.Date_received?.trim());
  if(!consumableItems.length)return null;
  return <div style={{background:"#fdf8ee",border:`1px solid ${C.gold}`,borderRadius:2,marginBottom:24}}>
    <div onClick={()=>setCollapsed(c=>!c)} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 22px",cursor:"pointer",userSelect:"none"}}>
      <span style={{fontSize:14,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,color:C.ink}}>Pending Items</span>
      <span style={{fontSize:10,background:C.gold,color:C.cream,padding:"2px 8px",borderRadius:1}}>{consumableItems.length}</span>
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
          </div>
        </div>;
      })}
    </div>}
  </div>;
}

function exportCSV(data,filename) {
  if(!data.length)return;
  const headers=Object.keys(data[0]).filter(k=>k!=="__rowIndex");
  const csv=[headers,...data.map(r=>headers.map(h=>r[h]??""))].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=filename;a.click();
}

function computeStatusUpdates(raw_data,daily) {
  const updates=[];
  const tinIdsInLog=new Set(daily.map(d=>d.Tin_ID).filter(Boolean));
  const finishedTinIds=new Set(daily.filter(d=>d["Finished_tin_today"]?.toLowerCase()==="y").map(d=>d.Tin_ID).filter(Boolean));
  for(const tin of raw_data){
    if(!isConsumable(tin))continue;
    if(tin.Status==="Gave Away"||tin.Status==="Gifted away")continue;
    const id=tin.Tin_ID,cur=tin.Status;
    let next=cur;
    if(tin.Date_received&&!tinIdsInLog.has(id)&&cur!=="Finished")next="Unopened";
    if(tinIdsInLog.has(id)&&(cur==="Unopened"||cur==="Pending"||!cur))next="Opened";
    if(finishedTinIds.has(id)&&cur!=="Finished")next="Finished";
    if(next!==cur&&next)updates.push({tin,newStatus:next,selected:true,reason:next==="Finished"?"Finished_tin_today marked":next==="Opened"?"Appears in consumption log":"Has Date_received, not in log"});
  }
  return updates;
}

// ── Sign-in gate ──────────────────────────────────────────────────────────────
function SignInGate() {
  return <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:24}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}`}</style>
    <div style={{fontSize:32,fontFamily:"'Playfair Display',Georgia,serif",color:C.ink}}>抹茶 Analytics</div>
    <div style={{fontSize:11,color:C.stone,letterSpacing:"0.15em",textTransform:"uppercase"}}>Private Dashboard</div>
    <button onClick={()=>signIn("google")} style={{...btnP,marginTop:8,padding:"12px 28px",fontSize:12,letterSpacing:"0.12em"}}>Sign in with Google</button>
    <a href="/" style={{fontSize:10,color:C.mist,textDecoration:"none",marginTop:8}}>← Public view</a>
  </div>;
}

function NotOwner({email}) {
  return <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}`}</style>
    <div style={{fontSize:14,color:C.red}}>Access denied</div>
    <div style={{fontSize:11,color:C.stone}}>{email} is not the owner account.</div>
    <button onClick={()=>signOut()} style={{...btnS,marginTop:8,padding:"8px 18px",fontSize:11}}>Sign out</button>
  </div>;
}

// ── Main private dashboard ────────────────────────────────────────────────────
function PrivateDashboard() {
  const [sheetData,setSheetData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [activeTab,setActiveTab]=useState("overview");
  const [modal,setModal]=useState(null);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const [lastRefresh,setLastRefresh]=useState(null);
  const [pendingSyncs,setPendingSyncs]=useState([]);
  const [invSearch,setInvSearch]=useState("");
  const [invBrand,setInvBrand]=useState("All");
  const [invStatus,setInvStatus]=useState("All");
  const [invType,setInvType]=useState("All");
  const [invSort,setInvSort]=useState({col:"Date_received",dir:"desc"});
  const [chartSort,setChartSort]=useState("priority");
  const [conRange,setConRange]=useState("30");
  const [conSort,setConSort]=useState({col:"Date",dir:"desc"});
  const [conBrand,setConBrand]=useState("All");
  const [conType,setConType]=useState("All");
  const [conSelf,setConSelf]=useState("All");
  const [postSort,setPostSort]=useState({col:"post_date",dir:"desc"});
  const [vizType,setVizType]=useState("All");

  function showToast(msg,type="success"){setToast({msg,type});setTimeout(()=>setToast(null),3500);}

  const loadData=useCallback(async()=>{
    setLoading(true);
    try {
      const data=await apiGet();
      data.raw_data.forEach((r,i)=>{r.__rowIndex=i+2;});
      data.daily.forEach((r,i)=>{r.__rowIndex=i+2;});
      data.posts.forEach((r,i)=>{r.__rowIndex=i+2;});
      setSheetData(data);
      setLastRefresh(new Date());
      const updates=computeStatusUpdates(data.raw_data,data.daily);
      if(updates.length)setPendingSyncs(updates);
    } catch(e){showToast("Error loading data","error");}
    setLoading(false);
  },[]);

  useEffect(()=>{loadData();},[loadData]);

  const {raw_data=[],daily=[],posts=[]}=sheetData||{};
  const today_d=todayDate();
  const pastDaily=daily.filter(d=>{const dt=parseDate(d.Date);return dt&&dt<=today_d;});
  const selfDaily=pastDaily.filter(isSelfConsumption);
  const vizDaily=vizType==="All"?selfDaily:selfDaily.filter(d=>d.Type===vizType);
  const consumableTins=raw_data.filter(isConsumable);
  const pendingItems=raw_data.filter(r=>r.Status==="Pending"&&!r.Date_received?.trim());
  const chartTypes=[...new Set(selfDaily.map(d=>d.Type).filter(Boolean))].sort();

  const totalGrams=vizDaily.reduce((s,d)=>s+parseGrams(d.Grams_Used),0);
  const sharedGrams=pastDaily.filter(d=>!isSelfConsumption(d)&&(vizType==="All"||d.Type===vizType)).reduce((s,d)=>s+parseGrams(d.Grams_Used),0);
  const uniqueDays=[...new Set(vizDaily.map(d=>d.Date))].length;
  const avgDailyG=uniqueDays>0?(totalGrams/uniqueDays).toFixed(1):0;
  const totalTins=raw_data.length;
  const gifted=raw_data.filter(r=>r.How_I_obtained?.toLowerCase().includes("gift")||r.How_I_obtained?.toLowerCase().includes("pr")).length;
  const purchased=totalTins-gifted;
  const totalSpend=raw_data.filter(r=>r.How_I_obtained?.toLowerCase().includes("purchas")).reduce((s,r)=>s+parsePrice(r.Retail_Price),0);
  const avgPricePerG=(()=>{const v=consumableTins.map(r=>parseFloat((r["Price/g"]||"").replace("$",""))).filter(n=>n>0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):"—";})();

  const stockCounts=["Opened","Unopened","Finished","Pending","Gave Away"].reduce((acc,s)=>{const n=consumableTins.filter(r=>r.Status===s).length;if(n>0)acc[s]=n;return acc;},{});
  const weekMap={};
  vizDaily.forEach(d=>{const w=weekLabel(d.Date);if(w)weekMap[w]=(weekMap[w]||0)+parseGrams(d.Grams_Used);});
  const weeklyData=Object.entries(weekMap).sort((a,b)=>parseInt(a[0].slice(1))-parseInt(b[0].slice(1))).map(([week,grams])=>({week,grams:+grams.toFixed(1)}));
  const rangeMs=conRange==="all"?Infinity:parseInt(conRange)*86400000;
  const cutoff=conRange==="all"?YEAR_START:new Date(Math.max(today_d-rangeMs,YEAR_START.getTime()));
  const dayMap={};
  vizDaily.filter(d=>{const dt=parseDate(d.Date);return dt&&dt>=cutoff;}).forEach(d=>{if(!d.Date)return;const k=fmtDate(d.Date,true);dayMap[k]=(dayMap[k]||0)+parseGrams(d.Grams_Used);});
  const dailyTrend=Object.entries(dayMap).map(([date,grams])=>({date,grams:+grams.toFixed(1)}));
  const brandGrams={};
  vizDaily.forEach(d=>{if(!d.Brand)return;brandGrams[d.Brand]=(brandGrams[d.Brand]||0)+parseGrams(d.Grams_Used);});
  const brandConsumption=Object.entries(brandGrams).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([brand,grams])=>({brand:brand.length>16?brand.slice(0,14)+"…":brand,grams}));
  const obtainMap={};
  raw_data.forEach(r=>{const k=r.How_I_obtained||"Unknown";obtainMap[k]=(obtainMap[k]||0)+1;});
  const obtainPie=Object.entries(obtainMap).map(([name,value])=>({name,value}));
  const allBrands=[...new Set(raw_data.map(r=>r.Brand).filter(Boolean))].sort();
  const allStatuses=[...new Set(consumableTins.map(r=>r.Status).filter(Boolean))].sort();
  const allTypes=[...new Set(raw_data.map(r=>r.Product_Type).filter(Boolean))].sort();

  const filteredRaw=useMemo(()=>{
    let rows=raw_data.filter(r=>{
      if(invStatus!=="All"&&!isConsumable(r))return false;
      return (invBrand==="All"||r.Brand===invBrand)&&(invStatus==="All"||r.Status===invStatus)&&(invType==="All"||r.Product_Type===invType)&&(!invSearch||Object.values(r).some(v=>v?.toLowerCase?.().includes(invSearch.toLowerCase())));
    });
    if(invSort.col==="priority"){rows=[...rows].sort((a,b)=>tinPriority(a)-tinPriority(b));}
    else{rows=sortRows(rows,invSort.col,invSort.dir);}
    return rows;
  },[raw_data,invBrand,invStatus,invType,invSearch,invSort]);

  const displayDaily=useMemo(()=>pastDaily.filter(d=>{
    const dt=parseDate(d.Date);if(!dt||dt<YEAR_START)return false;
    if(conBrand!=="All"&&d.Brand!==conBrand)return false;
    if(conType!=="All"&&d.Type!==conType)return false;
    if(conSelf==="Self"&&!isSelfConsumption(d))return false;
    if(conSelf==="Shared"&&isSelfConsumption(d))return false;
    return true;
  }),[pastDaily,conBrand,conType,conSelf]);
  const sortedDaily=useMemo(()=>sortRows(displayDaily,conSort.col,conSort.dir),[displayDaily,conSort]);

  const tinGramsData=useMemo(()=>{
    return raw_data.filter(r=>isConsumable(r)&&(r.Status==="Opened"||r.Status==="Unopened")&&parseFloat(r.Tin_Weight_g)>0)
      .map(r=>{
        const total=parseFloat(r.Tin_Weight_g);
        const used=daily.filter(d=>d.Tin_ID===r.Tin_ID).reduce((s,d)=>s+parseGrams(d.Grams_Used),0);
        const remaining=Math.max(0,total-used);
        const usedCapped=Math.min(used,total);
        return{tin:r,brand:r.Brand,name:r.Product_Name,total,used:usedCapped,remaining,pctUsed:Math.round(usedCapped/total*100)};
      }).sort((a,b)=>{
        if(chartSort==="brand")return a.brand.localeCompare(b.brand);
        if(chartSort==="pctUsed")return b.pctUsed-a.pctUsed;
        return tinPriority(a.tin)-tinPriority(b.tin);
      });
  },[raw_data,daily,chartSort]);

  const totalViews=posts.reduce((s,p)=>s+(parseInt(p.views)||0),0);
  const postTimeline=posts.slice(-20).map(p=>({date:fmtDate(p.post_date),views:parseInt(p.views)||0,saves:parseInt(p.saves)||0}));
  const postTypeMap={};
  posts.forEach(p=>{const t=p.content_type||"unknown";if(!postTypeMap[t])postTypeMap[t]={type:t,views:0,likes:0,saves:0,count:0};postTypeMap[t].views+=parseInt(p.views)||0;postTypeMap[t].likes+=parseInt(p.likes)||0;postTypeMap[t].saves+=parseInt(p.saves)||0;postTypeMap[t].count++;});
  const postTypeData=Object.values(postTypeMap).map(p=>({...p,avg_views:Math.round(p.views/p.count),engagement:p.count?+((p.likes+p.saves)/Math.max(p.views,1)*100).toFixed(2):0}));
  const sortedPosts=useMemo(()=>sortRows(posts,postSort.col,postSort.dir),[posts,postSort]);

  // ── Write handlers
  async function handleApplySync(selected){
    setSaving(true);
    try{
      const updatedRaw=[...raw_data];
      for(const u of selected){
        const idx=updatedRaw.findIndex(r=>r.Tin_ID===u.tin.Tin_ID);
        if(idx===-1)continue;
        const updated={...updatedRaw[idx],Status:u.newStatus};
        await apiUpdate(SHEETS.raw_data,updated.__rowIndex,updated);
        updatedRaw[idx]=updated;
      }
      setSheetData(d=>({...d,raw_data:updatedRaw}));
      setPendingSyncs([]);
      showToast(`${selected.length} status${selected.length>1?"es":""} updated ✓`);
    }catch(e){showToast("Error","error");}
    setSaving(false);
  }

  async function handleLogSave(form){
    setSaving(true);
    try{
      await apiAppend(SHEETS.daily,form);
      let updatedRaw=raw_data;
      if(form.Tin_ID){
        const inLog=daily.some(d=>d.Tin_ID===form.Tin_ID);
        if(!inLog){const idx=updatedRaw.findIndex(r=>r.Tin_ID===form.Tin_ID);if(idx!==-1&&updatedRaw[idx].Status==="Unopened"){const u={...updatedRaw[idx],Status:"Opened"};await apiUpdate(SHEETS.raw_data,u.__rowIndex,u);updatedRaw=updatedRaw.map((r,i)=>i===idx?u:r);}}
        if(form["Finished_tin_today"]==="y"){const idx=updatedRaw.findIndex(r=>r.Tin_ID===form.Tin_ID);if(idx!==-1&&updatedRaw[idx].Status!=="Finished"){const u={...updatedRaw[idx],Status:"Finished"};await apiUpdate(SHEETS.raw_data,u.__rowIndex,u);updatedRaw=updatedRaw.map((r,i)=>i===idx?u:r);}}
      }
      setSheetData(d=>({...d,daily:[...d.daily,{...form,__rowIndex:d.daily.length+2}],raw_data:updatedRaw}));
      setModal(null);showToast("Entry logged ✓");
    }catch(e){showToast("Error saving","error");}
    setSaving(false);
  }

  async function handleAddTinSave(form){
    setSaving(true);
    try{await apiAppend(SHEETS.raw_data,form);setSheetData(d=>({...d,raw_data:[...d.raw_data,{...form,__rowIndex:d.raw_data.length+2}]}));setModal(null);showToast("Item added ✓");}
    catch(e){showToast("Error saving","error");}
    setSaving(false);
  }

  async function handleEditSave(form){
    setSaving(true);
    try{
      const{sheetKey,sheetName}=modal;
      await apiUpdate(sheetName,form.__rowIndex,form);
      setSheetData(d=>({...d,[sheetKey]:d[sheetKey].map(r=>r.__rowIndex===form.__rowIndex?form:r)}));
      setModal(null);showToast("Saved ✓");
    }catch(e){showToast("Error saving","error");}
    setSaving(false);
  }

  async function handleDeleteRow(form){
    setSaving(true);
    try{
      const{sheetKey,sheetName}=modal;
      await apiDelete(sheetName,form.__rowIndex);
      setSheetData(d=>({...d,[sheetKey]:d[sheetKey].filter(r=>r.__rowIndex!==form.__rowIndex)}));
      setModal(null);showToast("Row deleted");
    }catch(e){showToast("Error deleting","error");}
    setSaving(false);
  }

  const tabStyle=t=>({padding:"8px 18px",border:"none",background:activeTab===t?C.ink:"transparent",color:activeTab===t?C.cream:C.stone,cursor:"pointer",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",borderRadius:1,transition:"all 0.15s"});
  const card={background:C.parchment,padding:"22px 26px",borderRadius:2};
  const thProps=(col,sort,setSort)=>({col,sortCol:sort.col,sortDir:sort.dir,onSort:()=>setSort(s=>({col,dir:s.col===col&&s.dir==="asc"?"desc":"asc"}))});

  if(loading)return <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
    <div style={{fontSize:32,fontFamily:"'Playfair Display',Georgia,serif",color:C.ink}}>抹茶</div>
    <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:C.stone}}>Loading…</div>
  </div>;

  // NOTE: The full tab JSX is identical to the Vite version — paste your existing tab content here.
  // The key difference is all API calls go through apiAppend/apiUpdate/apiDelete instead of the gapi client.
  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.parchment}}::-webkit-scrollbar-thumb{background:${C.warm}}
      .hrow:hover{background:${C.parchment}!important;cursor:pointer;}
    `}</style>

    {toast&&<div style={{position:"fixed",top:20,right:24,zIndex:2000,background:toast.type==="error"?C.red:C.moss,color:C.cream,padding:"12px 20px",fontSize:12,borderRadius:2}}>{toast.msg}</div>}
    {pendingSyncs.length>0&&<StatusSyncModal updates={pendingSyncs} onApply={handleApplySync} onClose={()=>setPendingSyncs([])} saving={saving}/>}
    {modal==="log"&&<LogEntryModal tins={raw_data} onSave={handleLogSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal==="addTin"&&<AddTinModal onSave={handleAddTinSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal?.type==="edit"&&<EditRowModal row={modal.row} onSave={handleEditSave} onDelete={handleDeleteRow} onClose={()=>setModal(null)} saving={saving}/>}

    <div style={{minHeight:"100vh",background:C.cream,color:C.ink}}>
      <header style={{borderBottom:`1px solid ${C.ink}`}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 40px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18,paddingBottom:14,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"baseline",gap:16}}>
              <span style={{fontSize:24,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700}}>抹茶 Analytics</span>
              <span style={{fontSize:11,color:C.stone,letterSpacing:"0.1em",textTransform:"uppercase"}}>Private</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {lastRefresh&&<span style={{fontSize:10,color:C.stone}}>↺ {lastRefresh.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>}
              <button onClick={loadData} style={{...sel,background:C.ink,color:C.cream,border:"none",padding:"6px 14px"}}>↻ Refresh</button>
              <button onClick={()=>setModal("log")} style={{...btnP,padding:"7px 16px",background:C.moss}}>+ Log Entry</button>
              <button onClick={()=>setModal("addTin")} style={{...btnP,padding:"7px 16px"}}>+ Add Item</button>
              <button onClick={()=>signOut({callbackUrl:"/private"})} style={{...btnS,padding:"6px 14px",fontSize:10}}>Sign out</button>
            </div>
          </div>
          <nav style={{display:"flex",gap:4}}>
            {[{id:"overview",label:"Overview"},{id:"consumption",label:"Consumption"},{id:"inventory",label:"Inventory"},{id:"pr",label:"PR & Cost"},{id:"social",label:"Social"}]
              .map(t=><button key={t.id} style={tabStyle(t.id)} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}
          </nav>
        </div>
      </header>

      <main style={{padding:"32px 40px",maxWidth:1400,margin:"0 auto",width:"100%"}}>
        {/* PASTE YOUR FULL TAB JSX FROM App.jsx HERE */}
        {/* Overview, Consumption, Inventory, PR, Social tabs */}
        {/* Replace all gapi/appendRow/updateRow/deleteRow calls with apiAppend/apiUpdate/apiDelete */}
        <div style={{padding:40,textAlign:"center",color:C.stone,fontSize:12}}>
          Paste your tab content from App.jsx here — see SETUP.md for instructions.
        </div>
      </main>

      <footer style={{borderTop:`1px solid ${C.warm}`,marginTop:32}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"16px 40px",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:10,color:C.mist,letterSpacing:"0.1em"}}>抹茶 ANALYTICS · PRIVATE</span>
          <a href="/" style={{fontSize:10,color:C.mist,textDecoration:"none"}}>← Public view</a>
        </div>
      </footer>
    </div>
  </>;
}

// ── Page entry point ──────────────────────────────────────────────────────────
export default function PrivatePage() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (!session) return <SignInGate/>;
  if (!session.user.isOwner) return <NotOwner email={session.user.email}/>;
  return <PrivateDashboard/>;
}

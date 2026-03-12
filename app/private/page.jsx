"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useCallback, useMemo } from "react";

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}
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
  const res = await fetch("/api/private-data", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({sheetName,row}) });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error || `Append failed (${res.status})`);
  return d;
}
async function apiUpdate(sheetName, rowIndex, row) {
  const res = await fetch("/api/private-data", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({sheetName,rowIndex,row}) });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error || `Update failed (${res.status})`);
  return d;
}
async function apiDelete(sheetName, rowIndex) {
  const res = await fetch("/api/private-data", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({sheetName,rowIndex}) });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error || `Delete failed (${res.status})`);
  return d;
}

// ── Sheet names ───────────────────────────────────────────────────────────────
const SHEETS = { raw_data:"raw_data", daily:"daily_consumption", posts:"posts", cash:"cash_received", codes:"discount_codes" };

// Extended type lists (override shared.js)
const PRODUCT_TYPES_EXT = ["Matcha","Hojicha","Gyokuro","Sencha","Mugwort","Other Tea","Skincare","Appliance","Accessory","Tool","Other"];
const CONSUMABLE_TYPES_EXT = ["Matcha","Hojicha","Gyokuro","Sencha","Mugwort","Other Tea"];
function isConsumableExt(r) { return CONSUMABLE_TYPES_EXT.includes(r?.Product_Type); }

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
  return <div style={{position:"fixed",inset:0,background:"rgba(26,26,24,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
    onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
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

// Friendly label map for field names
const FIELD_LABELS = {
  Tin_ID:"Tin ID", Brand:"Brand", Product_Name:"Product Name",
  Product_Type:"Type", Origin:"Origin / Region", URL:"Product URL",
  Retail_Price:"Retail Price ($)", "Price/g":"Price per Gram ($/g)",
  Tin_Weight_g:"Tin Weight (g)", How_I_obtained:"How Obtained",
  Method_of_contact:"How You Were Contacted", "Obligation?":"Post Obligation",
  "Affiliate?":"Affiliate Link", Date_of_contact:"Date of Contact",
  Date_received:"Date Received", Status:"Status", Expiration_Date:"Expiration Date",
  "Due_date-Post":"Post Due Date", "Due_date-Post2":"Post Due Date 2",
  "_Ceremonial_advertised?_(Matcha)":"Ceremonial Advertised?",
  "Organic?_(Matcha)":"Organic?", "First-harvest?_(Matcha)":"First Harvest?",
  "Disclosed_Cultivars_(Matcha)":"Cultivars", Owner:"Owner",
  Tin_ID:"Tin ID", Date:"Date", Type:"Tea Type", Name:"Product Name",
  Grams_Used:"Grams Used", For_someone_else:"Made for Someone Else",
  Latte:"Latte", Usucha:"Thin Whisk (Usucha)", Combo:"Combo",
  New_tin_opened:"Opened a New Tin", Finished_tin_today:"Finished Tin Today", Notes:"Notes",
  "Single_Cultivar?_(Matcha)":"Single Cultivar?",
  "Affiliate?":"Affiliate", "Payment_received":"Payment Received",
  Date:"Date", Amount:"Amount", Method:"Method",
  Code:"Discount Code", Link:"Link", Discount:"Discount",
  Dashboard_URL:"Dashboard URL",
};
const friendlyLabel = k => FIELD_LABELS[k] || k.replace(/_/g," ").replace(/\?/g,"").replace(/\(.*\)/g,"").trim();

// Date fields that should use <input type="date">
const DATE_FIELDS = new Set(["Date","Date_received","Expiration_Date","Date_of_contact","Due_date-Post","Due_date-Post2","post_date"]);
// Fields with set dropdown options
const DROPDOWN_FIELDS = {
  Product_Type: ["Matcha","Hojicha","Gyokuro","Sencha","Mugwort","Other Tea","Skincare","Appliance","Accessory","Tool","Other","__custom__"],
  Status: ["Unopened","Opened","Pending","Gave Away","Finished"],
  How_I_obtained: ["Purchased","Gifted (brand)","Gifted (friend)","PR","Other"],
  "_Ceremonial_advertised?_(Matcha)": ["y","n"],
  "Organic?_(Matcha)": ["y","n"],
  "First-harvest?_(Matcha)": ["y","n"],
  Type: ["Matcha","Hojicha","Gyokuro","Sencha","Other Tea"],
};
// Toggle (y/n) fields rendered as buttons
const TOGGLE_FIELDS = new Set(["For_someone_else","Latte","Usucha","Combo","New_tin_opened","Finished_tin_today"]);
// Fields to hide in generic EditRow
const HIDDEN_EDIT_FIELDS = new Set(["__rowIndex"]);

// Build Tin_ID from brand + name + date_received
function buildTinId(brand, name, dateReceived) {
  if (!brand || !name || !dateReceived) return "";
  const slug = s => s.toUpperCase().replace(/[^A-Z0-9]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
  const d = dateReceived.replace(/-/g,"").slice(0,8); // YYYYMMDD
  return `${slug(brand)}-${slug(name)}-${d}`;
}

function LogEntryModal({tins, onSave, onClose, saving}) {
  const activeTins = tins
    .filter(t => isConsumableExt(t) && (t.Status==="Opened" || t.Status==="Unopened"))
    .sort((a,b) => ({Opened:0,Unopened:1}[a.Status]??9) - ({Opened:0,Unopened:1}[b.Status]??9) || a.Brand.localeCompare(b.Brand));

  const initFromTin = t => ({
    Tin_ID: t?.Tin_ID||"",
    Date: today(),
    Brand: t?.Brand||"",
    Type: t?.Product_Type||"Matcha",
    Name: t?.Product_Name||"",
    Grams_Used: "2",
    For_someone_else:"", Latte:"", Usucha:"", Combo:"",
    New_tin_opened:"", Finished_tin_today:"", Notes:"",
  });

  const [form, setForm] = useState(initFromTin(activeTins[0]));
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const tog = k => set(k, form[k]==="y" ? "" : "y");

  const onTinSelect = id => {
    const t = tins.find(t=>t.Tin_ID===id);
    if (t) setForm(initFromTin(t));
    else setForm(f=>({...f, Tin_ID:"", Brand:"", Type:"", Name:""}));
  };

  const Tog = ({field, label}) => (
    <button type="button" onClick={()=>tog(field)} style={{
      padding:"7px 14px", fontSize:11, marginRight:8, marginBottom:8, borderRadius:1, cursor:"pointer",
      border:`1px solid ${form[field]==="y" ? C.moss : C.warm}`,
      background: form[field]==="y" ? C.moss : "transparent",
      color: form[field]==="y" ? C.cream : C.stone,
    }}>{label}</button>
  );

  // All brands and names from active tins for dropdowns
  const activeBrands = [...new Set(activeTins.map(t=>t.Brand).filter(Boolean))].sort();
  const tinsForBrand = activeTins.filter(t=>!form.Brand || t.Brand===form.Brand);
  const namesForBrand = [...new Set(tinsForBrand.map(t=>t.Product_Name).filter(Boolean))].sort();

  const onBrandSelect = brand => {
    const match = activeTins.find(t=>t.Brand===brand);
    if (match) setForm(initFromTin(match));
    else setForm(f=>({...f, Brand:brand, Tin_ID:"", Name:"", Type:""}));
  };
  const onNameSelect = name => {
    const match = activeTins.find(t=>t.Brand===form.Brand && t.Product_Name===name);
    if (match) setForm(initFromTin(match));
    else setForm(f=>({...f, Name:name}));
  };

  const selectedTin = tins.find(t=>t.Tin_ID===form.Tin_ID);

  return <Modal title="Log Consumption Entry" onClose={onClose}>
    {/* Pick from inventory OR fill manually */}
    <Field label="Pick from Inventory">
      <select value={form.Tin_ID} onChange={e=>onTinSelect(e.target.value)} style={inp}>
        <option value="">— Select a tin —</option>
        {activeTins.map(t=>(
          <option key={t.Tin_ID} value={t.Tin_ID}>
            {t.Brand} — {t.Product_Name} ({t.Status})
          </option>
        ))}
        <option value="__other__">Other / not in inventory</option>
      </select>
    </Field>

    {/* Tin info card */}
    {selectedTin && <div style={{background:C.parchment,borderRadius:2,padding:"10px 14px",marginBottom:4,fontSize:11,color:C.stone,display:"flex",gap:16,flexWrap:"wrap"}}>
      <span><strong>Type:</strong> {selectedTin.Product_Type}</span>
      {selectedTin.Origin && <span><strong>Origin:</strong> {selectedTin.Origin}</span>}
      {selectedTin.Tin_Weight_g && <span><strong>Size:</strong> {Math.round(parseFloat(selectedTin.Tin_Weight_g))}g</span>}
      <span style={{color:selectedTin.Status==="Opened"?C.moss:C.gold,fontWeight:600}}>{selectedTin.Status}</span>
    </div>}

    {/* Manual brand/name override when not from inventory */}
    {!selectedTin && <div style={g.col2}>
      <Field label="Brand">
        <select value={form.Brand} onChange={e=>onBrandSelect(e.target.value)} style={inp}>
          <option value="">Select brand…</option>
          {activeBrands.map(b=><option key={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Product Name">
        <select value={form.Name} onChange={e=>onNameSelect(e.target.value)} style={inp}>
          <option value="">Select name…</option>
          {namesForBrand.map(n=><option key={n}>{n}</option>)}
        </select>
      </Field>
    </div>}

    <div style={{...g.col2,marginTop:8}}>
      <Field label="Date" required>
        <input type="date" value={form.Date} onChange={e=>set("Date",e.target.value)} style={inp}/>
      </Field>
      <Field label="Grams Used" required>
        <input type="number" step="0.5" min="0.5" value={form.Grams_Used} onChange={e=>set("Grams_Used",e.target.value)} style={inp}/>
      </Field>
    </div>

    <Field label="Preparation Style">
      <Tog field="Latte" label="Latte"/>
      <Tog field="Usucha" label="Thin Whisk (Usucha)"/>
      <Tog field="Combo" label="Combo"/>
    </Field>

    <Field label="Other Details">
      <Tog field="For_someone_else" label="Made for someone else"/>
      <Tog field="New_tin_opened" label="Opened a new tin"/>
      <Tog field="Finished_tin_today" label="Finished this tin today"/>
    </Field>

    <Field label="Notes">
      <input value={form.Notes} onChange={e=>set("Notes",e.target.value)} style={inp} placeholder="Optional…"/>
    </Field>

    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Save Entry"}</button>
    </div>
  </Modal>;
}

function AddTinModal({onSave, onClose, saving, existingTins=[]}) {
  const existingBrands = [...new Set(existingTins.map(t=>t.Brand).filter(Boolean))].sort();

  const [form, setForm] = useState({
    Tin_ID:"", Brand:"", Product_Name:"", Product_Type:"Matcha",
    Origin:"", URL:"", Retail_Price:"", "Price/g":"", Tin_Weight_g:"",
    How_I_obtained:"Purchased", Method_of_contact:"", "Obligation?":"",
    "Affiliate?":"", Date_of_contact:"", Date_received:"",
    Status:"Unopened", Expiration_Date:"",
    "_Ceremonial_advertised?_(Matcha)":"n",
    "Organic?_(Matcha)":"n",
    "First-harvest?_(Matcha)":"n",
    "Disclosed_Cultivars_(Matcha)":"", "Single_Cultivar?_(Matcha)":"unknown",
    "Due_date-Post":"", "Due_date-Post2":"",
  });

  const set = (k,v) => setForm(prev => {
    const u = {...prev, [k]:v};
    // Auto-build Tin_ID only when all 3 fields are present
    const brand = k==="Brand" ? v : u.Brand;
    const name  = k==="Product_Name" ? v : u.Product_Name;
    const date  = k==="Date_received" ? v : u.Date_received;
    u.Tin_ID = buildTinId(brand, name, date);
    // Auto-calc Price/g when price and weight both known
    const price  = parseFloat(k==="Retail_Price" ? v : u.Retail_Price);
    const weight = parseFloat(k==="Tin_Weight_g"  ? v : u.Tin_Weight_g);
    if (price > 0 && weight > 0) u["Price/g"] = (price / weight).toFixed(4);
    return u;
  });

  const cons = isConsumable(form);
  const isPR = form.How_I_obtained !== "Purchased";
  const isMat = form.Product_Type === "Matcha";

  const YN = ({field, label}) => (
    <button type="button" onClick={()=>set(field, form[field]==="y"?"n":"y")} style={{
      padding:"6px 12px", fontSize:11, borderRadius:1, cursor:"pointer", marginRight:8,
      border:`1px solid ${form[field]==="y"?C.moss:C.warm}`,
      background:form[field]==="y"?C.moss:"transparent",
      color:form[field]==="y"?C.cream:C.stone,
    }}>{label}: {form[field]==="y"?"Yes":"No"}</button>
  );

  return <Modal title="Add New Item" onClose={onClose}>
    {/* Core identity */}
    <div style={g.col2}>
      <Field label="Brand" required>
        <input list="brand-list" style={inp} value={form.Brand} onChange={e=>set("Brand",e.target.value)} placeholder="e.g. Ippodo"/>
        <datalist id="brand-list">{existingBrands.map(b=><option key={b} value={b}/>)}</datalist>
      </Field>
      <Field label="Product Name" required>
        <input style={inp} value={form.Product_Name} onChange={e=>set("Product_Name",e.target.value)} placeholder="e.g. Ummon"/>
      </Field>
    </div>

    <Field label="Tin ID">
      <input style={{...inp,color:C.stone,fontFamily:"monospace",fontSize:11}} value={form.Tin_ID}
        onChange={e=>setForm(f=>({...f,Tin_ID:e.target.value}))}
        placeholder="Auto-filled from brand + name + date received"/>
    </Field>

    <div style={g.col2}>
      <Field label="Product Type" required>
        <select style={inp} value={form.__customType?"__custom__":form.Product_Type}
          onChange={e=>{
            if(e.target.value==="__custom__") setForm(f=>({...f,__customType:true,Product_Type:""}));
            else setForm(f=>({...f,__customType:false,Product_Type:e.target.value}));
          }}>
          {PRODUCT_TYPES_EXT.map(t=><option key={t} value={t}>{t==="__custom__"?"+ Add new type…":t}</option>)}
        </select>
        {form.__customType && <input style={{...inp,marginTop:6}} placeholder="Enter new type name…"
          value={form.Product_Type} onChange={e=>set("Product_Type",e.target.value)}/>}
      </Field>
      <Field label="Status">
        <select style={inp} value={form.Status} onChange={e=>set("Status",e.target.value)}>
          {["Unopened","Opened","Pending","Gave Away","Finished"].map(s=><option key={s}>{s}</option>)}
        </select>
      </Field>
    </div>

    {cons && <div style={g.col3}>
      <Field label="Origin / Region"><input style={inp} value={form.Origin} onChange={e=>set("Origin",e.target.value)} placeholder="e.g. Uji, Japan"/></Field>
      <Field label="Tin Weight (g)"><input type="number" step="1" style={inp} value={form.Tin_Weight_g} onChange={e=>set("Tin_Weight_g",e.target.value)}/></Field>
      <Field label="Expiration Date"><input type="date" style={inp} value={form.Expiration_Date} onChange={e=>set("Expiration_Date",e.target.value)}/></Field>
    </div>}

    {!cons && <Field label="Product URL"><input style={inp} value={form.URL} onChange={e=>set("URL",e.target.value)} placeholder="https://…"/></Field>}

    <div style={g.col3}>
      <Field label="Retail Price ($)"><input type="number" step="0.01" style={inp} value={form.Retail_Price} onChange={e=>set("Retail_Price",e.target.value)}/></Field>
      {cons && <Field label="Price/g"><div style={{...inp,color:C.stone,background:"#f8f5ee",display:"flex",alignItems:"center"}}>{form["Price/g"]?`$${parseFloat(form["Price/g"]).toFixed(4)}/g`:<span style={{opacity:0.4}}>auto-calculated</span>}</div></Field>}
      <Field label="Date Received"><input type="date" style={inp} value={form.Date_received} onChange={e=>set("Date_received",e.target.value)}/></Field>
    </div>

    <div style={g.col2}>
      <Field label="How Obtained">
        <select style={inp} value={form.How_I_obtained} onChange={e=>set("How_I_obtained",e.target.value)}>
          {["Purchased","Gifted (brand)","Gifted (friend)","PR","Other"].map(o=><option key={o}>{o}</option>)}
        </select>
      </Field>
      {isPR && <Field label="How You Were Contacted"><input style={inp} value={form.Method_of_contact} onChange={e=>set("Method_of_contact",e.target.value)} placeholder="e.g. Instagram DM"/></Field>}
    </div>

    {isPR && <div style={g.col2}>
      <Field label="Post Obligation"><input style={inp} value={form["Obligation?"]} onChange={e=>set("Obligation?",e.target.value)} placeholder="e.g. 1 post"/></Field>
      <Field label="Affiliate Link"><input style={inp} value={form["Affiliate?"]} onChange={e=>set("Affiliate?",e.target.value)} placeholder="y / link / blank"/></Field>
    </div>}

    {isPR && <div style={g.col2}>
      <Field label="Post Due Date"><input type="date" style={inp} value={form["Due_date-Post"]} onChange={e=>set("Due_date-Post",e.target.value)}/></Field>
      <Field label="Second Post Due Date"><input type="date" style={inp} value={form["Due_date-Post2"]} onChange={e=>set("Due_date-Post2",e.target.value)}/></Field>
    </div>}

    {isMat && cons && <>
      <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,marginBottom:10,marginTop:4}}>Matcha Characteristics</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <YN field="_Ceremonial_advertised?_(Matcha)" label="Ceremonial"/>
        <YN field="First-harvest?_(Matcha)" label="First Harvest"/>
        <YN field="Organic?_(Matcha)" label="Organic"/>
      </div>
      <div style={g.col2}>
        <Field label="Cultivars / Cultivar Blend">
          <input style={inp} value={form["Disclosed_Cultivars_(Matcha)"]} onChange={e=>set("Disclosed_Cultivars_(Matcha)",e.target.value)} placeholder="e.g. Okumidori, Samidori"/>
        </Field>
        <Field label="Single Cultivar?">
          <div style={{display:"flex",gap:8,paddingTop:4}}>
            {["yes","no","unknown"].map(opt=>(
              <button key={opt} type="button" onClick={()=>set("Single_Cultivar?_(Matcha)",opt)}
                style={{padding:"6px 12px",fontSize:11,borderRadius:1,cursor:"pointer",flex:1,
                  border:`1px solid ${form["Single_Cultivar?_(Matcha)"]===opt?C.moss:C.warm}`,
                  background:form["Single_Cultivar?_(Matcha)"]===opt?C.moss:"transparent",
                  color:form["Single_Cultivar?_(Matcha)"]===opt?C.cream:C.stone,
                  textTransform:"capitalize"}}>
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </>}

    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Add Item"}</button>
    </div>
  </Modal>;
}

// Converts stored date strings to YYYY-MM-DD for <input type="date">
function toDateInput(v) {
  if (!v) return "";
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2,"0")}-${m[2].padStart(2,"0")}`;
  return v; // already YYYY-MM-DD or empty
}

function EditRowModal({row, onSave, onDelete, onClose, saving}) {
  const [form, setForm] = useState(()=>{
    const f={...row};
    // Pre-convert date fields to YYYY-MM-DD
    for(const k of DATE_FIELDS) if(f[k]) f[k]=toDateInput(f[k]);
    // Strip $ and , from price fields so number inputs render correctly
    for(const k of ["Retail_Price","Price/g","Amount","Tin_Weight_g"]) if(f[k]!=null) f[k]=String(f[k]).replace(/[$,\s]/g,"").trim();
    return f;
  });
  const [confirm, setConfirm] = useState(false);
  const set = (k,v) => setForm(prev=>{
    const u={...prev,[k]:v};
    // Auto-recalc Price/g whenever price or weight changes
    const p=parseFloat(u.Retail_Price||"");
    const w=parseFloat(u.Tin_Weight_g||"");
    if(p>0&&w>0) u["Price/g"]=(p/w).toFixed(4);
    return u;
  });

  // Detect which sheet this row is from based on its keys
  const isDaily = "Grams_Used" in row;
  const isRaw   = "Tin_Weight_g" in row || "Product_Type" in row;
  const isPost  = "post_id" in row || "content_type" in row;
  const isCash  = "Amount" in row && "Method" in row;
  const isCode  = "Code" in row || "Dashboard_URL" in row;

  const Tog = ({field,label}) => (
    <button type="button" onClick={()=>set(field,form[field]==="y"?"":"y")} style={{
      padding:"7px 14px",fontSize:11,marginRight:8,marginBottom:8,borderRadius:1,cursor:"pointer",
      border:`1px solid ${form[field]==="y"?C.moss:C.warm}`,
      background:form[field]==="y"?C.moss:"transparent",
      color:form[field]==="y"?C.cream:C.stone,
    }}>{label}</button>
  );
  const YN = ({field,label}) => (
    <button type="button" onClick={()=>set(field,form[field]==="y"?"n":"y")} style={{
      padding:"6px 12px",fontSize:11,borderRadius:1,cursor:"pointer",marginRight:8,
      border:`1px solid ${form[field]==="y"?C.moss:C.warm}`,
      background:form[field]==="y"?C.moss:"transparent",
      color:form[field]==="y"?C.cream:C.stone,
    }}>{label}: {form[field]==="y"?"Yes":"No"}</button>
  );

  const cons = isConsumableExt(form);
  const isMat = form.Product_Type==="Matcha" || form.Type==="Matcha";
  const isPR  = form.How_I_obtained && form.How_I_obtained!=="Purchased";

  if (confirm) return <Modal title="Delete this entry?" onClose={()=>setConfirm(false)} danger>
    <p style={{color:C.stone,marginBottom:24,fontSize:13}}>Permanently removes this row from your Google Sheet. This cannot be undone.</p>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={()=>setConfirm(false)}>Cancel</button>
      <button style={btnD} onClick={()=>onDelete(form)} disabled={saving}>{saving?"Deleting…":"Yes, Delete"}</button>
    </div>
  </Modal>;

  return <Modal title={isDaily?"Edit Log Entry":isRaw?"Edit Item":isPost?"Edit Post":isCash?"Edit Payment":isCode?"Edit Code":"Edit Entry"} onClose={onClose}>;

    {/* ── DAILY CONSUMPTION EDIT ── */}
    {isDaily && <>
      <Field label="Tin ID"><input style={{...inp,color:C.stone,fontFamily:"monospace",fontSize:11}} value={form.Tin_ID||""} onChange={e=>set("Tin_ID",e.target.value)}/></Field>
      <div style={g.col2}>
        <Field label="Brand"><input style={inp} value={form.Brand||""} onChange={e=>set("Brand",e.target.value)}/></Field>
        <Field label="Product Name"><input style={inp} value={form.Name||""} onChange={e=>set("Name",e.target.value)}/></Field>
      </div>
      <div style={g.col3}>
        <Field label="Tea Type">
          <select style={inp} value={form.Type||""} onChange={e=>set("Type",e.target.value)}>
            {["Matcha","Hojicha","Gyokuro","Sencha","Mugwort","Other Tea"].map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Date" required><input type="date" style={inp} value={form.Date||""} onChange={e=>set("Date",e.target.value)}/></Field>
        <Field label="Grams Used" required><input type="number" step="0.5" min="0.5" style={inp} value={form.Grams_Used||""} onChange={e=>set("Grams_Used",e.target.value)}/></Field>
      </div>
      <Field label="Preparation Style">
        <Tog field="Latte" label="Latte"/>
        <Tog field="Usucha" label="Thin Whisk (Usucha)"/>
        <Tog field="Combo" label="Combo"/>
      </Field>
      <Field label="Other Details">
        <Tog field="For_someone_else" label="Made for someone else"/>
        <Tog field="New_tin_opened" label="Opened a new tin"/>
        <Tog field="Finished_tin_today" label="Finished this tin today"/>
      </Field>
      <Field label="Notes"><input style={inp} value={form.Notes||""} onChange={e=>set("Notes",e.target.value)}/></Field>
    </>}

    {/* ── INVENTORY ITEM EDIT ── */}
    {isRaw && <>
      <div style={g.col2}>
        <Field label="Brand" required><input style={inp} value={form.Brand||""} onChange={e=>set("Brand",e.target.value)}/></Field>
        <Field label="Product Name" required><input style={inp} value={form.Product_Name||""} onChange={e=>set("Product_Name",e.target.value)}/></Field>
      </div>
      <Field label="Tin ID"><input style={{...inp,color:C.stone,fontFamily:"monospace",fontSize:11}} value={form.Tin_ID||""} onChange={e=>set("Tin_ID",e.target.value)}/></Field>
      <div style={g.col2}>
        <Field label="Product Type">
          <select style={inp} value={form.Product_Type||""} onChange={e=>set("Product_Type",e.target.value)}>
            {PRODUCT_TYPES_EXT.filter(t=>t!=="__custom__").map(t=><option key={t}>{t}</option>)}
          </select>
        </Field>
        {cons && <Field label="Status">
          <select style={inp} value={form.Status||""} onChange={e=>set("Status",e.target.value)}>
            {["Unopened","Opened","Pending","Gave Away","Finished"].map(s=><option key={s}>{s}</option>)}
          </select>
        </Field>}

      </div>
      {cons && <div style={g.col3}>
        <Field label="Origin / Region"><input style={inp} value={form.Origin||""} onChange={e=>set("Origin",e.target.value)}/></Field>
        <Field label="Weight (g)"><input type="number" style={inp} value={form.Tin_Weight_g||""} onChange={e=>set("Tin_Weight_g",e.target.value)}/></Field>
        <Field label="Expiration Date"><input type="date" style={inp} value={form.Expiration_Date||""} onChange={e=>set("Expiration_Date",e.target.value)}/></Field>
      </div>}
      {!cons && <Field label="Product URL"><input style={inp} value={form.URL||""} onChange={e=>set("URL",e.target.value)}/></Field>}
      <div style={g.col3}>
        <Field label="Retail Price ($)"><input type="text" inputMode="decimal" style={inp} value={form.Retail_Price||""} onChange={e=>set("Retail_Price",e.target.value)} placeholder="e.g. 24.00"/></Field>
        {cons && <Field label="Price/g ($/g)">
          <div style={{...inp,color:C.stone,background:"#f8f5ee",display:"flex",alignItems:"center",gap:6}}>
            {form["Price/g"]?`$${parseFloat(form["Price/g"]||0).toFixed(4)}/g`:<span style={{opacity:0.4}}>auto-calculated</span>}
            {form.Retail_Price&&form.Tin_Weight_g&&<button type="button"
              onClick={()=>{const p=parseFloat(form.Retail_Price),w=parseFloat(form.Tin_Weight_g);if(p>0&&w>0)set("Price/g",(p/w).toFixed(4));}}
              style={{fontSize:9,padding:"2px 6px",border:`1px solid ${C.warm}`,background:"transparent",color:C.stone,cursor:"pointer",borderRadius:1,marginLeft:"auto"}}>
              Recalc
            </button>}
          </div>
        </Field>}
        <Field label="Date Received"><input type="date" style={inp} value={form.Date_received||""} onChange={e=>set("Date_received",e.target.value)}/></Field>
      </div>
      <div style={g.col2}>
        <Field label="How Obtained">
          <select style={inp} value={form.How_I_obtained||""} onChange={e=>set("How_I_obtained",e.target.value)}>
            {["Purchased","Gifted (brand)","Gifted (friend)","PR","Other"].map(o=><option key={o}>{o}</option>)}
          </select>
        </Field>
        {isPR && <Field label="Contact Method"><input style={inp} value={form.Method_of_contact||""} onChange={e=>set("Method_of_contact",e.target.value)}/></Field>}
      </div>
      {isPR && <>
        <div style={g.col2}>
          <Field label="Post Obligation"><input style={inp} value={form["Obligation?"]||""} onChange={e=>set("Obligation?",e.target.value)}/></Field>
          <Field label="Affiliate Link"><input style={inp} value={form["Affiliate?"]||""} onChange={e=>set("Affiliate?",e.target.value)}/></Field>
        </div>
        <div style={g.col2}>
          <Field label="Post Due Date"><input type="date" style={inp} value={form["Due_date-Post"]||""} onChange={e=>set("Due_date-Post",e.target.value)}/></Field>
          <Field label="2nd Post Due Date"><input type="date" style={inp} value={form["Due_date-Post2"]||""} onChange={e=>set("Due_date-Post2",e.target.value)}/></Field>
        </div>
      </>}
      {isMat && cons && <>
        <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.stone,marginBottom:10,marginTop:4}}>Matcha Characteristics</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          <YN field="_Ceremonial_advertised?_(Matcha)" label="Ceremonial"/>
          <YN field="First-harvest?_(Matcha)" label="First Harvest"/>
          <YN field="Organic?_(Matcha)" label="Organic"/>
        </div>
        <div style={g.col2}>
          <Field label="Cultivars">
            <input style={inp} value={form["Disclosed_Cultivars_(Matcha)"]||""} onChange={e=>set("Disclosed_Cultivars_(Matcha)",e.target.value)} placeholder="e.g. Okumidori, Samidori"/>
          </Field>
          <Field label="Single Cultivar?">
            <div style={{display:"flex",gap:6,paddingTop:4}}>
              {["yes","no","unknown"].map(opt=>(
                <button key={opt} type="button" onClick={()=>set("Single_Cultivar?_(Matcha)",opt)}
                  style={{padding:"6px 10px",fontSize:11,borderRadius:1,cursor:"pointer",flex:1,
                    border:`1px solid ${form["Single_Cultivar?_(Matcha)"]===opt?C.moss:C.warm}`,
                    background:form["Single_Cultivar?_(Matcha)"]===opt?C.moss:"transparent",
                    color:form["Single_Cultivar?_(Matcha)"]===opt?C.cream:C.stone,textTransform:"capitalize"}}>
                  {opt}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </>}
    </>}

    {/* ── CASH PAYMENT EDIT ── */}
    {isCash && <>
      <div style={g.col2}>
        <Field label="Brand"><input style={inp} value={form.Brand||""} onChange={e=>set("Brand",e.target.value)}/></Field>
        <Field label="Type"><input style={inp} value={form.Type||""} onChange={e=>set("Type",e.target.value)} placeholder="e.g. Post, Affiliate"/></Field>
      </div>
      <div style={g.col3}>
        <Field label="Date"><input type="date" style={inp} value={form.Date||""} onChange={e=>set("Date",e.target.value)}/></Field>
        <Field label="Amount ($)"><input type="text" inputMode="decimal" style={inp} value={form.Amount||""} onChange={e=>set("Amount",e.target.value)} placeholder="e.g. 40.00"/></Field>
        <Field label="Method"><input style={inp} value={form.Method||""} onChange={e=>set("Method",e.target.value)} placeholder="e.g. Cash, Venmo"/></Field>
      </div>
      <Field label="Status">
        <select style={inp} value={form.Status||""} onChange={e=>set("Status",e.target.value)}>
          {["Paid","Pending","Unpaid"].map(s=><option key={s}>{s}</option>)}
        </select>
      </Field>
    </>}

    {/* ── DISCOUNT CODE EDIT ── */}
    {isCode && <>
      <div style={g.col2}>
        <Field label="Brand"><input style={inp} value={form.Brand||""} onChange={e=>set("Brand",e.target.value)}/></Field>
        <Field label="Discount Code"><input style={{...inp,fontFamily:"monospace",fontWeight:700}} value={form.Code||""} onChange={e=>set("Code",e.target.value)} placeholder="e.g. HANNAH10"/></Field>
      </div>
      <div style={g.col2}>
        <Field label="Discount"><input style={inp} value={form.Discount||""} onChange={e=>set("Discount",e.target.value)} placeholder="e.g. 10% off"/></Field>
        <Field label="Affiliate?">
          <div style={{display:"flex",gap:8,paddingTop:4}}>
            {["y","n"].map(opt=>(
              <button key={opt} type="button" onClick={()=>set("Affiliate?",opt)} style={{
                padding:"6px 14px",fontSize:11,borderRadius:1,cursor:"pointer",flex:1,
                border:`1px solid ${form["Affiliate?"]===opt?C.moss:C.warm}`,
                background:form["Affiliate?"]===opt?C.moss:"transparent",
                color:form["Affiliate?"]===opt?C.cream:C.stone}}>
                {opt==="y"?"Yes":"No"}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Shop Link"><input style={inp} value={form.Link||""} onChange={e=>set("Link",e.target.value)} placeholder="https://…"/></Field>
      <Field label="Dashboard URL"><input style={inp} value={form.Dashboard_URL||""} onChange={e=>set("Dashboard_URL",e.target.value)} placeholder="https://…"/></Field>
    </>}

    {/* ── POST EDIT — generic fallback ── */}
    {isPost && Object.keys(form).filter(k=>!HIDDEN_EDIT_FIELDS.has(k)).map(k=>(
      <Field key={k} label={friendlyLabel(k)}>
        {DATE_FIELDS.has(k)
          ? <input type="date" style={inp} value={form[k]||""} onChange={e=>set(k,e.target.value)}/>
          : DROPDOWN_FIELDS[k]
            ? <select style={inp} value={form[k]||""} onChange={e=>set(k,e.target.value)}>{DROPDOWN_FIELDS[k].filter(o=>o!=="__custom__").map(o=><option key={o}>{o}</option>)}</select>
            : <input style={inp} value={form[k]||""} onChange={e=>set(k,e.target.value)}/>
        }
      </Field>
    ))}
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"space-between"}}>
      <button style={{...btnD,padding:"8px 16px"}} onClick={()=>setConfirm(true)}>Delete</button>
      <div style={{display:"flex",gap:10}}>
        <button style={btnS} onClick={onClose}>Cancel</button>
        <button style={btnP} onClick={()=>onSave(form)} disabled={saving}>{saving?"Saving…":"Save Changes"}</button>
      </div>
    </div>
  </Modal>;
}


function AddCashModal({onSave,onClose,saving}) {
  const [form,setForm]=useState({Date:"",Brand:"",Type:"",Amount:"",Method:"",Status:"Paid"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <Modal title="Add Cash / Payment" onClose={onClose}>
    <div style={g.col2}>
      <Field label="Brand" required><input style={inp} value={form.Brand} onChange={e=>set("Brand",e.target.value)} placeholder="e.g. Caff Off"/></Field>
      <Field label="Type" required>
        <select style={inp} value={form.Type} onChange={e=>set("Type",e.target.value)}>
          <option value="">Select…</option>
          {["Post","Affiliate","Gifted","Sponsorship","Other"].map(t=><option key={t}>{t}</option>)}
        </select>
      </Field>
    </div>
    <div style={g.col3}>
      <Field label="Date"><input type="date" style={inp} value={form.Date} onChange={e=>set("Date",e.target.value)}/></Field>
      <Field label="Amount ($)" required><input type="text" inputMode="decimal" style={inp} value={form.Amount} onChange={e=>set("Amount",e.target.value)} placeholder="e.g. 40.00"/></Field>
      <Field label="Method"><input style={inp} value={form.Method} onChange={e=>set("Method",e.target.value)} placeholder="e.g. Cash, Venmo"/></Field>
    </div>
    <Field label="Status">
      <div style={{display:"flex",gap:8}}>
        {["Paid","Pending","Unpaid"].map(s=>(
          <button key={s} type="button" onClick={()=>set("Status",s)} style={{
            flex:1,padding:"7px",fontSize:11,borderRadius:1,cursor:"pointer",
            border:`1px solid ${form.Status===s?C.moss:C.warm}`,
            background:form.Status===s?C.moss:"transparent",
            color:form.Status===s?C.cream:C.stone}}>
            {s}
          </button>
        ))}
      </div>
    </Field>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving||!form.Brand||!form.Amount}>{saving?"Saving…":"Add Entry"}</button>
    </div>
  </Modal>;
}

function AddCodeModal({onSave,onClose,saving}) {
  const [form,setForm]=useState({Brand:"",Code:"",Discount:"","Affiliate?":"y",Link:"",Dashboard_URL:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <Modal title="Add Discount / Affiliate Code" onClose={onClose}>
    <div style={g.col2}>
      <Field label="Brand" required><input style={inp} value={form.Brand} onChange={e=>set("Brand",e.target.value)} placeholder="e.g. Ippodo"/></Field>
      <Field label="Discount Code"><input style={{...inp,fontFamily:"monospace",fontWeight:700}} value={form.Code} onChange={e=>set("Code",e.target.value.toUpperCase())} placeholder="e.g. HANNAH10"/></Field>
    </div>
    <div style={g.col2}>
      <Field label="Discount"><input style={inp} value={form.Discount} onChange={e=>set("Discount",e.target.value)} placeholder="e.g. 10% off"/></Field>
      <Field label="Affiliate?">
        <div style={{display:"flex",gap:8,paddingTop:4}}>
          {["y","n"].map(opt=>(
            <button key={opt} type="button" onClick={()=>set("Affiliate?",opt)} style={{
              flex:1,padding:"6px",fontSize:11,borderRadius:1,cursor:"pointer",
              border:`1px solid ${form["Affiliate?"]===opt?C.moss:C.warm}`,
              background:form["Affiliate?"]===opt?C.moss:"transparent",
              color:form["Affiliate?"]===opt?C.cream:C.stone}}>
              {opt==="y"?"Yes":"No"}
            </button>
          ))}
        </div>
      </Field>
    </div>
    <Field label="Shop Link"><input style={inp} value={form.Link} onChange={e=>set("Link",e.target.value)} placeholder="https://…"/></Field>
    <Field label="Dashboard URL"><input style={inp} value={form.Dashboard_URL} onChange={e=>set("Dashboard_URL",e.target.value)} placeholder="https://…"/></Field>
    <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"flex-end"}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} onClick={()=>onSave(form)} disabled={saving||!form.Brand}>{saving?"Saving…":"Add Code"}</button>
    </div>
  </Modal>;
}

// ── Share Drop Tab ───────────────────────────────────────────────────────────
function estimateShipping(grams) {
  return { cost: Math.ceil(grams / 28) * 1.00, method: "" };
}


// Parses JSON suggestions stored in sheet cell, returns [{name,grams}]
function shippingFor(grams) {
  return estimateShipping(grams);
}

function parseSuggestions(raw) {
  try { return JSON.parse(raw||"[]"); } catch { return []; }
}

function AddListingModal({ raw_data, onClose, onSave, initial }) {
  const CONSUMABLE_EXT = ["Matcha","Hojicha","Gyokuro","Sencha","Mugwort","Other Tea"];
  const options = raw_data.filter(r => CONSUMABLE_EXT.includes(r.Product_Type));
  const [tinId, setTinId]       = useState(initial?.Tin_ID||"");
  const [gramsAvail, setGramsAvail] = useState(String(initial?.Grams_Available||""));
  const [notes, setNotes]       = useState(initial?.Notes||"");
  const [active, setActive]     = useState(initial?.Active||"y");
  const [suggestions, setSuggestions] = useState(()=>parseSuggestions(initial?.Suggestions));
  const [gramsMap, setGramsMap] = useState({});
  const [saving, setSaving]     = useState(false);
  const selected = raw_data.find(r=>r.Tin_ID===tinId)||{};
  const inpFull = {...inp, width:"100%"};

  useEffect(()=>{
    fetch("/api/grams-remaining").then(r=>r.json()).then(d=>{ if(!d.error) setGramsMap(d); }).catch(()=>{});
  },[]);

  const gramsLeft = tinId && gramsMap[tinId] != null ? gramsMap[tinId] : null;
  const tinWeight = parseFloat(selected.Tin_Weight_g)||0;

  const addSug    = () => setSuggestions(s=>[...s,{name:"",grams:""}]);
  const removeSug = i => setSuggestions(s=>s.filter((_,j)=>j!==i));
  const setSugField = (i,field,val) => setSuggestions(s=>s.map((x,j)=>j===i?{...x,[field]:val}:x));
  const sugTotal  = suggestions.reduce((s,x)=>s+(parseFloat(x.grams)||0),0);
  const avail     = parseFloat(gramsAvail)||0;

  async function handleSave() {
    if(!tinId||!gramsAvail) return;
    setSaving(true);
    await onSave({
      Tin_ID:tinId, Grams_Available:gramsAvail, Notes:notes, Active:active,
      Suggestions: suggestions.filter(s=>s.name||s.grams).length
        ? JSON.stringify(suggestions.filter(s=>s.name||s.grams).map(s=>({name:s.name,grams:parseFloat(s.grams)||0})))
        : "",
      Brand:selected.Brand||"", Product_Name:selected.Product_Name||"",
      Product_Type:selected.Product_Type||"",
      Origin:selected.Origin||"",
      "Disclosed_Cultivars_(Matcha)":selected["Disclosed_Cultivars_(Matcha)"]||"",
      "_Ceremonial_advertised?_(Matcha)":selected["_Ceremonial_advertised?_(Matcha)"]||"",
      "Organic?_(Matcha)":selected["Organic?_(Matcha)"]||"",
      "First-harvest?_(Matcha)":selected["First-harvest?_(Matcha)"]||"",
      "Price/g":selected["Price/g"]||"", URL:selected.URL||"",
      Tin_Weight_g:selected.Tin_Weight_g||"",
    });
    setSaving(false);
  }

  return <Modal title={initial?"Edit Listing":"Add to Share Drop"} onClose={onClose}>
    <Field label="Select Tin">
      <select style={inpFull} value={tinId} onChange={e=>{ e.stopPropagation(); setTinId(e.target.value); }}>
        <option value="">— choose a tin —</option>
        {options.map((r,i)=>{
          const gl = gramsMap[r.Tin_ID];
          const label = gl!=null ? ` (${Math.round(gl)}g left)` : r.Status ? ` (${r.Status})` : "";
          return <option key={`${r.Tin_ID||"blank"}-${i}`} value={r.Tin_ID}>{r.Brand} — {r.Product_Name}{label}</option>;
        })}
      </select>
    </Field>
    {tinId && <div style={{background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:1,padding:"10px 14px",fontSize:11,color:C.stone,display:"flex",flexDirection:"column",gap:4}}>
      {gramsLeft!=null&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:C.ink,fontWeight:600}}>{Math.round(gramsLeft)}g remaining</span>
        {tinWeight>0&&<span style={{color:C.mist,fontSize:10}}>{Math.round((gramsLeft/tinWeight)*100)}% of {tinWeight}g tin</span>}
      </div>}
      {selected.Origin&&<div><span style={{color:C.mist}}>Origin: </span>{selected.Origin}</div>}
      {selected["Disclosed_Cultivars_(Matcha)"]&&<div><span style={{color:C.mist}}>Cultivar: </span>{selected["Disclosed_Cultivars_(Matcha)"]}</div>}
      {selected["Price/g"]&&<div><span style={{color:C.mist}}>$/g: </span>{selected["Price/g"]}</div>}
      <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
        {["_Ceremonial_advertised?_(Matcha)","Organic?_(Matcha)","First-harvest?_(Matcha)"].map((k,i)=>
          selected[k]?.toLowerCase()==="y"&&<span key={i} style={{fontSize:9,padding:"2px 6px",border:`1px solid ${C.moss}`,color:C.moss,borderRadius:1}}>
            {["Ceremonial","Organic","1st Harvest"][i]}
          </span>
        )}
      </div>
    </div>}

    <div style={g.col2}>
      <Field label="Grams to Offer">
        <div style={{position:"relative"}}>
          <input type="number" min="1" max={gramsLeft||undefined} style={inpFull} value={gramsAvail}
            onChange={e=>setGramsAvail(e.target.value)} placeholder="e.g. 50"/>
          {gramsLeft!=null&&gramsAvail&&parseFloat(gramsAvail)>gramsLeft&&
            <div style={{fontSize:10,color:C.amber,marginTop:3}}>⚠ exceeds estimated {Math.round(gramsLeft)}g remaining</div>}
        </div>
      </Field>
      <Field label="Listed?">
        <div style={{display:"flex",gap:8,paddingTop:4}}>
          {["y","n"].map(opt=>(
            <button key={opt} type="button" onClick={()=>setActive(opt)} style={{
              flex:1,padding:"7px",fontSize:11,borderRadius:1,cursor:"pointer",
              border:`1px solid ${active===opt?C.moss:C.warm}`,
              background:active===opt?C.moss:"transparent",
              color:active===opt?C.cream:C.stone,
            }}>{opt==="y"?"Listed":"Hidden"}</button>
          ))}
        </div>
      </Field>
    </div>

    <Field label="Notes (shown to friends)">
      <input style={inpFull} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. about 60% remaining"/>
    </Field>

    <div style={{marginTop:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:10,color:C.stone,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>
          Suggested Allocations
          <span style={{fontSize:9,color:C.mist,textTransform:"none",letterSpacing:0,marginLeft:6,fontWeight:400}}>prefills grams for named friends</span>
        </div>
        <button type="button" onClick={addSug} style={{...btnS,padding:"3px 10px",fontSize:9}}>+ Add</button>
      </div>
      {suggestions.length===0&&<div style={{fontSize:11,color:C.mist,padding:"4px 0"}}>No suggestions — friends can claim any amount.</div>}
      {suggestions.map((sg,i)=>(
        <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
          <input placeholder="Friend's name" value={sg.name} onChange={e=>setSugField(i,"name",e.target.value)} style={{...inp,flex:2,padding:"6px 10px"}}/>
          <input type="number" min="1" placeholder="g" value={sg.grams} onChange={e=>setSugField(i,"grams",e.target.value)} style={{...inp,width:70,padding:"6px 10px"}}/>
          <button type="button" onClick={()=>removeSug(i)} style={{fontSize:13,color:C.red,background:"none",border:"none",cursor:"pointer",padding:"0 4px"}}>✕</button>
        </div>
      ))}
      {suggestions.length>0&&avail>0&&<div style={{fontSize:10,color:sugTotal>avail?C.red:C.stone,marginTop:4}}>
        {sugTotal}g suggested of {avail}g offered{sugTotal>avail?" — exceeds offered amount!":""}
      </div>}
    </div>

    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:12}}>
      <button style={btnS} onClick={onClose}>Cancel</button>
      <button style={btnP} disabled={saving||!tinId||!gramsAvail} onClick={handleSave}>
        {saving?"Saving…":"Save Listing"}
      </button>
    </div>
  </Modal>;
}
function ShareTab({ raw_data, shareData, setShareData, shareLoading, setShareLoading, shareModal, setShareModal }) {
  const card={background:C.parchment,padding:"22px 26px",borderRadius:2};

  const loadShare = useCallback(async()=>{
    setShareLoading(true);
    try{
      const res = await fetch("/api/share-data");
      const d = await res.json();
      setShareData({listings:d.listings||[],claims:d.claims||[]});
    }catch{}
    setShareLoading(false);
  },[setShareData,setShareLoading]);

  useEffect(()=>{ loadShare(); },[loadShare]);

  const [saveErr, setSaveErr] = useState("");

  async function handleSaveListing(form) {
    setSaveErr("");
    try {
      const payload = shareModal?.listing
        ? { listing:form, rowIndex:shareModal.listing.__rowIndex }
        : { listing:form };
      const res = await fetch("/api/share-data",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const d = await res.json();
      console.log("Share save response:", res.status, d);
      if(!res.ok) throw new Error(d.error||`HTTP ${res.status}`);
      setShareModal(null);
      await loadShare();
    } catch(e){
      console.error("Share save error:", e);
      setSaveErr(e.message);
    }
  }

  async function toggleActive(l) {
    const updated = {...l, Active: l.Active?.toLowerCase()==="y"?"n":"y"};
    await fetch("/api/share-data",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({listing:updated,rowIndex:l.__rowIndex})});
    setShareData(d=>({...d,listings:d.listings.map(x=>x.__rowIndex===l.__rowIndex?updated:x)}));
  }

  const { listings=[], claims=[] } = shareData;

  const claimsByTin  = (tinId,status) => claims.filter(c=>c.Tin_ID===tinId&&(!status||c.Status?.toLowerCase()===status.toLowerCase()));
  const gramsFor     = (tinId,status) => claimsByTin(tinId,status||"claimed").reduce((s,c)=>s+(parseFloat(c.Grams_Claimed)||0),0);

  const allClaimed = claims.filter(c=>c.Status?.toLowerCase()==="claimed");
  const personTotals = {};
  allClaimed.forEach(c=>{
    const g = parseFloat(c.Grams_Claimed)||0;
    if(!personTotals[c.Name]) personTotals[c.Name]={name:c.Name,grams:0,items:[]};
    personTotals[c.Name].grams += g;
    const label = [c.Brand, c.Product_Name].filter(Boolean).join(" — ") || c.Tin_ID;
    personTotals[c.Name].items.push(`${g}g ${label}`);
  });

  return <div style={{display:"flex",flexDirection:"column",gap:24}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <div>
        <div style={{fontSize:18,fontFamily:`'Playfair Display',Georgia,serif`,fontWeight:700,color:C.ink}}>Share Drop</div>
        <div style={{fontSize:11,color:C.stone,marginTop:4}}>
          Friends claim at{" "}
          <a href="/share" target="_blank" rel="noreferrer" style={{color:C.moss}}>your-domain/share ↗</a>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button style={{...btnS,padding:"7px 16px",fontSize:10}} onClick={loadShare}>↺ Refresh</button>
        <button style={{...btnP,padding:"7px 16px",fontSize:10}} onClick={()=>setShareModal({type:"add"})}>+ Add Listing</button>
      </div>
    </div>

    {saveErr&&<div style={{background:"#fce8e8",border:`1px solid ${C.red}`,borderRadius:1,padding:"10px 16px",fontSize:11,color:C.red}}>
      Save error: {saveErr}
    </div>}
    {shareLoading && <div style={{color:C.mist,fontSize:11,padding:"24px 0",textAlign:"center"}}>Loading…</div>}

    {listings.map((l,li)=>{
      const lClaims   = claimsByTin(l.Tin_ID,"claimed");
      const lWaitlist = claimsByTin(l.Tin_ID,"waitlist");
      const claimed   = gramsFor(l.Tin_ID,"claimed");
      const available = parseFloat(l.Grams_Available)||0;
      const remaining = Math.max(available-claimed,0);
      const active    = l.Active?.toLowerCase()==="y";
      const suggestions = parseSuggestions(l.Suggestions);
      return <div key={li} style={{...card,padding:0,overflow:"hidden",opacity:active?1:0.65,border:`1px solid ${C.warm}`}}>
        <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",background:active?C.ink:C.stone}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:C.mist,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{l.Product_Type||"Tea"}</div>
            <div style={{fontSize:15,fontFamily:`'Playfair Display',Georgia,serif`,fontWeight:700,color:C.cream}}>{l.Brand} — {l.Product_Name}</div>
            {l.Notes&&<div style={{fontSize:10,color:C.stone,marginTop:3}}>{l.Notes}</div>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            <div style={{textAlign:"right",fontSize:11,color:C.mist}}>
              <div style={{color:remaining>0?C.sage:C.amber,fontWeight:600}}>{remaining}g left</div>
              <div>{claimed}g / {available}g</div>
            </div>
            <button onClick={()=>toggleActive(l)} style={{padding:"4px 10px",fontSize:9,border:`1px solid ${active?"#5a9e54":C.mist}`,background:"transparent",color:active?"#5a9e54":C.mist,borderRadius:1,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>
              {active?"Listed":"Hidden"}
            </button>
            <button onClick={()=>setShareModal({type:"edit",listing:l})} style={{padding:"4px 10px",fontSize:9,border:`1px solid ${C.mist}`,background:"transparent",color:C.mist,borderRadius:1,cursor:"pointer"}}>
              Edit
            </button>
          </div>
        </div>

        {/* Claims + suggestions table */}
        <div style={{padding:"0 20px"}}>
          {lClaims.length===0&&lWaitlist.length===0&&suggestions.length===0 ? (
            <div style={{padding:"14px 0",fontSize:11,color:C.mist,textAlign:"center"}}>No claims yet</div>
          ) : <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,margin:"4px 0"}}>
            <thead><tr style={{borderBottom:`1px solid ${C.warm}`}}>
              {["","Name","Grams","Ship Est.","Status/Notes","Timestamp","Submitted"].map((h,i)=>(
                <th key={i} style={{padding:"8px 10px",textAlign:"left",fontSize:9,color:C.stone,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:400}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {/* Suggested rows (your plans) */}
              {suggestions.map((s,i)=>{
                const hasClaim = lClaims.some(c=>c.Name?.toLowerCase()===s.name?.toLowerCase());
                return <tr key={`sug-${i}`} style={{borderBottom:`1px solid ${C.warm}`,background:"#f5f8ec"}}>
                  <td style={{padding:"8px 10px",width:18}}>
                    <span title="Suggested by you" style={{fontSize:10,color:C.moss}}>✦</span>
                  </td>
                  <td style={{padding:"8px 10px",fontWeight:600,color:C.moss}}>{s.name||"—"}</td>
                  <td style={{padding:"8px 10px",color:C.moss}}>{s.grams}g</td>
                  <td style={{padding:"8px 10px",fontSize:10}}>{(()=>{const sh=shippingFor(s.grams,l,raw_data);return <><span style={{color:C.moss,fontWeight:600}}>${sh.cost.toFixed(2)}</span><span style={{color:C.mist,display:"block",fontSize:9}}>{sh.method}</span></>;})()} </td>
                  <td style={{padding:"8px 10px"}}>
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:1,background:"#e8f2e0",color:C.moss,border:`1px solid ${C.moss}`,fontWeight:600}}>
                      {hasClaim?"✓ Claimed":"Suggested"}
                    </span>
                  </td>
                  <td style={{padding:"8px 10px",color:C.mist,fontSize:10}}>—</td>
                </tr>;
              })}
              {/* Actual claim rows */}
              {[...lClaims,...lWaitlist].map((c,ci)=>{
                const isSuggested = suggestions.some(s=>s.name?.toLowerCase()===c.Name?.toLowerCase());
                return <tr key={`cl-${ci}`} style={{borderBottom:`1px solid ${C.warm}`,background:ci%2===0?C.cream:C.parchment}}>
                  <td style={{padding:"8px 10px",width:18}}>
                    {isSuggested&&<span title="Matches your suggestion" style={{fontSize:9,color:C.sage}}>✦</span>}
                  </td>
                  <td style={{padding:"8px 10px",fontWeight:600}}>{c.Name}</td>
                  <td style={{padding:"8px 10px"}}>{c.Grams_Claimed}g</td>
                  <td style={{padding:"8px 10px"}}>{(()=>{const sh=shippingFor(parseFloat(c.Grams_Claimed)||0,l,raw_data);return <><span style={{color:C.moss,fontWeight:600}}>${sh.cost.toFixed(2)}</span><span style={{color:C.mist,display:"block",fontSize:9}}>{sh.method}</span></>;})()} </td>
                  <td style={{padding:"8px 10px"}}>
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:1,fontWeight:600,
                      background:c.Status?.toLowerCase()==="claimed"?"#eef4ec":c.Status?.toLowerCase()==="waitlist"?"#fdf8e8":C.parchment,
                      color:c.Status?.toLowerCase()==="claimed"?C.moss:c.Status?.toLowerCase()==="waitlist"?C.gold:C.mist,
                      border:`1px solid ${c.Status?.toLowerCase()==="claimed"?C.moss:c.Status?.toLowerCase()==="waitlist"?C.gold:C.warm}`,
                    }}>{c.Status}</span>
                    {c.Notes&&<span style={{fontSize:10,color:C.stone,marginLeft:6}}>{c.Notes}</span>}
                  </td>
                  <td style={{padding:"8px 10px",color:C.mist,fontSize:10,whiteSpace:"nowrap"}}>{c.Timestamp}</td>
                  <td style={{padding:"8px 10px",fontSize:9}}>{c.Order_Submitted?<span style={{color:C.moss,fontWeight:600}}>✓ {c.Order_Submitted}</span>:<span style={{color:C.mist}}>—</span>}</td>
                </tr>;
              })}
            </tbody>
          </table>}
          <div style={{padding:"8px 0",fontSize:10,color:C.stone,display:"flex",gap:16,flexWrap:"wrap"}}>
            {lClaims.length>0&&<span><strong style={{color:C.ink}}>{lClaims.length}</strong> claimed · <strong style={{color:C.ink}}>{claimed}g</strong></span>}
            {lWaitlist.length>0&&<span style={{color:C.amber}}><strong>{lWaitlist.length}</strong> waitlist</span>}
            {suggestions.length>0&&<span style={{color:C.moss}}>✦ <strong>{suggestions.length}</strong> suggested</span>}
          </div>
        </div>
      </div>;
    })}

    {listings.length===0&&!shareLoading&&<div style={{...card,textAlign:"center",padding:"48px 24px",color:C.mist,border:`1px solid ${C.warm}`}}>
      No listings yet. Click "+ Add Listing" to add items to your share drop.
    </div>}

    {/* Shipping summary */}
    {Object.keys(personTotals).length>0&&<div style={card}>
      <SectionTitle right="claimed items only">Shipping Summary</SectionTitle>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginTop:12}}>
        <thead><tr style={{background:C.ink}}>
          {["Person","Total Grams","Shipping Est.","Items"].map(h=>(
            <th key={h} style={{padding:"10px 14px",textAlign:"left",color:C.mist,fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:400}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {Object.values(personTotals).map((p,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}>
              <td style={{padding:"10px 14px",fontWeight:700}}>{p.name}</td>
              <td style={{padding:"10px 14px"}}>{p.grams}g</td>
              <td style={{padding:"10px 14px",fontWeight:700,color:C.moss}}>
                ${Math.ceil(p.grams/28).toFixed(2)}
                <div style={{fontSize:9,color:C.mist,fontWeight:400}}>{p.methods.join(" + ")}</div>
              </td>
              <td style={{padding:"10px 14px",color:C.stone,fontSize:10,lineHeight:1.6}}>{p.items.join(", ")}</td>
            </tr>
          ))}
          <tr style={{background:C.parchment,borderTop:`2px solid ${C.warm}`}}>
            <td style={{padding:"10px 14px",fontWeight:700}}>Total</td>
            <td style={{padding:"10px 14px",fontWeight:600}}>{Object.values(personTotals).reduce((s,p)=>s+p.grams,0)}g</td>
            <td style={{padding:"10px 14px",fontWeight:700,color:C.moss}}>${Object.values(personTotals).reduce((s,p)=>s+Math.ceil(p.grams/28),0).toFixed(2)}</td>
            <td/>
          </tr>
        </tbody>
      </table>
      <div style={{fontSize:10,color:C.mist,marginTop:10}}>Estimates include ~30g packaging. Replace with actual shipping cost once confirmed.</div>
    </div>}

    {(shareModal?.type==="add"||shareModal?.type==="edit")&&
      <AddListingModal
        raw_data={raw_data}
        initial={shareModal.listing||null}
        onClose={()=>setShareModal(null)}
        onSave={handleSaveListing}
      />}
  </div>;
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
  if(!items.length)return null;
  return <div style={{background:"#fdf8ee",border:`1px solid ${C.gold}`,borderRadius:2,marginBottom:24}}>
    <div onClick={()=>setCollapsed(c=>!c)} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 22px",cursor:"pointer",userSelect:"none"}}>
      <span style={{fontSize:14,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,color:C.ink}}>Pending Items</span>
      <span style={{fontSize:10,background:C.gold,color:C.cream,padding:"2px 8px",borderRadius:1}}>{items.length}</span>
      <span style={{marginLeft:"auto",fontSize:12,color:C.stone}}>{collapsed?"▸ Show":"▾ Hide"}</span>
    </div>
    {!collapsed&&<div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 22px 18px"}}>
      {items.map((r,i)=>{
        const ds=daysSince(r.Date_of_contact||r.Date_received);
        const urgent=ds!==null&&ds>30;
        return <div key={i} onClick={()=>onEdit(r)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:C.cream,borderLeft:`3px solid ${urgent?"#d4854a":C.warm}`,cursor:"pointer",borderRadius:"0 2px 2px 0"}}>
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
    if(!tin.Product_Type?.trim())continue; // skip rows with no type
    if(!isConsumableExt(tin))continue; // skip non-consumables
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
  const mobile = useMobile();
  const g = {
    col1: {display:"grid",gridTemplateColumns:"1fr",gap:12},
    col2: {display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12},
    col3: {display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr",gap:12},
    col3sm: {display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:12},
    col4: {display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:mobile?10:20},
    col5: {display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(5,1fr)",gap:mobile?10:20},
    col6: {display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(6,1fr)",gap:mobile?10:20},
    col21: {display:"grid",gridTemplateColumns:mobile?"1fr":"2fr 1fr",gap:mobile?12:24},
    col12: {display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 2fr",gap:mobile?12:24},
  };
  const pad = mobile ? "16px" : "32px 40px";
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
  const [invSort,setInvSort]=useState({col:"Brand",dir:"asc"});
  const [invCerem,setInvCerem]=useState("All");
  const [invOrganic,setInvOrganic]=useState("All");
  const [invHarvest,setInvHarvest]=useState("All");
  const [invSingle,setInvSingle]=useState("All");
  const [chartSort,setChartSort]=useState("priority-asc");
  const [conRange,setConRange]=useState("30");
  const [conSort,setConSort]=useState({col:"Date",dir:"desc"});
  const [conBrand,setConBrand]=useState("All");
  const [conType,setConType]=useState("All");
  const [conSelf,setConSelf]=useState("All");
  const [postSort,setPostSort]=useState({col:"post_date",dir:"desc"});
  const [vizType,setVizType]=useState("All");
  const [prSearch,setPrSearch]=useState("");
  const [prObtained,setPrObtained]=useState("All");
  const [prSort,setPrSort]=useState({col:"Brand",dir:"asc"});
  const [prTab,setPrTab]=useState("obligations");
  const [shareData,setShareData]=useState({listings:[],claims:[]});
  const [shareLoading,setShareLoading]=useState(false);
  const [shareModal,setShareModal]=useState(null); // {type:"add"|"edit", listing?}
  const [prBrand,setPrBrand]=useState("All");
  const [prType,setPrType]=useState("All");
  const [prStatus,setPrStatus]=useState("All");
  const [prObligOnly,setPrObligOnly]=useState(false);
  const [prAffOnly,setPrAffOnly]=useState(false);
  const [cashMethod,setCashMethod]=useState("All");
  const [cashStatus2,setCashStatus2]=useState("All");
  const [cashYear,setCashYear]=useState("All");
  const [cashSort,setCashSort]=useState({col:"Date",dir:"desc"});
  const [codesSort,setCodesSort]=useState({col:"Brand",dir:"asc"});

  function showToast(msg,type="success"){setToast({msg,type});setTimeout(()=>setToast(null),3500);}

  const loadData=useCallback(async()=>{
    setLoading(true);
    try {
      const data=await apiGet();
      // rowIndex is now set server-side but keep client sync for local updates
      setSheetData(data);
      setLastRefresh(new Date());
      const updates=computeStatusUpdates(data.raw_data,data.daily);
      if(updates.length)setPendingSyncs(updates);
    } catch(e){showToast("Error loading data","error");}
    setLoading(false);
  },[]);

  useEffect(()=>{loadData();},[loadData]);

  // One-time: clear Status from non-consumable received items in the sheet
  useEffect(()=>{
    fetch("/api/private-data",{method:"PUT"})
      .then(r=>r.json())
      .then(d=>{ if(d.fixed>0){ loadData(); } }) // reload if rows were fixed
      .catch(()=>{}); // silent — non-critical
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const {raw_data=[],daily=[],posts=[],cash=[],codes=[]}=sheetData||{};
  const today_d=todayDate();
  const pastDaily=daily.filter(d=>{const dt=parseDate(d.Date);return dt&&dt<=today_d;});
  const selfDaily=pastDaily.filter(isSelfConsumption);
  const vizDaily=vizType==="All"?selfDaily:selfDaily.filter(d=>d.Type===vizType);
  const vizSelfDaily=vizDaily;
  const consumableTins=raw_data.filter(isConsumable);
  const pendingItems=raw_data.filter(r=>r.Status?.trim().toLowerCase()==="pending"&&isConsumableExt(r));
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
  // Fill 0g for every day in range with no entries
  const dailyTrend=(()=>{
    const result=[];
    const end=today_d;
    let cur=new Date(cutoff);
    while(cur<=end){
      const k=fmtDate(cur,true);
      result.push({date:k,grams:+(dayMap[k]||0).toFixed(1)});
      cur=new Date(cur.getTime()+86400000);
    }
    return result;
  })();
  const brandGrams={};
  vizDaily.forEach(d=>{if(!d.Brand)return;brandGrams[d.Brand]=(brandGrams[d.Brand]||0)+parseGrams(d.Grams_Used);});
  const brandConsumption=Object.entries(brandGrams).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([brand,grams])=>({brand:brand.length>16?brand.slice(0,14)+"…":brand,grams}));
  const obtainMap={};
  raw_data.forEach(r=>{const k=r.How_I_obtained||"Unknown";obtainMap[k]=(obtainMap[k]||0)+1;});
  const obtainPie=Object.entries(obtainMap).map(([name,value])=>({name,value}));
  const allBrands=[...new Set(raw_data.map(r=>r.Brand).filter(Boolean))].sort();
  const allStatuses=[...new Set(consumableTins.map(r=>r.Status).filter(Boolean))].sort();
  const allTypes=[...new Set(consumableTins.map(r=>r.Product_Type).filter(Boolean))].sort();

  const filteredRaw=useMemo(()=>{
    let rows=raw_data.filter(r=>{
      if(!isConsumableExt(r))return false; // inventory = consumables only
      if(invCerem!=="All"&&r["_Ceremonial_advertised?_(Matcha)"]!==invCerem)return false;
      if(invOrganic!=="All"&&r["Organic?_(Matcha)"]!==invOrganic)return false;
      if(invHarvest!=="All"&&r["First-harvest?_(Matcha)"]!==invHarvest)return false;
      if(invSingle!=="All"&&r["Single_Cultivar?_(Matcha)"]!==invSingle)return false;
      return (invBrand==="All"||r.Brand===invBrand)&&(invStatus==="All"||r.Status?.trim()===invStatus)&&(invType==="All"||r.Product_Type===invType)&&(!invSearch||Object.values(r).some(v=>v?.toLowerCase?.().includes(invSearch.toLowerCase())));
    });
    if(invSort.col==="priority"){rows=[...rows].sort((a,b)=>tinPriority(a)-tinPriority(b));}
    else{rows=sortRows(rows,invSort.col,invSort.dir);}
    return rows;
  },[raw_data,invBrand,invStatus,invType,invSearch,invSort,invCerem,invOrganic,invHarvest,invSingle]);

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
    return raw_data.filter(r=>isConsumableExt(r)&&(r.Status==="Opened"||r.Status==="Unopened")&&parseFloat(r.Tin_Weight_g)>0)
      .map(r=>{
        const total=parseFloat(r.Tin_Weight_g);
        const used=daily.filter(d=>d.Tin_ID===r.Tin_ID).reduce((s,d)=>s+parseGrams(d.Grams_Used),0);
        const remaining=Math.max(0,total-used);
        const usedCapped=Math.min(used,total);
        return{tin:r,brand:r.Brand,name:r.Product_Name,total,used:usedCapped,remaining,pctUsed:Math.round(usedCapped/total*100)};
      }).sort((a,b)=>{
        const cs=chartSort||"priority-asc";
        const lastDash=cs.lastIndexOf("-");
        const sk=lastDash>0?cs.slice(0,lastDash):cs;
        const sd=lastDash>0?cs.slice(lastDash+1):"asc";
        let cmp=0;
        if(sk==="brand") cmp=a.brand.localeCompare(b.brand);
        else if(sk==="pctUsed") cmp=b.pctUsed-a.pctUsed;
        else if(sk==="weight") cmp=b.total-a.total;
        else cmp=tinPriority(a.tin)-tinPriority(b.tin);
        return sd==="desc"?cmp:-cmp;
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
      // Normalise YYYY-MM-DD date inputs back to MM/DD/YYYY for sheet storage
      const toSheet=v=>v?.match(/^(\d{4})-(\d{2})-(\d{2})$/)?`${v.slice(5,7)}/${v.slice(8,10)}/${v.slice(0,4)}`:v;
      let cleaned=Object.fromEntries(Object.entries(form).map(([k,v])=>[k,DATE_FIELDS.has(k)?toSheet(v):v]));
      // Non-consumables that have been received should not carry a Status value
      if(sheetKey==="raw_data"&&!isConsumableExt(cleaned)&&cleaned.Date_received?.trim()){
        cleaned={...cleaned,Status:""};
      }
      await apiUpdate(sheetName,cleaned.__rowIndex,cleaned);
      setSheetData(d=>({...d,[sheetKey]:d[sheetKey].map(r=>r.__rowIndex===cleaned.__rowIndex?cleaned:r)}));
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

  async function handleCashSave(form){
    setSaving(true);
    try{
      await apiAppend(SHEETS.cash,form);
      setSheetData(d=>({...d,cash:[...d.cash,{...form,__rowIndex:d.cash.length+2}]}));
      setModal(null);showToast("Entry added ✓");
    }catch(e){showToast("Error saving","error");}
    setSaving(false);
  }
  async function handleCodeSave(form){
    setSaving(true);
    try{
      await apiAppend(SHEETS.codes,form);
      setSheetData(d=>({...d,codes:[...d.codes,{...form,__rowIndex:d.codes.length+2}]}));
      setModal(null);showToast("Code added ✓");
    }catch(e){showToast("Error saving","error");}
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
      html,body{width:100%;overflow-x:hidden;}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.parchment}}::-webkit-scrollbar-thumb{background:${C.warm}}
      .hrow:hover{background:${C.parchment}!important;cursor:pointer;}
      .tab-nav{display:flex;gap:4;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
      .tab-nav::-webkit-scrollbar{display:none;}
      .stat-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:20px;}
      .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
      .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
      .grid-2-1{display:grid;grid-template-columns:2fr 1fr;gap:24px;}
      .grid-1-2{display:grid;grid-template-columns:1fr 2fr;gap:24px;}
      .grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;}
      .header-inner{max-width:1400px;margin:0 auto;padding:0 40px;}
      .main-inner{padding:32px 40px;max-width:1400px;margin:0 auto;width:100%;}
      @media(max-width:768px){
        .stat-grid{grid-template-columns:repeat(3,1fr)!important;gap:10px!important;}
        .grid-2{grid-template-columns:1fr!important;}
        .grid-3{grid-template-columns:1fr 1fr!important;}
        .grid-2-1{grid-template-columns:1fr!important;}
        .grid-1-2{grid-template-columns:1fr!important;}
        .grid-5{grid-template-columns:repeat(2,1fr)!important;gap:10px!important;}
        .header-inner{padding:0 16px!important;}
        .main-inner{padding:16px!important;}
        .header-buttons{flex-wrap:wrap;gap:6px!important;}
        .header-title{font-size:18px!important;}
      }
      @media(max-width:480px){
        .stat-grid{grid-template-columns:repeat(2,1fr)!important;}
        .grid-3{grid-template-columns:1fr!important;}
        .grid-5{grid-template-columns:1fr 1fr!important;}
      }
    `}</style>

    {toast&&<div style={{position:"fixed",top:20,right:24,zIndex:2000,background:toast.type==="error"?C.red:C.moss,color:C.cream,padding:"12px 20px",fontSize:12,borderRadius:2}}>{toast.msg}</div>}
    {pendingSyncs.length>0&&<StatusSyncModal updates={pendingSyncs} onApply={handleApplySync} onClose={()=>setPendingSyncs([])} saving={saving}/>}
    {modal==="log"&&<LogEntryModal tins={raw_data} onSave={handleLogSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal==="addTin"&&<AddTinModal onSave={handleAddTinSave} onClose={()=>setModal(null)} saving={saving} existingTins={raw_data}/>}
    {modal==="addCash"&&<AddCashModal onSave={handleCashSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal==="addCode"&&<AddCodeModal onSave={handleCodeSave} onClose={()=>setModal(null)} saving={saving}/>}
    {modal?.type==="edit"&&<EditRowModal row={modal.row} onSave={handleEditSave} onDelete={handleDeleteRow} onClose={()=>setModal(null)} saving={saving}/>}

    <div style={{minHeight:"100vh",background:C.cream,color:C.ink}}>
      <header style={{borderBottom:`1px solid ${C.ink}`}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18,paddingBottom:14,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"baseline",gap:16}}>
              <span style={{fontSize:24,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700}}>抹茶 Analytics</span>
              <span style={{fontSize:11,color:C.stone,letterSpacing:"0.1em",textTransform:"uppercase"}}>Private</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:mobile?6:10,flexWrap:mobile?"wrap":"nowrap"}}>
              {lastRefresh&&!mobile&&<span style={{fontSize:10,color:C.stone}}>↺ {lastRefresh.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>}
              <button onClick={loadData} style={{...sel,background:C.ink,color:C.cream,border:"none",padding:"6px 14px"}}>↻ Refresh</button>
              <button onClick={()=>setModal("log")} style={{...btnP,padding:mobile?"6px 10px":"7px 16px",background:C.moss,fontSize:mobile?10:undefined}}>{mobile?"+ Log":"+ Log Entry"}</button>
              <button onClick={()=>setModal("addTin")} style={{...btnP,padding:mobile?"6px 10px":"7px 16px",fontSize:mobile?10:undefined}}>{mobile?"+ Add":"+ Add Item"}</button>
              <button onClick={()=>signOut({callbackUrl:"/private"})} style={{...btnS,padding:"6px 10px",fontSize:10}}>Sign out</button>
            </div>
          </div>
          <nav style={{display:"flex",gap:4,overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none",borderBottom:`1px solid ${C.warm}`}}>
            {[{id:"overview",label:"Overview"},{id:"consumption",label:"Consumption"},{id:"inventory",label:"Inventory"},{id:"pr",label:"PR & Cost"},{id:"social",label:"Social"},{id:"share",label:"Share Drop"}]
              .map(t=><button key={t.id} style={{...tabStyle(t.id),whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}
          </nav>
        </div>
      </header>

      <main style={{padding:pad,maxWidth:1400,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        {activeTab==="overview"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          {pendingItems.length>0&&<PendingPanel items={pendingItems} onEdit={r=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:SHEETS.raw_data})}/>}
          <div style={g.col6}>
            <Stat label="Total Items" value={totalTins} sub={`${consumableTins.length} tea products`}/>
            <Stat label="Gifted/PR" value={gifted} sub={`${Math.round(gifted/totalTins*100)}%`} accent={C.moss}/>
            <Stat label="Purchased" value={purchased} sub={`$${totalSpend.toFixed(0)} total`}/>
            <Stat label="Avg $/g" value={`$${avgPricePerG}`} sub="tea only"/>
            <Stat label="My Grams" value={`${totalGrams.toFixed(0)}g`} sub={`+${sharedGrams.toFixed(0)}g shared`}/>
            <Stat label="My Daily Avg" value={`${avgDailyG}g`} sub="self-consumption"/>
          </div>
          <div style={g.col21}>
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
          <div style={g.col12}>
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
          <div style={g.col5}>
            <Stat label="My Sessions" value={vizSelfDaily.length} sub={vizType==="All"?`${pastDaily.length-selfDaily.length} shared excluded`:`filtered to ${vizType}`}/>
            <Stat label="My Grams" value={`${totalGrams.toFixed(0)}g`} sub="self only"/>
            <Stat label="Shared" value={`${sharedGrams.toFixed(0)}g`} sub="made for others"/>
            <Stat label="My Daily Avg" value={`${avgDailyG}g`}/>
            <Stat label="Active Days" value={uniqueDays}/>
          </div>

          {/* Daily chart with range toggle */}
          <div style={card}>
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
                <SectionTitle>Daily Grams</SectionTitle>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[["7","7d"],["14","14d"],["30","30d"],["90","90d"],["all","All"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setConRange(v)} style={{padding:"4px 10px",fontSize:10,border:`1px solid ${conRange===v?C.ink:C.warm}`,background:conRange===v?C.ink:"transparent",color:conRange===v?C.cream:C.stone,cursor:"pointer",borderRadius:1,letterSpacing:"0.06em"}}>{l}</button>
                  ))}
                </div>
              </div>
              {/* Type toggle — wraps on mobile */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {["All",...[...new Set(pastDaily.map(d=>d.Type).filter(Boolean))].sort()].map(t=>(
                  <button key={t} onClick={()=>setVizType(t)} style={{padding:"3px 10px",fontSize:10,border:`1px solid ${vizType===t?C.moss:C.warm}`,background:vizType===t?C.moss:"transparent",color:vizType===t?C.cream:C.stone,cursor:"pointer",borderRadius:1,letterSpacing:"0.04em",textTransform:"capitalize"}}>{t}</button>
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

          <div style={g.col2}>
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
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${C.warm}`}}>
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
                      onClick={()=>setModal({type:"edit",row:{...d},sheetKey:"daily",sheetName:SHEETS.daily})}>
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
          {pendingItems.length>0&&<PendingPanel items={pendingItems} onEdit={r=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:SHEETS.raw_data})}/>}

          {/* ── Grams Remaining Chart */}
          {tinGramsData.length>0&&(()=>{
            const BAR_W=tinGramsData.length>20?88:tinGramsData.length>12?104:120;
            const chartW=Math.max(600,tinGramsData.length*BAR_W);
            const MultiLineTick=({x,y,index})=>{
              const d=tinGramsData[index];
              if(!d)return null;
              const wrap=(s,max)=>{const words=s.split(" ");const lines=[];let cur="";for(const w of words){if((cur+" "+w).trim().length>max&&cur){lines.push(cur.trim());cur=w;}else cur=(cur+" "+w).trim();}if(cur)lines.push(cur);return lines.slice(0,2);};
              const all=[...wrap(d.brand,11).map(l=>({text:l,fill:C.stone,size:9,fw:600})),...wrap(d.name,11).map(l=>({text:l,fill:C.mist,size:8,fw:400}))];
              return <g transform={`translate(${x},${y+6})`}>{all.map((l,i)=><text key={i} textAnchor="middle" fill={l.fill} fontSize={l.size} fontWeight={l.fw} dy={i*13}>{l.text}</text>)}</g>;
            };
            const selStyle={background:C.cream,border:`1px solid ${C.warm}`,color:C.ink,padding:"6px 10px",fontSize:11,borderRadius:1,cursor:"pointer"};
            return <div style={{...card}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:6}}>
                <div style={{flex:1}}><SectionTitle>Grams Remaining by Tin</SectionTitle></div>
                <div style={{display:"flex",alignItems:"center",gap:8,paddingBottom:14}}>
                  <span style={{fontSize:10,color:C.stone,letterSpacing:"0.08em",textTransform:"uppercase"}}>Sort</span>
                  <select value={chartSort} onChange={e=>setChartSort(e.target.value)} style={selStyle}>
                    <option value="priority-asc">⚑ Priority</option>
                    <option value="weight-desc">Heaviest → Lightest</option>
                    <option value="weight-asc">Lightest → Heaviest</option>
                    <option value="pctUsed-desc">Most Used → Least</option>
                    <option value="pctUsed-asc">Least Used → Most</option>
                    <option value="brand-asc">Brand A → Z</option>
                    <option value="brand-desc">Brand Z → A</option>
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:14,fontSize:10,color:C.stone,marginBottom:14,flexWrap:"wrap"}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:C.moss,display:"inline-block",borderRadius:1}}/> Remaining</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,background:C.warm,display:"inline-block",borderRadius:1}}/> Used</span>
                <span style={{display:"flex",alignItems:"center",gap:4,color:C.mist,fontStyle:"italic"}}>Dashed = Unopened</span>
              </div>
              {/* Only this inner div scrolls */}
              <div style={{overflowX:"auto",overflowY:"hidden"}}>
                <div style={{width:chartW,height:300}}>
                  <BarChart width={chartW} height={300} data={tinGramsData}
                    margin={{top:4,right:16,left:0,bottom:90}} barCategoryGap="20%">
                    <CartesianGrid stroke={C.warm} strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="brand" tick={<MultiLineTick/>} interval={0} height={90}/>
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

          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {/* Row 1: main filters */}
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              <input value={invSearch} onChange={e=>setInvSearch(e.target.value)} placeholder="Search…"
                style={{...sel,padding:"7px 12px",width:180,background:C.parchment,border:`1px solid ${C.warm}`}}/>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9,color:C.mist,textTransform:"uppercase",letterSpacing:"0.08em"}}>Brand</span>
                <select value={invBrand} onChange={e=>setInvBrand(e.target.value)} style={sel}><option value="All">All</option>{allBrands.map(b=><option key={b}>{b}</option>)}</select></div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9,color:C.mist,textTransform:"uppercase",letterSpacing:"0.08em"}}>Status</span>
                <select value={invStatus} onChange={e=>setInvStatus(e.target.value)} style={sel}><option value="All">All</option>{allStatuses.map(s=><option key={s}>{s}</option>)}</select></div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9,color:C.mist,textTransform:"uppercase",letterSpacing:"0.08em"}}>Type</span>
                <select value={invType} onChange={e=>setInvType(e.target.value)} style={sel}><option value="All">All</option>{allTypes.map(t=><option key={t}>{t}</option>)}</select></div>
              <select value={invSort.col==="priority"?"priority":""} onChange={e=>{if(e.target.value==="priority")setInvSort({col:"priority",dir:"asc"});else if(e.target.value==="expiry")setInvSort({col:"Expiration_Date",dir:"asc"});else if(e.target.value==="received")setInvSort({col:"Date_received",dir:"desc"});}} style={{...sel,borderColor:C.moss,color:C.moss}}>
                <option value="">Sort: Default</option>
                <option value="priority">⚑ Priority</option>
                <option value="expiry">Expiration date</option>
                <option value="received">Recently received</option>
              </select>
              <span style={{fontSize:10,color:C.stone}}>{filteredRaw.length} items</span>
              {(invBrand!=="All"||invStatus!=="All"||invType!=="All"||invSearch||invCerem!=="All"||invOrganic!=="All"||invHarvest!=="All"||invSingle!=="All")&&
                <button style={{...btnS,padding:"5px 12px",fontSize:10,color:C.red,borderColor:C.red}}
                  onClick={()=>{setInvBrand("All");setInvStatus("All");setInvType("All");setInvSearch("");setInvCerem("All");setInvOrganic("All");setInvHarvest("All");setInvSingle("All");}}>Clear all</button>}
              <button style={{...btnS,padding:"5px 12px",fontSize:10,marginLeft:"auto"}} onClick={()=>exportCSV(filteredRaw,"inventory.csv")}>↓ Export CSV</button>
            </div>
            {/* Row 2: matcha characteristic filters */}
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",padding:"6px 0",borderTop:`1px solid ${C.warm}`}}>
              <span style={{fontSize:9,color:C.mist,textTransform:"uppercase",letterSpacing:"0.08em",marginRight:4}}>Matcha characteristics</span>
              {[["Ceremonial","_Ceremonial_advertised?_(Matcha)",invCerem,setInvCerem],
                ["Organic","Organic?_(Matcha)",invOrganic,setInvOrganic],
                ["First Harvest","First-harvest?_(Matcha)",invHarvest,setInvHarvest],
                ["Single Cultivar","Single_Cultivar?_(Matcha)",invSingle,setInvSingle],
              ].map(([label,field,val,setVal])=>(
                <div key={field} style={{display:"flex",alignItems:"center",gap:3}}>
                  <span style={{fontSize:9,color:C.stone}}>{label}:</span>
                  {(field.includes("Single")?["All","yes","no","unknown"]:["All","y","n"]).map(opt=>(
                    <button key={opt} onClick={()=>setVal(opt)} style={{
                      padding:"3px 8px",fontSize:9,borderRadius:1,cursor:"pointer",
                      border:`1px solid ${val===opt?C.moss:C.warm}`,
                      background:val===opt?C.moss:"transparent",
                      color:val===opt?C.cream:C.stone,
                    }}>{opt==="y"?"Yes":opt==="n"?"No":opt==="All"?"All":opt}</button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{...card,padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:C.ink}}>
                {[["Brand","Brand"],["Product_Name","Product"],["Product_Type","Type"],["Status","Status"],["_Ceremonial_advertised?_(Matcha)","Cer."],["Organic?_(Matcha)","Org."],["First-harvest?_(Matcha)","1st Harv."],["Single_Cultivar?_(Matcha)","Single Cult."],["Price/g","$/g"],["Tin_Weight_g","Weight (g)"],["How_I_obtained","Obtained"],["Date_received","Received"],["Expiration_Date","Expires"],["",""]].map(([col,label])=>(
                  col?<Th key={col} label={label} {...thProps(col,invSort,setInvSort)}/>
                     :<th key="act" style={{padding:"10px 14px",color:C.mist,fontSize:9}}></th>
                ))}
              </tr></thead>
              <tbody>
                {filteredRaw.map((r,i)=>{
                  const st=(r.Status?.trim()||"").toLowerCase();
                  const sc=st==="finished"?C.mist:st==="opened"?C.moss:st==="unopened"?C.accent:st==="pending"?C.gold:C.stone;
                  const stBold=st==="opened"||st==="pending"||st==="unopened";
                  const VALID_STATUSES=new Set(["opened","unopened","pending","finished","gave away"]);
                  const stLabel=VALID_STATUSES.has(st)?(r.Status.trim().charAt(0).toUpperCase()+r.Status.trim().slice(1)):st?`⚠ ${r.Status.trim()}`:"—";
                  const cons=isConsumableExt(r);
                  const isMat=r.Product_Type==="Matcha";
                  // expiry computed inline via getExpiry()
                  return <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}
                    onClick={()=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:SHEETS.raw_data})}>
                    <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                    <td style={{padding:"9px 14px",color:C.stone,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.Product_Name}</td>
                    <td style={{padding:"9px 14px"}}><span style={{fontSize:9,padding:"2px 6px",background:cons?C.parchment:"#f0f0e8",border:`1px solid ${C.warm}`,borderRadius:1}}>{r.Product_Type}</span></td>
                    <td style={{padding:"9px 14px"}}>{cons?<span style={{color:sc,fontWeight:600}}>{r.Status}</span>:<span style={{color:C.mist,fontSize:10}}>—</span>}</td>
                    {[["_Ceremonial_advertised?_(Matcha)"],["Organic?_(Matcha)"],["First-harvest?_(Matcha)"]].map(([f])=>(
                      <td key={f} style={{padding:"9px 14px",textAlign:"center"}}>
                        {isMat?r[f]==="y"?<span style={{color:C.moss,fontWeight:700}}>✓</span>:<span style={{color:C.mist}}>—</span>:<span style={{color:C.mist,fontSize:9}}>n/a</span>}
                      </td>
                    ))}
                    <td style={{padding:"9px 14px",textAlign:"center",fontSize:10,color:C.stone}}>
                      {isMat?(r["Single_Cultivar?_(Matcha)"]||"—"):<span style={{color:C.mist,fontSize:9}}>n/a</span>}
                    </td>
                    <td style={{padding:"9px 14px"}}>{r["Price/g"]||"—"}</td>
                    <td style={{padding:"9px 14px"}}>{r.Tin_Weight_g?Math.round(parseFloat(r.Tin_Weight_g)):"—"}</td>
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
        {activeTab==="pr"&&(()=>{
          const fmtPrice = v => { const n=parsePrice(v); return n>0?`$${n.toFixed(0)}`:"—"; };
          const fmtAmt   = v => { const n=parsePrice(v); return n>0?`$${n.toFixed(2)}`:"—"; };

          // ── Cash filters
          const cashYears = ["All",...[...new Set(cash.map(r=>r.Date?.slice(r.Date?.length-4)).filter(v=>v?.match(/^\d{4}$/)))].sort().reverse()];
          const filteredCash = cash.filter(r => {
            const yearMatch = cashYear==="All"||r.Date?.endsWith(cashYear)||r.Date?.startsWith(cashYear);
            const methodMatch = cashMethod==="All"||r.Method===cashMethod;
            const statusMatch = cashStatus2==="All"||r.Status?.toLowerCase()===cashStatus2.toLowerCase();
            return yearMatch&&methodMatch&&statusMatch;
          });
          const sortedCash = sortRows(filteredCash, cashSort.col, cashSort.dir);
          const cashTotal  = filteredCash.reduce((s,r)=>s+parsePrice(r.Amount),0);
          const cashPaid   = filteredCash.filter(r=>r.Status?.toLowerCase()==="paid").reduce((s,r)=>s+parsePrice(r.Amount),0);
          const cashPending= filteredCash.filter(r=>r.Status?.toLowerCase()!=="paid").reduce((s,r)=>s+parsePrice(r.Amount),0);

          // ── PR filters
          const prBrands   = ["All",...[...new Set(raw_data.filter(r=>r.How_I_obtained&&r.How_I_obtained!=="Purchased").map(r=>r.Brand).filter(Boolean))].sort()];
          const prTypes    = ["All",...[...new Set(raw_data.filter(r=>r.How_I_obtained&&r.How_I_obtained!=="Purchased").map(r=>r.Product_Type).filter(Boolean))].sort()];
          const prStatuses = ["All",...[...new Set(raw_data.filter(r=>r.How_I_obtained&&r.How_I_obtained!=="Purchased").map(r=>r.Status).filter(Boolean))].sort()];
          const obtainedOptions = ["All",...[...new Set(raw_data.map(r=>r.How_I_obtained).filter(Boolean))].sort()];
          const prRows = raw_data.filter(r => r.How_I_obtained && r.How_I_obtained!=="Purchased");
          const filteredPr = prRows.filter(r => {
            if(prBrand!=="All"&&r.Brand!==prBrand) return false;
            if(prType!=="All"&&r.Product_Type!==prType) return false;
            if(prStatus!=="All"&&r.Status!==prStatus) return false;
            if(prObtained!=="All"&&r.How_I_obtained!==prObtained) return false;
            if(prObligOnly&&!r["Obligation?"]?.trim()) return false;
            if(prAffOnly&&!hasAffiliate(r)) return false;
            if(prSearch&&![r.Brand,r.Product_Name,r["Obligation?"],r.Origin].some(v=>v?.toLowerCase().includes(prSearch.toLowerCase()))) return false;
            return true;
          });
          const sortedPr = sortRows(filteredPr, prSort.col, prSort.dir);

          // ── Codes
          const affiliateCodes = codes.filter(r=>r.Brand||r.Code);
          const sortedCodes = sortRows(affiliateCodes, codesSort.col, codesSort.dir);

          const prHasFilter = prSearch||prBrand!=="All"||prType!=="All"||prStatus!=="All"||prObtained!=="All"||prObligOnly||prAffOnly;
          const subTabStyle = t => ({
            padding:"8px 18px", border:"none", fontSize:10, letterSpacing:"0.12em",
            textTransform:"uppercase", cursor:"pointer",
            background:"transparent", color:prTab===t?C.ink:C.stone,
            borderBottom:prTab===t?`2px solid ${C.ink}`:"2px solid transparent",
            borderRadius:0,
          });

          return <div style={{display:"flex",flexDirection:"column",gap:24}}>
            {pendingItems.length>0&&<PendingPanel items={pendingItems} onEdit={r=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:SHEETS.raw_data})}/>}

            {/* Stats */}
            <div style={g.col5}>
              <Stat label="PR / Gifted" value={gifted} sub={`${Math.round(gifted/Math.max(totalTins,1)*100)}% of all items`} accent={C.moss}/>
              <Stat label="Purchased" value={purchased} sub={`$${totalSpend.toFixed(0)} total`}/>
              <Stat label="Obligations" value={raw_data.filter(r=>r["Obligation?"]?.trim()).length} sub="required posts"/>
              <Stat label="Affiliates" value={codes.filter(r=>r["Affiliate?"]?.toLowerCase()==="y"&&(r.Brand||r.Code)).length} sub="discount codes"/>
              <Stat label="Cash (All Time)" value={`$${cash.reduce((s,r)=>s+parsePrice(r.Amount),0).toFixed(0)}`} sub={`$${cash.filter(r=>r.Status?.toLowerCase()==="paid").reduce((s,r)=>s+parsePrice(r.Amount),0).toFixed(0)} paid`} accent={C.moss}/>
            </div>

            {/* Sub-nav */}
            <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.warm}`}}>
              {[["obligations","PR Items"],["cash","Cash & Payments"],["codes","Codes & Links"]].map(([t,l])=>(
                <button key={t} onClick={()=>setPrTab(t)} style={subTabStyle(t)}>{l}</button>
              ))}
            </div>

            {/* ── PR Items ── */}
            {prTab==="obligations"&&<>
              {/* Filters */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                  <input value={prSearch} onChange={e=>setPrSearch(e.target.value)} placeholder="Search…"
                    style={{...sel,padding:"6px 10px",width:170,background:C.parchment,border:`1px solid ${C.warm}`}}/>
                  {/* Quick toggle pills */}
                <div style={{display:"flex",gap:6}}>
                  {[[prObligOnly,setPrObligOnly,"Has Obligation"],[prAffOnly,setPrAffOnly,"Affiliate"]].map(([val,setVal,label])=>(
                    <button key={label} onClick={()=>setVal(!val)} style={{
                      padding:"4px 10px",fontSize:10,borderRadius:1,cursor:"pointer",
                      border:`1px solid ${val?C.moss:C.warm}`,
                      background:val?C.moss:"transparent",
                      color:val?C.cream:C.stone,
                    }}>{label}</button>
                  ))}
                </div>
                {[["Brand",prBrands,prBrand,setPrBrand],["Type",prTypes,prType,setPrType],["How",obtainedOptions,prObtained,setPrObtained],["Status",prStatuses,prStatus,setPrStatus]].map(([label,opts,val,setVal])=>(
                    <div key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:9,color:C.mist,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
                      <select value={val} onChange={e=>setVal(e.target.value)} style={sel}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  {prHasFilter&&<button style={{...btnS,padding:"4px 10px",fontSize:10,color:C.red,borderColor:C.red}}
                    onClick={()=>{setPrSearch("");setPrBrand("All");setPrType("All");setPrStatus("All");setPrObtained("All");setPrObligOnly(false);setPrAffOnly(false);}}>Clear</button>}
                  <span style={{fontSize:10,color:C.stone,marginLeft:4}}>{sortedPr.length} items</span>
                </div>
              </div>
              <div style={{...card,padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:C.ink}}>
                    {[["Brand","Brand"],["Product_Name","Product"],["Product_Type","Type"],["Retail_Price","Value"],["How_I_obtained","How Obtained"],["Obligation?","Obligation"],["Due_date-Post","Due Date"],["Date_received","Received"],["Status","Status"],["",""]].map(([col,label])=>(
                      col?<Th key={col} label={label} {...thProps(col,prSort,setPrSort)}/>
                        :<th key="act" style={{padding:"10px 14px",background:C.ink}}></th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sortedPr.map((r,i)=>{
                      const dueDate=r["Due_date-Post"]||r["Due_date-Post2"]||"";
                      const du=daysUntil(dueDate);
                      const overdue=du!==null&&du<0;
                      const soon=du!==null&&du>=0&&du<14;
                      const cons=isConsumableExt(r);
                      return <tr key={i} className="hrow"
                        style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}
                        onClick={()=>setModal({type:"edit",row:r,sheetKey:"raw_data",sheetName:SHEETS.raw_data})}>
                        <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                        <td style={{padding:"9px 14px",color:C.stone,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.Product_Name}</td>
                        <td style={{padding:"9px 14px"}}><span style={{fontSize:9,padding:"2px 6px",background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:1}}>{r.Product_Type||"—"}</span></td>
                        <td style={{padding:"9px 14px",fontWeight:600,color:C.moss}}>{fmtPrice(r.Retail_Price)}</td>
                        <td style={{padding:"9px 14px",fontSize:10,color:C.stone}}>{r.How_I_obtained}</td>
                        <td style={{padding:"9px 14px"}}>{r["Obligation?"]?.trim()||<span style={{color:C.mist}}>—</span>}</td>
                        <td style={{padding:"9px 14px",color:overdue?C.red:soon?"#d4854a":C.stone,fontWeight:overdue||soon?700:400,whiteSpace:"nowrap"}}>
                          {dueDate?`${fmtDate(dueDate,true)}${overdue?" ✕":soon?` (${du}d)`:""}`:"—"}
                        </td>
                        <td style={{padding:"9px 14px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(r.Date_received,true)||"—"}</td>
                        <td style={{padding:"9px 14px"}}>{(()=>{
                          const s=(r.Status?.trim()||"").toLowerCase();
                          const VALID=new Set(["opened","unopened","pending","finished","gave away"]);
                          const label=VALID.has(s)?(r.Status.trim().charAt(0).toUpperCase()+r.Status.trim().slice(1)):s?"⚠ "+r.Status.trim():"—";
                          const col=s==="finished"?C.mist:s==="opened"?C.moss:s==="pending"?C.gold:s==="unopened"?C.accent:C.stone;
                          const bold=s==="opened"||s==="pending"||s==="unopened";
                          return <span style={{color:col,fontWeight:bold?600:400}}>{label}</span>;
                        })()}</td>
                        <td style={{padding:"9px 14px",color:C.mist,fontSize:10}}>edit →</td>
                      </tr>;
                    })}
                    {sortedPr.length===0&&<tr><td colSpan={10} style={{padding:"24px",textAlign:"center",color:C.mist,fontSize:11}}>No items match filters</td></tr>}
                  </tbody>
                </table>
              </div>
            </>}

            {/* ── Cash & Payments ── */}
            {prTab==="cash"&&<>
              {/* Cash filters */}
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                {[["Year",cashYears,cashYear,setCashYear],["Method",["All",...[...new Set(cash.map(r=>r.Method).filter(Boolean))].sort()],cashMethod,setCashMethod],["Status",["All","Paid","Pending","Unpaid"],cashStatus2,setCashStatus2]].map(([label,opts,val,setVal])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:9,color:C.mist,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
                    <select value={val} onChange={e=>setVal(e.target.value)} style={sel}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                {(cashYear!=="All"||cashMethod!=="All"||cashStatus2!=="All")&&
                  <button style={{...btnS,padding:"4px 8px",fontSize:9,color:C.red,borderColor:C.red}}
                    onClick={()=>{setCashYear("All");setCashMethod("All");setCashStatus2("All");}}>Clear</button>}
                <span style={{fontSize:10,color:C.stone}}>{filteredCash.length} entries</span>
                <button style={{...btnP,padding:"6px 14px",fontSize:10,marginLeft:"auto"}} onClick={()=>setModal("addCash")}>+ Add Entry</button>
              </div>
              {/* Summary cards */}
              <div style={g.col3}>
                {[["Paid","#e8f2e8",C.moss,cashPaid],["Pending","#fdf8e8",C.gold,cashPending],["Total",C.parchment,C.ink,cashTotal]].map(([label,bg,col,val])=>(
                  <div key={label} style={{...card,padding:"18px 22px",background:bg}}>
                    <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:C.stone,marginBottom:6}}>{label}{cashYear!=="All"?` (${cashYear})`:""}</div>
                    <div style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif",color:col}}>${val.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{...card,padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:C.ink}}>
                    {[["Date","Date"],["Brand","Brand"],["Type","Type"],["Method","Method"],["Amount","Amount"],["Status","Status"],["",""]].map(([col,label])=>(
                      col
                        ?<Th key={col} label={label} {...thProps(col,cashSort,setCashSort)}/>
                        :<th key="act" style={{padding:"10px 14px",background:C.ink}}></th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sortedCash.length===0&&<tr><td colSpan={7} style={{padding:"24px",textAlign:"center",color:C.mist,fontSize:11}}>No records</td></tr>}
                    {sortedCash.map((r,i)=>(
                      <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}
                        onClick={()=>setModal({type:"edit",row:r,sheetKey:"cash",sheetName:SHEETS.cash})}>
                        <td style={{padding:"9px 14px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(r.Date,true)||<span style={{color:C.mist}}>—</span>}</td>
                        <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                        <td style={{padding:"9px 14px",color:C.stone}}>{r.Type}</td>
                        <td style={{padding:"9px 14px",color:C.stone}}>{r.Method}</td>
                        <td style={{padding:"9px 14px",fontWeight:700,color:C.moss,textAlign:"right"}}>{fmtAmt(r.Amount)}</td>
                        <td style={{padding:"9px 14px"}}>
                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:1,fontWeight:600,
                            background:r.Status?.toLowerCase()==="paid"?"#e8f2e8":C.parchment,
                            color:r.Status?.toLowerCase()==="paid"?C.moss:C.gold,
                            border:`1px solid ${r.Status?.toLowerCase()==="paid"?C.moss:C.gold}`}}>
                            {r.Status||"—"}
                          </span>
                        </td>
                        <td style={{padding:"9px 14px",color:C.mist,fontSize:10}}>edit →</td>
                      </tr>
                    ))}
                    {sortedCash.length>0&&<tr style={{background:C.parchment,borderTop:`2px solid ${C.warm}`}}>
                      <td colSpan={4} style={{padding:"10px 14px",fontSize:10,color:C.stone,fontWeight:600,textAlign:"right"}}>
                        Total {cashYear!=="All"?cashYear:"all time"}
                      </td>
                      <td style={{padding:"10px 14px",fontWeight:700,color:C.moss,textAlign:"right",fontSize:13}}>${cashTotal.toFixed(2)}</td>
                      <td colSpan={2} style={{padding:"10px 14px",fontSize:10,color:C.stone}}>
                        {cashPaid>0&&<span style={{color:C.moss}}>${cashPaid.toFixed(2)} paid</span>}
                        {cashPending>0&&<span style={{color:C.gold,marginLeft:8}}>${cashPending.toFixed(2)} pending</span>}
                      </td>
                    </tr>}
                  </tbody>
                </table>
              </div>
            </>}

            {/* ── Codes & Links ── */}
            {prTab==="codes"&&<>
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button style={{...btnP,padding:"6px 14px",fontSize:10}} onClick={()=>setModal("addCode")}>+ Add Code</button>
              </div>
              <div style={{...card,padding:0,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:C.ink}}>
                    {[["Brand","Brand"],["Code","Code"],["Discount","Discount"],["Affiliate?","Affiliate"],["Link","Shop Link"],["Dashboard_URL","Dashboard"],["",""]].map(([col,label])=>(
                      col
                        ?<Th key={col} label={label} {...thProps(col,codesSort,setCodesSort)}/>
                        :<th key="act" style={{padding:"10px 14px",background:C.ink}}></th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sortedCodes.length===0&&<tr><td colSpan={7} style={{padding:"24px",textAlign:"center",color:C.mist,fontSize:11}}>No codes found</td></tr>}
                    {sortedCodes.map((r,i)=>(
                      <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}
                        onClick={()=>setModal({type:"edit",row:r,sheetKey:"codes",sheetName:SHEETS.codes})}>
                        <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                        <td style={{padding:"9px 14px"}}>
                          <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,letterSpacing:"0.05em",
                            color:C.ink,background:C.parchment,border:`1px solid ${C.warm}`,padding:"3px 10px",borderRadius:1}}>
                            {r.Code||"—"}
                          </span>
                        </td>
                        <td style={{padding:"9px 14px",color:C.moss,fontWeight:600}}>{r.Discount||"—"}</td>
                        <td style={{padding:"9px 14px"}}>
                          {r["Affiliate?"]?.toLowerCase()==="y"
                            ?<span style={{color:C.moss,fontWeight:600,fontSize:10}}>✓ Yes</span>
                            :<span style={{color:C.mist,fontSize:10}}>—</span>}
                        </td>
                        <td style={{padding:"9px 14px"}}>{r.Link
                          ?<a href={r.Link} target="_blank" rel="noreferrer" style={{color:C.moss,fontSize:10,textDecoration:"none"}} onClick={e=>e.stopPropagation()}>↗ Shop</a>
                          :"—"}</td>
                        <td style={{padding:"9px 14px"}}>{r.Dashboard_URL
                          ?<a href={r.Dashboard_URL} target="_blank" rel="noreferrer" style={{color:C.stone,fontSize:10,textDecoration:"none"}} onClick={e=>e.stopPropagation()}>↗ Dashboard</a>
                          :"—"}</td>
                        <td style={{padding:"9px 14px",color:C.mist,fontSize:10}}>edit →</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>}
          </div>;
        })()}

        {/* ── SOCIAL ─────────────────────────────────────────────────── */}
        {activeTab==="social"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          <div style={g.col4}>
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
          <div style={g.col2}>
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
                    onClick={()=>setModal({type:"edit",row:p,sheetKey:"posts",sheetName:SHEETS.posts})}>
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

        {/* ── SHARE DROP ──────────────────────────────────────────────── */}
        {activeTab==="share"&&<ShareTab
          raw_data={raw_data}
          shareData={shareData}
          setShareData={setShareData}
          shareLoading={shareLoading}
          setShareLoading={setShareLoading}
          shareModal={shareModal}
          setShareModal={setShareModal}
        />}
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

"use client";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import {
  C, PIE_COLORS, CONSUMABLE_TYPES, isConsumable, parseGrams, parsePrice,
  fmtDate, todayDate, getExpiry, tinPriority, daysUntil, sortRows,
  sel, btnS, YEAR_START,
} from "./components/shared";

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
function Th({label,col,sortCol,sortDir,onSort}) {
  const active=sortCol===col;
  return <th onClick={()=>onSort(col)} style={{textAlign:"left",padding:"10px 14px",color:active?C.cream:C.mist,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:400,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:active?"rgba(255,255,255,0.08)":"transparent"}}>
    {label} {active?(sortDir==="asc"?"↑":"↓"):""}
  </th>;
}
const TT=({active,payload,label,fmt})=>{
  if(!active||!payload?.length)return null;
  return <div style={{background:C.ink,color:C.cream,padding:"10px 14px",fontSize:11,borderRadius:2,lineHeight:1.7}}>
    <div style={{opacity:0.6,marginBottom:4}}>{label}</div>
    {payload.map((p,i)=><div key={i}>{p.name}: <strong>{fmt?fmt(p.value):p.value}</strong></div>)}
  </div>;
};

export default function PublicDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [invSearch, setInvSearch] = useState("");
  const [invBrand, setInvBrand] = useState("All");
  const [invStatus, setInvStatus] = useState("All");
  const [invType, setInvType] = useState("All");
  const [invSort, setInvSort] = useState({col:"Date_received",dir:"desc"});
  const [chartSort, setChartSort] = useState("priority");

  useEffect(() => {
    fetch("/api/public-data")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  }, []);

  const raw_data = data?.raw_data || [];
  const consumableTins = raw_data.filter(isConsumable);
  const today_d = todayDate();

  const allBrands = useMemo(()=>[...new Set(raw_data.map(r=>r.Brand).filter(Boolean))].sort(),[raw_data]);
  const allStatuses = useMemo(()=>[...new Set(consumableTins.map(r=>r.Status).filter(Boolean))].sort(),[consumableTins]);
  const allTypes = useMemo(()=>[...new Set(raw_data.map(r=>r.Product_Type).filter(Boolean))].sort(),[raw_data]);

  const filteredRaw = useMemo(() => {
    let rows = raw_data.filter(r => {
      if(invStatus!=="All"&&!isConsumable(r))return false;
      return (invBrand==="All"||r.Brand===invBrand)&&
        (invStatus==="All"||r.Status===invStatus)&&
        (invType==="All"||r.Product_Type===invType)&&
        (!invSearch||Object.values(r).some(v=>v?.toLowerCase?.().includes(invSearch.toLowerCase())));
    });
    if(invSort.col==="priority") {
      rows=[...rows].sort((a,b)=>tinPriority(a)-tinPriority(b));
    } else {
      rows=sortRows(rows,invSort.col,invSort.dir);
    }
    return rows;
  },[raw_data,invBrand,invStatus,invType,invSearch,invSort]);

  const tinGramsData = useMemo(() => {
    return raw_data
      .filter(r=>isConsumable(r)&&(r.Status==="Opened"||r.Status==="Unopened")&&parseFloat(r.Tin_Weight_g)>0)
      .map(r => {
        const total=parseFloat(r.Tin_Weight_g);
        // Public view: no consumption data, so show full bar as remaining
        return { tin:r, brand:r.Brand, name:r.Product_Name, total, used:0, remaining:total, pctUsed:0 };
      })
      .sort((a,b)=>{
        if(chartSort==="brand")return a.brand.localeCompare(b.brand);
        return tinPriority(a.tin)-tinPriority(b.tin);
      });
  },[raw_data,chartSort]);

  const obtainMap = {};
  raw_data.forEach(r=>{const k=r.How_I_obtained||"Unknown";obtainMap[k]=(obtainMap[k]||0)+1;});
  const obtainPie = Object.entries(obtainMap).map(([name,value])=>({name,value}));

  const stockCounts = ["Opened","Unopened","Finished","Pending","Gave Away"].reduce((acc,s)=>{
    const n=consumableTins.filter(r=>r.Status===s).length;
    if(n>0)acc[s]=n; return acc;
  },{});

  const totalTins = raw_data.length;
  const gifted = raw_data.filter(r=>r.How_I_obtained?.toLowerCase().includes("gift")||r.How_I_obtained?.toLowerCase().includes("pr")).length;

  const tabStyle = t => ({padding:"8px 18px",border:"none",background:activeTab===t?C.ink:"transparent",color:activeTab===t?C.cream:C.stone,cursor:"pointer",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",borderRadius:1,transition:"all 0.15s"});
  const card = {background:C.parchment,padding:"22px 26px",borderRadius:2};

  if(loading) return <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
    <div style={{fontSize:32,fontFamily:"'Playfair Display',Georgia,serif",color:C.ink}}>抹茶</div>
    <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:C.stone}}>Loading…</div>
  </div>;

  if(error) return <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{color:C.red,fontSize:13}}>{error}</div>
  </div>;

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.parchment}}::-webkit-scrollbar-thumb{background:${C.warm}}
      .hrow:hover{background:${C.parchment}!important;cursor:pointer;}
    `}</style>

    <div style={{minHeight:"100vh",background:C.cream,color:C.ink}}>
      <header style={{borderBottom:`1px solid ${C.ink}`}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 40px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18,paddingBottom:14,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"baseline",gap:16}}>
              <span style={{fontSize:24,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700}}>抹茶 Collection</span>
            </div>
            <a href="/private" style={{fontSize:10,color:C.stone,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",border:`1px solid ${C.warm}`,padding:"5px 12px",borderRadius:1}}>Owner Login →</a>
          </div>
          <nav style={{display:"flex",gap:4}}>
            {[{id:"overview",label:"Overview"},{id:"inventory",label:"Collection"}]
              .map(t=><button key={t.id} style={tabStyle(t.id)} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}
          </nav>
        </div>
      </header>

      <main style={{padding:"32px 40px",maxWidth:1400,margin:"0 auto",width:"100%"}}>

        {activeTab==="overview"&&<div style={{display:"flex",flexDirection:"column",gap:28}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            <Stat label="Total Items" value={totalTins} sub={`${consumableTins.length} tea products`}/>
            <Stat label="Gifted / PR" value={gifted} sub={`${totalTins?Math.round(gifted/totalTins*100):0}% of collection`} accent={C.moss}/>
            <Stat label="Opened" value={stockCounts["Opened"]||0} sub="currently in use"/>
            <Stat label="Unopened" value={stockCounts["Unopened"]||0} sub="waiting"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
            <div style={card}>
              <SectionTitle>How Obtained</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={obtainPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                  {obtainPie.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Pie><Tooltip content={<TT/>}/></PieChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexWrap:"wrap",gap:"4px 14px",marginTop:8}}>
                {obtainPie.map((item,i)=><span key={i} style={{fontSize:10,color:C.stone,display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],display:"inline-block"}}/>{item.name} ({item.value})
                </span>)}
              </div>
            </div>
            <div style={card}>
              <SectionTitle>Stock</SectionTitle>
              {Object.entries(stockCounts).map(([s,n])=>(
                <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.warm}`}}>
                  <span style={{fontSize:12,color:C.stone}}>{s}</span>
                  <span style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',Georgia,serif"}}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grams chart — public shows tin weights only, no consumption data */}
          {tinGramsData.length>0&&(()=>{
            const BAR_W=tinGramsData.length>20?72:tinGramsData.length>12?88:100;
            const chartW=Math.max(600,tinGramsData.length*BAR_W);
            const TwoLineTick=({x,y,index})=>{
              const d=tinGramsData[index];
              if(!d)return null;
              const wrap=(s,max)=>{if(s.length<=max)return[s];const idx=s.lastIndexOf(" ",max);return idx>0?[s.slice(0,idx),s.slice(idx+1)]:[s.slice(0,max),s.slice(max)];};
              const lines=[...wrap(d.brand,16).map(l=>({text:l,fill:C.stone,size:9})),...wrap(d.name,16).map(l=>({text:l,fill:C.mist,size:8}))];
              return <g transform={`translate(${x},${y+6})`}>{lines.map((l,i)=><text key={i} textAnchor="middle" fill={l.fill} fontSize={l.size} dy={i*13}>{l.text}</text>)}</g>;
            };
            return <div style={card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
                <SectionTitle>Collection by Tin Weight</SectionTitle>
                <div style={{display:"flex",gap:5}}>
                  {[["priority","⚑ Priority"],["brand","Brand"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setChartSort(v)} style={{padding:"3px 9px",fontSize:10,border:`1px solid ${chartSort===v?C.ink:C.warm}`,background:chartSort===v?C.ink:"transparent",color:chartSort===v?C.cream:C.stone,cursor:"pointer",borderRadius:1}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{overflowX:"auto",overflowY:"hidden"}}>
                <div style={{width:chartW,height:300}}>
                  <BarChart width={chartW} height={300} data={tinGramsData} margin={{top:4,right:16,left:0,bottom:70}} barCategoryGap="20%">
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
                        <div style={{fontSize:10,opacity:0.6,marginTop:4,display:"flex",justifyContent:"space-between",gap:12}}>
                          <span>{d?.tin?.Status}</span>
                          {exp&&<span style={{color:du<30?C.red:du<120?C.amber:C.mist}}>{exp.estimated?"est. ":""}{fmtDate(exp.date,true)}{du<0?" ✕":du<120?` (${du}d)`:""}</span>}
                        </div>
                      </div>;
                    }}/>
                    <Bar dataKey="total" fill={C.moss}
                      shape={(props)=>{
                        const{x,y,width,height,payload}=props;
                        const isUnopened=payload?.tin?.Status==="Unopened";
                        return <g>
                          <rect x={x} y={y} width={width} height={height} fill={C.moss} rx={2} fillOpacity={isUnopened?0.4:1}/>
                          {isUnopened&&<rect x={x} y={y} width={width} height={height} fill="none" stroke={C.moss} strokeWidth={1.5} strokeDasharray="3 2" rx={2}/>}
                        </g>;
                      }}/>
                  </BarChart>
                </div>
              </div>
            </div>;
          })()}
        </div>}

        {activeTab==="inventory"&&<div style={{display:"flex",flexDirection:"column",gap:24}}>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <input value={invSearch} onChange={e=>setInvSearch(e.target.value)} placeholder="Search…"
              style={{...sel,padding:"7px 12px",width:200,background:C.parchment,border:`1px solid ${C.warm}`}}/>
            <select value={invBrand} onChange={e=>setInvBrand(e.target.value)} style={sel}><option>All</option>{allBrands.map(b=><option key={b}>{b}</option>)}</select>
            <select value={invStatus} onChange={e=>setInvStatus(e.target.value)} style={sel}><option>All</option>{allStatuses.map(s=><option key={s}>{s}</option>)}</select>
            <select value={invType} onChange={e=>setInvType(e.target.value)} style={sel}><option>All</option>{allTypes.map(t=><option key={t}>{t}</option>)}</select>
            <span style={{fontSize:10,color:C.stone}}>{filteredRaw.length} items</span>
          </div>
          <div style={{background:C.parchment,borderRadius:2,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:C.ink}}>
                {[["Brand","Brand"],["Product_Name","Product"],["Product_Type","Type"],["Status","Status"],["Origin","Origin"],["Disclosed_Cultivars_(Matcha)","Cultivars"],["Tin_Weight_g","Weight"],["Date_received","Received"]].map(([col,label])=>(
                  <Th key={col} label={label} col={col} sortCol={invSort.col} sortDir={invSort.dir}
                    onSort={c=>setInvSort(s=>({col:c,dir:s.col===c&&s.dir==="asc"?"desc":"asc"}))}/>
                ))}
              </tr></thead>
              <tbody>
                {filteredRaw.map((r,i)=>{
                  const sc=r.Status==="Finished"?C.mist:r.Status==="Opened"?C.moss:r.Status==="Unopened"?C.accent:r.Status==="Pending"?C.gold:C.stone;
                  return <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}>
                    <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                    <td style={{padding:"9px 14px",color:C.stone}}>{r.Product_Name}</td>
                    <td style={{padding:"9px 14px"}}><span style={{fontSize:9,padding:"2px 6px",background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:1}}>{r.Product_Type}</span></td>
                    <td style={{padding:"9px 14px"}}>{isConsumable(r)?<span style={{color:sc,fontWeight:600}}>{r.Status}</span>:<span style={{color:C.mist,fontSize:10}}>—</span>}</td>
                    <td style={{padding:"9px 14px",color:C.stone}}>{r.Origin||"—"}</td>
                    <td style={{padding:"9px 14px",color:C.stone,fontSize:10}}>{r["Disclosed_Cultivars_(Matcha)"]||"—"}</td>
                    <td style={{padding:"9px 14px"}}>{r.Tin_Weight_g?`${r.Tin_Weight_g}g`:"—"}</td>
                    <td style={{padding:"9px 14px",color:C.stone,whiteSpace:"nowrap"}}>{fmtDate(r.Date_received,true)}</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>}
      </main>

      <footer style={{borderTop:`1px solid ${C.warm}`,marginTop:32}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"16px 40px",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:10,color:C.mist,letterSpacing:"0.1em"}}>抹茶 COLLECTION</span>
          <span style={{fontSize:10,color:C.mist}}>Public view</span>
        </div>
      </footer>
    </div>
  </>;
}

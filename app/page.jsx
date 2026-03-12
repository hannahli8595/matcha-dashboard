"use client";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  C, PIE_COLORS, isConsumable, tinPriority, sortRows,
} from "./components/shared";

const parseF = v => parseFloat(v) || 0;
const yesVal = v => ["y","yes","true","1"].includes((v||"").toLowerCase().trim());

function SectionTitle({children}) {
  return <div style={{borderBottom:`1px solid ${C.ink}`,paddingBottom:8,marginBottom:18}}>
    <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,fontWeight:700,color:C.ink,margin:0}}>{children}</h2>
  </div>;
}
function Note({children}) {
  return <div style={{fontSize:10,color:C.mist,fontStyle:"italic",marginBottom:16,lineHeight:1.6,borderLeft:`2px solid ${C.warm}`,paddingLeft:10}}>{children}</div>;
}
function Th({label,col,sortCol,sortDir,onSort}) {
  const active = sortCol === col;
  return <th onClick={()=>onSort(col)} style={{textAlign:"left",padding:"10px 14px",color:active?C.cream:C.mist,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:400,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:active?"rgba(255,255,255,0.08)":"transparent"}}>
    {label}{active?(sortDir==="asc"?" ↑":" ↓"):""}
  </th>;
}
function Dot({color,opacity=1}) {
  return <span style={{width:7,height:7,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0,opacity}}/>;
}

const STATUS_COLORS = {"Opened":C.moss,"Unopened":C.sage,"Finished":C.warm,"Pending":C.gold};

export default function PublicDashboard() {
  const [data,setData]     = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError]   = useState(null);
  const [invSearch,setInvSearch] = useState("");
  const [invBrand,setInvBrand]   = useState("All");
  const [invType,setInvType]     = useState("All");
  const [invSort,setInvSort]     = useState({col:"Brand",dir:"asc"});
  const [chartSort,setChartSort] = useState("weight-desc");

  useEffect(()=>{
    fetch("/api/public-data")
      .then(r=>r.json())
      .then(d=>{setData(d);setLoading(false);})
      .catch(()=>{setError("Failed to load");setLoading(false);});
  },[]);

  const raw_data = data?.raw_data || [];

  const teaItems = useMemo(()=>
    raw_data.filter(r => isConsumable(r) && r.Status !== "Gave Away")
  ,[raw_data]);

  const allBrands = useMemo(()=>[...new Set(teaItems.map(r=>r.Brand).filter(Boolean))].sort(),[teaItems]);
  const allTypes  = useMemo(()=>[...new Set(teaItems.map(r=>r.Product_Type).filter(Boolean))].sort(),[teaItems]);

  const filteredCollection = useMemo(()=>{
    const rows = teaItems.filter(r=>
      (invBrand==="All" || r.Brand===invBrand) &&
      (invType==="All"  || r.Product_Type===invType) &&
      (!invSearch || [r.Brand,r.Product_Name,r.Origin,r["Disclosed_Cultivars_(Matcha)"]].some(v=>v?.toLowerCase().includes(invSearch.toLowerCase())))
    );
    return sortRows(rows, invSort.col, invSort.dir);
  },[teaItems,invBrand,invType,invSearch,invSort]);

  const tinChartData = useMemo(()=>{
    const [sortKey,sortDir] = chartSort.split("-");
    return teaItems
      .filter(r => parseF(r.Tin_Weight_g) > 0)
      .map(r => ({tin:r, brand:r.Brand, name:r.Product_Name, weight:parseF(r.Tin_Weight_g), status:r.Status}))
      .sort((a,b)=>{
        const cmp = sortKey==="brand" ? a.brand.localeCompare(b.brand) : b.weight - a.weight;
        return sortDir==="desc" ? cmp : -cmp;
      });
  },[teaItems,chartSort]);

  const card    = {background:C.parchment, padding:"22px 26px", borderRadius:2};
  const selStyle = {background:C.cream, border:`1px solid ${C.warm}`, color:C.ink, padding:"6px 10px", fontSize:11, borderRadius:1, cursor:"pointer"};

  if(loading) return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}`}</style>
      <div style={{fontSize:32,fontFamily:"'Playfair Display',Georgia,serif",color:C.ink}}>抹茶</div>
      <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:C.stone}}>Loading…</div>
    </div>
  );

  if(error) return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{color:C.red,fontSize:13}}>{error}</div>
    </div>
  );

  // Bar chart tick — wraps brand + product name into narrow multi-line labels
  const BAR_W  = tinChartData.length > 20 ? 88 : tinChartData.length > 12 ? 104 : 120;
  const chartW = Math.max(600, tinChartData.length * BAR_W);

  const MultiLineTick = ({x,y,index}) => {
    const d = tinChartData[index];
    if(!d) return null;
    const wrap = (s,max) => {
      const words = s.split(" ");
      const lines = []; let cur = "";
      for(const w of words){
        if((cur+" "+w).trim().length > max && cur){ lines.push(cur.trim()); cur=w; }
        else cur = (cur+" "+w).trim();
      }
      if(cur) lines.push(cur);
      return lines.slice(0,2);
    };
    const all = [
      ...wrap(d.brand,11).map(l=>({text:l,fill:C.stone,size:9,fw:600})),
      ...wrap(d.name,11).map(l=>({text:l,fill:C.mist,size:8,fw:400})),
    ];
    return <g transform={`translate(${x},${y+6})`}>
      {all.map((l,i)=><text key={i} textAnchor="middle" fill={l.fill} fontSize={l.size} fontWeight={l.fw} dy={i*13}>{l.text}</text>)}
    </g>;
  };

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.parchment}}::-webkit-scrollbar-thumb{background:${C.warm}}
      .hrow:hover{background:${C.warm}!important;}
    `}</style>

    <div style={{minHeight:"100vh",background:C.cream,color:C.ink}}>

      {/* Header */}
      <header style={{borderBottom:`1px solid ${C.ink}`}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"18px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:24,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700}}>抹茶 Collection</div>
            <div style={{fontSize:10,color:C.stone,letterSpacing:"0.08em",marginTop:3}}>Matcha · Hojicha · Tea Powders · 2024–present</div>
          </div>
          <a href="/private" style={{fontSize:10,color:C.stone,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none",border:`1px solid ${C.warm}`,padding:"5px 12px",borderRadius:1}}>Owner Login →</a>
        </div>
      </header>

      <main style={{padding:"32px 40px",maxWidth:1400,margin:"0 auto",width:"100%",display:"flex",flexDirection:"column",gap:32}}>

        {/* ── Bar Chart ─────────────────────────────────────────────────── */}
        {tinChartData.length > 0 && (
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:6}}>
              <div style={{flex:1}}><SectionTitle>Collection by Tin Size</SectionTitle></div>
              <div style={{display:"flex",alignItems:"center",gap:8,paddingBottom:14}}>
                <span style={{fontSize:10,color:C.stone,letterSpacing:"0.08em",textTransform:"uppercase"}}>Sort</span>
                <select value={chartSort} onChange={e=>setChartSort(e.target.value)} style={selStyle}>
                  <option value="weight-desc">Heaviest → Lightest</option>
                  <option value="weight-asc">Lightest → Heaviest</option>
                  <option value="brand-asc">Brand A → Z</option>
                  <option value="brand-desc">Brand Z → A</option>
                </select>
              </div>
            </div>
            <Note>Each bar = one tin. Height = original weight in grams (g). Only tins with a known weight are shown. Consumption progress is not displayed. Duplicate tins are given away and not listed.</Note>
            <div style={{display:"flex",gap:14,fontSize:10,color:C.stone,marginBottom:14,flexWrap:"wrap"}}>
              {Object.entries(STATUS_COLORS).map(([s,color])=>(
                <span key={s} style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:10,height:10,background:color,display:"inline-block",borderRadius:1,opacity:s==="Unopened"?0.45:1}}/>{s}
                </span>
              ))}
            </div>
            <div style={{overflowX:"auto",overflowY:"hidden"}}>
              <div style={{width:chartW,height:320}}>
                <BarChart width={chartW} height={320} data={tinChartData} margin={{top:4,right:16,left:0,bottom:90}} barCategoryGap="20%">
                  <CartesianGrid stroke={C.warm} strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="brand" tick={<MultiLineTick/>} interval={0} height={90}/>
                  <YAxis tick={{fontSize:9,fill:C.stone}} tickFormatter={v=>`${v}g`} width={36}/>
                  <Tooltip content={({active,payload})=>{
                    if(!active||!payload?.length) return null;
                    const d = payload[0]?.payload;
                    return <div style={{background:C.ink,color:C.cream,padding:"10px 14px",fontSize:11,borderRadius:2,lineHeight:1.8,minWidth:160}}>
                      <div style={{fontWeight:600,marginBottom:2}}>{d?.brand}</div>
                      <div style={{opacity:0.7,fontSize:10,marginBottom:6}}>{d?.name}</div>
                      <div><span style={{color:C.mist}}>Size: </span>{d?.weight}g</div>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                        <Dot color={STATUS_COLORS[d?.status]||C.stone}/><span style={{fontSize:10,opacity:0.8}}>{d?.status}</span>
                      </div>
                    </div>;
                  }}/>
                  <Bar dataKey="weight" shape={(props)=>{
                    const {x,y,width,height,payload} = props;
                    const color = STATUS_COLORS[payload?.status] || C.stone;
                    const isUnopened = payload?.status === "Unopened";
                    return <g>
                      <rect x={x} y={y} width={width} height={height} fill={color} rx={2} fillOpacity={isUnopened?0.45:1}/>
                      {isUnopened && <rect x={x} y={y} width={width} height={height} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 2" rx={2}/>}
                    </g>;
                  }}/>
                </BarChart>
              </div>
            </div>
          </div>
        )}

        {/* ── Collection Table ──────────────────────────────────────────── */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Note>Tea products only — matcha, hojicha, and other powders. Accessories and appliances are not listed. Duplicate items are given away and not listed here.</Note>

          {/* Filters */}
          <div style={{display:"flex",alignItems:"flex-end",gap:0,flexWrap:"wrap",paddingBottom:12,borderBottom:`1px solid ${C.warm}`}}>
            <div style={{marginRight:8}}>
              <div style={{fontSize:9,color:C.mist,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Brand</div>
              <select value={invBrand} onChange={e=>setInvBrand(e.target.value)} style={{...selStyle,minWidth:160}}>
                <option value="All">All brands</option>
                {allBrands.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            {/* spacer roughly matching Product Name column */}
            <div style={{width:160,marginRight:8}}/>
            <div style={{marginRight:8}}>
              <div style={{fontSize:9,color:C.mist,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Type</div>
              <select value={invType} onChange={e=>setInvType(e.target.value)} style={{...selStyle,minWidth:120}}>
                <option value="All">All types</option>
                {allTypes.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{flex:1}}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
              <div style={{fontSize:9,color:C.mist,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Search</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input value={invSearch} onChange={e=>setInvSearch(e.target.value)}
                  placeholder="Brand, name, origin, cultivar…"
                  style={{padding:"6px 12px",border:`1px solid ${C.warm}`,background:C.cream,color:C.ink,fontSize:11,borderRadius:1,outline:"none",width:260}}/>
                {(invBrand!=="All"||invType!=="All"||invSearch) &&
                  <button onClick={()=>{setInvBrand("All");setInvType("All");setInvSearch("");}}
                    style={{padding:"5px 10px",fontSize:10,border:`1px solid ${C.red}`,background:"transparent",color:C.red,cursor:"pointer",borderRadius:1}}>
                    Clear
                  </button>}
                <span style={{fontSize:10,color:C.mist,whiteSpace:"nowrap"}}>{filteredCollection.length} items</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{background:C.parchment,borderRadius:2,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead>
                <tr style={{background:C.ink}}>
                  {[
                    ["Brand","Brand"],
                    ["Product_Name","Product Name"],
                    ["Product_Type","Type"],
                    ["Origin","Origin"],
                    ["Disclosed_Cultivars_(Matcha)","Cultivars"],
                    ["_Ceremonial_advertised?_(Matcha)","Ceremonial"],
                    ["First-harvest?_(Matcha)","First Harvest"],
                    ["Organic?_(Matcha)","Organic"],
                    ["Tin_Weight_g","Size (g)"],
                  ].map(([col,label])=>(
                    <Th key={col} label={label} col={col} sortCol={invSort.col} sortDir={invSort.dir}
                      onSort={c=>setInvSort(s=>({col:c,dir:s.col===c&&s.dir==="asc"?"desc":"asc"}))}/>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCollection.map((r,i)=>{
                  const isMat = r.Product_Type==="Matcha";
                  const Check = ({field}) => isMat
                    ? yesVal(r[field])
                      ? <span style={{color:C.moss,fontWeight:700,fontSize:13}}>✓</span>
                      : <span style={{color:C.mist}}>—</span>
                    : <span style={{color:C.mist}}>—</span>;
                  return (
                    <tr key={i} className="hrow" style={{borderBottom:`1px solid ${C.warm}`,background:i%2===0?C.cream:C.parchment}}>
                      <td style={{padding:"9px 14px",fontWeight:600}}>{r.Brand}</td>
                      <td style={{padding:"9px 14px",color:C.stone}}>{r.Product_Name}</td>
                      <td style={{padding:"9px 14px"}}>
                        <span style={{fontSize:9,padding:"2px 7px",background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:1,whiteSpace:"nowrap"}}>{r.Product_Type}</span>
                      </td>
                      <td style={{padding:"9px 14px",color:C.stone}}>{r.Origin||"—"}</td>
                      <td style={{padding:"9px 14px",color:C.stone,fontSize:10,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r["Disclosed_Cultivars_(Matcha)"]||""}>
                        {r["Disclosed_Cultivars_(Matcha)"]||"—"}
                      </td>
                      <td style={{padding:"9px 14px",textAlign:"center"}}><Check field="_Ceremonial_advertised?_(Matcha)"/></td>
                      <td style={{padding:"9px 14px",textAlign:"center"}}><Check field="First-harvest?_(Matcha)"/></td>
                      <td style={{padding:"9px 14px",textAlign:"center"}}><Check field="Organic?_(Matcha)"/></td>
                      <td style={{padding:"9px 14px",color:C.stone,textAlign:"right"}}>
                        {r.Tin_Weight_g ? Math.round(parseFloat(r.Tin_Weight_g)) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer style={{borderTop:`1px solid ${C.warm}`,marginTop:40}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"16px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:C.mist,letterSpacing:"0.1em"}}>抹茶 COLLECTION</span>
          <span style={{fontSize:10,color:C.mist}}>Matcha · Hojicha · Tea Powders · Public view</span>
        </div>
      </footer>
    </div>
  </>;
}

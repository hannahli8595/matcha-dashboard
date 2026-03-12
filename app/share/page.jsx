"use client";
import { useState, useEffect, useCallback } from "react";

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

const C = {
  ink:"#1a1a18", cream:"#faf7f2", parchment:"#f3ede3", warm:"#e8ddd0",
  stone:"#8a7f72", mist:"#b8b0a5", moss:"#4a6741", sage:"#7a9e74",
  gold:"#c4963a", amber:"#d4854a", accent:"#5c7a9e", red:"#8b3a3a",
};
const font = `'DM Mono', monospace`;
const serif = `'Playfair Display', Georgia, serif`;

function estimateShipping(grams) {
  return { cost: Math.ceil(grams / 28) };
}
function shippingFor(grams) {
  return estimateShipping(grams);
}
function parseSuggestions(raw) {
  try { return JSON.parse(raw||"[]"); } catch { return []; }
}
function Flag({ label, value }) {
  if (value?.toLowerCase() !== "y") return null;
  return <span style={{fontSize:9,padding:"2px 7px",borderRadius:1,border:`1px solid ${C.moss}`,color:C.moss,background:"#eef4ec",letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</span>;
}
function GramsBar({ available, claimed }) {
  const pct = Math.min((claimed/available)*100,100);
  const full = pct >= 100;
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.stone,marginBottom:4}}>
      <span>{claimed}g claimed of {available}g</span>
      <span style={{color:full?C.red:C.moss,fontWeight:600}}>{full?"sold out":`${available-claimed}g left`}</span>
    </div>
    <div style={{height:4,background:C.warm,borderRadius:2,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:full?C.amber:C.moss,borderRadius:2,transition:"width 0.4s"}}/>
    </div>
  </div>;
}

// ── Name modal ────────────────────────────────────────────────────────────────
function NameModal({ onClose, onName }) {
  const [name,setName]=useState("");
  const [err,setErr]=useState("");
  const inp={padding:"11px 14px",border:`1px solid ${C.warm}`,borderRadius:1,fontSize:14,fontFamily:font,background:C.parchment,color:C.ink,outline:"none",width:"100%"};
  function submit(){
    if(!name.trim()) return setErr("Please enter your name.");
    onName(name.trim()); onClose();
  }
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:"fixed",inset:0,background:"rgba(26,26,24,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.cream,width:"100%",maxWidth:360,borderRadius:2,overflow:"hidden"}}>
        <div style={{background:C.ink,padding:"20px 24px"}}>
          <div style={{fontSize:16,fontFamily:serif,fontWeight:700,color:C.cream}}>Who are you?</div>
          <div style={{fontSize:11,color:C.stone,marginTop:4}}>Enter once — then just pick grams and claim across everything.</div>
        </div>
        <div style={{padding:"24px",display:"flex",flexDirection:"column",gap:12}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
            style={inp} autoFocus onKeyDown={e=>e.key==="Enter"&&submit()}/>
          {err&&<div style={{fontSize:11,color:C.red}}>{err}</div>}
          <button onClick={submit}
            style={{padding:"12px",background:C.moss,color:C.cream,border:"none",borderRadius:1,cursor:"pointer",fontSize:12,fontFamily:font,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600}}>
            Let's go →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Submit confirmation modal ─────────────────────────────────────────────────
function SubmitModal({ myClaims, listings, myName, onClose, onSubmitted }) {
  const [submitting,setSub]=useState(false);
  const [done,setDone]=useState(null);
  const [err,setErr]=useState("");

  const totalG = myClaims.reduce((s,c)=>s+(parseFloat(c.Grams_Claimed)||0),0);
  const shTotal = Math.ceil(totalG / 28);

  async function handleSubmit() {
    setSub(true); setErr("");
    try {
      const res = await fetch("/api/share-data/submit",{method:"POST",
        headers:{"Content-Type":"application/json"},body:JSON.stringify({Name:myName})});
      const d = await res.json();
      if(!res.ok){setErr(d.error||"Error");setSub(false);return;}
      setDone(d);
      onSubmitted();
    } catch{setErr("Network error.");setSub(false);}
  }

  const row = (c,i)=>{
    return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.warm}`,gap:12}}>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:600,color:C.ink}}>{c.Brand}</div>
        <div style={{fontSize:10,color:C.stone}}>{c.Product_Name}</div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:600}}>{c.Grams_Claimed}g</div>
        
      </div>
    </div>;
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&!done&&onClose()}
      style={{position:"fixed",inset:0,background:"rgba(26,26,24,0.8)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.cream,width:"100%",maxWidth:460,borderRadius:2,overflow:"hidden",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{background:C.ink,padding:"18px 24px",flexShrink:0}}>
          <div style={{fontSize:15,fontFamily:serif,fontWeight:700,color:C.cream}}>{done?"Order submitted ✓":"Review your order"}</div>
          {!done&&<div style={{fontSize:11,color:C.stone,marginTop:3}}>Once submitted, Hannah gets notified. You can still edit individual claims.</div>}
        </div>
        <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
          {done ? <>
            <div style={{textAlign:"center",padding:"20px 0 12px"}}>
              <div style={{fontSize:40,marginBottom:12}}>🍵</div>
              <div style={{fontSize:14,fontWeight:700,color:C.moss,marginBottom:6}}>Order locked in!</div>
              <div style={{fontSize:11,color:C.stone,lineHeight:1.7}}>
                Hannah has been notified. She'll be in touch about shipping soon.
              </div>
            </div>
            <div style={{marginTop:16}}>
              {myClaims.map(row)}
            </div>
            <div style={{borderTop:`2px solid ${C.warm}`,marginTop:8,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600}}>
              <span>Shipping est.</span><span style={{color:C.moss}}>${shTotal.toFixed(2)}</span>
            </div>
          </> : <>
            {myClaims.map(row)}
            <div style={{borderTop:`2px solid ${C.warm}`,marginTop:8,paddingTop:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600,marginBottom:4}}>
                <span>Total</span><span>{totalG}g</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600}}>
                <span>Shipping est.</span><span style={{color:C.moss}}>${shTotal.toFixed(2)}</span>
              </div>
              <div style={{fontSize:10,color:C.mist,marginTop:6}}>Final shipping confirmed before payment.</div>
            </div>
            {err&&<div style={{fontSize:11,color:C.red,marginTop:8}}>{err}</div>}
          </>}
        </div>
        <div style={{padding:"16px 24px",borderTop:`1px solid ${C.warm}`,flexShrink:0,display:"flex",gap:10,justifyContent:"flex-end"}}>
          {done
            ? <button onClick={onClose} style={{padding:"9px 22px",background:C.moss,color:C.cream,border:"none",borderRadius:1,cursor:"pointer",fontSize:11,fontFamily:font,letterSpacing:"0.08em"}}>Done</button>
            : <>
                <button onClick={onClose} style={{padding:"9px 18px",background:"transparent",border:`1px solid ${C.warm}`,borderRadius:1,cursor:"pointer",fontSize:11,fontFamily:font,color:C.stone}}>Go back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{padding:"9px 22px",background:C.moss,color:C.cream,border:"none",borderRadius:1,cursor:submitting?"wait":"pointer",fontSize:11,fontFamily:font,letterSpacing:"0.08em",fontWeight:600}}>
                  {submitting?"Submitting…":"Submit order →"}
                </button>
              </>}
        </div>
      </div>
    </div>
  );
}

// ── Sticky order panel ────────────────────────────────────────────────────────
function OrderPanel({ myClaims, listings, myName, onSubmit, onCancelItem, submitted }) {
  const totalG = myClaims.reduce((s,c)=>s+(parseFloat(c.Grams_Claimed)||0),0);
  const shTotal = Math.ceil(totalG / 28);

  if (!myName) return (
    <div style={{background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:2,padding:"20px 18px"}}>
      <div style={{fontSize:12,fontFamily:serif,fontWeight:700,color:C.ink,marginBottom:6}}>Your order</div>
      <div style={{fontSize:11,color:C.mist}}>Enter your name to start claiming.</div>
    </div>
  );

  return (
    <div style={{background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:2,overflow:"hidden",position:"sticky",top:24}}>
      <div style={{background:C.ink,padding:"14px 18px"}}>
        <div style={{fontSize:12,fontFamily:serif,fontWeight:700,color:C.cream}}>Your order</div>
        <div style={{fontSize:10,color:C.stone,marginTop:2}}>{myName}</div>
      </div>
      <div style={{padding:"14px 18px"}}>
        {myClaims.length === 0 ? (
          <div style={{fontSize:11,color:C.mist,padding:"12px 0",textAlign:"center"}}>
            No claims yet —<br/>pick grams on any listing
          </div>
        ) : <>
          {myClaims.map((c,i)=>{
            const l=listings.find(l=>l.Tin_ID===c.Tin_ID)||{};
            const sh=shippingFor(parseFloat(c.Grams_Claimed)||0,l);
            const isSubmitted = !!c.Order_Submitted;
            return <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.warm}`,display:"flex",gap:8,alignItems:"flex-start"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.Brand}</div>
                <div style={{fontSize:10,color:C.stone,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.Product_Name}</div>
                <div style={{fontSize:10,color:C.mist,marginTop:2}}>{c.Grams_Claimed}g</div>
                {isSubmitted&&<div style={{fontSize:9,color:C.moss,marginTop:2}}>✓ submitted</div>}
              </div>
              {!isSubmitted&&<button onClick={()=>onCancelItem(c)}
                style={{fontSize:11,color:C.mist,background:"none",border:"none",cursor:"pointer",padding:"0 2px",flexShrink:0,lineHeight:1}}>✕</button>}
            </div>;
          })}

          {/* Totals */}
          <div style={{marginTop:10,paddingTop:8,borderTop:`2px solid ${C.warm}`}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
              <span style={{color:C.stone}}>Total</span>
              <span style={{fontWeight:600}}>{totalG}g</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
              <span style={{color:C.stone}}>Shipping est.</span>
              <span style={{fontWeight:600,color:C.moss}}>${shTotal.toFixed(2)}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{marginTop:12,padding:"8px 12px",background:"#eef4ec",border:`1px solid ${C.moss}`,borderRadius:1,fontSize:11,color:C.moss,fontWeight:600,textAlign:"center"}}>
              Order submitted ✓
            </div>
          ) : (
            <button onClick={onSubmit}
              style={{width:"100%",marginTop:12,padding:"10px",background:C.moss,color:C.cream,border:"none",borderRadius:1,cursor:"pointer",fontSize:11,fontFamily:font,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600}}>
              Review &amp; submit →
            </button>
          )}
          <div style={{fontSize:9,color:C.mist,marginTop:8,textAlign:"center",lineHeight:1.5}}>
            Submitting notifies Hannah.<br/>You can still edit claims after.
          </div>
        </>}
      </div>
    </div>
  );
}

// ── Listing card ──────────────────────────────────────────────────────────────
function ListingCard({ listing, claims, myName, onClaimDone, onNeedName }) {
  const suggestions  = parseSuggestions(listing.Suggestions);
  const tinClaims    = claims.filter(c=>c.Tin_ID===listing.Tin_ID&&c.Status?.toLowerCase()==="claimed");
  const waitClaims   = claims.filter(c=>c.Tin_ID===listing.Tin_ID&&c.Status?.toLowerCase()==="waitlist");
  const totalClaimed = tinClaims.reduce((s,c)=>s+(parseFloat(c.Grams_Claimed)||0),0);
  const available    = parseFloat(listing.Grams_Available)||0;
  const remaining    = Math.max(available-totalClaimed,0);
  const isFull       = remaining<=0;

  const myClaim = myName ? [...tinClaims,...waitClaims].find(c=>c.Name?.toLowerCase()===myName.toLowerCase()) : null;
  const mySug   = myName ? suggestions.find(s=>s.name?.toLowerCase()===myName.toLowerCase()) : null;

  const [grams,setGrams]   = useState(myClaim?String(myClaim.Grams_Claimed):mySug?String(mySug.grams):"");
  const [sub,setSub]       = useState(false);
  const [flash,setFlash]   = useState(null); // "claimed"|"updated"|"waitlist"
  const [err,setErr]       = useState("");

  useEffect(()=>{
    if(!grams){
      if(mySug) setGrams(String(mySug.grams));
      else if(myClaim) setGrams(String(myClaim.Grams_Claimed));
    }
  },[myName]);

  async function handleClaim() {
    if(!myName){onNeedName();return;}
    if(!grams||parseFloat(grams)<=0) return setErr("Enter grams.");
    setSub(true);setErr("");
    try{
      if(myClaim){
        const res=await fetch("/api/share-data",{method:"PATCH",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({Name:myName,Tin_ID:listing.Tin_ID,Grams_Claimed:parseFloat(grams)})});
        const d=await res.json();
        if(!res.ok){setErr(d.error||"Error");setSub(false);return;}
        setFlash(d.status==="Waitlist"?"waitlist":"updated");
      } else {
        const res=await fetch("/api/share-data",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({Tin_ID:listing.Tin_ID,Brand:listing.Brand,Product_Name:listing.Product_Name,
            Product_Type:listing.Product_Type||"",Name:myName,Grams_Claimed:parseFloat(grams)})});
        const d=await res.json();
        if(!res.ok){setErr(d.error||"Error");setSub(false);return;}
        setFlash(d.isWaitlist?"waitlist":"claimed");
      }
      onClaimDone();
      setTimeout(()=>setFlash(null),2500);
    }catch{setErr("Network error.");}
    setSub(false);
  }

  async function handleCancel(){
    if(!myName) return;
    setSub(true);
    try{
      const res=await fetch("/api/share-data",{method:"PATCH",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Name:myName,Tin_ID:listing.Tin_ID,cancel:true})});
      if(res.ok){setGrams("");onClaimDone();}
      else{const d=await res.json();setErr(d.error||"Error");}
    }catch{setErr("Network error.");}
    setSub(false);
  }

  const inp={padding:"9px 12px",border:`1px solid ${C.warm}`,borderRadius:1,fontSize:13,fontFamily:font,background:C.parchment,color:C.ink,outline:"none",width:"100%"};
  const flashColors={claimed:{bg:"#eef4ec",c:C.moss,t:"Claimed ✓"},updated:{bg:"#eef4ec",c:C.moss,t:"Updated ✓"},waitlist:{bg:"#fdf8e8",c:C.gold,t:"On waitlist ✓"}};
  const fc = flash ? flashColors[flash] : null;

  return (
    <div style={{background:C.cream,border:`1px solid ${C.warm}`,borderRadius:2,overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.ink,padding:"16px 20px"}}>
        <div style={{fontSize:10,color:C.mist,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{listing.Product_Type||"Tea"}</div>
        <div style={{fontSize:16,fontFamily:serif,fontWeight:700,color:C.cream,lineHeight:1.2}}>{listing.Brand}</div>
        <div style={{fontSize:11,color:C.mist,marginTop:2}}>{listing.Product_Name}</div>
      </div>
      <div style={{padding:"16px 20px",flex:1,display:"flex",flexDirection:"column",gap:11}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <Flag label="Ceremonial" value={listing["_Ceremonial_advertised?_(Matcha)"]}/>
          <Flag label="Organic"    value={listing["Organic?_(Matcha)"]}/>
          <Flag label="1st Harvest" value={listing["First-harvest?_(Matcha)"]}/>
        </div>
        <div style={{fontSize:11,color:C.stone,display:"flex",flexDirection:"column",gap:3}}>
          {listing.Origin&&<div><span style={{color:C.mist}}>Origin: </span>{listing.Origin}</div>}
          {listing["Disclosed_Cultivars_(Matcha)"]&&<div><span style={{color:C.mist}}>Cultivar: </span>{listing["Disclosed_Cultivars_(Matcha)"]}</div>}
          {listing["Price/g"]&&<div><span style={{color:C.mist}}>$/g: </span>{listing["Price/g"]}</div>}
          {listing.URL&&<a href={listing.URL} target="_blank" rel="noreferrer" style={{color:C.moss,fontSize:10}}>↗ Product page</a>}
        </div>
        {listing.Notes&&<div style={{fontSize:11,color:C.stone,background:C.parchment,border:`1px solid ${C.warm}`,padding:"7px 11px",borderRadius:1,fontStyle:"italic"}}>{listing.Notes}</div>}

        <GramsBar available={available} claimed={totalClaimed}/>

        {mySug&&!myClaim&&<div style={{background:"#f0f6ea",border:`1px solid ${C.sage}`,borderRadius:1,padding:"7px 11px",fontSize:11}}>
          <span style={{color:C.moss,fontWeight:600}}>✦ Suggested: {mySug.grams}g</span>
          <span style={{color:C.stone}}> — prefilled, adjust freely</span>
        </div>}

        {tinClaims.filter(c=>c.Name?.toLowerCase()!==myName?.toLowerCase()).length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {tinClaims.filter(c=>c.Name?.toLowerCase()!==myName?.toLowerCase()).map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:10,padding:"3px 0",borderBottom:`1px solid ${C.warm}`}}>
                <span style={{color:C.mist}}>{c.Name}</span><span style={{color:C.stone}}>{c.Grams_Claimed}g</span>
              </div>
            ))}
          </div>
        )}
        {waitClaims.length>0&&<div style={{fontSize:10,color:C.amber}}>{waitClaims.length} on waitlist</div>}

        {myClaim&&<div style={{background:"#eef4ec",border:`1px solid ${C.moss}`,borderRadius:1,padding:"7px 11px",fontSize:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>
            <span style={{color:C.moss,fontWeight:600}}>Your claim: {myClaim.Grams_Claimed}g</span>
            {myClaim.Status==="Waitlist"&&<span style={{color:C.amber,marginLeft:6}}>(waitlist)</span>}
            {myClaim.Order_Submitted&&<span style={{color:C.mist,marginLeft:6,fontSize:10}}>submitted</span>}
          </span>
          <button onClick={handleCancel} disabled={sub}
            style={{fontSize:10,color:C.red,background:"none",border:`1px solid ${C.red}`,borderRadius:1,padding:"2px 7px",cursor:"pointer",fontFamily:font}}>Cancel</button>
        </div>}

        {fc&&<div style={{background:fc.bg,borderRadius:1,padding:"7px 11px",fontSize:11,fontWeight:700,color:fc.c,textAlign:"center",transition:"opacity 0.3s"}}>{fc.t}</div>}

        <div style={{marginTop:"auto",display:"flex",flexDirection:"column",gap:7}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="number" min="1" placeholder={isFull?"Waitlist grams":"How many grams?"}
              value={grams} onChange={e=>setGrams(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleClaim()}
              style={inp}/>
            <button onClick={handleClaim} disabled={sub||!grams}
              style={{padding:"9px 14px",border:"none",borderRadius:1,cursor:sub?"wait":"pointer",whiteSpace:"nowrap",
                background:!grams?C.warm:isFull?C.amber:C.moss,color:C.cream,
                fontSize:11,fontFamily:font,letterSpacing:"0.08em",fontWeight:600,opacity:!grams?0.5:1}}>
              {sub?"…":myClaim?"Update":isFull?"Waitlist":"Claim"}
            </button>
          </div>
          {err&&<div style={{fontSize:11,color:C.red}}>{err}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const TYPE_TABS=["All","Matcha","Hojicha","Other"];
function typeTab(l,tab){
  if(tab==="All") return true;
  const t=l.Product_Type||"";
  if(tab==="Other") return t!=="Matcha"&&t!=="Hojicha";
  return t===tab;
}

export default function SharePage() {
  const mobile = useMobile();
  const [listings,setListings]    = useState([]);
  const [claims,setClaims]        = useState([]);
  const [loading,setLoading]      = useState(true);
  const [myName,setMyName]        = useState("");
  const [showNameModal,setShowNM] = useState(false);
  const [activeTab,setActiveTab]  = useState("All");
  const [refresh,setRefresh]      = useState(0);
  const [showSubmit,setShowSubmit]= useState(false);
  const [submitted,setSubmitted]  = useState(false);

  useEffect(()=>{
    try{const n=sessionStorage.getItem("share_name");if(n)setMyName(n);}catch{}
  },[]);
  function saveName(n){setMyName(n);try{sessionStorage.setItem("share_name",n);}catch{};}
  function clearName(){setMyName("");try{sessionStorage.removeItem("share_name");}catch{};}

  const load = useCallback(async()=>{
    try{
      const res=await fetch("/api/share-data");
      const d=await res.json();
      setListings(d.listings||[]);
      setClaims(d.claims||[]);
    }catch{}
    setLoading(false);
  },[]);
  useEffect(()=>{load();},[load,refresh]);

  const myClaims = myName
    ? claims.filter(c=>c.Name?.toLowerCase()===myName.toLowerCase()&&c.Status?.toLowerCase()!=="cancelled")
    : [];
  const hasUnsubmitted = myClaims.some(c=>!c.Order_Submitted&&c.Status?.toLowerCase()==="claimed");

  async function handleCancelItem(claim){
    try{
      await fetch("/api/share-data",{method:"PATCH",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({Name:myName,Tin_ID:claim.Tin_ID,cancel:true})});
      setRefresh(r=>r+1);
    }catch{}
  }

  const filtered=listings.filter(l=>typeTab(l,activeTab));
  const availableTabs=TYPE_TABS.filter(tab=>tab==="All"||listings.some(l=>typeTab(l,tab)));

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html,body{width:100%;overflow-x:hidden;background:${C.cream};font-family:'DM Mono',monospace;}
      input:focus{border-color:${C.moss}!important;box-shadow:0 0 0 2px rgba(74,103,65,0.1);}
      input[type=number]::-webkit-inner-spin-button{opacity:1;}
      .share-type-tabs::-webkit-scrollbar{display:none;}
    `}</style>

    {/* Header */}
    <div style={{background:C.ink,padding:mobile?"16px 16px 0":"28px 36px 0"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:mobile?"0 16px":0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,paddingBottom:20}}>
          <div>
            <div style={{fontSize:10,color:C.mist,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6}}>Share Drop</div>
            <div style={{fontSize:26,fontFamily:serif,color:C.cream,fontWeight:700}}>抹茶 Samples</div>
            <div style={{fontSize:11,color:C.stone,marginTop:7,maxWidth:440,lineHeight:1.7}}>
              Claim your grams. Stamps if it fits in an envelope, package rate if not. Submit when done.
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,paddingTop:4}}>
            {myName ? <>
              <div style={{fontSize:10,color:C.mist}}>Claiming as</div>
              <div style={{fontSize:14,fontWeight:700,color:C.cream}}>{myName}</div>
              <button onClick={()=>{clearName();setShowNM(true);}} style={{fontSize:10,color:C.stone,background:"none",border:`1px solid #555`,borderRadius:1,padding:"3px 10px",cursor:"pointer",fontFamily:font}}>Change</button>
            </> : <button onClick={()=>setShowNM(true)}
              style={{padding:"10px 22px",background:C.moss,color:C.cream,border:"none",borderRadius:1,cursor:"pointer",fontSize:11,fontFamily:font,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600}}>
              Start claiming →
            </button>}
          </div>
        </div>
        {availableTabs.length>1&&<div style={{display:"flex",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",borderTop:`1px solid #333`}}>
          {availableTabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{
              padding:"10px 20px",border:"none",borderBottom:`2px solid ${activeTab===tab?C.sage:"transparent"}`,
              background:"transparent",color:activeTab===tab?C.cream:C.stone,
              fontSize:11,fontFamily:font,cursor:"pointer",letterSpacing:"0.08em",
            }}>{tab}</button>
          ))}
        </div>}
      </div>
    </div>

    {/* Body — two-column layout */}
    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 280px",gap:mobile?0:28,alignItems:"start",maxWidth:1100,margin:"0 auto",padding:mobile?"16px":"28px 24px"}}>
      {/* Left: listings */}
      <div>
        {!myName&&<div style={{background:C.parchment,border:`1px solid ${C.warm}`,borderRadius:1,padding:"12px 18px",marginBottom:20,fontSize:11,color:C.stone,lineHeight:1.7}}>
          👋 <strong style={{color:C.ink}}>Enter your name once</strong> to claim across all listings.{" "}
          <button onClick={()=>setShowNM(true)} style={{color:C.moss,background:"none",border:"none",cursor:"pointer",fontFamily:font,fontSize:11,fontWeight:600,textDecoration:"underline"}}>Let's go →</button>
        </div>}

        {loading?<div style={{textAlign:"center",padding:"60px 0",color:C.mist}}>Loading…</div>
        :filtered.length===0?<div style={{textAlign:"center",padding:"60px 0"}}>
            <div style={{fontSize:20,fontFamily:serif,color:C.stone,marginBottom:8}}>
              {listings.length===0?"Nothing available right now":`No ${activeTab} listings`}
            </div>
            <div style={{fontSize:11,color:C.mist}}>{listings.length>0?"Try a different tab.":"Check back soon."}</div>
          </div>
        :<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:mobile?12:16}}>
            {filtered.map((l,i)=>(
              <ListingCard key={l.Tin_ID||i} listing={l} claims={claims} myName={myName}
                onClaimDone={()=>setRefresh(r=>r+1)}
                onNeedName={()=>setShowNM(true)}/>
            ))}
          </div>}

        {!loading&&listings.length>0&&<div style={{marginTop:28,fontSize:10,color:C.mist,lineHeight:1.8}}>
          <strong style={{color:C.stone}}>Shipping:</strong> ~$1 per 28g in a padded envelope. Full tins ship as packages ($5–$9). See your order panel for estimates. Final cost confirmed before payment.
        </div>}
      </div>

      {/* Right: sticky order panel — top on mobile, side on desktop */}
      <div style={{order:mobile?-1:1}}>
        <OrderPanel
          myClaims={myClaims}
          listings={listings}
          myName={myName}
          submitted={submitted}
          onSubmit={()=>setShowSubmit(true)}
          onCancelItem={handleCancelItem}
        />
      </div>
    </div>

    {showNameModal&&<NameModal onClose={()=>setShowNM(false)} onName={saveName}/>}
    {showSubmit&&<SubmitModal
      myClaims={myClaims.filter(c=>c.Status?.toLowerCase()==="claimed")}
      listings={listings}
      myName={myName}
      onClose={()=>setShowSubmit(false)}
      onSubmitted={()=>{setSubmitted(true);setRefresh(r=>r+1);}}
    />}
  </>;
}

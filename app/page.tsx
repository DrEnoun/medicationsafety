"use client";

import {
  ArrowRight, Bath, Boxes, Check, CheckCircle2, ChevronRight, CookingPot,
  Home, Info, LockKeyhole, PackageCheck, Play, Recycle, RotateCcw,
  ScanSearch, ShieldCheck, Snowflake, Sparkles, Star, Volume2, VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Mood = "guide" | "happy" | "sad";
type Mode = "start" | "play" | "transition" | "complete";
type SceneObject = {
  id: string; label: string; lesson: string; x: number; y: number;
  sprite: number; asset: "medicine" | "lookalike" | "inspection"; unsafe: boolean;
};
type RoomStage = {
  title: string; kicker: string; instruction: string; tip: string;
  icon: typeof Home; atlas: "room" | "station"; panel: number; items: SceneObject[];
};

const unsafe = (id:string,label:string,lesson:string,x:number,y:number,sprite:number,asset:SceneObject["asset"]="medicine"):SceneObject =>
  ({id,label,lesson,x,y,sprite,asset,unsafe:true});
const decoy = (id:string,label:string,lesson:string,x:number,y:number,sprite:number,asset:SceneObject["asset"]="lookalike"):SceneObject =>
  ({id,label,lesson,x,y,sprite,asset,unsafe:false});

const roomStages: RoomStage[] = [
  {
    title: "Living Room", kicker: "Stage 1 · Spot the danger",
    instruction: "Five of these 11 objects are unsafe medicines. Choose carefully.",
    tip: "Keep medicines up, away and ideally locked—not on tables, sofas or inside an accessible bag.",
    icon: Home, atlas: "room", panel: 0,
    items: [
      unsafe("sofa","Tablet blister pack on the sofa","Blister packaging can still be opened by a child.",31,58,0),
      unsafe("coffee","Cough syrup on the coffee table","A child-resistant cap is not child-proof.",55,69,1),
      unsafe("bag","Prescription bottle in an open handbag","Visitor bags also need to be stored out of reach.",75,60,2),
      unsafe("floor","Asthma inhaler on the floor","Store medicines where children and pets cannot reach them.",20,80,3),
      unsafe("tv","Capsule blister beside the television","Return medicine to secure storage immediately after use.",82,32,10),
      decoy("remote","Television remote","It resembles a slim pack from a distance, but it is not medicine.",14,55,12),
      decoy("mints","Mint tin","It may resemble a medicine tin, but it contains mints.",46,61,0),
      decoy("lipbalm","Lip balm","A tube shape alone does not make an item medicine.",67,39,3),
      decoy("sanitiser","Hand sanitiser","This is a hygiene product, not the medicine you are hunting.",83,73,2),
      decoy("candy","Wrapped candy","It looks colourful, but it is not a medicine package.",45,34,7),
      decoy("juice","Small juice carton","Read the object, not only its package shape.",89,51,6),
    ],
  },
  {
    title: "Kitchen", kicker: "Stage 2 · Heat and moisture",
    instruction: "Find the 5 medicines hidden among kitchen lookalikes.",
    tip: "A kitchen can be hot and humid. Keep medicines away from sinks, stoves, sunlight and food containers.",
    icon: CookingPot, atlas: "room", panel: 1,
    items: [
      unsafe("stove","Cough syrup beside the stove","Heat can damage medicine quality.",27,46,1),
      unsafe("sink","Tablet blister beside the sink","Moisture can damage tablets and packaging.",53,58,0),
      unsafe("window","Eye drops in direct sunlight","Light and heat may reduce stability.",76,31,4),
      unsafe("food","Medicine carton beside food","Separate medicines from food to prevent mix-ups.",67,73,12),
      unsafe("jar","Prescription tablets beside spice jars","Keep medicines separate and in original labelled packaging.",39,76,2),
      decoy("spice","Spice jar","This belongs in the kitchen and is not medicine.",18,66,13),
      decoy("vanilla","Vanilla flavouring bottle","The amber bottle is convincing, but the product is food flavouring.",39,39,1),
      decoy("cleaner","Hand sanitiser","Check the product type before choosing.",85,61,2),
      decoy("drink","Juice carton","Packaging shape can mislead you.",58,34,6),
      decoy("mintk","Mint tin","It contains mints, not tablets.",85,79,0),
      decoy("balmk","Lip balm","This personal-care product is not the unsafe medicine.",20,28,3),
    ],
  },
  {
    title: "Play Area", kicker: "Stage 3 · Little explorers",
    instruction: "Find 5 medicines among toys, treats and convincing lookalikes.",
    tip: "Never call medicine candy. Store medicines and supplements out of sight and reach after every use.",
    icon: Boxes, atlas: "room", panel: 2,
    items: [
      unsafe("gummy","Vitamin gummy jar beside sweets","Gummy vitamins are still supplements—not sweets.",29,63,13),
      unsafe("toybox","Inhaler in the toy box","A toy box is not a safe storage place.",72,69,3),
      unsafe("floorpack","Tablet blister on the floor","Partly empty packs may still contain enough medicine to cause harm.",46,81,0),
      unsafe("dollhouse","Liquid medicine inside the dollhouse","Do not leave medicine where children play.",82,40,11),
      unsafe("backpack","Medicine carton in an open school bag","Bags containing medicine must be closed and stored out of reach.",17,42,12),
      decoy("candyp","Wrapped candy","It is a treat, not medicine—but never describe medicine as candy.",47,48,7),
      decoy("bubbles","Bubble solution","The small bottle is a toy product, not medicine.",64,37,4),
      decoy("crayons","Crayon box","A carton shape is not enough evidence.",28,33,5),
      decoy("juicep","Juice carton","This drink carton is a distractor.",88,63,6),
      decoy("glue","Glue stick","It resembles a medicine tube, but it is craft glue.",60,78,14),
      decoy("blocks","Toy block packet","Look closely at the object before deciding.",15,70,15),
    ],
  },
  {
    title: "Bathroom", kicker: "Stage 4 · Humidity alert",
    instruction: "Find 5 medicines among similar bathroom products.",
    tip: "Despite the name “medicine cabinet,” a humid bathroom is unsuitable for many medicines unless the label says otherwise.",
    icon: Bath, atlas: "room", panel: 3,
    items: [
      unsafe("shower","Prescription bottle above the shower","Steam and heat can affect medicine stability.",24,32,2),
      unsafe("sinkpills","Tablet blister beside the sink","Water and moisture can damage packaging.",48,58,0),
      unsafe("windowmed","Eye drops on the sunny ledge","Avoid direct sunlight unless storage instructions permit it.",76,30,4),
      unsafe("towel","Medicated cream under a wet towel","Keep medicine packaging clean and dry.",70,75,5),
      unsafe("toilet","Liquid medicine on the cistern","Choose a secure, dry storage location.",24,73,11),
      decoy("mouthwash","Mouthwash bottle","This is an oral-care product, not medicine.",40,33,10),
      decoy("shampoo","Travel shampoo","Its bottle shape is similar, but it is shampoo.",84,58,8),
      decoy("skincare","Facial skincare tube","This cosmetic tube is not the medicine target.",58,73,9),
      decoy("cotton","Cotton-bud box","A small white box can be deceptive.",14,52,11),
      decoy("sanitiserb","Hand sanitiser","This hygiene product is a distractor.",88,78,2),
      decoy("lipbalmb","Lip balm","Look beyond the tube shape.",57,25,3),
    ],
  },
  {
    title: "Medicine Check", kicker: "Stage 5 · Inspect before use",
    instruction: "Inspect all 11 packages. Find the 5 unsafe medicines.",
    tip: "Check the expiry date, label, seal, colour and packaging. When unsure, isolate the item and ask a pharmacist.",
    icon: ScanSearch, atlas: "station", panel: 0,
    items: [
      unsafe("cracked","Cracked bottle with broken seal","Damaged packaging may allow contamination.",18,63,0,"inspection"),
      unsafe("punctured","Punctured tablet blister","A broken blister no longer protects the tablet properly.",34,40,1,"inspection"),
      unsafe("changed","Cloudy liquid with changed appearance","Unexpected colour, smell or texture needs pharmacist review.",50,70,2,"inspection"),
      unsafe("dirty","Crushed and badly soiled carton","Do not use medicine from badly damaged or contaminated packaging.",68,45,3,"inspection"),
      unsafe("split","Split cream tube","A split tube can allow leakage and contamination.",83,70,5,"inspection"),
      decoy("intact1","Intact sealed blister","The seal, appearance and package are intact.",19,35,8,"inspection"),
      decoy("intact2","Clearly labelled bottle","The label and child-resistant cap appear intact.",39,62,9,"inspection"),
      decoy("intact3","Sealed medicine carton","This package appears sealed and undamaged.",55,36,10,"inspection"),
      decoy("intact4","Normal clear liquid medicine","No visible change or packaging damage is present.",73,62,11,"inspection"),
      decoy("intact5","Intact cream tube","The tube is sealed and within its labelled date.",86,38,12,"inspection"),
      decoy("intact6","Sealed capsule blister","The cavities and foil appear intact.",59,78,13,"inspection"),
    ],
  },
];

const storageItems = [
  { id:"insulin", name:"Unopened insulin pen", cue:"Label: refrigerate; do not freeze", target:"fridge", sprite:7 },
  { id:"vaccine", name:"Vaccine vial", cue:"Label: store at 2–8°C", target:"fridge", sprite:15 },
  { id:"antibiotic", name:"Mixed antibiotic liquid", cue:"Dispensing label: refrigerate", target:"fridge", sprite:11 },
  { id:"paracetamol", name:"Paracetamol tablets", cue:"Original blister; room temperature", target:"cabinet", sprite:0 },
  { id:"bp", name:"Blood pressure capsules", cue:"Original pack; keep dry", target:"cabinet", sprite:10 },
  { id:"syrup", name:"Cough syrup", cue:"Label: room temperature", target:"cabinet", sprite:1 },
  { id:"inhaler", name:"Asthma inhaler", cue:"Keep dry; away from heat", target:"cabinet", sprite:3 },
  { id:"cream", name:"Topical cream", cue:"Label: below 25°C", target:"cabinet", sprite:5 },
  { id:"eyedrops", name:"Eye drops", cue:"Label: room temperature", target:"cabinet", sprite:4 },
  { id:"mystery", name:"Unlabelled medicine bottle", cue:"No label; identity unknown", target:"pharmacist", sprite:2 },
];

const disposalRounds = [
  { item:"Expired tablets in their original blister", answer:"return", lesson:"Returning unwanted medicines prevents accidental use and supports safer disposal.", options:[
    {id:"bin",label:"Throw loose into the household bin"}, {id:"return",label:"Take them to an authorised medicine-return point"}, {id:"share",label:"Give them to someone with similar symptoms"}]},
  { item:"Leftover prescribed antibiotics", answer:"return", lesson:"Do not save or share leftover antibiotics. Return them through an authorised service.", options:[
    {id:"save",label:"Keep them for the next infection"}, {id:"return",label:"Return them and ask the pharmacist for guidance"}, {id:"sink",label:"Pour them into the sink"}]},
  { item:"Expired liquid medicine", answer:"closed", lesson:"Keep the container closed and use a medicine-return service; do not pour it into water or soil.", options:[
    {id:"toilet",label:"Flush it down the toilet"}, {id:"closed",label:"Keep it closed and return the container"}, {id:"garden",label:"Pour it onto soil"}]},
  { item:"Used needle or lancet", answer:"sharps", lesson:"Sharps need a puncture-resistant sharps container and local clinic or pharmacy guidance.", options:[
    {id:"wrap",label:"Wrap it in tissue and bin it"}, {id:"snap",label:"Break the needle first"}, {id:"sharps",label:"Place it in an approved sharps container"}]},
  { item:"Medicine with personal details on the label", answer:"privacy", lesson:"Protect personal information while keeping the medicine identifiable for safe return.", options:[
    {id:"share",label:"Post a photo online to ask friends"}, {id:"privacy",label:"Protect personal data before authorised return"}, {id:"open",label:"Remove all tablets from the packaging"}]},
];

const stageLabels = ["Living room","Kitchen","Play area","Bathroom","Medicine check","Storage sort","Safe disposal"];
const disposalSprites = [0,10,11,7,12];

function spriteStyle(asset:SceneObject["asset"],sprite:number):CSSProperties {
  const x=(sprite%4)*33.333;
  const y=Math.floor(sprite/4)*33.333;
  const file=asset==="medicine"?"medicine-sprites.png":asset==="lookalike"?"lookalike-sprites.png":"inspection-sprites.png";
  return {backgroundImage:`url('/assets/${file}')`,backgroundPosition:`${x}% ${y}%`};
}

function useAudio() {
  const [muted,setMuted] = useState(false);
  const ctx = useRef<AudioContext|null>(null);
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);
  const beat = useRef(0);
  const ensure = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctx.current) ctx.current = new AudioContext();
    if (ctx.current.state === "suspended") void ctx.current.resume();
    return ctx.current;
  },[]);
  const tone = useCallback((hz:number,d=.12,type:OscillatorType="sine",vol=.05,delay=0) => {
    if (muted) return;
    const ac=ensure(); if(!ac) return;
    const o=ac.createOscillator(), g=ac.createGain();
    o.type=type; o.frequency.value=hz;
    g.gain.setValueAtTime(.001,ac.currentTime+delay);
    g.gain.linearRampToValueAtTime(vol,ac.currentTime+delay+.015);
    g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+delay+d);
    o.connect(g).connect(ac.destination); o.start(ac.currentTime+delay); o.stop(ac.currentTime+delay+d+.04);
  },[ensure,muted]);
  const play = useCallback((kind:"correct"|"wrong"|"transition"|"drop")=>{
    if(kind==="correct"){tone(659,.12,"sine",.07);tone(880,.18,"sine",.06,.1);}
    if(kind==="wrong"){tone(220,.16,"triangle",.055);tone(165,.2,"triangle",.04,.12);}
    if(kind==="transition"){tone(440,.12,"sine",.045);tone(554,.13,"sine",.045,.1);tone(740,.22,"sine",.05,.2);}
    if(kind==="drop") tone(420,.08,"sine",.035);
  },[tone]);
  useEffect(()=>{
    if(muted){if(timer.current)clearInterval(timer.current);timer.current=null;return;}
    const notes=[261.6,329.6,392,329.6,293.7,349.2,440,349.2];
    timer.current=setInterval(()=>{if(ctx.current?.state==="running"){tone(notes[beat.current%notes.length],.28,"sine",.012);beat.current++;}},560);
    return()=>{if(timer.current)clearInterval(timer.current);};
  },[muted,tone]);
  return {muted, start:ensure, play, toggle:()=>{ensure();setMuted(v=>!v);}};
}

function Marker({item,found,onChoose}:{item:SceneObject;found:boolean;onChoose:()=>void}) {
  return <button className={`scene-object ${found?"is-found":""}`} style={{left:`${item.x}%`,top:`${item.y}%`}}
    onClick={e=>{e.stopPropagation();if(!found)onChoose();}} aria-label={found?`${item.label}, found`:`Inspect object: ${item.label}`} disabled={found}>
    <span className="object-sprite" style={spriteStyle(item.asset,item.sprite)}/>
    {found&&<span className="found-ring"><Check/></span>}
  </button>;
}

function Mascot({mood,message}:{mood:Mood;message:string}) {
  const pos=mood==="guide"?0:mood==="happy"?50:100;
  return <aside className={`mascot-card mood-${mood}`} aria-live="polite">
    <div className="mascot-sprite" style={{backgroundPosition:`${pos}% center`}} role="img" aria-label={`Pharmacist mascot is ${mood}`}/>
    <div className="speech-bubble"><span>Pharmacist Alyaa</span><p>{message}</p></div>
  </aside>;
}

export default function HomePage(){
  const [mode,setMode]=useState<Mode>("start");
  const [stage,setStage]=useState(0);
  const [score,setScore]=useState(0);
  const [found,setFound]=useState<string[]>([]);
  const [mood,setMood]=useState<Mood>("guide");
  const [message,setMessage]=useState("Ready to make this home safer? I’ll guide you through every room.");
  const [stored,setStored]=useState<string[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [round,setRound]=useState(0);
  const [mistakes,setMistakes]=useState(0);
  const feedbackTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const audio=useAudio();
  const complete=stage<5?found.length===5:stage===5?stored.length===10:round===5;
  const room=stage<5?roomStages[stage]:null;

  const feedback=useCallback((nextMood:Mood,text:string)=>{
    setMood(nextMood);setMessage(text);
    if(feedbackTimer.current)clearTimeout(feedbackTimer.current);
    feedbackTimer.current=setTimeout(()=>{setMood("guide");},2200);
  },[]);
  useEffect(()=>()=>{if(feedbackTimer.current)clearTimeout(feedbackTimer.current);},[]);
  const start=()=>{audio.start();audio.play("transition");setMode("play");setMessage(roomStages[0].instruction);};
  const choose=(item:SceneObject)=>{
    if(found.includes(item.id))return;
    if(!item.unsafe){setMistakes(v=>v+1);audio.play("wrong");feedback("sad",`Not this one. ${item.lesson}`);return;}
    setFound(v=>[...v,item.id]);setScore(v=>v+100);
    if(found.length===4){audio.play("transition");setMood("happy");setMessage("Stage cleared! This home is safer because of you.");}
    else{audio.play("correct");feedback("happy",`Correct! ${item.lesson}`);}
  };
  const miss=()=>{if(complete)return;setMistakes(v=>v+1);audio.play("wrong");feedback("sad","That object is safe. Try again and look for medicine in a risky place.");};
  const advance=()=>{
    if(!complete)return;
    if(stage===6){setMode("complete");return;}
    setMode("transition");
    window.setTimeout(()=>{const next=stage+1;setStage(next);setFound([]);setMood("guide");
      setMessage(next<5?roomStages[next].instruction:next===5?"Drag or tap each medicine into its safest storage place.":"Choose the safest disposal action. Wrong choices can be retried.");
      setMode("play");},1050);
  };
  const restart=()=>{setMode("start");setStage(0);setScore(0);setFound([]);setStored([]);setSelected(null);setRound(0);setMistakes(0);setMood("guide");setMessage("Ready to make this home safer? I’ll guide you through every room.");};
  const place=(id:string,zone:string)=>{
    const item=storageItems.find(x=>x.id===id);if(!item||stored.includes(id))return;
    if(item.target===zone){setStored(v=>[...v,id]);setSelected(null);setScore(v=>v+100);
      if(stored.length===9){audio.play("transition");setMood("happy");setMessage("Stage cleared! Every item is now stored safely.");}
      else{audio.play("correct");feedback("happy",`Correct! ${item.name} → ${zone==="fridge"?"refrigerator":zone==="cabinet"?"locked dry cabinet":"pharmacist review"}.`);}}
    else{setMistakes(v=>v+1);audio.play("wrong");feedback("sad",`Not quite. Recheck the clue: “${item.cue}”.`);}
  };
  const answer=(choice:string)=>{
    const current=disposalRounds[round];if(!current)return;
    if(choice===current.answer){setScore(v=>v+100);
      if(round===4){audio.play("transition");setMood("happy");setMessage("Excellent! You completed the Home Medication Safety Mission.");}
      else{audio.play("correct");feedback("happy",`Correct! ${current.lesson}`);}
      window.setTimeout(()=>setRound(v=>v+1),750);}
    else{setMistakes(v=>v+1);audio.play("wrong");feedback("sad","That may harm people, animals or the environment. Please try again.");}
  };

  const ActiveIcon=stage<5?roomStages[stage].icon:stage===5?PackageCheck:Recycle;
  const count=stage<5?found.length:stage===5?stored.length:round;
  const total=stage===5?10:5;

  return <main className="game-shell">
    <header className="topbar">
      <div className="institutional-brand">
        <Image src="/assets/uitm-logo.png" alt="Universiti Teknologi MARA" width={180} height={76} priority />
        <div><strong>FAKULTI FARMASI</strong><span>UITM KAMPUS BERTAM</span></div>
      </div>
      <div className="game-title"><ShieldCheck/><div><strong>Pharmacy Safety Hunt</strong><span>Home Medication Safety Mission</span></div></div>
      <div className="score"><Star fill="currentColor"/><strong>{score.toLocaleString()}</strong><span>points</span></div>
      <button className="icon-button" onClick={audio.toggle} aria-label={audio.muted?"Turn sound on":"Mute sound"}>{audio.muted?<VolumeX/>:<Volume2/>}</button>
    </header>
    <nav className="stage-rail" aria-label="Game progress">{stageLabels.map((label,i)=><div key={label} className={`stage-dot ${i===stage?"active":""} ${i<stage||mode==="complete"?"done":""}`}><span>{i<stage||mode==="complete"?<Check/>:i+1}</span><small>{label}</small></div>)}</nav>

    {mode==="start"&&<section className="start-screen">
      <div className="start-art room-atlas"/>
      <div className="start-panel">
        <span className="eyebrow"><Sparkles/> 7 interactive stages</span>
        <h2>Can you make this home medicine-safe?</h2>
        <p>Search five rooms filled with realistic medicines and convincing lookalikes. Then sort storage needs and master safe disposal.</p>
        <div className="mission-grid"><span><ScanSearch/>Find 25 hazards</span><span><PackageCheck/>Sort 10 medicines</span><span><Recycle/>Solve 5 disposal cases</span></div>
        <button className="primary-button" onClick={start}><Play fill="currentColor"/>Start mission</button>
        <small>Sound begins after Start. Use the speaker button anytime.</small>
      </div>
      <Mascot mood={mood} message={message}/>
    </section>}

    {mode!=="start"&&mode!=="complete"&&<section className="play-layout">
      <div className="play-column">
        <div className="stage-heading">
          <div className="stage-title"><span><ActiveIcon/></span><div><p>{stage<5?room?.kicker:`Stage ${stage+1} · ${stage===5?"Follow the label":"Protect people and planet"}`}</p><h2>{stage<5?room?.title:stage===5?"Medication Storage Sort":"Safe Medicine Disposal"}</h2></div></div>
          <div className="counter"><strong>{count}/{total}</strong><span>{stage<5?"found":stage===5?"sorted":"solved"}</span></div>
        </div>

        {stage<5&&room&&<div className="scene-card">
          <button className="scene-canvas" onClick={miss} aria-label={`${room.title} hidden item scene`}>
            <span className={`scene-image ${room.atlas==="room"?"room-atlas":"station-atlas"}`} style={{backgroundPosition:`${room.atlas==="room"?room.panel*33.333:room.panel*50}% center`}}/>
            <span className="scene-shade"/>
          </button>
          <div className="marker-layer">{room.items.map(item=><Marker key={item.id} item={item} found={found.includes(item.id)} onChoose={()=>choose(item)}/>)}</div>
          <div className="instruction-chip"><ScanSearch/>{room.instruction}</div>
        </div>}

        {stage===5&&<div className="storage-board station-stage-2">
          <div className="storage-items">{storageItems.map(item=>{const done=stored.includes(item.id);return <button key={item.id} draggable={!done} disabled={done}
            className={`storage-card ${done?"done":""} ${selected===item.id?"selected":""}`} onClick={()=>{if(!done){setSelected(item.id);audio.play("drop");}}}
            onDragStart={e=>e.dataTransfer.setData("text/plain",item.id)}><span className="storage-thumb object-sprite" style={spriteStyle("medicine",item.sprite)}/><div><strong>{item.name}</strong><small>{done?"Placed safely ✓":item.cue}</small></div></button>;})}</div>
          <div className="storage-zones">{[
            {id:"fridge",title:"Refrigerator",note:"2–8°C · never freeze",icon:Snowflake},
            {id:"cabinet",title:"Locked dry cabinet",note:"High · cool · away from moisture",icon:LockKeyhole},
            {id:"pharmacist",title:"Ask a pharmacist",note:"Unknown, unlabelled or unclear",icon:Info},
          ].map(zone=>{const Icon=zone.icon;return <button key={zone.id} className="drop-zone" onClick={()=>selected&&place(selected,zone.id)}
            onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();place(e.dataTransfer.getData("text/plain"),zone.id);}}>
            <Icon/><strong>{zone.title}</strong><span>{zone.note}</span><small>Drop or tap here</small></button>;})}</div>
        </div>}

        {stage===6&&<div className="disposal-board station-stage-3">{round<5?<>
          <div className="disposal-item"><span className="disposal-medicine object-sprite" style={spriteStyle("medicine",disposalSprites[round])}/><p>What is the safest action for:</p><h3>{disposalRounds[round].item}?</h3></div>
          <div className="disposal-options">{disposalRounds[round].options.map(o=><button key={o.id} onClick={()=>answer(o.id)}><span>{o.label}</span><ChevronRight/></button>)}</div>
        </>:<div className="stage-win"><CheckCircle2/><h3>Disposal mission complete</h3><p>You chose safe, responsible actions for all five items.</p></div>}</div>}

        <div className="tip-strip"><Info/><p><strong>Safety note:</strong> {stage<5?room?.tip:stage===5?"Always follow the product label and pharmacist instructions. Only refrigerate medicines that specifically require it—and never freeze them.":"Use an authorised medicine-return service. Ask a pharmacist about local arrangements and safe sharps disposal."}</p></div>
      </div>
      <div className="guide-column"><Mascot mood={mood} message={message}/><div className="stage-summary"><div><span style={{width:`${Math.min(100,count/total*100)}%`}}/></div><p>{complete?"Stage complete":`${total-count} remaining`}</p><button className="primary-button" disabled={!complete} onClick={advance}>{stage===6?"See results":"Next stage"}<ArrowRight/></button></div></div>
    </section>}

    {mode==="transition"&&<div className="transition-screen"><div><Check/></div><p>Stage {stage+1} cleared</p><h2>{stageLabels[stage+1]} unlocked</h2><span><i/></span></div>}

    {mode==="complete"&&<section className="complete-screen">
      <div className="confetti"/>
      <Mascot mood="happy" message="Brilliant work! You now know how to spot, store and dispose of medicines more safely at home."/>
      <div className="result-card"><span className="result-badge"><ShieldCheck/></span><p>MISSION COMPLETE</p><h2>Home Medication Safety Champion</h2>
        <div className="final-score"><Star fill="currentColor"/><strong>{score.toLocaleString()}</strong><span>points</span></div>
        <div className="result-stats"><span><strong>40</strong>safety tasks</span><span><strong>7</strong>stages</span><span><strong>{mistakes}</strong>retries</span></div>
        <p className="final-rule">Keep medicines in original packaging, follow the label, store them securely, check expiry and appearance, and return unwanted items safely.</p>
        <button className="primary-button" onClick={restart}><RotateCcw/>Play again</button>
      </div>
    </section>}
    <footer className="game-footer">CREATED BY DR NUR &apos;AINUN MOKHTAR</footer>
  </main>;
}

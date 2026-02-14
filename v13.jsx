import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ===== おうちで しゅっぱつしんこう！ v13 =====
// サウンドエフェクト + スタンプカード

// ============ Sound System (Web Audio API) ============
var _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { return null; }
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}
function playTone(freq, dur, type, vol, delay) {
  var ctx = getAudioCtx(); if (!ctx) return;
  var t = ctx.currentTime + (delay || 0);
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol || 0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(t); osc.stop(t + dur);
}
function playNoise(dur, vol, delay) {
  var ctx = getAudioCtx(); if (!ctx) return;
  var t = ctx.currentTime + (delay || 0);
  var bufSize = ctx.sampleRate * dur;
  var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  var data = buf.getChannelData(0);
  for (var i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  var src = ctx.createBufferSource(); src.buffer = buf;
  var gain = ctx.createGain();
  gain.gain.setValueAtTime(vol || 0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(gain); gain.connect(ctx.destination);
  src.start(t); src.stop(t + dur);
}

var SFX = {
  partGet: function() {
    playTone(523, 0.12, "sine", 0.15, 0);
    playTone(659, 0.12, "sine", 0.15, 0.1);
    playTone(784, 0.2, "sine", 0.18, 0.2);
  },
  rapidTap: function() {
    playTone(800 + Math.random() * 200, 0.06, "square", 0.06);
  },
  swipeDone: function() {
    playTone(400, 0.15, "sine", 0.1, 0);
    playTone(600, 0.15, "sine", 0.1, 0.08);
    playTone(800, 0.15, "sine", 0.12, 0.16);
  },
  holdTick: function(p) {
    playTone(300 + p * 500, 0.05, "triangle", 0.06);
  },
  holdDone: function() {
    playTone(600, 0.15, "sine", 0.12, 0);
    playTone(900, 0.25, "sine", 0.15, 0.12);
  },
  doorClose: function() {
    playNoise(0.4, 0.08);
    playTone(200, 0.3, "sine", 0.06, 0.05);
  },
  bell: function() {
    for (var i = 0; i < 4; i++) {
      playTone(1200, 0.15, "sine", 0.12, i * 0.25);
      playTone(900, 0.15, "sine", 0.08, i * 0.25 + 0.12);
    }
  },
  horn: function() {
    playTone(280, 0.8, "sawtooth", 0.08);
    playTone(350, 0.8, "sawtooth", 0.06);
  },
  crossing: function() {
    for (var i = 0; i < 6; i++) playTone(1000, 0.1, "square", 0.07, i * 0.2);
  },
  gatangoton: function() {
    playTone(120, 0.08, "square", 0.04, 0);
    playTone(100, 0.08, "square", 0.04, 0.15);
    playTone(130, 0.08, "square", 0.04, 0.5);
    playTone(110, 0.08, "square", 0.04, 0.65);
  },
  tunnel: function() {
    playTone(80, 1.0, "sine", 0.06);
    playTone(120, 0.8, "triangle", 0.04, 0.1);
  },
  arrival: function() {
    var notes = [523, 659, 784, 1047];
    for (var i = 0; i < notes.length; i++) playTone(notes[i], 0.3, "sine", 0.12, i * 0.25);
  },
  celebrate: function() {
    var notes = [523, 587, 659, 784, 880, 1047];
    for (var i = 0; i < notes.length; i++) playTone(notes[i], 0.18, "sine", 0.1, i * 0.1);
  },
  stamp: function() {
    playTone(440, 0.08, "square", 0.08, 0);
    playTone(880, 0.15, "sine", 0.12, 0.06);
    playTone(1320, 0.25, "sine", 0.1, 0.15);
  },
  couple: function() {
    playNoise(0.15, 0.1);
    playTone(200, 0.2, "sawtooth", 0.08, 0.1);
    playTone(300, 0.15, "sine", 0.06, 0.2);
  },
};

// ============ Stamp Card Storage ============
var STAMP_KEY = "ouchi-stamps";
function todayStr() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function loadStamps(callback) {
  try {
    window.storage.get(STAMP_KEY).then(function(result) {
      callback(result ? JSON.parse(result.value) : []);
    }).catch(function() { callback([]); });
  } catch(e) { callback([]); }
}
function saveStamp(trainId, callback) {
  loadStamps(function(stamps) {
    var today = todayStr();
    var exists = stamps.some(function(s) { return s.date === today && s.trainId === trainId; });
    if (!exists) stamps.push({ date: today, trainId: trainId });
    // Keep last 60 days
    var cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 60);
    var cutStr = cutoff.getFullYear() + "-" + String(cutoff.getMonth()+1).padStart(2,"0") + "-" + String(cutoff.getDate()).padStart(2,"0");
    stamps = stamps.filter(function(s) { return s.date >= cutStr; });
    try {
      window.storage.set(STAMP_KEY, JSON.stringify(stamps)).then(function() {
        if (callback) callback(stamps);
      }).catch(function() { if (callback) callback(stamps); });
    } catch(e) { if (callback) callback(stamps); }
  });
}

// ============ Time of Day ============
function getTimeOfDay() {
  var h = new Date().getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 16) return "day";
  if (h >= 16 && h < 18) return "dusk";
  return "night";
}

var SKY_COLORS = {
  dawn:  { top:"#FF9E6B", mid:"#FFD1A3", low:"#FFE8CC", ground:"#E8DDD0" },
  day:   { top:"#87CEEB", mid:"#B0E0FF", low:"#E8F8FF", ground:"#F0F0E8" },
  dusk:  { top:"#5C3D6E", mid:"#D4738A", low:"#FFBEA0", ground:"#E0D0C0" },
  night: { top:"#0A0E2A", mid:"#1A1E40", low:"#2A3060", ground:"#282830" },
};
var MTN_COLORS = {
  dawn: ["#C09878","#B08868","#D0A888"], day: ["#6BAF7A","#5A9E6A","#7CBF8A"],
  dusk: ["#7A6080","#6A5070","#8A7090"], night:["#2A3050","#1E2540","#343860"],
};
var BLD_COLORS = {
  dawn: ["#B8A898","#A89888","#C0B0A0","#B0A090"],
  day:  ["#A8B4C4","#8899AA","#95A5B5","#B0BCC8"],
  dusk: ["#887080","#786070","#907888","#887080"],
  night:["#1A1E30","#202440","#181C2E","#222640"],
};
// Window glow: night/dusk windows glow warm
function winColor(tod, i, j, k) {
  if (tod === "night") return ((i+j+k)%3===0) ? "#FFE89F" : ((i+j+k)%5===0 ? "#88CCFF" : "#FFD870");
  if (tod === "dusk") return ((i+j+k)%3===0) ? "#FFD870" : "#E0C8B0";
  return ((i+j+k)%3===0) ? "#C8D8E8" : "#FFE89F";
}

// ============ Train Data ============
var TRAINS = [
  { id:"hayabusa",name:"はやぶさ",series:"E5けい",kind:"shinkansen",body:"#00894B",bodyLo:"#007A42",roof:"#CDCDCD",stripe1:"#E63780",stripe1W:5,stripe1Y:176,stripe2:"#FFFFFF",stripe2W:3,stripe2Y:182,nose:"#00894B",noseLo:"#006838",window:"#A8DFFF",winFrame:"#005E2B",winBg:"#003D1E",under:"#888",skirt:"#AAA",bogie:"#555",headlight:"rect",hlW:8,hlH:4,noseType:"e5",coupleWith:"komachi" },
  { id:"komachi",name:"こまち",series:"E6けい",kind:"shinkansen",body:"#CC1635",bodyLo:"#AA1028",roof:"#D0D0D0",stripe1:"#C0C0C0",stripe1W:6,stripe1Y:175,stripe2:"#FFFFFF",stripe2W:2,stripe2Y:182,nose:"#CC1635",noseLo:"#991020",window:"#A8DFFF",winFrame:"#8B1520",winBg:"#5E0E15",under:"#888",skirt:"#AAA",bogie:"#555",headlight:"rect",hlW:7,hlH:3,noseType:"e6",coupleWith:"hayabusa" },
  { id:"kagayaki",name:"かがやき",series:"E7けい",kind:"shinkansen",body:"#F0F0F0",bodyLo:"#E0E0E0",roof:"#1B62A0",stripe1:"#1B62A0",stripe1W:5,stripe1Y:174,stripe2:"#B87333",stripe2W:4,stripe2Y:180,nose:"#EAEAEA",noseLo:"#D8D8D8",window:"#A8DFFF",winFrame:"#155080",winBg:"#0D3050",under:"#888",skirt:"#B0B0B0",bogie:"#555",headlight:"round",hlW:6,hlH:5,noseType:"e7" },
  { id:"nozomi",name:"のぞみ",series:"N700けい",kind:"shinkansen",body:"#F5F5F5",bodyLo:"#E8E8E8",roof:"#D0D0D0",stripe1:"#2266AA",stripe1W:5,stripe1Y:177,stripe2:null,stripe2W:0,stripe2Y:0,nose:"#EDEDED",noseLo:"#DCDCDC",window:"#A8DFFF",winFrame:"#1C5D8A",winBg:"#0E3555",under:"#888",skirt:"#B0B0B0",bogie:"#555",headlight:"n700",hlW:10,hlH:4,noseType:"n700" },
  { id:"doctor_yellow",name:"ドクターイエロー",series:"923がた",kind:"shinkansen",body:"#FFD814",bodyLo:"#EBC400",roof:"#D8D0A0",stripe1:"#2266AA",stripe1W:5,stripe1Y:177,stripe2:null,stripe2W:0,stripe2Y:0,nose:"#F2CC00",noseLo:"#DDBB00",window:"#A8DFFF",winFrame:"#AA8800",winBg:"#775500",under:"#888",skirt:"#B0B0B0",bogie:"#555",headlight:"n700",hlW:10,hlH:4,noseType:"n700" },
  { id:"yamanote",name:"やまのてせん",series:"E235けい",kind:"commuter",body:"#D8D8D8",bodyLo:"#C8C8C8",roof:"#A0A0A0",stripe1:"#8DC21F",stripe1W:8,stripe1Y:175,stripe2:null,stripe2W:0,stripe2Y:0,nose:"#D0D0D0",noseLo:"#C0C0C0",window:"#A8DFFF",winFrame:"#666",winBg:"#444",under:"#777",skirt:"#999",bogie:"#555",headlight:"rect",hlW:12,hlH:3,noseType:"flat" },
  { id:"yokosuka",name:"よこすかせん",series:"E235けい",kind:"commuter",body:"#EAE6D6",bodyLo:"#DDD8C8",roof:"#999",stripe1:"#1B4D8A",stripe1W:6,stripe1Y:174,stripe2:"#EAE6D6",stripe2W:3,stripe2Y:181,nose:"#E2DED0",noseLo:"#D4D0C2",window:"#A8DFFF",winFrame:"#666",winBg:"#444",under:"#777",skirt:"#999",bogie:"#555",headlight:"rect",hlW:12,hlH:3,noseType:"flat" },
  { id:"sl",name:"SLたいじゅ",series:"C11がた",kind:"steam",body:"#1A1A1A",bodyLo:"#111",roof:"#222",stripe1:"#8B0000",stripe1W:3,stripe1Y:195,stripe2:null,stripe2W:0,stripe2Y:0,nose:"#1A1A1A",noseLo:"#111",window:"#C8B878",winFrame:"#444",winBg:"#333",under:"#333",skirt:"#444",bogie:"#333",headlight:"round",hlW:8,hlH:8,noseType:"steam" },
  { id:"linear",name:"リニア",series:"L0けい",kind:"shinkansen",body:"#EEF2F8",bodyLo:"#DEE6F0",roof:"#2060A0",stripe1:"#2060A0",stripe1W:5,stripe1Y:176,stripe2:"#55AADD",stripe2W:3,stripe2Y:182,nose:"#E8EEF6",noseLo:"#D0DAE8",window:"#88C8FF",winFrame:"#1B5599",winBg:"#0D3366",under:"#888",skirt:"#A0A8B0",bogie:"#555",headlight:"rect",hlW:6,hlH:3,noseType:"linear" },
];

// ============ Weather ============
function getWeather() {
  var r = Math.random();
  if (r < 0.25) return "rain";
  if (r < 0.38) return "rainbow";
  return "clear";
}

var ALL_STEPS = [
  { id:"prepare",label:"しゅっぱつ じゅんび",instruction:"くつを はこう！",emoji:"👟",partName:"しゃりん",partLabel:"しゃりん ゲット！",bgGrad:["#FFF5D6","#FFF0B8"],btnColor:"#FF9F43",interact:"rapid",hint:"れんだ！",goal:6 },
  { id:"walk1",label:"あるいて いこう",instruction:"てくてく あるこう！",emoji:"🚶",partName:"せんろ",partLabel:"せんろ ゲット！",bgGrad:["#D5F5E3","#A8E6CF"],btnColor:"#2ECC71",interact:"swipe",hint:"→ スワイプ！" },
  { id:"walk2",label:"どんどん いこう",instruction:"いいちょうし！",emoji:"💨",partName:"ボディ",partLabel:"ボディ ゲット！",bgGrad:["#FDEBEF","#F8C8D4"],btnColor:"#E74C8B",interact:"hold",hint:"ながおし！",holdMs:1500 },
  { id:"halfway",label:"はんぶん きたよ",instruction:"まどを つけよう！",emoji:"⭐",partName:"まど",partLabel:"まど ゲット！",bgGrad:["#D6EEF8","#AED8F0"],btnColor:"#3498DB",interact:"tap",hint:"タップ！" },
  { id:"walk3",label:"あとちょっと",instruction:"ドアを つけよう！",emoji:"🚪",partName:"ドア",partLabel:"ドア ゲット！",bgGrad:["#E8DAEF","#D2B4DE"],btnColor:"#8E44AD",interact:"swipe",hint:"→ スワイプ！" },
  { id:"walk4",label:"もうすこし",instruction:"やねを のせよう！",emoji:"🏗️",partName:"やね",partLabel:"やね ゲット！",bgGrad:["#FCF3CF","#F9E79F"],btnColor:"#F39C12",interact:"hold",hint:"ながおし！",holdMs:1200 },
  { id:"almost",label:"もうすぐ おうち",instruction:"パンタグラフを つけて！",emoji:"⚡",partName:"パンタグラフ",partLabel:"パンタグラフ ゲット！",bgGrad:["#D5F5E3","#B8E6C8"],btnColor:"#27AE60",interact:"rapid",hint:"れんだ！",goal:5 },
];

var STATION_NAMES=["はなえき","もりえき","かわえき","そらえき","ほしえき","にじえき"];
var DEFAULT_SETTINGS={stepCount:4,stationName:"おうち",runDuration:14};
function getSteps(c){
  // Steps: 0=しゃりん 1=せんろ 2=ボディ 3=まど 4=ドア 5=やね 6=パンタグラフ
  if(c<=2)return[ALL_STEPS[0],ALL_STEPS[2]]; // しゃりん→ボディ
  if(c===3)return[ALL_STEPS[0],ALL_STEPS[2],ALL_STEPS[3]]; // +まど
  if(c===4)return[ALL_STEPS[0],ALL_STEPS[1],ALL_STEPS[2],ALL_STEPS[3]]; // +せんろ
  if(c===5)return[ALL_STEPS[0],ALL_STEPS[1],ALL_STEPS[2],ALL_STEPS[3],ALL_STEPS[5]]; // +やね
  if(c===6)return[ALL_STEPS[0],ALL_STEPS[1],ALL_STEPS[2],ALL_STEPS[3],ALL_STEPS[4],ALL_STEPS[5]]; // +ドア
  return ALL_STEPS; // 7: all including パンタグラフ
}

// ============ Nose Paths ============
function noseE5(){return"M320,128 C330,128 348,128 358,130 C375,133 395,142 405,155 C412,165 415,175 415,178 C415,181 412,191 405,201 C395,214 375,222 358,225 C348,227 330,228 320,228";}
function noseE6(){return"M320,128 C332,128 352,128 365,131 C382,135 400,145 412,158 C418,166 420,174 420,178 C420,182 418,190 412,198 C400,211 382,221 365,225 C352,228 332,228 320,228";}
function noseE7(){return"M320,128 C335,128 355,133 368,143 C378,151 385,165 385,178 C385,191 378,205 368,213 C355,223 335,228 320,228";}
function noseN700(){return"M320,128 C328,128 340,129 352,132 C368,137 382,148 390,162 C394,170 395,175 395,178 C395,181 394,186 390,194 C382,208 368,219 352,224 C340,227 328,228 320,228";}
function noseFlat(){return"M320,128 L332,128 Q340,128 340,138 L340,218 Q340,228 332,228 L320,228";}
function noseSteam(){return"M320,145 L355,145 Q365,145 365,155 L365,210 Q365,218 355,218 L320,218";}
function noseLinear(){return"M320,128 C335,128 355,128 375,132 C395,138 415,150 425,165 C428,170 430,175 430,178 C430,181 428,186 425,191 C415,206 395,218 375,224 C355,228 335,228 320,228";}
var NOSE_FNS={e5:noseE5,e6:noseE6,e7:noseE7,n700:noseN700,flat:noseFlat,steam:noseSteam,linear:noseLinear};
var NOSE_TIP_X={e5:413,e6:418,e7:383,n700:393,flat:338,steam:363,linear:428};

// ============ RunTrainSVG (compact for running/passing) ============
function RunTrainSVG({ train:t, flip, svgFlip, scaleY, hideTrack }) {
  var id="run-"+t.id+(flip||svgFlip?"-f":"");
  var isSteam=t.kind==="steam";
  var nosePath=NOSE_FNS[t.noseType]();
  var tipX=NOSE_TIP_X[t.noseType];
  var bx=70,by=isSteam?145:128,bw=250,bh=isSteam?73:100,bb=by+bh;
  var wins=isSteam?[{x:88,y:155,w:22,h:16}]:t.kind==="commuter"?[0,1,2,3,4,5].map(function(i){return{x:90+i*36,y:140,w:24,h:26};}):
    [0,1,2,3,4].map(function(i){return{x:100+i*40,y:142,w:26,h:22};});
  var cwx=t.noseType==="flat"?308:300;
  var cww=t.noseType==="flat"?18:20;
  // CSS flip for HTML contexts, SVG transform flip for nested SVG contexts
  var txf = flip ? "scaleX(-1)" : "none";
  var innerTransform = svgFlip ? "translate(480,0) scale(-1,1)" : null;

  return (
    <svg viewBox="0 0 480 275" style={{width:"100%",height:"auto",display:"block",overflow:"visible",transform:svgFlip?"none":txf}}>
      <defs>
        <linearGradient id={"bg-"+id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.body}/><stop offset="100%" stopColor={t.bodyLo}/></linearGradient>
        <linearGradient id={"sh-"+id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.35)"/><stop offset="100%" stopColor="rgba(0,0,0,0.05)"/></linearGradient>
        <clipPath id={"bc-"+id}><rect x={bx} y={by} width={bw} height={bh} rx={isSteam?4:10}/><path d={nosePath}/></clipPath>
        <filter id={"sd-"+id}><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15"/></filter>
      </defs>
      <g transform={innerTransform||undefined}>
      {!hideTrack && <g><rect x={0} y={250} width={480} height={3.5} rx={1.5} fill="#8B7355"/><rect x={0} y={261} width={480} height={3.5} rx={1.5} fill="#8B7355"/></g>}
      {isSteam && <g><rect x={160} y={148} width={195} height={70} rx={35} fill="#222"/><rect x={340} y={145} width={25} height={73} rx={4} fill="#2A2A2A"/><rect x={348} y={115} width={14} height={33} rx={3} fill="#333"/><rect x={345} y={112} width={20} height={6} rx={2} fill="#444"/><ellipse cx={280} cy={148} rx={12} ry={8} fill="#333"/><ellipse cx={355} cy={105} rx={10} ry={7} fill="#AAA" opacity={0.35}><animate attributeName="cy" values="105;60" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0" dur="2.5s" repeatCount="indefinite"/></ellipse></g>}
      <rect x={bx+8} y={bb} width={bw-16} height={12} rx={2} fill={t.under}/>
      <rect x={bx+4} y={bb+8} width={bw-8} height={8} rx={2} fill={t.skirt}/>
      <g filter={"url(#sd-"+id+")"}>
        <rect x={bx} y={by} width={bw} height={bh} rx={isSteam?4:10} fill={"url(#bg-"+id+")"}/>
        <path d={nosePath} fill={t.nose}/>
        {!isSteam && <path d={"M"+bx+","+(by+4)+" Q"+(bx-12)+","+(by+bh/2)+" "+bx+","+(bb-4)} fill={t.bodyLo}/>}
        {!isSteam && <circle cx={bx-5} cy={by+bh/2} r={5} fill={t.under} stroke={t.bodyLo} strokeWidth={1.5}/>}
        <g clipPath={"url(#bc-"+id+")"}>
          <rect x={bx-20} y={by} width={bw+tipX-bx+20} height={bh} fill={"url(#sh-"+id+")"}/>
          <rect x={bx-20} y={t.stripe1Y} width={tipX-bx+30} height={t.stripe1W} fill={t.stripe1}/>
          {t.stripe2 && <rect x={bx-20} y={t.stripe2Y} width={tipX-bx+30} height={t.stripe2W} fill={t.stripe2}/>}
          <rect x={bx-5} y={by-2} width={bw+tipX-bx+15} height={14} rx={5} fill={t.roof}/>
        </g>
        <ellipse cx={isSteam?tipX+2:tipX-4} cy={isSteam?155:170} rx={t.hlW/2} ry={t.hlH/2} fill="#FFFBE0"/>
        <ellipse cx={isSteam?tipX+2:tipX-4} cy={isSteam?155:170} rx={t.hlW/2+5} ry={t.hlH/2+4} fill="#FFFBE0" opacity={0.2}><animate attributeName="opacity" values="0.2;0.45;0.2" dur="0.8s" repeatCount="indefinite"/></ellipse>
        {!isSteam && <rect x={bx-8} y={185} width={6} height={3.5} rx={1.5} fill="#E74C3C" opacity={0.85}/>}
      </g>
      {!isSteam && <g><line x1={bx+70} y1={by+14} x2={bx+70} y2={bb-2} stroke="rgba(0,0,0,0.1)" strokeWidth={2}/><line x1={bx+170} y1={by+14} x2={bx+170} y2={bb-2} stroke="rgba(0,0,0,0.1)" strokeWidth={2}/></g>}
      {wins.map(function(w,i){return (<g key={i}><rect x={w.x} y={w.y} width={w.w} height={w.h} rx={3} fill={t.winBg}/><rect x={w.x+1.5} y={w.y+1.5} width={w.w-3} height={w.h-3} rx={2} fill={t.window}/></g>);})}
      {!isSteam && <g><rect x={cwx} y={144} width={cww} height={18} rx={3} fill={t.winBg}/><rect x={cwx+1.5} y={145.5} width={cww-3} height={15} rx={2} fill="#88C8FF"/></g>}
      {isSteam ? [150,180,210,268,288].map(function(cx,i){return (<circle key={i} cx={cx} cy={i<3?248:250} r={i<3?12:7} fill={i<3?"#8B0000":"#4A4A4A"}/>);}) :
        [[bx+30,bx+56],[bx+bw-56,bx+bw-30]].map(function(pair,gi){return (<g key={gi}><rect x={pair[0]-10} y={bb+12} width={pair[1]-pair[0]+20} height={7} rx={2} fill={t.bogie}/>{[pair[0],pair[1]].map(function(cx,wi){return (<g key={wi}><circle cx={cx} cy={bb+20} r={8.5} fill="#3A3A3A"/><circle cx={cx} cy={bb+20} r={6} fill="#5A5A5A"/><circle cx={cx} cy={bb+20} r={2} fill="#888"/><animateTransform attributeName="transform" type="rotate" from={"0 "+cx+" "+(bb+20)} to={"360 "+cx+" "+(bb+20)} dur="0.25s" repeatCount="indefinite"/></g>);})}</g>);})}
      {!isSteam && t.noseType!=="flat" && <g opacity={0.5}><line x1={200} y1={by} x2={195} y2={by-14} stroke="#666" strokeWidth={2}/><line x1={205} y1={by} x2={210} y2={by-14} stroke="#666" strokeWidth={2}/><line x1={192} y1={by-14} x2={213} y2={by-14} stroke="#555" strokeWidth={2.5}/><line x1={198} y1={by-24} x2={208} y2={by-24} stroke="#444" strokeWidth={2}/></g>}
      </g>
    </svg>
  );
}

// ============ TrainSVG (collect screen, from v10) ============
function TrainSVG({ train:t,parts,animating,animProgress,stepCount }) {
  var id=t.id;var allPn=getSteps(stepCount||4).map(function(s){return s.partName;});
  var hw=parts.includes("しゃりん"),ht=parts.includes("せんろ"),hwin=parts.includes("まど"),hb=parts.includes("ボディ");
  var hdoor=parts.includes("ドア"),hroof=parts.includes("やね"),hpan=parts.includes("パンタグラフ");
  // If step is not in current set, auto-show when body is present
  var showDoors=allPn.includes("ドア")?hdoor:hb;
  var showRoof=allPn.includes("やね")?hroof:hb;
  var showPan=allPn.includes("パンタグラフ")?hpan:hb;
  var isSteam=t.kind==="steam";
  var getOff=function(pn){if(animating!==pn)return{};var r=1-(animProgress||0);var m={
    "しゃりん":{transform:"translateY("+r*50+"px)",opacity:animProgress},
    "せんろ":{opacity:animProgress},
    "まど":{transform:"translateY("+r*-40+"px)",opacity:animProgress},
    "ボディ":{transform:"translateY("+r*-60+"px)",opacity:animProgress},
    "ドア":{transform:"translateX("+r*30+"px)",opacity:animProgress},
    "やね":{transform:"translateY("+r*-30+"px)",opacity:animProgress},
    "パンタグラフ":{transform:"translateY("+r*-40+"px)",opacity:animProgress}
  };return m[pn]||{};};
  var wS=getOff("しゃりん"),tS=getOff("せんろ"),winS=getOff("まど"),bS=getOff("ボディ");
  var doorS=getOff("ドア"),roofS=getOff("やね"),panS=getOff("パンタグラフ");
  var nosePath=NOSE_FNS[t.noseType]();var tipX=NOSE_TIP_X[t.noseType];
  var bx=70,by=isSteam?145:128,bw=250,bh=isSteam?73:100,bb=by+bh;
  var wins=isSteam?[{x:88,y:155,w:22,h:16}]:t.kind==="commuter"?[0,1,2,3,4,5].map(function(i){return{x:90+i*36,y:140,w:24,h:26};}):
    [0,1,2,3,4].map(function(i){return{x:100+i*40,y:142,w:26,h:22};});
  // Door positions between windows
  var doors=isSteam?[]:[{x:83,y:140,w:14,h:44},{x:215,y:140,w:14,h:44}];
  if(t.kind==="commuter")doors=[{x:78,y:138,w:12,h:48},{x:150,y:138,w:12,h:48},{x:222,y:138,w:12,h:48}];

  return (
    <svg viewBox="0 0 480 275" style={{width:"100%",maxWidth:480,height:"auto",display:"block",margin:"0 auto",overflow:"visible"}}>
      <defs>
        <linearGradient id={"bg-"+id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.body}/><stop offset="100%" stopColor={t.bodyLo}/></linearGradient>
        <clipPath id={"bc-"+id}><rect x={bx} y={by} width={bw} height={bh} rx={isSteam?4:10}/><path d={nosePath}/></clipPath>
        <filter id={"sd-"+id}><feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15"/></filter>
      </defs>
      {/* せんろ */}
      <g style={Object.assign({opacity:ht?1:0.12},ht&&tS.opacity!==undefined?{opacity:tS.opacity}:{})}>
        <rect x={0} y={250} width={480} height={3.5} rx={1.5} fill={ht?"#8B7355":"#ddd"}/><rect x={0} y={261} width={480} height={3.5} rx={1.5} fill={ht?"#8B7355":"#ddd"}/>
        {[...Array(20)].map(function(_,i){return <rect key={i} x={4+i*24} y={247} width={8} height={20} rx={1.5} fill={ht?"#A0926B":"#e8e8e8"}/>;})}
      </g>
      {/* 台車・スカート (ボディ依存) */}
      <g style={Object.assign({opacity:hb?1:0.12},hb?bS:{})}><rect x={bx+8} y={bb} width={bw-16} height={12} rx={2} fill={hb?t.under:"#ddd"}/><rect x={bx+4} y={bb+8} width={bw-8} height={8} rx={2} fill={hb?t.skirt:"#e8e8e8"}/></g>
      {/* ボディ本体 */}
      <g style={Object.assign({opacity:hb?1:0.12},hb?bS:{})} filter={hb?"url(#sd-"+id+")":undefined}>
        <rect x={bx} y={by} width={bw} height={bh} rx={isSteam?4:10} fill={hb?"url(#bg-"+id+")":"#e8e8e8"}/><path d={nosePath} fill={hb?t.nose:"#e0e0e0"}/>
        {hb && <g clipPath={"url(#bc-"+id+")"}><rect x={bx-20} y={t.stripe1Y} width={tipX-bx+30} height={t.stripe1W} fill={t.stripe1}/>{t.stripe2&&<rect x={bx-20} y={t.stripe2Y} width={tipX-bx+30} height={t.stripe2W} fill={t.stripe2}/>}</g>}
        {hb && <ellipse cx={isSteam?tipX+2:tipX-4} cy={isSteam?155:170} rx={t.hlW/2} ry={t.hlH/2} fill="#FFFBE0"/>}
      </g>
      {/* やね (独立描画) */}
      <g style={Object.assign({opacity:showRoof?1:0.12},showRoof?roofS:{})}>
        {hb ? <g clipPath={"url(#bc-"+id+")"}><rect x={bx-5} y={by-2} width={bw+tipX-bx+15} height={14} rx={5} fill={showRoof?t.roof:"#ddd"}/></g>
         : <rect x={bx} y={by} width={bw} height={14} rx={isSteam?4:8} fill={showRoof?t.roof:"#ddd"}/>}
      </g>
      {/* まど */}
      <g style={Object.assign({opacity:hwin?1:0.12},hwin?winS:{})}>
        {wins.map(function(w,i){return (<g key={i}><rect x={w.x} y={w.y} width={w.w} height={w.h} rx={3} fill={hwin?t.winBg:"#ddd"}/><rect x={w.x+1.5} y={w.y+1.5} width={w.w-3} height={w.h-3} rx={2} fill={hwin?t.window:"#e5e5e5"}/></g>);})}
      </g>
      {/* ドア (独立描画) */}
      {doors.length>0 && <g style={Object.assign({opacity:showDoors?1:0.12},showDoors?doorS:{})}>
        {doors.map(function(d,i){return (<g key={"d"+i}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={2} fill={showDoors?(t.bodyLo||"#C8C8C8"):"#ddd"} stroke={showDoors?"rgba(0,0,0,0.15)":"#ccc"} strokeWidth={1}/>
          <line x1={d.x+d.w/2} y1={d.y+4} x2={d.x+d.w/2} y2={d.y+d.h-4} stroke={showDoors?"rgba(0,0,0,0.12)":"#ccc"} strokeWidth={0.8}/>
          <rect x={d.x+d.w-3.5} y={d.y+d.h/2-2} width={2} height={4} rx={0.5} fill={showDoors?"#999":"#ccc"}/>
        </g>);})}
      </g>}
      {/* パンタグラフ (新幹線・通勤電車のみ) */}
      {!isSteam && <g style={Object.assign({opacity:showPan?1:0.12},showPan?panS:{})}>
        <g transform="translate(200, 0)">
          {/* 基台 */}
          <rect x={-6} y={by-2} width={12} height={5} rx={1.5} fill={showPan?"#555":"#ccc"}/>
          {/* 下腕 */}
          <line x1={0} y1={by-2} x2={-10} y2={by-28} stroke={showPan?"#666":"#ccc"} strokeWidth={2.5} strokeLinecap="round"/>
          <line x1={0} y1={by-2} x2={10} y2={by-28} stroke={showPan?"#666":"#ccc"} strokeWidth={2.5} strokeLinecap="round"/>
          {/* 上腕 */}
          <line x1={-10} y1={by-28} x2={-4} y2={by-48} stroke={showPan?"#777":"#ccc"} strokeWidth={2} strokeLinecap="round"/>
          <line x1={10} y1={by-28} x2={4} y2={by-48} stroke={showPan?"#777":"#ccc"} strokeWidth={2} strokeLinecap="round"/>
          {/* 集電板(すり板) */}
          <rect x={-14} y={by-52} width={28} height={3} rx={1} fill={showPan?"#444":"#bbb"}/>
          {/* ばね */}
          <line x1={-3} y1={by-10} x2={-8} y2={by-20} stroke={showPan?"#888":"#ccc"} strokeWidth={1} strokeDasharray="2,2"/>
          <line x1={3} y1={by-10} x2={8} y2={by-20} stroke={showPan?"#888":"#ccc"} strokeWidth={1} strokeDasharray="2,2"/>
          {/* 架線(電線) */}
          {showPan && <line x1={-80} y1={by-54} x2={80} y2={by-54} stroke="#333" strokeWidth={1.5} opacity={0.3}/>}
        </g>
      </g>}
      {/* しゃりん */}
      <g style={Object.assign({opacity:hw?1:0.12},hw?wS:{})}>
        {isSteam?[150,180,210,268,288].map(function(cx,i){return <circle key={i} cx={cx} cy={i<3?248:250} r={i<3?12:7} fill={hw?(i<3?"#8B0000":"#4A4A4A"):"#d0d0d0"}/>;}):
        [[bx+30,bx+56],[bx+bw-56,bx+bw-30]].map(function(pair,gi){return (<g key={gi}>{hw&&<rect x={pair[0]-10} y={bb+12} width={pair[1]-pair[0]+20} height={7} rx={2} fill={t.bogie}/>}{[pair[0],pair[1]].map(function(cx,wi){return (<g key={wi}><circle cx={cx} cy={bb+20} r={8.5} fill={hw?"#3A3A3A":"#d0d0d0"}/><circle cx={cx} cy={bb+20} r={6} fill={hw?"#5A5A5A":"#ddd"}/></g>);})}</g>);})}
      </g>
      {/* パーツゲット きらきら */}
      {animating&&(animProgress||0)>0.85&&<g>{[{cx:140,cy:238},{cx:200,cy:228},{cx:260,cy:234}].map(function(s,i){return (<g key={i}><line x1={s.cx-8} y1={s.cy} x2={s.cx+8} y2={s.cy} stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" fill="freeze"/></line><line x1={s.cx} y1={s.cy-8} x2={s.cx} y2={s.cy+8} stroke="#FFD700" strokeWidth={2.5} strokeLinecap="round"><animate attributeName="opacity" values="1;0" dur="0.6s" fill="freeze"/></line></g>);})}</g>}
    </svg>
  );
}

// ============ Depot Mini ============
function DepotTrainSVG({train:t}){var id="dep-"+t.id;var isSteam=t.kind==="steam";var isFlat=t.noseType==="flat";
var mn=t.noseType==="e5"||t.noseType==="e6"?"M135,8 C145,8 158,14 164,24 C166,28 166,32 164,36 C158,46 145,52 135,52":t.noseType==="e7"?"M135,8 C148,10 158,18 160,30 C158,42 148,50 135,52":t.noseType==="n700"?"M135,8 C144,9 154,15 160,24 C162,28 162,32 160,36 C154,45 144,51 135,52":isFlat?"M135,8 L145,8 Q150,8 150,15 L150,45 Q150,52 145,52 L135,52":t.noseType==="steam"?"M135,14 L155,14 Q160,14 160,20 L160,44 Q160,50 155,50 L135,50":t.noseType==="linear"?"M135,8 C150,8 168,14 176,24 C178,28 178,32 176,36 C168,46 150,52 135,52":"M135,8 C150,8 165,16 172,30 C165,44 150,52 135,52";
// nose tip X for headlight placement
var ntx=t.noseType==="e5"?162:t.noseType==="e6"?162:t.noseType==="e7"?158:t.noseType==="n700"?158:t.noseType==="linear"?174:isFlat?148:t.noseType==="steam"?158:170;
return (<svg viewBox="0 0 200 62" style={{width:"100%",height:"100%"}}><defs><linearGradient id={"dbg-"+id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.body}/><stop offset="100%" stopColor={t.bodyLo}/></linearGradient><clipPath id={"dc-"+id}><rect x={15} y={8} width={120} height={44} rx={isSteam?3:7}/><path d={mn}/></clipPath></defs><rect x={0} y={55} width={200} height={2} rx={1} fill="#8B7355"/><rect x={0} y={59} width={200} height={2} rx={1} fill="#8B7355"/><rect x={18} y={48} width={116} height={5} rx={1.5} fill={t.under}/><rect x={15} y={8} width={120} height={44} rx={isSteam?3:7} fill={"url(#dbg-"+id+")"}/><path d={mn} fill={t.nose}/><g clipPath={"url(#dc-"+id+")"}><rect x={0} y={30} width={200} height={t.stripe1W*0.8} fill={t.stripe1}/>{t.stripe2&&<rect x={0} y={30+t.stripe1W*0.8+1} width={200} height={t.stripe2W*0.7} fill={t.stripe2}/>}<rect x={0} y={4} width={200} height={7} rx={3} fill={t.roof}/></g>{!isSteam&&[0,1,2].map(function(i){return <rect key={i} x={28+i*30} y={16} width={18} height={12} rx={2.5} fill={t.window} stroke={t.winFrame} strokeWidth={1}/>;})}{isSteam&&<rect x={28} y={18} width={14} height={10} rx={2} fill={t.window}/>}<ellipse cx={ntx} cy={30} rx={2.5} ry={2} fill="#FFFBE0"/><circle cx={12} cy={30} r={2.5} fill="#AAA"/>{isSteam?[30,48,66,100,115].map(function(cx,i){return <circle key={i} cx={cx} cy={56} r={i<3?5:3.5} fill={i<3?"#8B0000":"#4A4A4A"}/>;}):
[32,50,104,122].map(function(cx,i){return <circle key={i} cx={cx} cy={56} r={4} fill="#444"/>;})}{isSteam&&<rect x={148} y={2} width={8} height={14} rx={2} fill="#333"/>}</svg>);}

// ============ Departure Sequence Screen ============
// ============ Station Platform SVG ============
function PlatformSVG({ showTrain, train, trainOffsetX, coupled, coupledTrain, doorsLabel, stationLabel, sublabel, boardText, children }) {
  // #1 fix: unique gradient IDs per instance
  var pid = useMemo(function(){ return "pl" + Math.random().toString(36).slice(2,7); }, []);
  return (
    <svg viewBox="0 0 480 320" style={{width:"100%",maxWidth:520,height:"auto",display:"block"}}>
      <defs>
        <linearGradient id={pid+"s"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB"/><stop offset="60%" stopColor="#B0E0FF"/><stop offset="100%" stopColor="#D8E8F0"/>
        </linearGradient>
        <linearGradient id={pid+"e"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D0C8B8"/><stop offset="100%" stopColor="#A09080"/>
        </linearGradient>
        <linearGradient id={pid+"t"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E0D4"/><stop offset="40%" stopColor="#DDD5C8"/><stop offset="100%" stopColor="#D0C8BC"/>
        </linearGradient>
        <linearGradient id={pid+"r"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#606870"/><stop offset="100%" stopColor="#505058"/>
        </linearGradient>
        {/* #14 fix: pattern instead of 60 circles */}
        <pattern id={pid+"b"} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.5" fill="#9A9080" opacity="0.5"/>
          <circle cx="12" cy="11" r="2" fill="#7A7060" opacity="0.4"/>
          <circle cx="8" cy="15" r="1.5" fill="#8A8070" opacity="0.45"/>
        </pattern>
      </defs>

      <rect x={0} y={0} width={480} height={200} fill={"url(#"+pid+"s)"}/>

      {[20,60,95,140,180,230,280,330,370,410,440].map(function(x,i){
        var h = 25 + (i*17)%35; var w = 18 + (i*11)%16;
        return <rect key={"b"+i} x={x} y={118-h} width={w} height={h} rx={1} fill={["#B8C4D0","#A0AABB","#C0C8D4"][i%3]} opacity={0.4}/>;
      })}

      <rect x={10} y={45} width={460} height={8} rx={2} fill={"url(#"+pid+"r)"}/>
      <rect x={10} y={53} width={460} height={2} fill="#484850"/>
      {[...Array(23)].map(function(_,i){ return (
        <rect key={"rp"+i} x={10+i*20} y={46} width={18} height={6} rx={1} fill={i%2===0?"#586068":"#505860"} opacity={0.6}/>
      );})}
      {[40,130,220,310,400].map(function(x,i){ return (
        <g key={"pil"+i}>
          <rect x={x} y={55} width={7} height={148} fill="#6B6B72"/>
          <rect x={x-2} y={55} width={11} height={5} rx={1} fill="#787880"/>
          <rect x={x-2} y={198} width={11} height={5} rx={1} fill="#787880"/>
        </g>
      );})}

      <rect x={0} y={203} width={480} height={42} fill={"url(#"+pid+"t)"}/>
      {[...Array(24)].map(function(_,i){ return (
        <line key={"tl"+i} x1={i*20} y1={203} x2={i*20} y2={245} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>
      );})}
      <line x1={0} y1={222} x2={480} y2={222} stroke="rgba(0,0,0,0.05)" strokeWidth={1}/>
      <rect x={0} y={200} width={480} height={4} rx={1} fill="#FFD814"/>
      {[...Array(48)].map(function(_,i){ return (
        <circle key={"td"+i} cx={5+i*10} cy={198} r={2} fill="#FFD814" opacity={0.7}/>
      );})}
      <rect x={0} y={245} width={480} height={12} fill={"url(#"+pid+"e)"}/>
      <line x1={0} y1={245} x2={480} y2={245} stroke="rgba(0,0,0,0.15)" strokeWidth={1}/>

      <rect x={0} y={257} width={480} height={63} fill="#8B8070"/>
      <rect x={0} y={257} width={480} height={63} fill={"url(#"+pid+"b)"}/>
      <rect x={0} y={275} width={480} height={3.5} rx={1} fill="#5A5040"/>
      <rect x={0} y={275} width={480} height={1.5} rx={0.5} fill="#8A7860"/>
      <rect x={0} y={290} width={480} height={3.5} rx={1} fill="#5A5040"/>
      <rect x={0} y={290} width={480} height={1.5} rx={0.5} fill="#8A7860"/>
      {[...Array(32)].map(function(_,i){ return (
        <rect key={"tie"+i} x={5+i*15} y={272} width={8} height={24} rx={1} fill="#6A6050" opacity={0.7}/>
      );})}

      <g transform="translate(200, 62)">
        <rect x={0} y={0} width={80} height={4} fill="#666"/>
        <rect x={10} y={4} width={2} height={12} fill="#888"/>
        <rect x={68} y={4} width={2} height={12} fill="#888"/>
        <rect x={2} y={16} width={76} height={36} rx={4} fill="#fff" stroke="#444" strokeWidth={1.5}/>
        <text x={40} y={29} textAnchor="middle" fontSize={6} fill="#aaa" fontWeight={700}>{sublabel || "えき"}</text>
        <text x={40} y={42} textAnchor="middle" fontSize={11} fill="#333" fontWeight={900} fontFamily="'Zen Maru Gothic', sans-serif">{stationLabel || ""}</text>
      </g>

      <g transform="translate(350, 172)">
        <rect x={0} y={18} width={40} height={3} rx={1} fill="#8B6040"/>
        <rect x={2} y={10} width={36} height={3} rx={1} fill="#9B7050"/>
        <rect x={3} y={13} width={2} height={15} fill="#6A4828"/>
        <rect x={35} y={13} width={2} height={15} fill="#6A4828"/>
        <rect x={18} y={13} width={2} height={15} fill="#6A4828"/>
      </g>

      <g transform="translate(60, 130)">
        <rect x={0} y={0} width={22} height={72} rx={2} fill="#CC3333"/>
        <rect x={2} y={4} width={18} height={30} rx={1} fill="#FFE8D0"/>
        <rect x={5} y={8} width={4} height={6} rx={1} fill="#E74C3C" opacity={0.6}/>
        <rect x={12} y={8} width={4} height={6} rx={1} fill="#3498DB" opacity={0.6}/>
        <rect x={5} y={18} width={4} height={6} rx={1} fill="#2ECC71" opacity={0.6}/>
        <rect x={12} y={18} width={4} height={6} rx={1} fill="#F39C12" opacity={0.6}/>
        <rect x={3} y={40} width={16} height={8} rx={1} fill="#222"/>
      </g>

      {/* #9 fix: boardText prop for departure vs arrival */}
      <g transform="translate(145, 80)">
        <rect x={0} y={0} width={60} height={28} rx={3} fill="#1A1A2A"/>
        <rect x={2} y={2} width={56} height={24} rx={2} fill="#0A0A1A"/>
        <text x={30} y={12} textAnchor="middle" fontSize={5} fill="#FF8800" fontWeight={700}>{train ? train.name : ""}</text>
        <text x={30} y={21} textAnchor="middle" fontSize={4.5} fill="#00FF88" fontWeight={600}>{boardText || "まもなく はっしゃ"}</text>
      </g>

      {/* Train on track */}
      {showTrain && (function(){
        if (coupled && coupledTrain) {
          // Two trains scaled to fit platform. Each SVG is 480 wide, body ~70..420.
          // At scale 0.38 each is ~182px wide. Two side by side with overlap at ~-40 gap.
          return (
            <g transform={"translate("+(trainOffsetX||0)+",0)"}>
              <g transform="translate(-30, 120) scale(0.38)">
                <RunTrainSVG train={coupledTrain} svgFlip hideTrack/>
              </g>
              <g transform="translate(145, 120) scale(0.38)">
                <RunTrainSVG train={train} hideTrack/>
              </g>
            </g>
          );
        }
        return (
          <g transform={"translate("+(trainOffsetX||0)+",0)"}>
            <g transform="translate(30, 100) scale(0.55)">
              <RunTrainSVG train={train} hideTrack/>
            </g>
          </g>
        );
      })()}

      {doorsLabel && <text x={240} y={180} textAnchor="middle" fontSize={13} fill="#E74C3C" fontWeight={900} fontFamily="'Zen Maru Gothic', sans-serif" opacity={0.9}>{doorsLabel}</text>}

      {children}
    </svg>
  );
}

function DepartureScreen({ train, coupled, coupledTrain, onDepart }) {
  var F = "'Zen Maru Gothic', sans-serif";
  var [step, setStep] = useState(0);
  var stepLabels = ["ホームに とうちゃく！", "ドアが しまります", "🔔 はっしゃ ベル！", "しゅっぱつ しんこう！"];
  var trainIcon = train.kind === "steam" ? "🚂" : "🚄";
  // #4 fix: use ref for onDepart to avoid stale closure
  var onDepartRef = useRef(onDepart);
  onDepartRef.current = onDepart;

  useEffect(function() {
    var timers = [
      setTimeout(function(){ setStep(1); SFX.doorClose(); }, 1800),
      setTimeout(function(){ setStep(2); SFX.bell(); }, 3200),
      setTimeout(function(){ setStep(3); SFX.horn(); }, 4800),
      setTimeout(function(){ onDepartRef.current(); }, 6500),
    ];
    return function() { timers.forEach(clearTimeout); };
  }, []);

  // #5 fix: removed unused trainOx variable
  var doorsText = step === 1 ? "プシュー…" : null;

  return (
    <div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#E8F0F8 0%,#D8E4EE 50%,#C8D4DE 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F,position:"relative",overflow:"hidden",padding:"16px"}}>
      <div style={{width:"100%",maxWidth:520,position:"relative"}}>
        <div style={{transition:step>=3?"transform 1.5s cubic-bezier(0.25,0.46,0.45,0.94)":"none",transform:step>=3?"translateX(60%)":"translateX(0)"}}>
          <PlatformSVG
            showTrain
            train={train}
            trainOffsetX={0}
            coupled={coupled}
            coupledTrain={coupledTrain}
            doorsLabel={doorsText}
            stationLabel={train.name}
            sublabel="のりば"
            boardText="まもなく はっしゃ"
          />
        </div>
      </div>

      {step === 2 && <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",zIndex:10}}>
        <div style={{fontSize:"3rem",animation:"bellSwing 0.3s ease-in-out infinite alternate",filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.2))"}}>🔔</div>
      </div>}

      <div style={{marginTop:20,textAlign:"center",zIndex:10}}>
        <div key={step} style={{fontSize:"1.5rem",fontWeight:900,color:"#5B3A1A",letterSpacing:3,animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",textShadow:"0 1px 4px rgba(255,255,255,0.8)"}}>
          {trainIcon} {stepLabels[step]}
        </div>
      </div>
    </div>
  );
}

// ============ Parallax Bg (time-of-day aware, 2.5D perspective) ============
function ParallaxBg({ dist, season, tod }) {
  var tw = 1200;
  var ox = [-(dist*0.08)%tw, -(dist*0.18)%tw, -(dist*0.4)%tw, -(dist*0.7)%tw, -(dist*1.0)%tw];
  var mtnC = season==="snow" ? ["#ccdde8","#b8ccd8","#d0dce6"] : MTN_COLORS[tod];
  var bldC = BLD_COLORS[tod];
  var isNight = tod === "night";
  var isDusk = tod === "dusk";
  var groundC = season==="snow"?"#E8E8F0":isNight?"#2A3A2A":"#7CB870";
  var groundC2 = season==="snow"?"#D8D8E4":isNight?"#1E2E1E":"#5A9A4E";

  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Stars (night only) */}
      {isNight && <div style={{position:"absolute",inset:0}}>
        {[...Array(30)].map(function(_,i){return (
          <div key={i} style={{position:"absolute",left:(i*3.3+Math.sin(i)*5)%100+"%",top:(i*2.7+Math.cos(i)*8)%45+"%",width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:"50%",background:"#fff",opacity:0.3+Math.sin(i*1.5)*0.3,animation:"twinkle "+(1.5+i%3)+"s "+(i*0.2)+"s ease-in-out infinite alternate"}}/>
        );})}
      </div>}
      {/* Clouds (not at night) */}
      {!isNight && <div style={{position:"absolute",top:"4%",width:tw*2,height:80,transform:"translateX("+ox[0]+"px)",willChange:"transform"}}>
        {[0,150,340,520,700,900,1050,1200,1350,1540,1720,1900].map(function(x,i){return (
          <svg key={i} style={{position:"absolute",left:x,top:i%3*18,width:75,height:45,opacity:isDusk?0.25:0.4}} viewBox="0 0 90 45"><ellipse cx={45} cy={30} rx={38} ry={12} fill={isDusk?"#FFD0A0":"white"} opacity={0.5}/><ellipse cx={32} cy={20} rx={18} ry={14} fill={isDusk?"#FFC890":"white"} opacity={0.6}/></svg>
        );})}
      </div>}
      {/* Mountains with depth */}
      <div style={{position:"absolute",bottom:"42%",width:tw*2,height:120,transform:"translateX("+ox[1]+"px) perspective(600px) rotateX(2deg)",transformOrigin:"bottom center",willChange:"transform"}}>
        <svg width={tw*2} height={120} viewBox={"0 0 "+(tw*2)+" 120"}>
          {[0,120,260,400,530,680,830,980,1120,1280,1430,1580,1720,1880,2050,2200].map(function(x,i){var h=50+(i*29)%50;return (
            <polygon key={i} points={x+",120 "+(x+60)+","+(120-h)+" "+(x+120)+",120"} fill={mtnC[i%3]} opacity={0.55}/>
          );})}
        </svg>
      </div>
      {/* Buildings with slight perspective */}
      <div style={{position:"absolute",bottom:"28%",width:tw*2,height:100,transform:"translateX("+ox[2]+"px) perspective(500px) rotateX(3deg)",transformOrigin:"bottom center",willChange:"transform"}}>
        <svg width={tw*2} height={100} viewBox={"0 0 "+(tw*2)+" 100"}>
          {Array.from({length:32},function(_,i){var x=i*75,h=20+(i*31)%55,w=16+(i*17)%24;return (
            <g key={i}><rect x={x} y={100-h} width={w} height={h} rx={2} fill={bldC[i%4]}/>
            {Array.from({length:Math.floor(h/11)},function(_2,j){return Array.from({length:Math.floor(w/7)},function(_3,k){return (
              <rect key={j+"-"+k} x={x+2+k*7} y={100-h+3+j*11} width={3.5} height={4.5} rx={0.8} fill={winColor(tod,i,j,k)} opacity={isNight?0.9:0.75}/>
            );});})}</g>
          );})}
        </svg>
      </div>
      {/* Fence with depth */}
      <div style={{position:"absolute",bottom:"22%",width:tw*2,height:28,transform:"translateX("+ox[3]+"px) perspective(400px) rotateX(4deg)",transformOrigin:"bottom center",willChange:"transform"}}>
        <svg width={tw*2} height={28} viewBox={"0 0 "+(tw*2)+" 28"}>
          {[...Array(60)].map(function(_,i){return (
            <g key={i}><rect x={i*40} y={2} width={3} height={25} rx={1} fill={isNight?"#444":"#B0A090"}/><rect x={i*40} y={7} width={40} height={2} fill={isNight?"#555":"#C0B0A0"}/><rect x={i*40} y={18} width={40} height={2} fill={isNight?"#555":"#C0B0A0"}/></g>
          );})}
        </svg>
      </div>
      {/* Ground plane (grass/gravel) - perspective vanishing */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"22%",background:"linear-gradient(180deg,"+groundC+" 0%,"+groundC2+" 100%)",transformOrigin:"bottom center"}}>
        {/* Ground texture stripes for motion */}
        <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
          {[...Array(12)].map(function(_,i){return (
            <div key={i} style={{position:"absolute",left:((i*100/6)+(ox[4]*0.3)%100)%100+"%",top:0,bottom:0,width:2,background:season==="snow"?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.04)",transform:"skewX(-15deg)"}}/>
          );})}
        </div>
      </div>
      {/* Track - perspective converging rails */}
      <div style={{position:"absolute",bottom:"13%",left:0,right:0,height:"10%",overflow:"hidden"}}>
        <svg width="100%" height="100%" viewBox="0 0 800 60" preserveAspectRatio="none" style={{display:"block"}}>
          {/* Rails with perspective - slightly converge toward top */}
          <line x1={0} y1={15} x2={800} y2={18} stroke={isNight?"#665540":"#8B7355"} strokeWidth={3}/>
          <line x1={0} y1={40} x2={800} y2={38} stroke={isNight?"#665540":"#8B7355"} strokeWidth={3}/>
          {/* Sleepers scrolling */}
          {[...Array(40)].map(function(_,i){
            var sx=((i*20+(ox[4]*0.8)%800)+800)%800;
            return <rect key={i} x={sx} y={10} width={5} height={35} rx={1} fill={isNight?"#554430":"#A0926B"} opacity={0.7}/>;
          })}
          {/* Rail highlights */}
          <line x1={0} y1={15} x2={800} y2={18} stroke={isNight?"#887766":"#BBA880"} strokeWidth={1} opacity={0.4}/>
          <line x1={0} y1={40} x2={800} y2={38} stroke={isNight?"#887766":"#BBA880"} strokeWidth={1} opacity={0.4}/>
        </svg>
      </div>
    </div>
  );
}

// ============ Running scene sub-components ============
function RunSpeedLines({speed}){if(speed<=0.5)return null;return (<div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:4}}>{[...Array(8)].map(function(_,i){return (<div key={i} style={{position:"absolute",right:-80,top:(30+i*7)+"%",width:40+i*12,height:2,background:"rgba(255,255,255,"+(0.2+speed*0.2)+")",borderRadius:2,animation:"speedLine "+(0.3+0.2/speed)+"s "+i*0.04+"s linear infinite"}}/>);})}</div>);}
function RunOnomatopoeia({speed}){if(speed<=0.3)return null;var F="'Zen Maru Gothic', sans-serif";return (<div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:5}}>{["ガタンゴトン","シュー","ゴォー"].map(function(txt,i){return (<div key={i} style={{position:"absolute",left:(15+(i*25)%60)+"%",top:(18+(i*12)%25)+"%",fontSize:(1+(i%2)*0.2)+"rem",fontWeight:900,color:"rgba(91,58,26,0.3)",fontFamily:F,letterSpacing:3,animation:"onomatFloat 2.8s "+i*0.7+"s ease-out infinite",whiteSpace:"nowrap"}}>{txt}</div>);})}</div>);}
function RunSeasonalParticles({season}){if(!season)return null;
  // #12 fix: stabilize random values with useMemo
  var items=useMemo(function(){var arr=[];for(var i=0;i<18;i++){arr.push({x:Math.random()*100,s:season==="sakura"?10+Math.random()*8:4+Math.random()*4,d:Math.random()*5,dur:3+Math.random()*4});}return arr;},[season]);
  return (<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:8}}>{items.map(function(p,i){return (<div key={i} style={{position:"absolute",left:p.x+"%",top:-20,width:p.s,height:p.s,background:season==="sakura"?"#FFB7C5":"#fff",borderRadius:season==="sakura"?"50% 0 50% 50%":"50%",opacity:0.7,animation:"snowfall "+p.dur+"s "+p.d+"s linear infinite"}}/>);})}</div>);}
function RunCrossing({visible,crossingX}){if(!visible)return null;return (<div style={{position:"absolute",left:(50+crossingX*0.15)+"%",bottom:"25%",zIndex:18,pointerEvents:"none",transform:"translateX(-50%)"}}><svg width={50} height={85} viewBox="0 0 50 85"><rect x={22} y={0} width={5} height={85} rx={2} fill="#333"/><rect x={4} y={7} width={42} height={7} rx={3} fill="#FFD814" stroke="#333" strokeWidth={0.8}/><circle cx={24} cy={24} r={5} fill="#E74C3C"><animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite"/></circle></svg><div style={{fontSize:"0.85rem",fontWeight:900,color:"#E74C3C",fontFamily:"'Zen Maru Gothic', sans-serif",letterSpacing:3,textAlign:"center",animation:"kankankan 0.3s ease infinite alternate",marginTop:-4}}>カンカン</div></div>);}
function RunStationSign({visible,name}){if(!visible)return null;return (<div style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",zIndex:25,pointerEvents:"none",fontFamily:"'Zen Maru Gothic', sans-serif",animation:"stationPass 3s ease-in-out forwards"}}><div style={{background:"#fff",border:"3px solid #333",borderRadius:10,padding:"8px 24px",boxShadow:"0 4px 16px rgba(0,0,0,0.2)",textAlign:"center"}}><div style={{fontSize:"0.55rem",color:"#aaa",letterSpacing:1}}>つうか</div><div style={{fontSize:"1.2rem",fontWeight:900,color:"#333",letterSpacing:3}}>{name}</div></div></div>);}
function RunFuji({visible,opacity}){if(!visible)return null;return (<div style={{position:"absolute",right:"8%",top:"12%",zIndex:6,pointerEvents:"none",opacity:opacity}}><svg width={110} height={85} viewBox="0 0 120 90"><polygon points="60,5 110,85 10,85" fill="#6677AA" opacity={0.7}/><polygon points="60,5 80,35 40,35" fill="white" opacity={0.8}/></svg><div style={{textAlign:"center",fontSize:"0.75rem",fontWeight:900,color:"#5B6BAA",fontFamily:"'Zen Maru Gothic', sans-serif",marginTop:-6}}>ふじさん！🗻</div></div>);}
function RunDecoupleSign({visible,partnerName}){if(!visible)return null;return (<div style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",zIndex:30,pointerEvents:"none",fontFamily:"'Zen Maru Gothic', sans-serif",animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}><div style={{background:"linear-gradient(145deg,#FFE066,#FFB347)",border:"3px solid #cc8030",borderRadius:14,padding:"10px 28px",boxShadow:"0 4px 16px rgba(0,0,0,0.2)",textAlign:"center"}}><div style={{fontSize:"1.3rem",fontWeight:900,color:"#7B3F00",letterSpacing:3}}>🔓 きりはなし！</div><div style={{fontSize:"0.8rem",color:"#996622",marginTop:2}}>{partnerName}と おわかれ</div></div></div>);}
function RunTunnel({phase}){if(!phase)return null;return (<div style={{position:"absolute",inset:0,zIndex:50,background:phase==="inside"?"rgba(0,0,0,0.78)":"rgba(0,0,0,0)",transition:"background 0.5s ease",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>{phase==="inside"&&<div style={{fontSize:"1.3rem",fontWeight:900,color:"#FFE066",fontFamily:"'Zen Maru Gothic', sans-serif",letterSpacing:4,animation:"fadeIn 0.5s ease",textShadow:"0 0 20px rgba(255,224,102,0.5)"}}>🚇 トンネル つうか ちゅう…</div>}</div>);}

// ============ Passing Train ============
function PassingTrainEvent({ visible, currentId }) {
  if (!visible) return null;
  var others = TRAINS.filter(function(t){ return t.id !== currentId && t.kind === "shinkansen"; });
  var other = others[Math.floor(Date.now() / 100000) % others.length];
  return (
    <div style={{position:"absolute",bottom:"18%",right:0,width:"min(45vw,260px)",zIndex:15,animation:"passingTrain 1.8s linear forwards",pointerEvents:"none",transform:"perspective(800px) rotateY(8deg) rotateX(2deg)",transformOrigin:"center bottom",filter:"drop-shadow(-4px 8px 6px rgba(0,0,0,0.2))"}}>
      <RunTrainSVG train={other} flip hideTrack/>
    </div>
  );
}

// ============ Easing ============
function easeProgress(rawP){if(rawP<0.08)return rawP*rawP/0.08*0.08;if(rawP>0.88){var q=(rawP-0.88)/0.12;return 0.88+0.12*(1-(1-q)*(1-q));}return rawP;}

// ============ Running Screen ============
function RunningScreen({ train, settings, coupled, coupledTrain, onGoReward }) {
  var dur = settings.runDuration;
  var totalDist = 4000;
  var [dist, setDist] = useState(0);
  var [arrived, setArrived] = useState(false);
  var [decoupled, setDecoupled] = useState(false);
  var decoupledRef = useRef(false);
  var [rearLag, setRearLag] = useState(0);
  var [tunnelPhase, setTunnelPhase] = useState(null);
  var [showPassing, setShowPassing] = useState(false);
  // #16 fix: season is determined first, weather depends on it (snow season forces clear weather to avoid rain+snow)
  var [season] = useState(function(){ return ["sakura","snow",null,null][Math.floor(Math.random()*4)]; });
  var [tod] = useState(getTimeOfDay);
  var [weather] = useState(function(){ return season === "snow" ? "clear" : getWeather(); });
  var animRef = useRef();
  var startRef = useRef(0);
  var sfxFlags = useRef({crossing:false, tunnel:false, passing:false, decouple:false, arrival:false});
  var lastGatan = useRef(0);
  var rndStation = useMemo(function(){ return STATION_NAMES[Math.floor(Math.random()*STATION_NAMES.length)]; }, []);
  var hasFuji = useMemo(function(){ return Math.random()>0.4; }, []);
  var hasPassing = useMemo(function(){ return Math.random()>0.3; }, []);
  var decoupleAt=0.62, crossingAt=0.18, stationAt=0.30, fujiStart=0.40, fujiEnd=0.55, passingAt=0.50, tunnelStart=0.68, tunnelEnd=0.78;

  useEffect(function() {
    startRef.current = performance.now();
    var totalMs = dur * 1000;
    var doTick = function(now) {
      var elapsed = now - startRef.current;
      var rawP = Math.min(elapsed / totalMs, 1);
      var p = easeProgress(rawP);
      setDist(p * totalDist);
      if (p>=tunnelStart && p<tunnelStart+0.02) setTunnelPhase("enter");
      else if (p>=tunnelStart+0.02 && p<tunnelEnd-0.02) setTunnelPhase("inside");
      else if (p>=tunnelEnd-0.02 && p<tunnelEnd) setTunnelPhase("exit");
      else if (p>=tunnelEnd) setTunnelPhase(null);
      if (hasPassing && p>=passingAt && p<passingAt+0.04) setShowPassing(true);
      else if (p>=passingAt+0.06) setShowPassing(false);
      if (coupled && p>=decoupleAt && !decoupledRef.current) { setDecoupled(true); decoupledRef.current=true; }
      if (decoupledRef.current) setRearLag(function(prev){ return Math.min(prev+2.5,400); });
      // === Sound triggers ===
      var sf = sfxFlags.current;
      if (p>=crossingAt-0.02 && p<crossingAt+0.04 && !sf.crossing) { sf.crossing=true; SFX.crossing(); }
      if (p>=tunnelStart && p<tunnelStart+0.02 && !sf.tunnel) { sf.tunnel=true; SFX.tunnel(); }
      if (hasPassing && p>=passingAt && p<passingAt+0.02 && !sf.passing) { sf.passing=true; SFX.horn(); }
      if (coupled && p>=decoupleAt && !sf.decouple) { sf.decouple=true; SFX.couple(); }
      // #6 fix: no gatangoton inside tunnel
      if (p>0.08 && p<0.88 && !(p>=tunnelStart && p<tunnelEnd) && now-lastGatan.current>1200) { lastGatan.current=now; SFX.gatangoton(); }
      if (rawP<1) animRef.current=requestAnimationFrame(doTick);
      else { setArrived(true); if(!sf.arrival){sf.arrival=true; SFX.arrival();} }
    };
    animRef.current = requestAnimationFrame(doTick);
    return function(){ cancelAnimationFrame(animRef.current); };
  }, [dur,coupled]);

  var progress=dist/totalDist;
  var crossingScreenX=(crossingAt-progress)*totalDist*0.5;
  var showCrossing=Math.abs(crossingScreenX)<300;
  var showStationSign=Math.abs((stationAt-progress)*totalDist*0.5)<250;
  var showFuji=hasFuji&&progress>=fujiStart-0.05&&progress<=fujiEnd+0.05;
  var fujiOpacity=Math.min(1,(progress-fujiStart+0.05)*10)*Math.min(1,(fujiEnd+0.05-progress)*10);
  var speed=progress<0.08?progress/0.08:progress>0.88?(1-progress)/0.12:1;
  var bounceY=speed>0.3?Math.sin(dist*0.05)*1.5:0;
  var showDecoupleSign=coupled&&progress>=decoupleAt-0.03&&progress<decoupleAt+0.08;
  var partnerName=coupledTrain?coupledTrain.name:"";
  var skyC=season==="snow"?SKY_COLORS.day:(weather==="rain"||weather==="rainbow")?{top:"#8899AA",mid:"#A0AABB",low:"#C0C8D0",ground:"#D0D0D0"}:SKY_COLORS[tod];
  var bgColor="linear-gradient(180deg,"+skyC.top+" 0%,"+skyC.mid+" 40%,"+skyC.low+" 65%,"+skyC.ground+" 100%)";
  var rearOp=decoupled?Math.max(0,1-rearLag/200):1;
  var rearTx=decoupled?-rearLag:0;
  var trainIcon=train.kind==="steam"?"🚂":"🚄";
  var titleText=train.name+(coupled?" + "+partnerName:"")+" しゅっぱつ！";

  // Auto-advance to arrival sequence
  useEffect(function() {
    if (arrived) {
      var t = setTimeout(onGoReward, 1200);
      return function() { clearTimeout(t); };
    }
  }, [arrived]);

  return (
    <div style={{minHeight:"100dvh",position:"relative",overflow:"hidden",fontFamily:"'Zen Maru Gothic', sans-serif",background:bgColor}}>
      <ParallaxBg dist={dist} season={season} tod={season==="snow"?"day":tod}/>
      <RunSeasonalParticles season={season}/>
      <RainEffect weather={weather}/>
      <RainbowArc visible={weather==="rainbow"&&progress>0.55}/>
      <RunSpeedLines speed={speed}/>
      <RunOnomatopoeia speed={speed}/>
      <RunCrossing visible={showCrossing} crossingX={crossingScreenX}/>
      <RunStationSign visible={showStationSign} name={rndStation}/>
      <RunFuji visible={showFuji} opacity={fujiOpacity}/>
      <PassingTrainEvent visible={showPassing} currentId={train.id}/>
      <RunDecoupleSign visible={showDecoupleSign} partnerName={partnerName}/>
      <RunTunnel phase={tunnelPhase}/>
      {!arrived && (function(){
        // 2.5D perspective: slight rotateY gives depth to train
        var trainPerspective = "perspective(800px) rotateY(-8deg) rotateX(2deg)";
        if (coupled) {
          var coupOffset = decoupled ? rearTx : 0;
          var coupOp = decoupled ? rearOp : 1;
          return (
            <div style={{position:"absolute",left:"1%",bottom:"14%",width:"min(85vw, 520px)",zIndex:12,transform:"translateY("+bounceY+"px) "+trainPerspective,transformOrigin:"center bottom",willChange:"transform",filter:"drop-shadow(4px 8px 6px rgba(0,0,0,0.2))"}}>
              <div style={{display:"flex",alignItems:"flex-start",marginLeft:0}}>
                <div style={{width:"52%",flexShrink:0,marginRight:"-12%",opacity:coupOp,transform:"translateX("+coupOffset+"px)",pointerEvents:"none"}}>
                  <RunTrainSVG train={coupledTrain} flip hideTrack/>
                </div>
                <div style={{width:"52%",flexShrink:0}}>
                  <RunTrainSVG train={train} hideTrack/>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div style={{position:"absolute",left:"3%",bottom:"14%",width:"min(55vw, 320px)",zIndex:12,transform:"translateY("+bounceY+"px) "+trainPerspective,transformOrigin:"center bottom",willChange:"transform",filter:"drop-shadow(4px 8px 6px rgba(0,0,0,0.2))"}}>
            <RunTrainSVG train={train} hideTrack/>
          </div>
        );
      })()}
      {!arrived && <div style={{position:"absolute",top:"3%",left:"50%",transform:"translateX(-50%)",zIndex:15,textAlign:"center",pointerEvents:"none"}}>
        <div style={{fontSize:"1.3rem",fontWeight:900,color:tod==="night"?"#FFE066":"#5B3A1A",letterSpacing:3,fontFamily:"'Zen Maru Gothic', sans-serif",textShadow:tod==="night"?"0 1px 8px rgba(0,0,0,0.5)":"0 1px 4px rgba(255,255,255,0.8)",animation:"fadeIn 0.5s ease"}}>
          {trainIcon} {titleText}
        </div>
      </div>}
      {arrived && <div style={{position:"absolute",inset:0,zIndex:60,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.5s ease"}}><div style={{fontSize:"1.5rem",fontWeight:900,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.5)",animation:"pulse 1s infinite"}}>もうすぐ とうちゃく…</div></div>}
    </div>
  );
}

// ============ Arrival / Reward / Settings / Depot / Collect ============


function ParticleBurst(){var ps=[];for(var i=0;i<16;i++){var cs=["#FFE066","#FF6B8A","#66E0FF","#7CFF66","#FF9F43","#E066FF"];ps.push({a:(i/16)*360,s:5+Math.random()*10,c:cs[i%cs.length],d:Math.random()*0.1});}return <div style={{position:"absolute",top:"50%",left:"50%",pointerEvents:"none",zIndex:100}}>{ps.map(function(p,i){return <div key={i} style={{position:"absolute",width:p.s,height:p.s,borderRadius:i%2===0?"50%":"2px",backgroundColor:p.c,animation:"particleBurst 0.8s "+p.d+"s ease-out forwards",transform:"rotate("+p.a+"deg) translateY(-10px)",opacity:0}}/>;})}</div>;}

function RewardScreen({trainName,onReset}){var[sel,setSel]=useState(null);var[show,setShow]=useState(false);useEffect(function(){var t=setTimeout(function(){setShow(true);},500);return function(){clearTimeout(t);};},[]);
var rewards=[{id:"bath",emoji:"🛁",label:"おふろ",msg:"おふろに はいろう！\nぽっかぽかに なるよ",color:"#88D8F7"},{id:"food",emoji:"🍚",label:"ごはん",msg:"ごはんを たべよう！\nもぐもぐ おいしいね",color:"#FFB347"},{id:"sleep",emoji:"🌙",label:"おやすみ",msg:"おやすみなさい！\nいい ゆめ みてね",color:"#B8A9D4"}];
return (<div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#FFF8E1 0%,#FFECB3 50%,#FFE082 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Zen Maru Gothic', sans-serif",padding:20}}>
<div style={{fontSize:"1.3rem",fontWeight:900,color:"#5B3A1A",letterSpacing:3,marginBottom:6,animation:"fadeIn 0.5s ease"}}>🏠 おうちに ついたよ！</div>
<div style={{fontSize:"0.95rem",color:"#888",marginBottom:20}}>{trainName}の たびは たのしかったね！</div>
{show&&!sel&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><div style={{fontSize:"1.1rem",fontWeight:800,color:"#7B3F00",letterSpacing:2,marginBottom:4,animation:"slideUp 0.4s ease"}}>つぎは なにする？</div><div style={{display:"flex",gap:12}}>{rewards.map(function(r,i){return <button key={r.id} onClick={function(){setSel(r);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:100,padding:"16px 8px",borderRadius:20,border:"none",background:"linear-gradient(145deg,"+r.color+","+r.color+"cc)",cursor:"pointer",boxShadow:"0 6px 0 "+r.color+"88",animation:"popIn 0.5s "+(0.2+i*0.15)+"s cubic-bezier(0.34,1.56,0.64,1) both",fontFamily:"'Zen Maru Gothic', sans-serif"}}><span style={{fontSize:"2.5rem"}}>{r.emoji}</span><span style={{fontSize:"1rem",fontWeight:800,color:"#fff",letterSpacing:2}}>{r.label}</span></button>;})}</div></div>}
{sel&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",position:"relative"}}><ParticleBurst/><div style={{fontSize:"4rem",animation:"float 2s ease-in-out infinite"}}>{sel.emoji}</div><div style={{background:"rgba(255,255,255,0.8)",borderRadius:20,padding:"18px 32px",textAlign:"center"}}><div style={{fontSize:"1.2rem",fontWeight:900,color:"#5B3A1A",whiteSpace:"pre-line",lineHeight:1.6,letterSpacing:2}}>{sel.msg}</div></div><button onClick={onReset} style={{marginTop:12,padding:"12px 32px",borderRadius:18,border:"none",background:"linear-gradient(145deg,#FFE066,#FF9F43)",color:"#7B3F00",fontSize:"1rem",fontWeight:800,cursor:"pointer",fontFamily:"'Zen Maru Gothic', sans-serif",boxShadow:"0 4px 0 #cc8030"}}>もういっかい あそぶ</button></div>}
</div>);}

function SettingsModal({settings,onChange,onClose}){var[local,setLocal]=useState(Object.assign({},settings));var[ni,setNi]=useState(settings.stationName);var apply=function(){onChange(Object.assign({},local,{stationName:ni}));onClose();};
return (<div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",fontFamily:"'Zen Maru Gothic', sans-serif",animation:"fadeIn 0.2s ease"}} onClick={onClose}><div style={{background:"#fff",borderRadius:24,padding:"28px 24px",width:"min(360px,90vw)",maxHeight:"80vh",overflow:"auto",boxShadow:"0 16px 48px rgba(0,0,0,0.3)",animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}} onClick={function(e){e.stopPropagation();}}>
<div style={{fontSize:"1.2rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:20,textAlign:"center"}}>⚙️ ほごしゃ せってい</div>
<div style={{marginBottom:20}}><div style={{fontSize:"0.9rem",fontWeight:700,color:"#666",marginBottom:8}}>ステップすう</div><div style={{display:"flex",gap:6,justifyContent:"center"}}>{[2,3,4,5,6,7].map(function(n){return <button key={n} onClick={function(){setLocal(Object.assign({},local,{stepCount:n}));}} style={{width:44,height:44,borderRadius:12,border:"none",background:local.stepCount===n?"linear-gradient(135deg,#FFE066,#FF9F43)":"#f0f0f0",color:local.stepCount===n?"#7B3F00":"#999",fontSize:"1.1rem",fontWeight:800,cursor:"pointer",fontFamily:"'Zen Maru Gothic', sans-serif"}}>{n}</button>;})}</div></div>
<div style={{marginBottom:20}}><div style={{fontSize:"0.9rem",fontWeight:700,color:"#666",marginBottom:8}}>おうちえきの なまえ</div><div style={{display:"flex",alignItems:"center",gap:4,background:"#f5f5f5",borderRadius:14,padding:"8px 14px",border:"2px solid #e0e0e0"}}><input value={ni} onChange={function(e){setNi(e.target.value.slice(0,10));}} placeholder="おうち" style={{flex:1,border:"none",background:"transparent",fontSize:"1.1rem",fontWeight:700,outline:"none",fontFamily:"'Zen Maru Gothic', sans-serif",color:"#5B3A1A"}}/><span style={{fontSize:"0.85rem",color:"#bbb",fontWeight:600}}>えき</span></div></div>
<div style={{marginBottom:24}}><div style={{fontSize:"0.9rem",fontWeight:700,color:"#666",marginBottom:8}}>そうこうじかん</div><div style={{display:"flex",gap:6,justifyContent:"center"}}>{[{v:8,l:"みじかい"},{v:14,l:"ふつう"},{v:20,l:"ながい"}].map(function(o){return <button key={o.v} onClick={function(){setLocal(Object.assign({},local,{runDuration:o.v}));}} style={{padding:"8px 16px",borderRadius:12,border:"none",background:local.runDuration===o.v?"linear-gradient(135deg,#88D8F7,#3498DB)":"#f0f0f0",color:local.runDuration===o.v?"#fff":"#999",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",fontFamily:"'Zen Maru Gothic', sans-serif"}}>{o.l}</button>;})}</div></div>
<button onClick={apply} style={{width:"100%",padding:"14px",borderRadius:16,border:"none",background:"linear-gradient(145deg,#FFE066,#FF9F43)",color:"#7B3F00",fontSize:"1.1rem",fontWeight:800,cursor:"pointer",fontFamily:"'Zen Maru Gothic', sans-serif",boxShadow:"0 4px 0 #cc8030"}}>けってい</button>
</div></div>);}

function CouplingDialog({train,onYes,onNo}){
  var partner=TRAINS.find(function(t){return t.id===train.coupleWith;});
  if(!partner)return null;
  var F="'Zen Maru Gothic', sans-serif";
  var [stage,setStage]=useState("ask"); // ask -> approach -> impact -> done
  var [shakeX,setShakeX]=useState(0);
  var sparkRef=useRef([]);

  var handleYes=function(){
    setStage("approach");
    // After approach animation (1s), trigger impact
    setTimeout(function(){
      setStage("impact");
      SFX.couple();
      // Screen shake
      setShakeX(-6);
      setTimeout(function(){setShakeX(8);},60);
      setTimeout(function(){setShakeX(-4);},120);
      setTimeout(function(){setShakeX(3);},180);
      setTimeout(function(){setShakeX(0);},240);
      // Generate sparks
      var sp=[];
      for(var i=0;i<12;i++){sp.push({x:50+((Math.random()-0.5)*20),y:40+((Math.random()-0.5)*10),vx:(Math.random()-0.5)*8,vy:-Math.random()*6-2,s:3+Math.random()*4});}
      sparkRef.current=sp;
    },900);
    // After impact, show "done"
    setTimeout(function(){setStage("done");SFX.celebrate();},1600);
    // Proceed to collect
    setTimeout(function(){onYes();},2800);
  };

  // Spark positions for impact
  var sparks=sparkRef.current;

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",fontFamily:F,animation:"fadeIn 0.3s ease"}}>
      <div style={{background:stage==="done"?"linear-gradient(145deg,#FFF8E1,#FFE082)":"#fff",borderRadius:24,padding:"28px 20px",width:"min(360px,90vw)",textAlign:"center",boxShadow:"0 16px 48px rgba(0,0,0,0.3)",animation:stage==="ask"?"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)":"none",transform:"translateX("+shakeX+"px)",transition:shakeX===0?"transform 0.1s ease":"none"}}>

        {/* Stage: ask */}
        {stage==="ask" && <div>
          <div style={{fontSize:"1.3rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:16}}>🔗 れんけつ する？</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:12}}>
            <div style={{width:110,height:40}}><DepotTrainSVG train={train}/></div>
            <div style={{fontSize:"1.5rem",fontWeight:900,color:"#FF9F43"}}>+</div>
            <div style={{width:110,height:40}}><DepotTrainSVG train={partner}/></div>
          </div>
          <div style={{fontSize:"0.9rem",color:"#888",marginBottom:18,lineHeight:1.6}}>{train.name}と {partner.name}を<br/>れんけつして はしるよ！</div>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            <button onClick={handleYes} style={{padding:"12px 28px",borderRadius:16,border:"none",background:"linear-gradient(145deg,#FFE066,#FF9F43)",color:"#7B3F00",fontSize:"1.05rem",fontWeight:800,cursor:"pointer",fontFamily:F,boxShadow:"0 4px 0 #cc8030"}}>れんけつ！</button>
            <button onClick={onNo} style={{padding:"12px 28px",borderRadius:16,border:"none",background:"#f0f0f0",color:"#999",fontSize:"1.05rem",fontWeight:800,cursor:"pointer",fontFamily:F}}>ひとりで</button>
          </div>
        </div>}

        {/* Stage: approach - two trains slide toward each other */}
        {stage==="approach" && <div>
          <div style={{fontSize:"1.1rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:12}}>れんけつ ちゅう…</div>
          <div style={{position:"relative",height:60,overflow:"hidden",marginBottom:12}}>
            <div style={{position:"absolute",left:0,top:8,width:120,height:44,animation:"coupleSlideRight 0.8s cubic-bezier(0.4,0,0.2,1) forwards"}}>
              <DepotTrainSVG train={partner}/>
            </div>
            <div style={{position:"absolute",right:0,top:8,width:120,height:44,animation:"coupleSlideLeft 0.8s cubic-bezier(0.4,0,0.2,1) forwards"}}>
              <DepotTrainSVG train={train}/>
            </div>
          </div>
          <div style={{fontSize:"2rem",animation:"pulse 0.4s infinite"}}>🔧</div>
        </div>}

        {/* Stage: impact - flash + sparks */}
        {(stage==="impact"||stage==="done") && <div>
          {stage==="impact" && <div>
            <div style={{fontSize:"1.2rem",fontWeight:900,color:"#E74C3C",letterSpacing:3,marginBottom:8,animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>ガチャン！</div>
            <div style={{position:"relative",height:60,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0}}>
                <div style={{width:120,height:44}}><DepotTrainSVG train={partner}/></div>
                <div style={{width:120,height:44}}><DepotTrainSVG train={train}/></div>
              </div>
              {/* Sparks - reuse particleBurst style */}
              <div style={{position:"absolute",left:"50%",top:"50%",pointerEvents:"none"}}>
                {sparks.map(function(sp,i){return (
                  <div key={i} style={{position:"absolute",width:sp.s,height:sp.s,borderRadius:i%3===0?"50%":"2px",background:["#FFE066","#FF6B3A","#66E0FF","#FFB347"][i%4],animation:"particleBurst 0.7s "+(i*0.02)+"s ease-out forwards",transform:"rotate("+(i*30)+"deg) translateY(-10px)",opacity:0}}/>
                );})}
              </div>
              {/* Flash */}
              <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 0 30px 15px rgba(255,255,200,0.8)",animation:"coupleFlash 0.4s ease-out forwards"}}/>
            </div>
          </div>}

          {stage==="done" && <div style={{animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{fontSize:"1.5rem",fontWeight:900,color:"#2B6CB0",letterSpacing:3,marginBottom:10}}>🔗 れんけつ かんりょう！</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:10}}>
              <div style={{width:120,height:44}}><DepotTrainSVG train={partner}/></div>
              <div style={{width:120,height:44}}><DepotTrainSVG train={train}/></div>
            </div>
            <div style={{fontSize:"1rem",color:"#5B3A1A",fontWeight:700}}>{partner.name} + {train.name}</div>
            <div style={{fontSize:"0.85rem",color:"#888",marginTop:4}}>いっしょに はしるよ！</div>
            <div style={{fontSize:"2.5rem",marginTop:6,animation:"float 1.5s ease-in-out infinite"}}>{train.kind==="steam"?"🚂🚂":"🚄🚄"}</div>
          </div>}
        </div>}

      </div>
    </div>
  );
}

function DepotSelector({onSelect,onOpenSettings,onStamps}){var[si,setSi]=useState(null);var[ro,setRo]=useState(false);var lp=useRef(null);var hs=function(t,i){setSi(i);setRo(true);setTimeout(function(){onSelect(t);},900);};
return (<div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#4A4A5A 0%,#3A3A48 30%,#2E2E3A 100%)",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Zen Maru Gothic', sans-serif",padding:"20px 16px",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,right:0,height:40,background:"linear-gradient(180deg,#555568,transparent)",zIndex:1}}/>{[0,1,2].map(function(i){return <div key={i} style={{position:"absolute",top:0,left:(20+i*30)+"%",width:8,height:40,background:"#666678",zIndex:2}}/>;})}{[0,1,2,3].map(function(i){return <div key={i} style={{position:"absolute",top:36,left:(12+i*25)+"%",width:24,height:6,borderRadius:"0 0 12px 12px",background:"#FFE89F",boxShadow:"0 4px 20px rgba(255,232,159,0.4)",zIndex:3}}/>;})}<div style={{marginTop:44,fontSize:"1.4rem",fontWeight:900,color:"#FFE066",letterSpacing:4,textAlign:"center",textShadow:"0 2px 8px rgba(0,0,0,0.5)",zIndex:5}}>🏗️ しゃりょうきち</div>
<div style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.6)",marginBottom:10,textAlign:"center",fontWeight:700,letterSpacing:2,zIndex:5}}>きょうの でんしゃを えらぼう！</div>
<div style={{display:"flex",flexDirection:"column",gap:6,width:"100%",maxWidth:400,zIndex:5,overflow:"auto",flex:1,paddingBottom:60}}>
{TRAINS.map(function(train,idx){var isSel=si===idx,isOther=si!==null&&!isSel;return (
<div key={train.id} style={{position:"relative",overflow:"hidden",borderRadius:14,transition:"all 0.3s ease",opacity:isOther?0.3:1}}>
<div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)"}}/>
<div style={{position:"absolute",top:4,left:8,fontSize:"0.55rem",color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:1}}>{"BAY "+(idx+1)}</div>
<button onClick={function(){if(!ro)hs(train,idx);}} disabled={ro} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px 6px 6px",border:"none",borderRadius:14,background:"transparent",cursor:ro?"default":"pointer",width:"100%",textAlign:"left"}}>
<div style={{width:120,height:44,flexShrink:0,borderRadius:8,overflow:"hidden",transform:isSel&&ro?"translateX(120%)":"translateX(0)",transition:isSel&&ro?"transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)":"none"}}><DepotTrainSVG train={train}/></div>
<div style={{flex:1}}><div style={{fontSize:"1rem",fontWeight:900,color:"#fff",letterSpacing:2}}>{train.name}</div><div style={{fontSize:"0.65rem",color:"rgba(255,255,255,0.4)",fontWeight:600}}>{train.series}{train.coupleWith?" 🔗":""}</div></div>
{!ro&&<div style={{fontSize:"0.9rem",color:"rgba(255,255,255,0.3)"}}>▶</div>}
</button></div>);})}
</div>
<button onPointerDown={function(){lp.current=setTimeout(onOpenSettings,600);}} onPointerUp={function(){clearTimeout(lp.current);}} onPointerLeave={function(){clearTimeout(lp.current);}} style={{position:"fixed",bottom:20,right:20,width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:"1.3rem",color:"rgba(255,255,255,0.35)",zIndex:10}}>⚙️</button>
{onStamps && <button onClick={onStamps} style={{position:"fixed",bottom:20,left:20,height:40,borderRadius:20,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",fontSize:"0.85rem",fontWeight:700,color:"rgba(255,255,255,0.5)",zIndex:10,padding:"0 16px",fontFamily:"'Zen Maru Gothic', sans-serif"}}>📅 スタンプ</button>}
<div style={{position:"fixed",bottom:68,right:14,fontSize:"0.55rem",color:"rgba(255,255,255,0.18)",zIndex:10,textAlign:"center"}}>ながおしで<br/>せってい</div>
</div>);}

function PartGetBanner({label,visible,onDone}){useEffect(function(){if(visible){var t=setTimeout(onDone,1800);return function(){clearTimeout(t);};};},[visible,onDone]);if(!visible)return null;return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,animation:"bannerPop 0.5s cubic-bezier(0.34,1.56,0.64,1)",position:"relative"}}><ParticleBurst/><div style={{background:"linear-gradient(145deg,#FFE066,#FFB347)",borderRadius:24,padding:"16px 36px",textAlign:"center",boxShadow:"0 8px 28px rgba(0,0,0,0.2)"}}><div style={{fontSize:"2rem",marginBottom:2}}>✨🎉✨</div><div style={{fontSize:"1.4rem",fontWeight:900,color:"#7B3F00",letterSpacing:3,fontFamily:"'Zen Maru Gothic', sans-serif"}}>{label}</div></div></div>;}
function BigButton({onClick,label,emoji,color,pulse,disabled}){return <button onClick={onClick} disabled={disabled} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,width:"min(300px,82vw)",padding:"22px 20px",border:"none",borderRadius:28,background:disabled?"#ccc":"linear-gradient(145deg,"+color+","+color+"cc)",color:"#fff",fontSize:"1.5rem",fontWeight:800,cursor:disabled?"default":"pointer",boxShadow:disabled?"none":"0 8px 0 "+color+"88, 0 12px 24px rgba(0,0,0,0.18)",fontFamily:"'Zen Maru Gothic', sans-serif",letterSpacing:2,animation:pulse&&!disabled?"pulse 1.5s infinite":"none",WebkitTapHighlightColor:"transparent",userSelect:"none"}}><span style={{fontSize:"2.5rem",lineHeight:1}}>{emoji}</span><span>{label}</span></button>;}
function ProgressDots({total,current}){return <div style={{display:"flex",gap:10,justifyContent:"center",margin:"8px 0"}}>{Array.from({length:total},function(_,i){return <div key={i} style={{width:32,height:32,borderRadius:"50%",background:i<current?"linear-gradient(135deg,#FFE066,#FF9F43)":i===current?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.25)",border:i===current?"3px solid #FF9F43":"3px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",transition:"all 0.4s ease",boxShadow:i<current?"0 2px 8px rgba(255,159,67,0.4)":"none"}}>{i<current?"⭐":i===current?"🚃":""}</div>;})}</div>;}

// ============ Interaction Mini-Games ============
function RapidTapGame({goal,color,emoji,onComplete,disabled}) {
  var [count, setCount] = useState(0);
  var pct = Math.min(count / goal * 100, 100);
  var done = count >= goal;
  useEffect(function() { if (done && onComplete) onComplete(); }, [done]);
  return (
    <div style={{animation:"slideUp 0.4s ease",textAlign:"center"}}>
      <div style={{fontSize:"1.1rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:4}}>れんだ して まわせ！</div>
      <div style={{fontSize:"0.85rem",color:"#888",marginBottom:10}}>{count} / {goal}</div>
      <div style={{width:"min(260px,70vw)",height:14,background:"rgba(0,0,0,0.08)",borderRadius:7,margin:"0 auto 14px",overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,"+color+","+color+"cc)",borderRadius:7,transition:"width 0.15s ease"}}/>
      </div>
      <button onClick={function(){if(!disabled&&!done){setCount(function(c){return c+1;});SFX.rapidTap();}}} disabled={disabled||done} style={{width:100,height:100,borderRadius:"50%",border:"none",background:done?"#66BB6A":"linear-gradient(145deg,"+color+","+color+"cc)",color:"#fff",fontSize:"2.5rem",cursor:disabled?"default":"pointer",boxShadow:done?"none":"0 6px 0 "+color+"88",fontFamily:"'Zen Maru Gothic', sans-serif",animation:!done&&!disabled?"pulse 0.8s infinite":"none",transition:"transform 0.08s"}} onPointerDown={function(e){if(!done)e.currentTarget.style.transform="scale(0.9)";}} onPointerUp={function(e){e.currentTarget.style.transform="scale(1)";}}>{done?"✓":emoji}</button>
      <div style={{fontSize:"0.8rem",color:"#bbb",marginTop:8,fontWeight:700}}>🔨 タンタンタン！</div>
    </div>
  );
}

function SwipeGame({color,emoji,onComplete,disabled}) {
  var [swiped, setSwiped] = useState(false);
  var [startX, setStartX] = useState(null);
  var [dragX, setDragX] = useState(0);
  var threshold = 120;
  var done = swiped;
  useEffect(function() { if (done && onComplete) onComplete(); }, [done]);
  // #13 fix: PointerEvent uses clientX directly, removed dead e.touches branches
  var onStart = function(e) { if (!disabled && !done) setStartX(e.clientX); };
  var onMove = function(e) { if (startX === null || done) return; var dx = e.clientX - startX; setDragX(Math.max(0, dx)); if (dx > threshold) { setSwiped(true); setStartX(null); SFX.swipeDone(); } };
  var onEnd = function() { if (!done) { setStartX(null); setDragX(0); } };
  return (
    <div style={{animation:"slideUp 0.4s ease",textAlign:"center"}}>
      <div style={{fontSize:"1.1rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:4}}>よこに スワイプ！</div>
      <div style={{fontSize:"0.85rem",color:"#888",marginBottom:14}}>→ みぎに スライド</div>
      <div style={{width:"min(280px,75vw)",height:70,background:"rgba(0,0,0,0.06)",borderRadius:35,margin:"0 auto",position:"relative",overflow:"hidden",touchAction:"none"}} onPointerDown={onStart} onPointerMove={onMove} onPointerUp={onEnd} onPointerLeave={onEnd}>
        <div style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",fontSize:"1.5rem",opacity:0.2}}>→→→</div>
        <div style={{position:"absolute",left:6+dragX,top:4,width:62,height:62,borderRadius:"50%",background:done?"#66BB6A":"linear-gradient(145deg,"+color+","+color+"cc)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",boxShadow:"0 3px 8px rgba(0,0,0,0.2)",transition:done?"left 0.3s ease":"none",cursor:"grab"}}>{done?"✓":emoji}</div>
      </div>
    </div>
  );
}

function HoldGame({holdMs,color,emoji,onComplete,disabled}) {
  var [progress, setProgress] = useState(0);
  var [holding, setHolding] = useState(false);
  var [done, setDone] = useState(false);
  var holdRef = useRef(null);
  var startRef = useRef(0);
  // #11 fix: track last tick threshold with ref for stable detection
  var lastTickRef = useRef(0);
  useEffect(function() { if (done && onComplete) onComplete(); }, [done]);
  useEffect(function() { return function() { if (holdRef.current) cancelAnimationFrame(holdRef.current); }; }, []);
  var onDown = function() {
    if (disabled || done) return;
    setHolding(true);
    startRef.current = performance.now();
    lastTickRef.current = 0;
    var tick = function(now) {
      var elapsed = now - startRef.current;
      var p = Math.min(elapsed / holdMs, 1);
      setProgress(p);
      var curTick = Math.floor(p * 5);
      if (curTick > lastTickRef.current) { lastTickRef.current = curTick; SFX.holdTick(p); }
      if (p < 1) holdRef.current = requestAnimationFrame(tick);
      else { setDone(true); setHolding(false); SFX.holdDone(); }
    };
    holdRef.current = requestAnimationFrame(tick);
  };
  var onUp = function() {
    if (!done) { setHolding(false); cancelAnimationFrame(holdRef.current); setProgress(0); }
  };
  var pct = Math.round(progress * 100);
  var ringDash = 2 * Math.PI * 44;
  var ringOff = ringDash * (1 - progress);
  return (
    <div style={{animation:"slideUp 0.4s ease",textAlign:"center"}}>
      <div style={{fontSize:"1.1rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:4}}>ながおし して！</div>
      <div style={{fontSize:"0.85rem",color:"#888",marginBottom:14}}>おして おさえて…</div>
      <div style={{position:"relative",width:110,height:110,margin:"0 auto"}} onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp}>
        <svg width={110} height={110} style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
          <circle cx={55} cy={55} r={44} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={8}/>
          <circle cx={55} cy={55} r={44} fill="none" stroke={done?"#66BB6A":color} strokeWidth={8} strokeDasharray={ringDash} strokeDashoffset={ringOff} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.05s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.2rem",cursor:"pointer",userSelect:"none",animation:holding?"holdPulse 0.3s ease infinite":"none"}}>{done?"✓":emoji}</div>
      </div>
      <div style={{fontSize:"0.75rem",color:"#bbb",marginTop:6,fontWeight:700}}>{done?"できた！":holding?pct+"%":"ぎゅっと おして！"}</div>
    </div>
  );
}

// ============ Rain & Rainbow ============
function RainEffect({weather}) {
  if (weather !== "rain" && weather !== "rainbow") return null;
  var drops = useMemo(function() {
    var arr = [];
    for (var i = 0; i < 40; i++) arr.push({x:Math.random()*100, d:Math.random()*2, dur:0.4+Math.random()*0.4, h:12+Math.random()*10});
    return arr;
  }, []);
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:7}}>
      {drops.map(function(d,i) { return (
        <div key={i} style={{position:"absolute",left:d.x+"%",top:-20,width:2,height:d.h,background:"rgba(120,160,220,0.35)",borderRadius:1,transform:"rotate(12deg)",animation:"rainfall "+d.dur+"s "+d.d+"s linear infinite"}}/>
      ); })}
      {/* Puddle reflections */}
      {[15,40,65,85].map(function(x,i) { return (
        <div key={"p"+i} style={{position:"absolute",bottom:"17%",left:x+"%",width:30+i*8,height:4,background:"rgba(120,160,220,0.15)",borderRadius:"50%",animation:"puddleRipple 1.5s "+(i*0.3)+"s ease-in-out infinite"}}/>
      ); })}
    </div>
  );
}

function RainbowArc({visible}) {
  if (!visible) return null;
  var colors = ["#FF0000","#FF8800","#FFFF00","#00CC00","#0088FF","#4400CC","#8800AA"];
  return (
    <div style={{position:"absolute",top:"-10%",left:"20%",width:"60%",zIndex:3,pointerEvents:"none",opacity:0.35,animation:"fadeIn 2s ease"}}>
      <svg viewBox="0 0 200 110" style={{width:"100%"}}>
        {colors.map(function(c,i) { return (
          <path key={i} d={"M "+(10+i*2)+",110 A "+(90-i*3)+","+(90-i*3)+" 0 0 1 "+(190-i*2)+",110"} fill="none" stroke={c} strokeWidth={3} opacity={0.7}/>
        ); })}
      </svg>
    </div>
  );
}

// ============ Arrival Sequence ============
function ArrivalSequence({stationName,train,onGoReward}) {
  var F = "'Zen Maru Gothic', sans-serif";
  var [step, setStep] = useState(0);
  // 0=減速中(train off-screen right) 1=ホーム進入 2=停車 3=ドア開 4=おかえり
  var labels = ["もうすぐ つくよ…","ホームに はいります","とうちゃく！","ドアが ひらきます","🎊 おかえりなさい！"];

  useEffect(function() {
    var timers = [
      setTimeout(function(){ setStep(1); }, 1500),
      setTimeout(function(){ setStep(2); SFX.arrival(); }, 3000),
      setTimeout(function(){ setStep(3); SFX.doorClose(); }, 4500),
      setTimeout(function(){ setStep(4); SFX.celebrate(); }, 6000),
    ];
    return function() { timers.forEach(clearTimeout); };
  }, []);

  var doorsText = step === 3 ? "プシュー" : null;

  return (
    <div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#E8F0F8 0%,#D8E4EE 50%,#C8D4DE 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F,position:"relative",overflow:"hidden",padding:"16px"}}>
      <div style={{width:"100%",maxWidth:520,position:"relative",overflow:"hidden"}}>
        {/* #10 fix: show train from step 0 (at right edge), slides in from right */}
        <div style={{transition:step>=1?"transform 1.5s cubic-bezier(0.25,0.46,0.45,0.94)":"none",transform:step===0?"translateX(70%)":step===1?"translateX(20%)":"translateX(0)"}}>
          <PlatformSVG
            showTrain
            train={train}
            trainOffsetX={0}
            doorsLabel={doorsText}
            stationLabel={stationName + "えき"}
            sublabel="しゅうてんえき"
            boardText="まもなく とうちゃく"
          />
        </div>
      </div>

      {/* Family waiting on platform */}
      {step >= 4 && <div style={{marginTop:-20,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",textAlign:"center",zIndex:10}}>
        <div style={{fontSize:"3rem"}}>👨‍👩‍👧</div>
        <div style={{fontSize:"1rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginTop:2}}>おかえり！</div>
      </div>}

      {/* Step label */}
      <div style={{marginTop:step>=4?8:20,textAlign:"center",zIndex:10}}>
        <div key={step} style={{fontSize:"1.4rem",fontWeight:900,color:"#5B3A1A",letterSpacing:3,animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",textShadow:"0 1px 4px rgba(255,255,255,0.8)"}}>
          {labels[step]}
        </div>
      </div>

      {/* Continue button */}
      {step >= 4 && <button onClick={onGoReward} style={{marginTop:16,zIndex:15,padding:"14px 36px",borderRadius:20,border:"none",background:"linear-gradient(145deg,#FFE066,#FF9F43)",color:"#7B3F00",fontSize:"1.15rem",fontWeight:800,cursor:"pointer",fontFamily:F,boxShadow:"0 4px 0 #cc8030",animation:"popIn 0.5s 0.5s cubic-bezier(0.34,1.56,0.64,1) both"}}>つぎへ すすむ →</button>}
    </div>
  );
}

function CollectScreen({train,settings,onRun,onBack}){
  var steps=useMemo(function(){
    var s=getSteps(settings.stepCount);
    // Steam trains don't have pantograph
    if(train.kind==="steam") s=s.filter(function(st){return st.partName!=="パンタグラフ";});
    return s;
  },[settings.stepCount,train.kind]);
  var[step,setStep]=useState(0);var[parts,setParts]=useState([]);var[animating,setAnimating]=useState(null);var[animProgress,setAnimProgress]=useState(0);var[showBanner,setShowBanner]=useState(null);var[shakeY,setShakeY]=useState(0);var[isBuild,setIsBuild]=useState(false);var[buttonLocked,setButtonLocked]=useState(false);var animRef=useRef(null);var stepRef=useRef(step);stepRef.current=step;
  // #3 fix: ref for buttonLocked to avoid stale closure in setTimeout
  var buttonLockedRef=useRef(false);
  var setBL=function(v){setButtonLocked(v);buttonLockedRef.current=v;};
  var cs=steps[step];
  var startAnim=useCallback(function(pn){setAnimating(pn);setAnimProgress(0);setBL(true);var dur2=pn==="ボディ"?700:500;var t0=performance.now();var tick=function(now){var p=Math.min((now-t0)/dur2,1);setAnimProgress(1-Math.pow(1-p,3));if(p<1){animRef.current=requestAnimationFrame(tick);}else{setShakeY(-5);setTimeout(function(){setShakeY(3);},80);setTimeout(function(){setShakeY(-1);},150);setTimeout(function(){setShakeY(0);},220);setTimeout(function(){setAnimating(null);setAnimProgress(0);setShowBanner(steps[stepRef.current].partLabel);SFX.partGet();},350);}};animRef.current=requestAnimationFrame(tick);},[steps]);
  useEffect(function(){return function(){if(animRef.current)cancelAnimationFrame(animRef.current);};},[]);
  var handleStep=useCallback(function(){if(buttonLockedRef.current)return;setParts(function(p){return[...p,cs.partName];});startAnim(cs.partName);},[cs,startAnim]);
  var handleBannerDone=useCallback(function(){setShowBanner(null);setBL(false);if(step<steps.length-1)setStep(function(s){return s+1;});else setIsBuild(true);},[step,steps.length]);
  var bgG = isBuild ? "linear-gradient(180deg,#E8F4FD,#D0E8FA,#fff)" : "linear-gradient(180deg,"+cs.bgGrad[0]+","+cs.bgGrad[1]+",#fff)";

  // #3 fix: use ref to avoid stale buttonLocked in setTimeout closure
  var handleMiniComplete = useCallback(function(){
    setTimeout(function(){
      if(buttonLockedRef.current)return;
      setParts(function(p){return[...p,steps[stepRef.current].partName];});
      startAnim(steps[stepRef.current].partName);
    }, 400);
  },[startAnim,steps]);

  // Render interaction widget
  var renderInteraction = function() {
    if (showBanner) return <PartGetBanner label={showBanner} visible onDone={handleBannerDone}/>;
    if (isBuild) return (
      <div style={{animation:"slideUp 0.4s ease",textAlign:"center"}}>
        <div style={{fontSize:"2.5rem",animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>{"🎉"+(train.kind==="steam"?"🚂":"🚄")+"🎉"}</div>
        <div style={{fontSize:"1.4rem",fontWeight:900,color:"#2B6CB0",letterSpacing:2,margin:"8px 0 4px"}}>パーツが ぜんぶ そろったよ！</div>
        <div style={{fontSize:"1.05rem",color:"#666",marginBottom:14}}>{train.name}を はしらせよう！</div>
        <BigButton onClick={onRun} label="しゅっぱつ しんこう！" emoji={train.kind==="steam"?"🚂":"🚄"} color="#E5253C" pulse/>
      </div>
    );
    var itype = cs.interact || "tap";
    if (itype === "rapid") return <RapidTapGame key={step} goal={cs.goal||6} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked}/>;
    if (itype === "swipe") return <SwipeGame key={step} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked}/>;
    if (itype === "hold") return <HoldGame key={step} holdMs={cs.holdMs||1200} color={cs.btnColor} emoji={cs.emoji} onComplete={handleMiniComplete} disabled={buttonLocked}/>;
    // default tap
    return (
      <div style={{animation:"slideUp 0.4s ease",textAlign:"center"}} key={step}>
        <div style={{fontSize:"1.3rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2,marginBottom:4}}>{cs.instruction}</div>
        <div style={{fontSize:"0.95rem",color:"#888",marginBottom:14}}>{cs.hint||"ボタンをおして パーツをゲット！"}</div>
        <BigButton onClick={handleStep} label={cs.label} emoji={cs.emoji} color={cs.btnColor} pulse disabled={buttonLocked}/>
      </div>
    );
  };

  return (
    <div style={{minHeight:"100dvh",background:bgG,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Zen Maru Gothic', sans-serif",padding:"20px 16px",transition:"background 0.6s ease",position:"relative",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
        <button onClick={onBack} style={{background:"rgba(0,0,0,0.06)",border:"none",borderRadius:12,padding:"6px 12px",cursor:"pointer",fontSize:"0.85rem",fontFamily:"'Zen Maru Gothic', sans-serif",fontWeight:700,color:"#999"}}>← もどる</button>
        <div style={{fontSize:"1.1rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2}}>{train.kind==="steam"?"🚂":"🚄"} {train.name}</div>
      </div>
      <ProgressDots total={steps.length} current={step+(isBuild?1:0)}/>
      <div style={{width:"100%",maxWidth:480,margin:"4px 0",transform:"translateY("+shakeY+"px)",transition:shakeY===0?"transform 0.1s ease-out":"none",animation:isBuild&&!showBanner?"float 2s ease-in-out infinite":"none"}}><TrainSVG train={train} parts={parts} animating={animating} animProgress={animProgress} stepCount={settings.stepCount}/></div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",margin:"6px 0"}}>{steps.map(function(s){return <div key={s.id} style={{padding:"5px 12px",borderRadius:14,background:parts.includes(s.partName)?"linear-gradient(135deg,#FFE066,#FF9F43)":"rgba(0,0,0,0.05)",color:parts.includes(s.partName)?"#7B3F00":"#bbb",fontSize:"0.8rem",fontWeight:700,transition:"all 0.4s"}}>{parts.includes(s.partName)?"✓ "+s.partName:"? "+s.partName}</div>;})}</div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,marginTop:8}}>
        {renderInteraction()}
      </div>
    </div>
  );
}

// ============ Stamp Card Screen ============
function StampCard({onBack}) {
  var F = "'Zen Maru Gothic', sans-serif";
  var [stamps, setStamps] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    loadStamps(function(data) { setStamps(data); setLoading(false); });
  }, []);

  // Last 14 days
  var days = [];
  for (var i = 13; i >= 0; i--) {
    var d = new Date(); d.setDate(d.getDate() - i);
    var ds = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
    var dayStamps = stamps.filter(function(s) { return s.date === ds; });
    var dayLabel = (d.getMonth()+1) + "/" + d.getDate();
    var dayOfWeek = ["にち","げつ","か","すい","もく","きん","ど"][d.getDay()];
    days.push({date:ds, label:dayLabel, dow:dayOfWeek, dowIdx:d.getDay(), stamps:dayStamps, isToday:i===0});
  }

  // Collected trains
  var collected = {};
  stamps.forEach(function(s) { collected[s.trainId] = true; });
  var totalCollected = Object.keys(collected).length;

  return (
    <div style={{minHeight:"100dvh",background:"linear-gradient(180deg,#FFF8E1 0%,#FFECB3 50%,#FFE082 100%)",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:F,padding:"20px 16px",overflow:"auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,width:"100%",maxWidth:400}}>
        <button onClick={onBack} style={{background:"rgba(0,0,0,0.06)",border:"none",borderRadius:12,padding:"6px 12px",cursor:"pointer",fontSize:"0.85rem",fontFamily:F,fontWeight:700,color:"#999"}}>← もどる</button>
        <div style={{fontSize:"1.2rem",fontWeight:900,color:"#5B3A1A",letterSpacing:2}}>📅 スタンプカード</div>
      </div>

      {/* Completion bar */}
      <div style={{width:"100%",maxWidth:400,background:"rgba(255,255,255,0.6)",borderRadius:16,padding:"12px 16px",marginBottom:12}}>
        <div style={{fontSize:"0.85rem",fontWeight:700,color:"#7B3F00",marginBottom:6}}>🏆 しゃしゅ コンプリート {totalCollected} / {TRAINS.length}</div>
        <div style={{height:10,background:"rgba(0,0,0,0.06)",borderRadius:5,overflow:"hidden"}}>
          <div style={{width:(totalCollected/TRAINS.length*100)+"%",height:"100%",background:"linear-gradient(90deg,#FFE066,#FF9F43)",borderRadius:5,transition:"width 0.5s ease"}}/>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:8}}>
          {TRAINS.map(function(t) {
            var got = collected[t.id];
            return (
              <div key={t.id} style={{width:36,height:20,borderRadius:6,background:got?"linear-gradient(135deg,"+t.body+","+t.bodyLo+")":"rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.45rem",fontWeight:700,color:got?"#fff":"#ccc",border:got?"1px solid rgba(0,0,0,0.1)":"1px solid rgba(0,0,0,0.04)"}}>
                {got ? "✓" : "?"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar grid - #8 fix: align to actual weekdays */}
      <div style={{width:"100%",maxWidth:400,background:"rgba(255,255,255,0.6)",borderRadius:16,padding:"12px 8px"}}>
        <div style={{fontSize:"0.9rem",fontWeight:800,color:"#7B3F00",textAlign:"center",marginBottom:8,letterSpacing:2}}>さいきん 14にちかん</div>
        {/* Weekday headers */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
          {["にち","げつ","か","すい","もく","きん","ど"].map(function(dw){return (
            <div key={dw} style={{fontSize:"0.5rem",color:"#999",fontWeight:700,textAlign:"center"}}>{dw}</div>
          );})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {/* Pad empty cells to align first day to correct weekday column */}
          {(function(){var pad=[];var firstDow=days[0]?days[0].dowIdx:0;for(var p=0;p<firstDow;p++){pad.push(<div key={"pad"+p}/>);}return pad;})()}
          {days.map(function(day) {
            var hasStamp = day.stamps.length > 0;
            // #7 fix: show the LAST stamp of the day (most recent play) and count
            var lastStamp = hasStamp ? day.stamps[day.stamps.length - 1] : null;
            var trainForDay = lastStamp ? TRAINS.find(function(t){return t.id===lastStamp.trainId;}) : null;
            return (
              <div key={day.date} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 2px",borderRadius:10,background:day.isToday?"rgba(255,159,67,0.15)":"transparent",border:day.isToday?"2px solid #FF9F43":"2px solid transparent"}}>
                <div style={{fontSize:"0.7rem",fontWeight:800,color:day.isToday?"#FF9F43":"#666"}}>{day.label}</div>
                <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:hasStamp?"linear-gradient(135deg,#FFE066,#FF9F43)":"rgba(0,0,0,0.04)",fontSize:hasStamp?"1rem":"0.7rem",boxShadow:hasStamp?"0 2px 6px rgba(255,159,67,0.3)":"none",position:"relative"}}>
                  {hasStamp ? (trainForDay ? (trainForDay.kind==="steam"?"🚂":"🚄") : "⭐") : ""}
                  {day.stamps.length > 1 && <div style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:"50%",background:"#E74C3C",color:"#fff",fontSize:"0.4rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{day.stamps.length}</div>}
                </div>
                {hasStamp && trainForDay && <div style={{fontSize:"0.4rem",color:"#999",fontWeight:700,textAlign:"center",lineHeight:1.1,maxWidth:42,overflow:"hidden"}}>{trainForDay.name}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {loading && <div style={{marginTop:20,fontSize:"1rem",color:"#999"}}>よみこみちゅう...</div>}
    </div>
  );
}

// ============ Main App ============
export default function OuchiTrainApp() {
  var [train, setTrain] = useState(null);
  var [phase, setPhase] = useState("select");
  var [settings, setSettings] = useState(DEFAULT_SETTINGS);
  var [showSettings, setShowSettings] = useState(false);
  var [coupled, setCoupled] = useState(false);
  var [coupledTrain, setCoupledTrain] = useState(null);

  var handleSelect = function(t) {
    setTrain(t);
    if (t.coupleWith) setPhase("askCouple");
    else { setCoupled(false); setCoupledTrain(null); setPhase("collect"); }
  };
  var handleCouple = function(yes) {
    if (yes) { setCoupled(true); setCoupledTrain(TRAINS.find(function(t2){return t2.id===train.coupleWith;})); }
    else { setCoupled(false); setCoupledTrain(null); }
    setPhase("collect");
  };
  var handleReset = function() { setTrain(null); setCoupled(false); setCoupledTrain(null); setPhase("select"); };
  var handleReward = function() {
    // Save stamp when reaching reward
    if (train) saveStamp(train.id, function() { SFX.stamp(); });
    setPhase("reward");
  };

  return (
    <div>
      <style>{[
        "@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&display=swap');",
        "*{box-sizing:border-box;margin:0;padding:0;}",
        "@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}",
        "@keyframes popIn{0%{transform:scale(0.3);opacity:0;}100%{transform:scale(1);opacity:1;}}",
        "@keyframes fadeIn{0%{opacity:0;}100%{opacity:1;}}",
        "@keyframes slideUp{0%{transform:translateY(30px);opacity:0;}100%{transform:translateY(0);opacity:1;}}",
        "@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}",
        "@keyframes particleBurst{0%{transform:translateY(-10px) scale(0);opacity:1;}100%{transform:translateY(-90px) scale(1);opacity:0;}}",
        "@keyframes bannerPop{0%{transform:scale(0) translateY(20px);opacity:0;}100%{transform:scale(1) translateY(0);opacity:1;}}",
        "@keyframes speedLine{0%{transform:translateX(0);opacity:0;}20%{opacity:0.6;}100%{transform:translateX(-500px);opacity:0;}}",
        "@keyframes onomatFloat{0%{transform:translateY(0) scale(0.7);opacity:0;}15%{transform:translateY(-10px) scale(1.1);opacity:0.6;}50%{opacity:0.4;}100%{transform:translateY(-60px) scale(0.8);opacity:0;}}",
        "@keyframes kankankan{0%{transform:translateX(-3px);}100%{transform:translateX(3px);}}",
        "@keyframes stationPass{0%{opacity:0;transform:translateX(-50%) translateY(20px);}10%{opacity:1;transform:translateX(-50%) translateY(0);}80%{opacity:1;}100%{opacity:0;transform:translateX(-50%) translateY(-20px);}}",
        "@keyframes snowfall{0%{transform:translateY(-20px) rotate(0deg);opacity:0;}10%{opacity:1;}90%{opacity:0.8;}100%{transform:translateY(100vh) rotate(360deg);opacity:0;}}",
        "@keyframes passingTrain{0%{transform:translateX(120vw);}100%{transform:translateX(-120vw);}}",
        "@keyframes bellSwing{0%{transform:rotate(-15deg);}100%{transform:rotate(15deg);}}",
        "@keyframes twinkle{0%{opacity:0.2;}100%{opacity:1;}}",
        "@keyframes rainfall{0%{transform:translateY(-20px) rotate(12deg);opacity:0;}10%{opacity:0.6;}90%{opacity:0.4;}100%{transform:translateY(100vh) rotate(12deg);opacity:0;}}",
        "@keyframes puddleRipple{0%,100%{transform:scaleX(1);opacity:0.15;}50%{transform:scaleX(1.3);opacity:0.25;}}",
        "@keyframes holdPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}",
        "@keyframes slideInRight{0%{transform:translateX(100%);}100%{transform:translateX(0);}}",
        "@keyframes coupleSlideRight{0%{transform:translateX(-40px);}100%{transform:translateX(calc(50% - 10px));}}",
        "@keyframes coupleSlideLeft{0%{transform:translateX(40px);}100%{transform:translateX(calc(-50% + 10px));}}",
        "@keyframes coupleFlash{0%{transform:translate(-50%,-50%) scale(1);opacity:1;}100%{transform:translate(-50%,-50%) scale(3);opacity:0;}}",
      ].join("\n")}</style>
      {phase === "select" && <DepotSelector onSelect={handleSelect} onOpenSettings={function(){setShowSettings(true);}} onStamps={function(){setPhase("stamps");}} />}
      {phase === "stamps" && <StampCard onBack={function(){setPhase("select");}} />}
      {phase === "askCouple" && train && <CouplingDialog train={train} onYes={function(){handleCouple(true);}} onNo={function(){handleCouple(false);}} />}
      {phase === "collect" && train && <CollectScreen train={train} settings={settings} onRun={function(){setPhase("depart");}} onBack={handleReset} />}
      {phase === "depart" && train && <DepartureScreen train={train} coupled={coupled} coupledTrain={coupledTrain} onDepart={function(){setPhase("run");}} />}
      {phase === "run" && train && <RunningScreen train={train} settings={settings} coupled={coupled} coupledTrain={coupledTrain} onGoReward={function(){setPhase("arrive");}} />}
      {phase === "arrive" && train && <ArrivalSequence stationName={settings.stationName} train={train} onGoReward={handleReward} />}
      {phase === "reward" && train && <RewardScreen trainName={train.name} onReset={handleReset} />}
      {showSettings && <SettingsModal settings={settings} onChange={setSettings} onClose={function(){setShowSettings(false);}} />}
    </div>
  );
}

'use client'
import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  src: string
  /** 'bunny' = HLS stream from Bunny.net, 'upload' = direct MP4 */
  sourceType?: 'bunny' | 'upload'
  title?: string
  onProgress?: (seconds: number, total: number) => void
}

export default function VideoPlayer({ src, sourceType = 'upload', title, onProgress }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerInitialized = useRef(false)

  useEffect(() => {
    if (!src || playerInitialized.current) return
    playerInitialized.current = true

    // Dynamically load HLS.js
    const hlsScript = document.createElement('script')
    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest'
    hlsScript.onload = () => initPlayer()
    document.head.appendChild(hlsScript)

    // Dynamically load Lucide
    const lucideScript = document.createElement('script')
    lucideScript.src = 'https://unpkg.com/lucide@latest'
    lucideScript.onload = () => {}
    document.head.appendChild(lucideScript)

    return () => {
      playerInitialized.current = false
    }
  }, [src])

  const initPlayer = () => {
    const container = containerRef.current
    if (!container) return
    const video = container.querySelector('#mainVideo') as HTMLVideoElement
    if (!video) return

    const Hls = (window as any).Hls
    const lucide = (window as any).lucide

    if (lucide) lucide.createIcons()

    const isHLS = src.includes('.m3u8') || sourceType === 'bunny'

    if (isHLS && Hls && Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true })
      hls.loadSource(src)
      hls.attachMedia(video)
    } else {
      video.src = src
    }

    // Progress callback
    if (onProgress) {
      video.addEventListener('timeupdate', () => {
        onProgress(video.currentTime, video.duration || 0)
      })
    }
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
      <div
        ref={containerRef}
        style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}
        id="videoContainer"
      >
        {/* Injected HTML player */}
        <VideoPlayerHTML src={src} />
      </div>
    </div>
  )
}

// The full player rendered as raw HTML via dangerouslySetInnerHTML
function VideoPlayerHTML({ src }: { src: string }) {
  const html = `
<style>
:root{--royal-blue:#4f46e5;--silver-buffer:rgba(255,255,255,0.25);--bg-black:#0a0a0a;--text-white:#ffffff;--transition:all 0.3s cubic-bezier(0.4,0,0.2,1);--control-height:40px}
*{box-sizing:border-box;outline:none!important;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
.vp-wrap{position:relative;width:100%;height:100%;background:#000;display:flex;justify-content:center;align-items:center}
.vp-wrap.inactive{cursor:none}
video.main-video{width:100%;height:100%;object-fit:contain;display:block}
.touch-overlay{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;z-index:50;pointer-events:auto;touch-action:manipulation}
.touch-zone{flex:1;display:flex;align-items:center;justify-content:center;position:relative;touch-action:manipulation}
.tap-ripple{position:absolute;top:50%;transform:translateY(-50%);width:80px;height:80px;background:rgba(255,255,255,0.12);backdrop-filter:blur(4px);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:12px;font-weight:800;color:white;opacity:0;pointer-events:none;z-index:120}
.tap-ripple.left{left:15%}.tap-ripple.right{right:15%}
.ripple-arrows{display:flex;gap:2px;align-items:center}
.ripple-arrow{width:7px;height:11px;clip-path:polygon(0 50%,100% 0,100% 100%);background:rgba(255,255,255,0.7)}
.tap-ripple.right .ripple-arrow{clip-path:polygon(100% 50%,0 0,0 100%)}
@keyframes rippleAnim{0%{opacity:1;transform:translateY(-50%) scale(0.8)}80%{opacity:.8}100%{opacity:0;transform:translateY(-50%) scale(1.7)}}
@keyframes arrowSeq{0%,100%{opacity:.3}33%{opacity:1}}
.tap-ripple.animating .ripple-arrow:nth-child(1){animation:arrowSeq .4s 0s ease}
.tap-ripple.animating .ripple-arrow:nth-child(2){animation:arrowSeq .4s .1s ease}
.tap-ripple.animating .ripple-arrow:nth-child(3){animation:arrowSeq .4s .2s ease}
.rc-warning{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(180,0,0,.18);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s ease}
.rc-warning.show{opacity:1;pointer-events:all}
.rc-warning-box{background:linear-gradient(135deg,#8b0000,#c0392b);border:2px solid #f44;border-radius:14px;padding:24px 36px;text-align:center;box-shadow:0 0 40px rgba(255,0,0,.5)}
.loading-spinner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border:4px solid var(--silver-buffer);border-top-color:var(--royal-blue);border-radius:50%;animation:spin 1s linear infinite;display:none;z-index:150;pointer-events:none}
@keyframes spin{100%{transform:translate(-50%,-50%) rotate(360deg)}}
.controls-wrapper{position:absolute;bottom:0;left:0;right:0;padding:16px;background:linear-gradient(to top,rgba(0,0,0,.98) 0%,transparent 100%);display:flex;align-items:center;gap:12px;z-index:100;direction:ltr;transition:opacity .4s ease,transform .4s ease}
.vp-wrap.inactive .controls-wrapper{opacity:0;transform:translateY(8px);pointer-events:none}
.play-box{background:rgba(10,10,10,.8);color:#fff;border:none;border-radius:10px;width:var(--control-height);height:var(--control-height);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--transition);flex-shrink:0}
.play-box:hover{background:var(--royal-blue);transform:scale(1.1)}
.main-controls-box{background:rgba(10,10,10,.7);backdrop-filter:blur(12px);border-radius:10px;border:1px solid rgba(255,255,255,.05);flex-grow:1;display:flex;align-items:center;padding:0 12px;height:var(--control-height);gap:12px}
.progress-container{flex-grow:1;display:flex;align-items:center;position:relative;height:100%;cursor:pointer}
.progress-track{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:3px;position:relative;transition:height .2s}
.progress-container:hover .progress-track{height:6px}
.progress-bar{position:absolute;height:100%;background:var(--royal-blue);width:0%;border-radius:3px;transition:width .1s linear;z-index:2}
.buffer-bar{position:absolute;height:100%;background:var(--silver-buffer);width:0%;border-radius:3px;z-index:1}
.floating-tracker{position:absolute;bottom:18px;left:0;transform:translateX(-50%);background:rgba(0,0,0,.75);color:#fff;padding:3px 8px;border-radius:16px;font-size:11px;font-weight:800;font-family:monospace;pointer-events:none;z-index:60;white-space:nowrap;border:1.5px solid rgba(79,70,229,.6);transition:left .1s linear}
.time-display{font-family:monospace;font-size:11px;color:#aaa;margin:0 8px;white-space:nowrap;direction:ltr;display:flex;align-items:center}
.right-controls{display:flex;align-items:center;gap:4px}
.control-btn{background:none;border:none;color:#ddd;cursor:pointer;padding:6px;display:flex;align-items:center;transition:var(--transition)}
.control-btn:hover{color:var(--royal-blue);transform:scale(1.15);filter:drop-shadow(0 0 4px rgba(79,70,229,.6))}
.hover-menu-wrapper{position:relative;height:100%;display:flex;align-items:center}
.floating-panel{position:absolute;bottom:calc(100% + 12px);left:50%;transform:translateX(-50%);background:rgba(5,5,5,.98);border-radius:10px;border:1px solid rgba(255,255,255,.1);opacity:0;visibility:hidden;transition:var(--transition);z-index:1000;padding:6px;backdrop-filter:blur(20px);min-width:130px;box-shadow:0 10px 30px rgba(0,0,0,.8)}
.volume-wrapper:hover .volume-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(-4px)}
.settings-panel.active{opacity:1;visibility:visible;transform:translateX(-50%) translateY(-4px)}
.volume-panel{min-width:34px!important;padding:14px 0!important;bottom:calc(100% + 4px)!important;border-radius:8px!important}
.volume-slider-container{width:4px;height:80px;background:rgba(255,255,255,.1);border-radius:4px;cursor:pointer;position:relative;margin:0 auto;touch-action:none}
.volume-slider-fill{position:absolute;bottom:0;width:100%;background:var(--royal-blue);height:80%;border-radius:4px;pointer-events:none}
.volume-thumb{position:absolute;left:50%;transform:translate(-50%,50%);width:10px;height:10px;background:#fff;border:2px solid var(--royal-blue);border-radius:50%;pointer-events:none;box-shadow:0 0 0 2px rgba(79,70,229,.2),0 2px 6px rgba(0,0,0,.5);transition:transform .15s ease}
.volume-slider-container:hover .volume-thumb,.volume-slider-container.dragging .volume-thumb{transform:translate(-50%,50%) scale(1.35)}
.setting-item{padding:7px 10px;font-size:12px;color:#fff;cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-radius:5px;transition:.2s;direction:rtl;font-family:'Cairo',sans-serif}
.setting-item:hover{background:var(--royal-blue)}
.setting-item.active{color:var(--royal-blue);font-weight:bold}
.setting-item .val-label{font-size:9px;opacity:.8;margin-right:8px}
.hidden-menu{display:none!important}
.muted-indicator{position:absolute;top:28px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.7);color:#fff;padding:10px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:150;opacity:0;visibility:hidden;transition:all .3s ease;backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.1)}
.muted-indicator.show{opacity:1;visibility:visible}
.fs-icon{width:16px;height:16px;position:relative;display:flex;align-items:center;justify-content:center;pointer-events:none}
.fs-icon::before,.fs-icon::after,.fs-icon span::before,.fs-icon span::after{content:'';position:absolute;width:5px;height:5px;border-color:currentColor;border-style:solid;transition:transform .25s ease}
.fs-icon::before{top:0;left:0;border-width:2px 0 0 2px}
.fs-icon::after{top:0;right:0;border-width:2px 2px 0 0}
.fs-icon span::before{bottom:0;left:0;border-width:0 0 2px 2px}
.fs-icon span::after{bottom:0;right:0;border-width:0 2px 2px 0}
.is-fullscreen .fs-icon::before{transform:translate(3px,3px)}
.is-fullscreen .fs-icon::after{transform:translate(-3px,3px)}
.is-fullscreen .fs-icon span::before{transform:translate(3px,-3px)}
.is-fullscreen .fs-icon span::after{transform:translate(-3px,-3px)}
</style>

<div class="vp-wrap" id="vpWrap">
  <div class="rc-warning" id="rcWarn"><div class="rc-warning-box"><div style="font-size:36px">🚫</div><div style="color:#fff;font-size:18px;font-weight:800;margin-top:6px">⚠️ محتوى محمي</div><div style="color:#ffaaaa;font-size:13px;margin-top:4px">لا يمكن الوصول إليه</div></div></div>
  <div class="loading-spinner" id="vpSpinner"></div>
  <div class="tap-ripple left" id="vpRippleL"><div class="ripple-arrows"><div class="ripple-arrow"></div><div class="ripple-arrow"></div><div class="ripple-arrow"></div></div><span>+10s</span></div>
  <div class="tap-ripple right" id="vpRippleR"><div class="ripple-arrows"><div class="ripple-arrow"></div><div class="ripple-arrow"></div><div class="ripple-arrow"></div></div><span>-10s</span></div>
  <video class="main-video" id="mainVideo" playsinline crossorigin="anonymous"></video>
  <div class="touch-overlay" id="vpTouchOverlay">
    <div class="touch-zone" id="vpZoneR"></div>
    <div class="touch-zone" id="vpZoneM"></div>
    <div class="touch-zone" id="vpZoneL"></div>
  </div>
  <div class="muted-indicator" id="vpMutedInd"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg></div>
  <div class="controls-wrapper" id="vpControls">
    <div class="play-box" id="vpPlayBtn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
    <div class="main-controls-box">
      <div class="progress-container" id="vpProgress">
        <div class="floating-tracker" id="vpTracker">00:00</div>
        <div class="progress-track"><div class="buffer-bar" id="vpBuf"></div><div class="progress-bar" id="vpBar"></div></div>
      </div>
      <div class="time-display" id="vpTime">00:00 / 00:00</div>
      <div class="right-controls">
        <div class="hover-menu-wrapper volume-wrapper">
          <button class="control-btn" id="vpMuteBtn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg></button>
          <div class="floating-panel volume-panel"><div class="volume-slider-container" id="vpVolSlider"><div class="volume-slider-fill" id="vpVolFill"></div><div class="volume-thumb" id="vpVolThumb"></div></div></div>
        </div>
        <div class="hover-menu-wrapper" id="vpSettingsWrap">
          <button class="control-btn" id="vpSettingsBtn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
          <div class="floating-panel settings-panel" id="vpSettingsPanel">
            <div id="vpMainMenu">
              <div class="setting-item" onclick="vpSwitchMenu('vpSpeedMenu',event)"><span>السرعة</span><span class="val-label" id="vpCurSpeed">طبيعي</span></div>
            </div>
            <div id="vpSpeedMenu" class="hidden-menu">
              <div class="setting-item" onclick="vpSwitchMenu('vpMainMenu',event)" style="opacity:.5">رجوع</div>
              <div class="setting-item" onclick="vpSetSpd(.5,'0.5x')">0.5x</div>
              <div class="setting-item" onclick="vpSetSpd(.75,'0.75x')">0.75x</div>
              <div class="setting-item active" onclick="vpSetSpd(1,'طبيعي')">طبيعي</div>
              <div class="setting-item" onclick="vpSetSpd(1.25,'1.25x')">1.25x</div>
              <div class="setting-item" onclick="vpSetSpd(1.5,'1.5x')">1.5x</div>
              <div class="setting-item" onclick="vpSetSpd(1.75,'1.75x')">1.75x</div>
              <div class="setting-item" onclick="vpSetSpd(2,'2x')">2x</div>
            </div>
          </div>
        </div>
        <button class="control-btn" id="vpFsBtn"><div class="fs-icon"><span></span></div></button>
      </div>
    </div>
  </div>
</div>

<script>
(function(){
  var vpSrc = "${src}";
  var wrap=document.getElementById('vpWrap'),v=document.getElementById('mainVideo'),
  playBtn=document.getElementById('vpPlayBtn'),pBar=document.getElementById('vpBar'),
  bBar=document.getElementById('vpBuf'),vFill=document.getElementById('vpVolFill'),
  vThumb=document.getElementById('vpVolThumb'),vSlider=document.getElementById('vpVolSlider'),
  mBtn=document.getElementById('vpMuteBtn'),pCont=document.getElementById('vpProgress'),
  tracker=document.getElementById('vpTracker'),fsBtn=document.getElementById('vpFsBtn'),
  sBtn=document.getElementById('vpSettingsBtn'),sPanel=document.getElementById('vpSettingsPanel'),
  sWrap=document.getElementById('vpSettingsWrap'),timeDisp=document.getElementById('vpTime'),
  spinner=document.getElementById('vpSpinner'),mutedInd=document.getElementById('vpMutedInd'),
  rcWarn=document.getElementById('vpRcWarn')||document.getElementById('rcWarn'),
  ripL=document.getElementById('vpRippleL'),ripR=document.getElementById('vpRippleR'),
  zL=document.getElementById('vpZoneL'),zM=document.getElementById('vpZoneM'),zR=document.getElementById('vpZoneR'),
  touchOvr=document.getElementById('vpTouchOverlay');

  var hideTimer,isDragVol=false,isDragProg=false,isHoverCtrl=false,rcTimer;
  var touchSX=0,touchSY=0,isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;

  // Block right-click
  wrap.addEventListener('contextmenu',function(e){e.preventDefault();showRC();});
  function showRC(){if(!rcWarn)return;rcWarn.classList.add('show');clearTimeout(rcTimer);rcTimer=setTimeout(function(){rcWarn.classList.remove('show');},2200);}

  // Init video
  function initVid(){
    var isHLS=vpSrc.includes('.m3u8');
    if(isHLS&&window.Hls&&window.Hls.isSupported()){
      var hls=new window.Hls({autoStartLoad:true});
      hls.loadSource(vpSrc);hls.attachMedia(v);
    } else {v.src=vpSrc;}
  }

  // Wait for HLS.js to load
  var hlsCheckCount=0;
  function waitForHls(){
    if(window.Hls||hlsCheckCount>20){initVid();return;}
    hlsCheckCount++;setTimeout(waitForHls,200);
  }
  waitForHls();

  v.volume=1;v.muted=false;updateVolUI();

  // Spinner
  v.addEventListener('waiting',function(){spinner.style.display='block';});
  v.addEventListener('playing',function(){spinner.style.display='none';});
  v.addEventListener('canplay',function(){spinner.style.display='none';});
  v.addEventListener('seeked', function(){spinner.style.display='none';});

  // Buffer
  v.addEventListener('progress',function(){
    if(v.buffered.length>0&&v.duration){
      bBar.style.width=(v.buffered.end(v.buffered.length-1)/v.duration*100)+'%';
    }
  });

  // Play/Pause
  function fmt(t){if(isNaN(t))return'00:00';var h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=Math.floor(t%60);var p=function(n){return n<10?'0'+n:n;};return h>0?h+':'+p(m)+':'+p(s):p(m)+':'+p(s);}
  function setPlayIcon(paused){playBtn.innerHTML=paused?'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';}
  async function togglePlay(){if(v.paused){try{await v.play();setPlayIcon(false);}catch(e){}}else{v.pause();setPlayIcon(true);}resetTimer();}
  playBtn.addEventListener('click',function(e){e.stopPropagation();togglePlay();});
  v.addEventListener('ended',function(){setPlayIcon(true);});

  // Ripple
  function showRipple(el,label){
    el.style.animation='none';void el.offsetWidth;el.style.animation='rippleAnim .65s ease-out forwards';
    el.classList.add('animating');var sp=el.querySelector('span');if(sp)sp.textContent=label;
    setTimeout(function(){el.classList.remove('animating');},700);
  }
  function seekFwd(){v.currentTime=Math.min(v.duration||0,v.currentTime+10);showRipple(ripL,'+10s');resetTimer();}
  function seekBwd(){v.currentTime=Math.max(0,v.currentTime-10);showRipple(ripR,'-10s');resetTimer();}

  // Touch zones
  function makeZoneHandler(zone){
    var tc=0,tt;
    return function(e){
      if(isDragProg||isDragVol)return;
      clearTimeout(tt);tc++;
      if(tc===1){tt=setTimeout(function(){tc=0;if(zone==='middle')togglePlay();else resetTimer();},280);}
      else if(tc===2){clearTimeout(tt);tc=0;if(zone==='left')seekFwd();else if(zone==='right')seekBwd();else fsBtn.click();}
    };
  }
  var hL=makeZoneHandler('left'),hM=makeZoneHandler('middle'),hR=makeZoneHandler('right');
  zL.addEventListener('click',hL);zM.addEventListener('click',hM);zR.addEventListener('click',hR);
  if(isTouch){
    function mkTE(h){return function(e){var dx=Math.abs(e.changedTouches[0].clientX-touchSX),dy=Math.abs(e.changedTouches[0].clientY-touchSY);if(dx>25||dy>25)return;e.preventDefault();h(e);};};
    zL.addEventListener('touchend',mkTE(hL),{passive:false});zM.addEventListener('touchend',mkTE(hM),{passive:false});zR.addEventListener('touchend',mkTE(hR),{passive:false});
  }
  touchOvr.addEventListener('touchstart',function(e){touchSX=e.touches[0].clientX;touchSY=e.touches[0].clientY;},{passive:true});
  v.addEventListener('dblclick',function(){if(!isTouch)fsBtn.click();});

  // Volume
  function setVol(clientY,sliderEl){var r=(sliderEl||vSlider).getBoundingClientRect();var vol=Math.max(0,Math.min(1,1-(clientY-r.top)/r.height));if(vol<.05){vol=0;v.muted=true;}else v.muted=false;v.volume=vol;updateVolUI();}
  function updateVolUI(){
    var vol=v.muted?0:v.volume;var h=(vol*100)+'%';vFill.style.height=h;vThumb.style.bottom=h;
    mutedInd.classList.toggle('show',v.muted||v.volume===0);
    var ic=v.muted||v.volume===0?'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>':v.volume<.5?'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
    mBtn.innerHTML=ic;
  }
  mBtn.addEventListener('click',function(e){e.stopPropagation();v.muted=!v.muted;if(!v.muted&&v.volume===0)v.volume=.2;updateVolUI();});
  mutedInd.addEventListener('click',function(e){e.stopPropagation();v.muted=false;if(!v.volume)v.volume=.2;updateVolUI();});
  vSlider.addEventListener('mousedown',function(e){isDragVol=true;vSlider.classList.add('dragging');setVol(e.clientY);e.stopPropagation();});
  vSlider.addEventListener('touchstart',function(e){isDragVol=true;vSlider.classList.add('dragging');setVol(e.touches[0].clientY);e.stopPropagation();e.preventDefault();},{passive:false});

  // Progress
  function seekTo(clientX){var r=pCont.getBoundingClientRect();var pos=Math.max(0,Math.min(1,(clientX-r.left)/r.width));pBar.style.width=(pos*100)+'%';tracker.style.left=(pos*100)+'%';tracker.textContent=fmt(pos*(v.duration||0));v.currentTime=pos*(v.duration||0);}
  pCont.addEventListener('mousedown',function(e){isDragProg=true;seekTo(e.clientX);e.stopPropagation();});
  pCont.addEventListener('touchstart',function(e){isDragProg=true;seekTo(e.touches[0].clientX);e.stopPropagation();e.preventDefault();},{passive:false});
  pCont.addEventListener('mousemove',function(e){if(isDragProg)seekTo(e.clientX);});

  document.addEventListener('mousemove',function(e){if(isDragVol)setVol(e.clientY);if(isDragProg)seekTo(e.clientX);});
  document.addEventListener('mouseup',function(){isDragVol=false;isDragProg=false;vSlider.classList.remove('dragging');});
  document.addEventListener('touchmove',function(e){if(isDragVol){setVol(e.touches[0].clientY);e.preventDefault();}if(isDragProg){seekTo(e.touches[0].clientX);e.preventDefault();}},{passive:false});
  document.addEventListener('touchend',function(){isDragVol=false;isDragProg=false;vSlider.classList.remove('dragging');});

  // Sync UI
  v.addEventListener('timeupdate',function(){
    if(!v.duration)return;
    var pct=(v.currentTime/v.duration*100)+'%';pBar.style.width=pct;tracker.style.left=pct;tracker.textContent=fmt(v.currentTime);
    timeDisp.textContent=fmt(v.currentTime)+' / '+fmt(v.duration);
  });

  // Settings
  window.vpSwitchMenu=function(id,e){if(e)e.stopPropagation();['vpMainMenu','vpSpeedMenu'].forEach(function(m){var el=document.getElementById(m);if(el)el.classList.add('hidden-menu');});var t=document.getElementById(id);if(t)t.classList.remove('hidden-menu');};
  window.vpSetSpd=function(r,lbl){v.playbackRate=r;var el=document.getElementById('vpCurSpeed');if(el)el.textContent=lbl;document.querySelectorAll('#vpSpeedMenu .setting-item').forEach(function(x){x.classList.remove('active');});vpSwitchMenu('vpMainMenu');sPanel.classList.remove('active');};
  sBtn.addEventListener('click',function(e){e.stopPropagation();sPanel.classList.toggle('active');vpSwitchMenu('vpMainMenu');});
  document.addEventListener('click',function(e){if(!sWrap.contains(e.target))sPanel.classList.remove('active');});

  // Fullscreen
  fsBtn.addEventListener('click',function(){if(!document.fullscreenElement)wrap.requestFullscreen();else document.exitFullscreen();});
  document.addEventListener('fullscreenchange',function(){wrap.classList.toggle('is-fullscreen',!!document.fullscreenElement);});

  // Hide timer
  function resetTimer(){wrap.classList.remove('inactive');clearTimeout(hideTimer);if(!isHoverCtrl)hideTimer=setTimeout(function(){wrap.classList.add('inactive');},3000);}
  wrap.addEventListener('mousemove',resetTimer);
  var ctrls=document.getElementById('vpControls');
  if(ctrls){ctrls.addEventListener('mouseenter',function(){isHoverCtrl=true;resetTimer();});ctrls.addEventListener('mouseleave',function(){isHoverCtrl=false;resetTimer();});}

  // Keyboard
  document.addEventListener('keydown',function(e){switch(e.key){case' ':e.preventDefault();togglePlay();break;case'ArrowRight':e.preventDefault();seekFwd();break;case'ArrowLeft':e.preventDefault();seekBwd();break;case'ArrowUp':e.preventDefault();v.volume=Math.min(1,v.volume+.1);v.muted=false;updateVolUI();break;case'ArrowDown':e.preventDefault();v.volume=Math.max(0,v.volume-.1);updateVolUI();break;case'f':case'F':e.preventDefault();fsBtn.click();break;}});
})();
</script>
`

  return <div dangerouslySetInnerHTML={{ __html: html }} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
}

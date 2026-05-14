'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import './style.scss';

const slides = [
  { before: '/images/compare-dust-before.jpg', after: '/images/compare-dust-after.jpg' },
  { before: '/images/compare-grease1-before.jpg', after: '/images/compare-grease1-after.jpg' },
  { before: '/images/compare-grease2-before.jpg', after: '/images/compare-grease2-after.jpg' },
  { before: '/images/compare-reservoir-before.jpg', after: '/images/compare-reservoir-after.jpg' },
];

function Slider({ before, after }) {
  const wrapRef = useRef(null), clipRef = useRef(null), handleRef = useRef(null), imgRef = useRef(null);
  const dragging = useRef(false);
  const setPos = useCallback((x) => {
    const r = wrapRef.current?.getBoundingClientRect(); if (!r) return;
    let pct = Math.max(2, Math.min(98, ((x - r.left) / r.width) * 100));
    clipRef.current.style.width = pct + '%';
    handleRef.current.style.left = pct + '%';
    imgRef.current.style.width = r.width + 'px';
    imgRef.current.style.minWidth = r.width + 'px';
  }, []);

  useEffect(() => {
    const w = wrapRef.current; if (!w) return;
    const ro = new ResizeObserver(() => { imgRef.current.style.width = w.offsetWidth+'px'; imgRef.current.style.minWidth = w.offsetWidth+'px'; });
    ro.observe(w);
    const md = e => { dragging.current=true; setPos(e.clientX); e.preventDefault(); };
    const mm = e => { if(dragging.current) setPos(e.clientX); };
    const mu = () => { dragging.current=false; };
    const ts = e => { dragging.current=true; setPos(e.touches[0].clientX); };
    const tm = e => { if(dragging.current){setPos(e.touches[0].clientX);e.preventDefault();} };
    const te = () => { dragging.current=false; };
    w.addEventListener('mousedown',md); window.addEventListener('mousemove',mm); window.addEventListener('mouseup',mu);
    w.addEventListener('touchstart',ts,{passive:true}); w.addEventListener('touchmove',tm,{passive:false}); w.addEventListener('touchend',te);
    return () => { ro.disconnect(); w.removeEventListener('mousedown',md); window.removeEventListener('mousemove',mm); window.removeEventListener('mouseup',mu); };
  }, [setPos]);

  return (
    <div className="comp__slide">
      <div className="comp__label comp__label--before">До</div>
      <div className="comp__label comp__label--after">После</div>
      <div className="comp__wrap" ref={wrapRef}>
        <img src={after} alt="После" draggable="false" />
        <div className="comp__clip" ref={clipRef}><img src={before} alt="До" draggable="false" ref={imgRef} /></div>
        <div className="comp__handle" ref={handleRef}>
          <div className="comp__line"/><div className="comp__circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 4l-4 4 4 4"/><path d="M16 4l4 4-4 4"/></svg></div><div className="comp__line"/>
        </div>
      </div>
    </div>
  );
}

export default function Comparison() {
  const [cur, setCur] = useState(0);
  const go = i => setCur(((i%4)+4)%4);
  return (
    <section className="comp">
      <div className="comp__carousel">
        <div className="comp__track" style={{transform:`translateX(-${cur*100}%)`}}>
          {slides.map((s,i) => <Slider key={i} {...s} />)}
        </div>
        <button className="comp__arrow comp__arrow--prev" onClick={()=>go(cur-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button className="comp__arrow comp__arrow--next" onClick={()=>go(cur+1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 6 15 12 9 18"/></svg></button>
      </div>
      <div className="comp__dots">{slides.map((_,i)=><button key={i} className={`comp__dot${i===cur?' comp__dot--on':''}`} onClick={()=>go(i)}/>)}</div>
    </section>
  );
}

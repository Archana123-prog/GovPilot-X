import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 247, suffix: '+', label: 'Challenges Posted',  color: 'text-gov-400' },
  { value: 89,  suffix: '',  label: 'Active Pilots',       color: 'text-cyber-400' },
  { value: 1842,suffix: '+', label: 'Verified Startups',   color: 'text-accent-purple' },
  { value: 94,  suffix: '%', label: 'Match Accuracy',      color: 'text-accent-green' },
];

function Counter({ target, suffix, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const startedRef = useRef(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        if (startedRef.current) return;
        startedRef.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => setCount(Math.round(obj.val)),
        });
      },
    });
    return () => trigger.kill();
  }, [target, duration]);

  return (
    <span ref={ref}>{count.toLocaleString()}{suffix}</span>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <p className={`text-4xl md:text-5xl font-display font-bold ${s.color}`}>
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-white/50 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

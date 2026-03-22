import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

export const AnimatedCounter = ({ target, duration = 2000 }: { target: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = target / (duration / 16);
      
      const updateCounter = () => {
        start += increment;
        if (start < target) {
          setCount(Math.ceil(start));
          requestAnimationFrame(updateCounter);
        } else {
          setCount(target);
        }
      };
      updateCounter();
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Constelação animada — elemento de assinatura herdado do site NexumLab.
 * Reaproveitado aqui de propósito: é o sinal visual mais direto de que
 * auditorCLT e NexumLab são a mesma casa.
 */
export default function NetworkBackground({ count = 28 }) {
  const shouldReduceMotion = useReducedMotion();

  const nodes = useMemo(() => {
    const points = [];
    for (let i = 0; i < count; i += 1) {
      points.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        driftX: Math.random() * 2 - 1,
        driftY: Math.random() * 2 - 1,
      });
    }
    return points;
  }, [count]);

  const connections = useMemo(() => {
    const lines = [];
    nodes.forEach((node) => {
      const nearby = nodes
        .filter((n) => n.id !== node.id)
        .sort((a, b) => {
          const distA = Math.hypot(a.x - node.x, a.y - node.y);
          const distB = Math.hypot(b.x - node.x, b.y - node.y);
          return distA - distB;
        })
        .slice(0, 2);

      nearby.forEach((target) => {
        lines.push({
          id: `${node.id}-${target.id}`,
          x1: node.x,
          y1: node.y,
          x2: target.x,
          y2: target.y,
        });
      });
    });
    return lines;
  }, [nodes]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0" aria-hidden="true">
      <svg width="100%" height="100%" className="absolute inset-0">
        {connections.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="hsl(var(--destructive))"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 3, ease: 'easeInOut', delay: Math.random() * 2 }}
          />
        ))}

        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="hsl(var(--destructive))"
            initial={{ opacity: 0.2 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.3 }
                : {
                    opacity: [0.1, 0.6, 0.1],
                    scale: [1, 1.5, 1],
                    cx: [`${node.x}%`, `${node.x + node.driftX}%`, `${node.x}%`],
                    cy: [`${node.y}%`, `${node.y + node.driftY}%`, `${node.y}%`],
                  }
            }
            transition={{
              duration: node.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
              delay: node.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

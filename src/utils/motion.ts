export const easeOut = [0.16, 1, 0.3, 1] as const;

export const container = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay,
      staggerChildren: 0.09,
      delayChildren: delay + 0.06,
    },
  },
});

export const itemUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOut, delay },
  },
});

export const itemFade = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOut, delay } },
});

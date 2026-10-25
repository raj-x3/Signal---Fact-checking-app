import React, { useRef, useState } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence, 
  MotionValue 
} from 'motion/react';
import { IconLayoutNavbarCollapse } from '@tabler/icons-react';

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative block md:hidden ${className || ''}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href || '#'}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        aria-label="Toggle Navigation Dock"
      >
        <IconLayoutNavbarCollapse className="w-5 h-5" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`hidden md:flex h-12 gap-2.5 items-center rounded-2xl bg-white/80 backdrop-blur-md px-3 border border-slate-200/80 shadow-xs ${className || ''}`}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue<number>;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Smooth macOS-style dock magnification
  const widthTransform = useTransform(distance, [-120, 0, 120], [36, 52, 36]);
  const heightTransform = useTransform(distance, [-120, 0, 120], [36, 52, 36]);

  const widthTransformIcon = useTransform(distance, [-120, 0, 120], [17, 24, 17]);
  const heightTransformIcon = useTransform(distance, [-120, 0, 120], [17, 24, 17]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 160,
    damping: 14,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="shrink-0"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-xl bg-slate-50 hover:bg-white flex items-center justify-center relative shadow-2xs border border-slate-200/70 hover:border-blue-400 hover:shadow-sm transition-colors cursor-pointer group"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 3, x: '-50%' }}
              className="px-2.5 py-1 whitespace-pre rounded-lg bg-slate-900 text-white absolute -top-9 left-1/2 -translate-x-1/2 w-fit text-[11px] font-semibold tracking-tight shadow-lg pointer-events-none z-50 flex items-center gap-1 border border-slate-700"
            >
              <span>{title}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

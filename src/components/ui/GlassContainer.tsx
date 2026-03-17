import React, { ReactNode } from "react";
import styles from "./GlassContainer.module.css";

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
}

export default function GlassContainer({ children, className = "" }: GlassContainerProps) {
  return (
    <div className={`${styles.glass} ${className}`}>
      {children}
    </div>
  );
}

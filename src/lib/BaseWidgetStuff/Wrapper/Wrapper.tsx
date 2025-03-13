import React from 'react';
import classNames from 'classnames';

import styles from './Wrapper.module.css';

interface Props {
  children: React.ReactNode;
  center?: boolean;
  className?: string
  style?: React.CSSProperties;
}

export function Wrapper({children, center, className, style}: Props) {
  return (
    <div
      className={className + " " + classNames(styles.Wrapper, center && styles.center)}
      style={style}
    >
      {children}
    </div>
  );
}

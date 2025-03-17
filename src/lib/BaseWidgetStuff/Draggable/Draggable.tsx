import React, { forwardRef } from 'react';
import classNames from 'classnames';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import { Handle } from '../Item/components/Handle';
import styles from './Draggable.module.css';

interface Props {
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  className?: string;
  transform?: Transform | null;
  isPendingDelay?: boolean;
  children?: React.ReactNode;
}

export const Draggable = forwardRef<HTMLDivElement, Props>(
  function Draggable(
    {
      dragOverlay,
      dragging,
      handle,
      listeners,
      transform,
      style,
      className,
      isPendingDelay = false,
      children
    },
    ref
  ) {
    const urlMatch = className?.match(/url\(["']?([^"']*)["']?\)/);
    const url: string | null = urlMatch ? urlMatch[1] : null;

    return (
      <div
        aria-label="Draggable"
        data-cypress="draggable-item"
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle,
          isPendingDelay && styles.pendingDelay
        ) + " " + className}
        style={
          {
            ...style,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
            '--existing-background': url ? `url(${url})` : 'none'
          } as React.CSSProperties
        }
        {...(handle ? {} : listeners)}
        tabIndex={handle ? -1 : undefined}
        ref={ref}
      >
        {handle ? <Handle {...(handle ? listeners : {})} /> : null}
        {children}
      </div>
    );
  }
);
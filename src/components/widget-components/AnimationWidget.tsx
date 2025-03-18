import React from 'react';
import WidgetBase, { WidgetBaseProps } from "components/WidgetBase";

export function AnimationWidget(props: WidgetBaseProps) {
  const loadingStyle: React.CSSProperties = {
    border: '16px solid #f3f3f3', // Light grey
    borderTop: '16px solid #3498db', // Blue
    borderRadius: '50%',
    width: '120px',
    height: '120px',
    animation: 'spin 2s linear infinite'
  };

  return (
    <WidgetBase {...props}>
      <div style={loadingStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </WidgetBase>
  );
}
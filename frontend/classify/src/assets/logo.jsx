import * as React from "react";
const SVGComponent = (props) => (
  <svg
    width={200}
    height={200}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <radialGradient
        id="neonGradient"
        cx="50%"
        cy="50%"
        r="70%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" stopColor="#A020F0" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#A020F0" stopOpacity={0} />
      </radialGradient>
      <filter id="blurFilter" x={0} y={0} width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={15} />
      </filter>
    </defs>
    <circle
      cx={100}
      cy={100}
      r={100}
      fill="url(#neonGradient)"
      filter="url(#blurFilter)"
    />
    <polygon
      points="100,30 135,100 100,85 65,100"
      fill="#A020F0"
      opacity={0.3}
    />
    <polygon
      points="100,30 135,100 100,170 65,100"
      fill="#A020F0"
      opacity={0.6}
    />
  </svg>
);
export default SVGComponent;

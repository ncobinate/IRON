import Svg, { Rect, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

const DOTS = [
  // Outer rectangle — top (high opacity)
  { id: 0, x: 18, y: 16, r: 2.2, opacity: 0.90 }, // outer top-left
  { id: 1, x: 82, y: 16, r: 2.2, opacity: 0.90 }, // outer top-right
  // Outer rectangle — bottom (low opacity)
  { id: 2, x: 82, y: 84, r: 2.2, opacity: 0.60 }, // outer bottom-right
  { id: 3, x: 18, y: 84, r: 2.2, opacity: 0.60 }, // outer bottom-left
  // Inner rectangle — top
  { id: 4, x: 34, y: 30, r: 2.0, opacity: 0.85 }, // inner top-left
  { id: 5, x: 66, y: 30, r: 2.0, opacity: 0.85 }, // inner top-right
  // Inner rectangle — bottom
  { id: 6, x: 66, y: 70, r: 2.0, opacity: 0.65 }, // inner bottom-right
  { id: 7, x: 34, y: 70, r: 2.0, opacity: 0.65 }, // inner bottom-left
  // Center — brightest and slightly larger
  { id: 8, x: 50, y: 50, r: 3.2, opacity: 1.00 }, // center
];

const CONNECTIONS = [
  // Outer rectangle edges
  [0, 1], [1, 2], [2, 3], [3, 0],
  // Inner rectangle edges
  [4, 5], [5, 6], [6, 7], [7, 4],
  // Outer to nearest inner (depth illusion)
  [0, 4], [1, 5], [2, 6], [3, 7],
  // All to center
  [0, 8], [1, 8], [2, 8], [3, 8],
  [4, 8], [5, 8], [6, 8], [7, 8],
];

const DOT_COLOR = '#b0c8ff';
const LINE_COLOR = '#b0c8ff';

export default function IronLogo({ size = 100 }) {
  const scale = size / 100;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Background */}
      <Rect
        x={0} y={0} width={100} height={100}
        rx={8} ry={8}
        fill="#070710"
        stroke="#1a2a4a"
        strokeWidth={1}
      />

      {/* Connection lines */}
      {CONNECTIONS.map(([a, b], i) => {
        const dotA = DOTS[a];
        const dotB = DOTS[b];
        const avgOpacity = (dotA.opacity + dotB.opacity) / 2;
        return (
          <Line
            key={`line-${i}`}
            x1={dotA.x} y1={dotA.y}
            x2={dotB.x} y2={dotB.y}
            stroke={LINE_COLOR}
            strokeWidth={0.6}
            strokeOpacity={avgOpacity * 0.45}
          />
        );
      })}

      {/* Dots */}
      {DOTS.map(dot => (
        <Circle
          key={`dot-${dot.id}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={DOT_COLOR}
          fillOpacity={dot.opacity}
        />
      ))}

      {/* Center glow — extra bright ring */}
      <Circle
        cx={50} cy={50} r={5}
        fill="none"
        stroke={DOT_COLOR}
        strokeWidth={0.8}
        strokeOpacity={0.25}
      />
    </Svg>
  );
}

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DensityMap.css';

// ── Hotspot Data ─────────────────────────────────────────────
// x, y: percentage position on the map image (0-100)
// density: 0-100 (drives color and blob size)
const HOTSPOTS = [
  { id: 'nyc',       city: 'New York',    country: 'USA',       x: 22.5, y: 34.5, density: 94, collectors: 3820 },
  { id: 'la',        city: 'Los Angeles', country: 'USA',       x: 14.5, y: 39.5, density: 68, collectors: 2140 },
  { id: 'london',    city: 'London',      country: 'UK',        x: 46.8, y: 26.5, density: 82, collectors: 2960 },
  { id: 'paris',     city: 'Paris',       country: 'France',    x: 48.2, y: 29.0, density: 76, collectors: 2450 },
  { id: 'dubai',     city: 'Dubai',       country: 'UAE',       x: 59.5, y: 43.0, density: 55, collectors: 1680 },
  { id: 'mumbai',    city: 'Mumbai',      country: 'India',     x: 63.5, y: 49.5, density: 71, collectors: 2280 },
  { id: 'delhi',     city: 'Delhi',       country: 'India',     x: 63.8, y: 42.5, density: 58, collectors: 1740 },
  { id: 'singapore', city: 'Singapore',   country: 'Singapore', x: 76.5, y: 57.5, density: 48, collectors: 1320 },
  { id: 'tokyo',     city: 'Tokyo',       country: 'Japan',     x: 83.5, y: 34.0, density: 62, collectors: 1940 },
  { id: 'sydney',    city: 'Sydney',      country: 'Australia', x: 85.0, y: 73.5, density: 38, collectors:  980 },
  { id: 'saopaulo',  city: 'São Paulo',   country: 'Brazil',    x: 28.5, y: 67.5, density: 32, collectors:  760 },
  { id: 'berlin',    city: 'Berlin',      country: 'Germany',   x: 50.2, y: 25.5, density: 61, collectors: 1860 },
];

// ── Density → color helper ───────────────────────────────────
function densityColor(d, alpha = 0.55) {
  if (d >= 80) return `rgba(239,68,68,${alpha})`;        // red
  if (d >= 65) return `rgba(249,115,22,${alpha})`;       // orange
  if (d >= 50) return `rgba(234,179,8,${alpha})`;        // yellow
  if (d >= 35) return `rgba(34,197,94,${alpha})`;        // green
  return           `rgba(59,130,246,${alpha})`;           // blue
}

function densityLabel(d) {
  if (d >= 80) return 'Very High';
  if (d >= 65) return 'High';
  if (d >= 50) return 'Moderate';
  if (d >= 35) return 'Low';
  return 'Very Low';
}

// ── Component ────────────────────────────────────────────────
export default function DensityMap({ mapSrc = '/world-map.png' }) {
  const [active, setActive] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const handleEnter = (hotspot, e) => {
    setActive(hotspot);
    updateTooltip(e);
  };

  const handleMove = (e) => {
    if (active) updateTooltip(e);
  };

  const updateTooltip = (e) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
  };

  return (
    <div
      ref={mapRef}
      className="density-map-root"
      onMouseMove={handleMove}
      onMouseLeave={() => setActive(null)}
    >
      {/* Map image */}
      <img
        src={mapSrc}
        alt="World collector density map"
        className="density-map-img"
        draggable={false}
      />

      {/* Scan-line overlay */}
      <div className="density-scanlines" />

      {/* Vignette */}
      <div className="density-vignette" />

      {/* Heatmap blobs + pins */}
      {HOTSPOTS.map((h) => {
        const blobSize = 4 + (h.density / 100) * 12; // 4–16 vw
        const color = densityColor(h.density);
        const colorEdge = densityColor(h.density, 0);
        const isActive = active?.id === h.id;

        return (
          <div
            key={h.id}
            className="density-hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onMouseEnter={(e) => handleEnter(h, e)}
          >
            {/* Glow blob */}
            <div
              className="density-blob"
              style={{
                width: `${blobSize}vw`,
                height: `${blobSize}vw`,
                background: `radial-gradient(circle, ${color} 0%, ${colorEdge} 70%)`,
                opacity: isActive ? 1 : 0.65,
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}
            />

            {/* Pulsing ring */}
            <div
              className="density-ring"
              style={{ borderColor: densityColor(h.density, 0.7) }}
            />

            {/* Center dot */}
            <div
              className="density-dot"
              style={{ background: densityColor(h.density, 1) }}
            />
          </div>
        );
      })}

      {/* Tooltip */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="density-tooltip"
            style={{
              left: tooltipPos.x + 16,
              top: tooltipPos.y - 10,
            }}
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
          >
            <div className="density-tt-city">{active.city}</div>
            <div className="density-tt-country">{active.country}</div>

            <div className="density-tt-bar-wrap">
              <div
                className="density-tt-bar"
                style={{
                  width: `${active.density}%`,
                  background: densityColor(active.density, 0.9),
                }}
              />
            </div>

            <div className="density-tt-row">
              <span style={{ color: densityColor(active.density, 1) }}>
                {densityLabel(active.density)}
              </span>
              <span className="density-tt-count">
                {active.collectors.toLocaleString()} collectors
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="density-legend">
        <div className="density-legend-title">Collector Density</div>
        {[
          { label: 'Very High', color: densityColor(90) },
          { label: 'High',      color: densityColor(70) },
          { label: 'Moderate',  color: densityColor(52) },
          { label: 'Low',       color: densityColor(38) },
          { label: 'Very Low',  color: densityColor(20) },
        ].map(({ label, color }) => (
          <div className="density-legend-row" key={label}>
            <span className="density-legend-dot" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

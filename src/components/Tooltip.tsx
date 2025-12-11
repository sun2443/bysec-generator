import { useState } from "react";

interface TooltipProps {
  text: string;
  tooltip: string;
  value?: string | number;
}

export function Tooltip({ text, tooltip, value }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <span
        style={{
          cursor: "help",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          position: "relative",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {text}
        <span style={{ fontSize: "0.7rem", color: "#999999" }}>(?)</span>
        
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "100%",
              marginTop: "0.25rem",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {tooltip}
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "10px",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "6px solid #1a1a1a",
              }}
            />
          </div>
        )}
      </span>
      {value !== undefined && (
        <span style={{ color: "#666666" }}>{value}</span>
      )}
    </div>
  );
}

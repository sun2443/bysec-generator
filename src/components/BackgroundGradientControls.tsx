import { Layer, GradientColor } from "../App";

interface BackgroundGradientControlsProps {
  layer: Layer;
  onToggleGradient: () => void;
  onUpdateAngle: (angle: number) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onUpdateColor: (index: number, color: string) => void;
  onUpdatePosition: (index: number, position: number) => void;
  onUpdateBackgroundColor: (color: string) => void;
}

export function BackgroundGradientControls({
  layer,
  onToggleGradient,
  onUpdateAngle,
  onAddColor,
  onRemoveColor,
  onUpdateColor,
  onUpdatePosition,
  onUpdateBackgroundColor,
}: BackgroundGradientControlsProps) {
  const styles = {
    controlLabel: {
      fontSize: "0.813rem",
      color: "#000000",
      marginBottom: "0.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "500",
    } as React.CSSProperties,
    
    slider: {
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      background: "#E0E0E0",
      outline: "none",
      WebkitAppearance: "none" as const,
      cursor: "pointer",
    } as React.CSSProperties,
    
    toggleButton: {
      padding: "0.375rem 0.75rem",
      borderRadius: "6px",
      border: "none",
      fontSize: "0.75rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
    } as React.CSSProperties,
  };

  return (
    <div
      style={{
        marginTop: "0.75rem",
        paddingTop: "0.75rem",
        borderTop: "1px solid #E0E0E0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <label
          style={{
            fontSize: "0.813rem",
            color: "#000000",
            fontWeight: "500",
          }}
        >
          Use Gradient
        </label>
        <button
          onClick={onToggleGradient}
          style={{
            ...styles.toggleButton,
            backgroundColor: layer.useGradient ? "#000000" : "#E0E0E0",
            color: layer.useGradient ? "#FFFFFF" : "#666666",
          }}
        >
          {layer.useGradient ? "ON" : "OFF"}
        </button>
      </div>

      {layer.useGradient && (
        <>
          {/* Gradient Angle */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={styles.controlLabel}>
              <span>Angle</span>
              <span style={{ color: "#666666" }}>{layer.gradientAngle || 0}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={layer.gradientAngle || 0}
              onChange={(e) => onUpdateAngle(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Gradient Colors */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.813rem",
                  color: "#000000",
                  fontWeight: "500",
                }}
              >
                Gradient Colors
              </span>
              <button
                onClick={onAddColor}
                style={{
                  ...styles.toggleButton,
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  fontSize: "0.75rem",
                }}
              >
                + Add
              </button>
            </div>

            {/* Color stops */}
            {layer.gradientColors?.map((gradColor, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  {/* Color picker */}
                  <input
                    type="color"
                    value={gradColor.color}
                    onChange={(e) => onUpdateColor(index, e.target.value)}
                    style={{
                      width: "48px",
                      height: "48px",
                      border: "2px solid #E0E0E0",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  />

                  {/* HEX input */}
                  <input
                    type="text"
                    value={gradColor.color}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                        onUpdateColor(index, value);
                      }
                    }}
                    placeholder="#000000"
                    style={{
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                      border: "1px solid #E0E0E0",
                      borderRadius: "6px",
                      padding: "0.625rem",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                    }}
                  />

                  {/* Remove button */}
                  {(layer.gradientColors?.length || 0) > 2 && (
                    <button
                      onClick={() => onRemoveColor(index)}
                      style={{
                        padding: "0.625rem",
                        backgroundColor: "#FF4444",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Position slider */}
                <div>
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "#666666",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Position: {gradColor.position}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={gradColor.position}
                    onChange={(e) =>
                      onUpdatePosition(index, Number(e.target.value))
                    }
                    style={styles.slider}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Solid Color - when gradient is off */}
      {!layer.useGradient && (
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              fontSize: "0.813rem",
              color: "#000000",
              fontWeight: "500",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Background Color
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {/* Color picker */}
            <input
              type="color"
              value={layer.backgroundColor || "#000000"}
              onChange={(e) => onUpdateBackgroundColor(e.target.value)}
              style={{
                width: "60px",
                height: "60px",
                border: "2px solid #E0E0E0",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            />

            {/* HEX input */}
            <input
              type="text"
              value={layer.backgroundColor || "#000000"}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                  onUpdateBackgroundColor(value);
                }
              }}
              placeholder="#000000"
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                color: "#000000",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                padding: "0.625rem",
                fontSize: "0.875rem",
                fontFamily: "monospace",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
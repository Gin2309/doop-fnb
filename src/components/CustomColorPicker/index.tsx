import React, { useState, useEffect } from "react";

export default function CustomColorPicker({
  className,
  onChangeValue,
  values,
}: {
  className?: string;
  onChangeValue?: (value: string) => void; // Ensure the function accepts a string
  values?: any; // Single color string
}) {
  const colors = [
    "#FEFFFE",
    "#EBEBEB",
    "#D6D6D6",
    "#C2C2C2",
    "#ADADAD",
    "#999999",
    "#858585",
    "#707070",
    "#5C5C5C",
    "#474747",
    "#333333",
    "#000000",
    "#00374A",
    "#011D57",
    "#11053B",
    "#2E063D",
    "#3C071B",
    "#5C0701",
    "#5A1C00",
    "#583300",
    "#563D00",
    "#666100",
    "#4F5504",
    "#263E0F",
    "#004D65",
    "#012F7B",
    "#1A0A52",
    "#450D59",
    "#551029",
    "#831100",
    "#7B2900",
    "#7A4A00",
    "#785800",
    "#8D8602",
    "#6F760A",
    "#38571A",
    "#016E8F",
    "#0042A9",
    "#2C0977",
    "#61187C",
    "#791A3D",
    "#B51A00",
    "#AD3E00",
    "#A96800",
    "#A67B01",
    "#C4BC00",
    "#9BA50E",
    "#4E7A27",
  ];

  const [selectedColor, setSelectedColor] = useState<any>(values || "#FEFFFE");

  useEffect(() => {
    if (values) {
      setSelectedColor(values);
    }
  }, [values]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (onChangeValue) {
      onChangeValue(color);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap">
        {colors.map((color, index) => (
          <div
            key={index}
            style={{ backgroundColor: color }}
            className={`h-8 w-8 cursor-pointer hover:opacity-75 ${
              values && values[0] === color ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
}

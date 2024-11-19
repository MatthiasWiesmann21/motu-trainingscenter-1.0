// components/ColorPicker.tsx

// TODO: Will be updated soon.
"use client";
import React, { useState } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState<string>('#ffffff');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <div className="p-4">
      <input type="color" value={color} onChange={handleChange} className="w-16 h-16" />
      <p>Selected Color: {color}</p>
    </div>
  );
};

export default ColorPicker;

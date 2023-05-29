import React, { useState, useEffect } from "react";

export function states() {
  const [values, setValues] = useState({});

  useEffect(() => {}, []);

  return {
    values,
    setValues,
  };
}

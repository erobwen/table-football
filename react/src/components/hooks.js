import { useEffect, useState } from 'react'
import axios from "axios";

export function useLoadedData(path) {
  const [data, setData] = useState(null);
  useEffect(() => {
    reload();
  }, []);

  function reload() {
    axios
      .get("http://localhost:3000" + path)
      .then((response) => setData(response.data))
      .catch((err) => {
      console.error(err);
    });
  }

  return [data, reload]
} 
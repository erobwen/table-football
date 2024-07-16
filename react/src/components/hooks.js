import { useEffect, useState } from 'react'
import axios from "axios";

export function useLoadedData(url, dummyData) {
  if (dummyData) return [dummyData, () => {}];
  const [data, setData] = useState(null);
  useEffect(() => {
    reload();
  }, []);

  function reload() {
    axios
      .get("http://localhost:3000" + url)
      .then((response) => setUsers(response.data))
      .catch((err) => {
      console.error(err);
    });
  }

  return [data, reload]
} 
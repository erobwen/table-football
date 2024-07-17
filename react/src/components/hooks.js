import { useEffect, useState } from 'react'

export function useLoadedData(loader) {
  const [data, setData] = useState(null);
  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    setData(await loader())
  }

  return [data, reload]
} 
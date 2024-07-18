import { useEffect, useState } from 'react'

export function useLoadedData(loader, defaultValue=null) {
  const [data, setData] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    reload();
  }, []);

  async function reload() {
    setData(await loader())
    setIsLoaded(true)
  }

  return [data, isLoaded, reload]
} 
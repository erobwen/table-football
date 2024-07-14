import axios from "axios";

import { useEffect, useState } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:3000/api")
      .then((response) => setMessage(response.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [message, setMessage] = useState(0)

  return (
    <>
      {message}
    </>
  )
}

export default App

import axios from "axios";

let base = "http://localhost:3000"

export async function postUser(name) {
  try {
    const result = await axios.post(base + "/api/users", {name}); 
    return result.data; 
  } catch(error) {
    throw new Error(error.response.data);
  }
}

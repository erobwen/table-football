import axios from "axios";

let base = "http://localhost:3000"

export async function getUsers() {
  try {
    return (await axios.get(base + "/api/users")).data; 
  } catch(error) {
    throw new Error(error.response.data);
  }
}

export async function postUser(name) {
  try {
    const result = await axios.post(base + "/api/users", {name}); 
    return result.data; 
  } catch(error) {
    throw new Error(error.response.data);
  }
}

export async function postTeam(name, player1Id, player2Id) {
  try {
    const result = await axios.post(base + "/api/teams", {name, player1Id, player2Id}); 
    return result.data; 
  } catch(error) {
    throw new Error(error.response.data);
  }
}

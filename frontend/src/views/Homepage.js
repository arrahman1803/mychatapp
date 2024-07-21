import React from 'react'
import { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import jwtDecode from 'jwt-decode'

function Homepage() {
  const [res, setRes] = useState("")
  const api = useAxios();
  const token = localStorage.getItem("authTokens")

  const baseURL = 'http://127.0.0.1:8000/api'
  const axios = useAxios()

  const [users, setUsers] = useState([])
  if (token){
    const decode = jwtDecode(token)
    var user_id = decode.user_id
    var username = decode.username
    var full_name = decode.full_name
    var image = decode.image
  }
  
  useEffect(() => {
    try {
        // Send a get request to the api endpoint to get the message of the logged in user
      axios.get(baseURL + '/users/').then((res) => {
        // Set the data that was gotten back from the database via the api to the setMessage state
        setUsers(res.data)
        // Console Log the data that was gotten from the db
        console.log(res.data);
      })
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <div>
      <>
      <main className="madin " style={{ marginTop: "100px" }}>
        <div className="container p-0 ">
          <h1 className="mb-3 text-center">Suggested Users to Chat</h1>
          <div className="row">
          {users.map((user) =>
  <div className="col-sm-6 mb-3 mb-sm-0" key={user.id}>
    <div className="card">
      <div className="card-body">
        <img src={user.image} className='mb-4' height={50} width={50}/>
        <h5 className="card-title">{user.full_name}</h5>
        <p className="card-text">@ {user.user.username}</p>
        <a href={"/inbox/" + user.id} className="btn btn-primary text-white">Send Message</a>
      </div>
    </div>
  </div> 
        )}
</div>
        </div>
      </main>
</>
    </div>
  )
}

export default Homepage

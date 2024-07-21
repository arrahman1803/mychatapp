import React from 'react'
import './style/Message.css'
import { useState, useEffect } from 'react'
import useAxios from '../utils/useAxios'
import jwtDecode from 'jwt-decode'
import { Link, useHistory } from 'react-router-dom/'
import moment from 'moment';

function Message() {

  const baseURL = 'http://127.0.0.1:8000/api'
  // Create New State
  const [messages, setMessages] = useState([])
  let [newSearch, setnewSearch] = useState({search: "",});

  // Initialize the useAxios Function to post and get data from protected routes
  const axios = useAxios()

  // Get and Decode Token
  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token)
  // Get Userdata from decoded token
  const user_id = decoded.user_id
  const username = decoded.username
  const history = useHistory()

  useEffect(() => {
    try {
      // Send a get request to the api endpoint to get the message of the logged in user
      axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
        // Set the data that was gotten back from the database via the api to the setMessage state
        setMessages(res.data)
        // Console Log the data that was gotten from the db
        console.log(res.data);
      })
    } catch (error) {
      console.log(error);
    }
  }, [])
 
  const handleSearchChange = (event) => {
    setnewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });

  };

  const SearchUser = () => {
    axios.get(baseURL + '/search/' + newSearch.username + '/')
        .then((res) => {
            if (res.status === 404) {
                console.log(res.data.detail);
                alert("User does not exist");
            } else {
                history.push('/search/'+newSearch.username+'/');
            }
        })
        .catch((error) => {
            alert("User Does Not Exist")
        });
};
  return (
    <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
              <div className="px-4 ">
                  <div className="d-flfex align-itemfs-center">
                    <div className="flex-grow-1 d-flex align-items-center mt-2">
                      <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        name='username'

                      />
                      <button className='ml-2' onClick={SearchUser} style={{border:"none", borderRadius:"50%"}}><i className='fas fa-search'></i></button>
                    </div>
                  </div>
                </div>
                {messages.map((message) =>
                  <Link 
                    to={"/inbox/" + (message.sender.id === user_id ? message.reciever.id : message.sender.id) + "/"}
                    href="#"
                    className="list-group-item list-group-item-action border-0"
                  >
                    <small><div className="badge bg-success float-right text-white">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div></small>
                    <div className="d-flex align-items-start">
                    {message.sender.id !== user_id && 
                      <img src={message.sender_profile.image} className="rounded-circle mr-1" alt="1" width={40} height={40}/>
                    }
                    {message.sender.id === user_id && 
                      <img src={message.reciever_profile.image} className="rounded-circle mr-1" alt="2" width={40} height={40}/>
                    }
                      <div className="flex-grow-1 ml-3">
                          {message.sender.id === user_id && 
                            (message.reciever_profile.full_name !== null ? message.reciever_profile.full_name : message.reciever.username)
                          }

                          {message.sender.id !== user_id && 
                            (message.sender.username) 
                          }
                        <div className="small">
                           <small>{message.message}</small>
                        </div>
                      </div>
                    </div>
                    </Link>
                )}
                
               
              </div>
             
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Message
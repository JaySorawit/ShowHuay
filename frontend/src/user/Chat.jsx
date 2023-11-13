import React from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";

function Chat() {
  return (
      <>
      <Navbar/>
      <div className="BG" style={{width:'100%',backgroundColor:'#D9D9D9'}}>
        <div className="container-xxl" style={{width:'1170px',backgroundColor:'red'}}>
            <div className="Chat">
                <div className="contactlist">

                </div>
                <div className="chatdetail">
                    <div className="card-footer">
                        <div className="input-group">
                            <input type='text' className='form-control' id='message' placeholder='Send new message'></input>
                            <button className='btn btn-success' type='button' id='message'>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
      </div>
      </>
  )
}

export default Chat
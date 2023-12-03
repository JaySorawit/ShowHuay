import React from 'react'

function PageNotFound() {

  const PageNotFoundStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90vh' 
  };

  const buttonStyle = {
    backgroundColor: '#F44C0C',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '500',
    marginTop: '20px',
  };
  
  return (
    <>
    <div className="page" style={{color:'#fff', backgroundColor:'#F44C0C', height:'100vh'}}>
      <div style={PageNotFoundStyle}>
          <h1 style={{ fontSize: '100px' }}>404</h1>
          <h1 style={{ fontSize: '30px' }}>Page Not Found</h1>
          <p style={{ fontSize: '20px' }}>The page you are looking for does not exist.</p>
          <button style={buttonStyle} onClick={() => window.location.href = '/'}>Go Home</button>
      </div>
    </div>
    </>
  )
}

export default PageNotFound
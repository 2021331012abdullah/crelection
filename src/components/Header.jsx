import React from 'react'
import { useAuth } from '../utils/AuthContext'
import { Link } from 'react-router-dom'
import { LogOut, LogIn } from 'react-feather'

const Header = () => {
    const {user, handleLogout} = useAuth()

  return (
    <div id="header--wrapper">
        {user ? (
            <>
                <p>স্বাগতম {user.name}</p>
                <br/> <br/>
                <div className='center-align'><LogOut className="header--link" onClick={handleLogout}/> <button className='redtext'  onClick={handleLogout}>লগ আউট</button> </div>
            </>
        ): (
            <>
                <Link to="/">
                    <LogIn className="header--link"/>
                </Link>
            </>
        )}
    </div>
  )
}

export default Header

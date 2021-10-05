import React, {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Navbar = () => {
    const {logout} = useContext(AuthContext)

    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
            <span className="brand-logo">Сокращение ссылок</span>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><NavLink to="/create">Create</NavLink></li>
                <li><NavLink to="/links">Links</NavLink></li>
                <li><NavLink to="/" onClick={logout}>Logout</NavLink></li>
            </ul>
            </div>
        </nav>
    )
}
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import menuIcon from '../../../assets/images/menu-icon.png';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav>
            <div className='container'>
                <div className='brand'>Zentangle</div>
                <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to='/learn'>Learn</Link>
                    </li>
                    <li>
                        <Link to='/safety'>Safety</Link>
                    </li>
                    <li>
                        <Link to='/support'>Support</Link>
                    </li>
                    {menuOpen &&
                    <li>
                        <button className='login'>
                            Login
                        </button>
                    </li>
                    }
                </ul>
            </div>
            <button className='toggle-button' onClick={() => setMenuOpen(!menuOpen)}>
                    <img src={menuIcon} alt="menu" />
            </button>
            <div className='lg-login'>
                <button type='button'>Login</button>
            </div>
        </nav>
    )
}
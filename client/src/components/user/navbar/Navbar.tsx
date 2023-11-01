import './Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import menuIcon from '../../../assets/images/menu-icon.png';

interface Props {
    login: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({login}: Props) {
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
                        <button onClick={() => login(true)} className='login'>
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
                <button onClick={() => login(true)} type='button'>Login</button>
            </div>
        </nav>
    )
}
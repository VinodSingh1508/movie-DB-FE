import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import LoginModal from "../login/LoginModal";
import RegistrationModal from "../login/RegistrationModal";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

const Header = ({ isUserLoggedIn, setIsUserLoggedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const handleLoginButtonClick = () => {
        setShowLoginModal(true);
    };
    const handleLoginModalClose = () => {
        setShowLoginModal(false);
    };

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const handleRegisterButtonClick = () => {
        setShowRegisterModal(true);
    };
    const handleRegisterModalClose = () => {
        setShowRegisterModal(false);
    };

    const handleLogout = () => {
        Cookies.remove('user');
        setIsUserLoggedIn(false);
    };

    useEffect(() => {
        const userCookie = Cookies.get('user');
        setIsUserLoggedIn(userCookie !== undefined);
    }, [isUserLoggedIn]);

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/" style={{ "color": 'gold' }}>
                        <FontAwesomeIcon icon={faVideoSlash} />Movies DB
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <NavLink className="nav-link" to="/">Home</NavLink>
                            {isUserLoggedIn && <NavLink className="nav-link" to='/Watchlist'>Watch List</NavLink>}
                        </Nav>
                        {isUserLoggedIn ? (
                            <Button variant="outline-info" className="me-2" onClick={handleLogout}>Logout {JSON.parse(Cookies.get('user'))?.name}</Button>
                        ) : (
                            <>
                                <Button variant="outline-info" className="me-2" onClick={handleLoginButtonClick}>Login</Button>
                                <Button variant="outline-info" onClick={handleRegisterButtonClick}>Register</Button>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showLoginModal && (<LoginModal showModal={showLoginModal} onHide={handleLoginModalClose} handelLogin={setIsUserLoggedIn} />)}
            {showRegisterModal && (<RegistrationModal showModal={showRegisterModal} onHide={handleRegisterModalClose} handelLogin={setIsUserLoggedIn} />)}

        </>
    )
}

export default Header

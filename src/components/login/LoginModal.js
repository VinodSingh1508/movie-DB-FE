import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { useState } from "react";
import api from '../../api/axiosConfig';
import Cookies from 'js-cookie';
import './FormStyle.css';

const LoginModal = ({ showModal, onHide, handelLogin }) => {
    const [formData, setFormData] = useState({ email: "", pass: "" });
    const [loginFailed, setLoginFailed] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (!formData.pass.trim()) {
            newErrors.pass = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            api.post('/api/v1/users/getUser', {
                email: formData.email,
                pass: formData.pass
            })
                .then(function (response) {
                    let user = response.data;
                    if (!user.watchlist)
                        user.watchlist = [];
                    Cookies.set('user', JSON.stringify(user));
                    onHide();
                    handelLogin(true);
                    setLoginFailed(false);
                })
                .catch(function (error) {
                    setLoginFailed(true);
                });
        }

    };

    const handleReset = () => {
        setFormData({ email: "", pass: "" });
        setErrors({});
    };

    return (
        <Modal
            show={showModal}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Login
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            id="email" name="email" value={formData.email} onChange={handleChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            id="pass" name="pass" value={formData.pass} onChange={handleChange}
                        />
                        {errors.pass && <p className="error">{errors.pass}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {loginFailed && <span className='formError error'>Login Failed</span>}
                    <Button type='submit'>Submit</Button>
                    <Button type="reset" onClick={handleReset}>Reset</Button>
                </Modal.Footer>

            </form>
        </Modal>
    );
}

export default LoginModal;
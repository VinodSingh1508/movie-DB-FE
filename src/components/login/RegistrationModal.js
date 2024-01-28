import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import api from '../../api/axiosConfig';
import "./FormStyle.css"

const RegistrationModal = ({ showModal, onHide, handelLogin}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [userCreationFailed, setUserCreationFailed] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      api.post('/api/v1/users/createUser', {
        name:formData.name,
        email:formData.email,
        pass:formData.password
      })
      .then(function (response) {
        if(response.data==="Failed")
        {
          setUserCreationFailed(true);          
        } else {
            Cookies.set('user', JSON.stringify({name: formData.name, email: formData.email, watchlist: []}));
            onHide();
            handelLogin(true);
            setUserCreationFailed(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  return (
    <Modal show={showModal} onHide={onHide} size="lg" centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              id="name" name="name" value={formData.name} onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          
          <div className="mb-3">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              id="email" name="email" value={formData.email} onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="password" name="password" value={formData.password} onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
        {userCreationFailed && <span className='formError error'>Login Failed</span>}
          <Button type="submit">Register</Button>
          <Button type="reset" onClick={handleReset}>
            Reset
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default RegistrationModal;

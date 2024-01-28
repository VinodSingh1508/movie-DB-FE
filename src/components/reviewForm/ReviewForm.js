import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ReviewForm = ({ handleSubmit, revText, labelText, defaultValue }) => {
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = () => {
    const inputValue = revText.current.value;
    setIsValid(inputValue.length >= 3);
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="reviewForm.ReviewComment">
        <Form.Label>{labelText}</Form.Label>
        <Form.Control
          ref={revText}
          as="textarea"
          rows={3}
          defaultValue={defaultValue}
          onChange={handleInputChange}
          isInvalid={!isValid}
        />
        <Form.Control.Feedback type="invalid">
          Minimum 3 characters required.
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="outline-info" onClick={handleSubmit} disabled={!isValid}>
        Submit
      </Button>
    </Form>
  );
};

export default ReviewForm;

"use client"
import React, { useState } from 'react';
import { signUp } from '@/lib/auth-client';
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";

const SignUpPage = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      setMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const { error } = await signUp.email({ name, email, password });
      if (error) {
        setMessage(error.message || 'Unable to create your account. Please try again.');
        return;
      }

      setMessage('Your account has been created successfully.');
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Please sign up</h2>
      <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
        <TextField
          isRequired
          minLength={3}
          name="name"
          validate={(value) => {
            if (value.length < 3) {
              return "Name must be at least 3 characters";
            }
            if (!/^[A-Za-z\s]+$/.test(value)) {
              return "Name can only contain letters and spaces";
            }
            return null;
          }}
        >
          <Label>Name</Label>
          <Input placeholder="Ratul Hasan" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return "Please enter a valid email address";
            }
            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="ratul@gmail.com" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }
            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number";
            }
            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
          <FieldError />
        </TextField>

        {message && <p role="status">{message}</p>}

        <div className="flex gap-2">
          <Button type="submit" isDisabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Submit'}
          </Button>
          <Button type="reset" variant="secondary" isDisabled={isSubmitting}>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignUpPage;

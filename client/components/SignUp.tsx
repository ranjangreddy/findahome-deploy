import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Facebook, Twitter } from 'lucide-react';
import Logo from './Logo';
import styles from './SignUp.module.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>Sign Up</h2>
          <p className={styles.subtitle}>New User? Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <User className={styles.icon} />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <User className={styles.icon} />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Mail className={styles.icon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Phone className={styles.icon} />
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="Contact No."
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Alternate method</span>
        </div>

        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google" />
          </button>
          <button className={styles.socialButton}>
            <Facebook color="#1877F2" />
          </button>
          <button className={styles.socialButton}>
            <Twitter color="#1DA1F2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
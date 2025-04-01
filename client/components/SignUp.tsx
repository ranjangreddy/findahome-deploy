import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Facebook, Twitter } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    role: 'buyer', // default role
  });
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registration successful! You can now log in.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          contactNumber: '',
          role: 'buyer',
        });
setTimeout(() => navigate('/login'), 1500);

      } else {
        setMessage(data.error || 'Something went wrong!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <User className={styles.icon} />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <Mail className={styles.icon} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <Phone className={styles.icon} />
            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact No." className={styles.input} required />
          </div>

          <div className={styles.inputGroup}>
            <select name="role" value={formData.role} onChange={handleChange} className={styles.input}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button type="submit" className={styles.signupButton} disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {message && <p style={{ marginTop: '10px', color: 'crimson' }}>{message}</p>}
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Alternate method</span>
        </div>

        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>
            <img
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
              alt="Google"
              style={{ height: '24px' }}
            />
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

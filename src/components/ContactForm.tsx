'use client';

import React, { useState } from 'react';

interface ContactFormProps {
  type: 'contact' | 'installation' | 'it-support' | 'cloud';
  styles: Record<string, string>;
}

export default function ContactForm({ type, styles }: ContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/[^\d]/g, '');
      if (digits.length > 0 && !/^[6-9]/.test(digits)) {
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: digits.slice(0, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // Reset success state after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.inputField}>
          <input
            type="text"
            name="fullName"
            placeholder="Your full name *"
            className={styles.input}
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          />
        </div>
        <div className={styles.inputField}>
          <input
            type="email"
            name="email"
            placeholder="Write your email here *"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={status === 'submitting'}
          />
        </div>
      </div>

      <div className={styles.inputField}>
        <input
          type="tel"
          name="phone"
          maxLength={10}
          pattern="[6-9][0-9]{9}"
          placeholder="Phone number (10 digits)"
          className={styles.input}
          value={formData.phone}
          onChange={handleChange}
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.inputField}>
        <input
          type="text"
          name="subject"
          placeholder="Write your subject here"
          className={styles.input}
          value={formData.subject}
          onChange={handleChange}
          disabled={status === 'submitting'}
        />
      </div>

      <div className={styles.inputField}>
        <textarea
          name="message"
          placeholder="Write your message here *"
          className={styles.textarea}
          value={formData.message}
          onChange={handleChange}
          required
          disabled={status === 'submitting'}
        />
      </div>

      {status === 'success' && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '16px',
          fontWeight: 400,
          border: '1px solid #c3e6cb',
          animation: 'fadeIn 0.3s ease'
        }}>
          ✓ Thank you! Your message has been sent successfully. We will contact you soon.
        </div>
      )}

      {status === 'error' && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '16px',
          fontWeight: 400,
          border: '1px solid #f5c6cb',
          animation: 'fadeIn 0.3s ease'
        }}>
          ✗ {errorMessage}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={status === 'submitting'}
        style={{ opacity: status === 'submitting' ? 0.7 : 1, position: 'relative' }}
      >
        {status === 'submitting' ? 'SENDING...' : (type === 'it-support' || type === 'cloud' ? 'Send' : 'SUBMIT')}
      </button>
    </form>
  );
}

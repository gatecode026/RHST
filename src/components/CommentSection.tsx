'use client';

import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  postId: string;
  author: string;
  date: string;
  avatar: string;
  text: string;
  isReply: boolean;
}

interface CommentSectionProps {
  postId: string;
  styles: Record<string, string>;
}

export default function CommentSection({ postId, styles }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    text: '',
    saveInfo: false
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyToAuthor, setReplyToAuthor] = useState<string | null>(null);

  // Load comments on mount and when postId changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/blog/comment?postId=${postId}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
        } else {
          setError('Failed to load comments.');
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Network error loading comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    // Check if user saved name/email in browser previously
    const savedAuthor = localStorage.getItem('comment_author');
    const savedEmail = localStorage.getItem('comment_email');
    if (savedAuthor && savedEmail) {
      setFormData((prev) => ({
        ...prev,
        author: savedAuthor,
        email: savedEmail,
        saveInfo: true
      }));
    }
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReplyClick = (authorName: string) => {
    setReplyToAuthor(authorName);
    // Scroll smoothly to form
    const formElement = document.getElementById('comment-form-target');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelReply = () => {
    setReplyToAuthor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const commentText = replyToAuthor 
      ? `@${replyToAuthor} ${formData.text}`
      : formData.text;

    try {
      const res = await fetch('/api/blog/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId,
          author: formData.author,
          email: formData.email,
          text: commentText,
          isReply: !!replyToAuthor
        })
      });

      const data = await res.json();
      if (data.success) {
        // Append new comment to client list
        setComments((prev) => [...prev, data.comment]);
        setFormData((prev) => ({ ...prev, text: '' }));
        setReplyToAuthor(null);

        // Save metadata if checkbox is checked
        if (formData.saveInfo) {
          localStorage.setItem('comment_author', formData.author);
          localStorage.setItem('comment_email', formData.email);
        } else {
          localStorage.removeItem('comment_author');
          localStorage.removeItem('comment_email');
        }
      } else {
        setError(data.error || 'Failed to post comment.');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Network error posting comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Comments List Section */}
      <div className={styles.commentsSection}>
        <h3 className={styles.commentsHeading}>
          {loading ? 'Loading comments...' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
        </h3>

        {error && !comments.length && (
          <div style={{ color: '#ff4e2a', fontSize: '16px', marginBottom: '1rem' }}>{error}</div>
        )}

        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`${styles.commentCard} ${comment.isReply ? styles.commentReply : ''}`}
            >
              <div className={styles.avatarWrapper}>
                <img 
                  src={comment.avatar} 
                  alt={comment.author} 
                  className={styles.avatar}
                />
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.commentDate}>{comment.date}</span>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
                <button 
                  type="button" 
                  className={styles.replyBtn}
                  onClick={() => handleReplyClick(comment.author)}
                >
                  Reply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave a Comment Form */}
      <div id="comment-form-target" style={{ scrollMarginTop: '100px' }}>
        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>
            {replyToAuthor ? `REPLYING TO ${replyToAuthor.toUpperCase()}` : 'LEAVE A COMMENT'}
          </h3>
          <p className={styles.formSubtitle}>
            Your email address will not be published. Required fields are marked *
            {replyToAuthor && (
              <button 
                type="button" 
                onClick={cancelReply}
                style={{ 
                  marginLeft: '1rem', 
                  color: '#ff4e2a', 
                  textDecoration: 'underline', 
                  fontSize: '15px',
                  fontWeight: 500
                }}
              >
                Cancel Reply
              </button>
            )}
          </p>

          <div className={styles.textareaWrapper}>
            <textarea 
              name="text"
              placeholder="Write your comment here *" 
              className={styles.textarea}
              value={formData.text}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className={styles.inputGrid}>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                name="author"
                placeholder="Write your name here *" 
                className={styles.input}
                value={formData.author}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
            <div className={styles.inputWrapper}>
              <input 
                type="email" 
                name="email"
                placeholder="Write your email here *" 
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input 
              type="checkbox" 
              name="saveInfo"
              className={styles.checkbox} 
              checked={formData.saveInfo}
              onChange={handleChange}
            />
            <span>
              Save my name, email, and website in this browser for the next time.
            </span>
          </label>

          {error && comments.length > 0 && (
            <div style={{ color: '#ff4e2a', fontSize: '16px' }}>{error}</div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'POSTING...' : 'POST COMMENT'}
          </button>
        </form>
      </div>
    </>
  );
}

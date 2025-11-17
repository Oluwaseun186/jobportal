import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function CommentsSection({ jobId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();

  // Wrap fetchComments in useCallback to make it stable
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/job/${jobId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [jobId]); // Add jobId as dependency

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // Now fetchComments is stable

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/comments', {
        content: newComment,
        jobId: jobId
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/comments', {
        content: replyContent,
        jobId: jobId,
        parentComment: parentId
      });
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(`http://localhost:5000/api/comments/${commentId}/like`);
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const renderComments = (commentsList, depth = 0) => {
    return commentsList.map(comment => (
      <div key={comment._id} className={`comment ${depth > 0 ? 'reply' : ''}`}>
        <div className="comment-header">
          <strong>{comment.user.name}</strong>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p>{comment.content}</p>
        <div className="comment-actions">
          <button onClick={() => handleLike(comment._id)}>
            Like ({(comment.likes && comment.likes.length) || 0})
          </button>
          {user && (
            <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}>
              Reply
            </button>
          )}
          {(user && (user._id === comment.user._id || user.role === 'admin')) && (
            <button 
              onClick={() => handleDeleteComment(comment._id)}
              className="delete-btn"
            >
              Delete
            </button>
          )}
        </div>

        {replyingTo === comment._id && (
          <div className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
            />
            <div>
              <button onClick={() => handleSubmitReply(comment._id)}>Post Reply</button>
              <button onClick={() => setReplyingTo(null)}>Cancel</button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="comments-section">
      <h3>Discussion ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p>Please log in to comment</p>
      )}

      <div className="comments-list">
        {renderComments(comments)}
      </div>
    </div>
  );
}

export default CommentsSection;
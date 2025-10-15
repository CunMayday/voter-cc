/**
 * Version: 2
 * Updated with Purdue colors, delete buttons, and improved comment expand/collapse
 */
import { useState } from 'react';

/**
 * SuggestionCard Component
 * Displays a single suggestion with voting buttons and comments
 */
const SuggestionCard = ({ suggestion, currentUserId, onVote, onAddComment, onDeleteSuggestion, onDeleteComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('neutral');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Check user's current vote
  const userVote = suggestion.votes?.[currentUserId];

  const handleVote = (voteType) => {
    onVote(suggestion.id, currentUserId, voteType);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    const trimmedText = commentText.trim();
    if (trimmedText.length < 1) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(suggestion.id, trimmedText, commentType);
      setCommentText('');
      setCommentType('neutral');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteSuggestion = () => {
    if (window.confirm('Are you sure you want to delete this suggestion? This cannot be undone.')) {
      onDeleteSuggestion(suggestion.id);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDeleteComment(suggestion.id, commentId);
    }
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get comment type styling
  const getCommentTypeStyles = (type) => {
    switch (type) {
      case 'pro':
        return 'bg-green-50 border-green-200';
      case 'con':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-purdue-gray';
    }
  };

  const getCommentTypeBadge = (type) => {
    switch (type) {
      case 'pro':
        return 'bg-green-100 text-green-800';
      case 'con':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purdue-gray/30 text-purdue-dark-gray';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purdue-gold">
      <div className="flex gap-4">
        {/* Voting buttons */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote('up')}
            className={`p-2 rounded-lg transition-colors ${
              userVote === 'up'
                ? 'bg-purdue-gold text-white'
                : 'bg-purdue-gray/20 text-purdue-dark-gray hover:bg-purdue-athletic-gold hover:text-white'
            }`}
            title="Upvote"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <span className={`font-bold text-lg ${
            suggestion.score > 0 ? 'text-green-600' :
            suggestion.score < 0 ? 'text-red-600' :
            'text-purdue-dark-gray'
          }`}>
            {suggestion.score}
          </span>

          <button
            onClick={() => handleVote('down')}
            className={`p-2 rounded-lg transition-colors ${
              userVote === 'down'
                ? 'bg-red-600 text-white'
                : 'bg-purdue-gray/20 text-purdue-dark-gray hover:bg-red-100 hover:text-red-600'
            }`}
            title="Downvote"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-purdue-black text-lg flex-1">{suggestion.text}</p>
            <button
              onClick={handleDeleteSuggestion}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
              title="Delete suggestion"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-purdue-gray mb-3">
            <span className="font-medium text-purdue-dark-gray">{suggestion.author}</span>
            <span>•</span>
            <span>{formatDate(suggestion.timestamp)}</span>
            <span>•</span>
            <span>{suggestion.upvotes} up, {suggestion.downvotes} down</span>
          </div>

          {/* Comments toggle - improved button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purdue-athletic-gold/20 hover:bg-purdue-athletic-gold/30 text-purdue-dark-gray rounded-lg transition-colors font-medium text-sm border border-purdue-gray/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>
              {showComments ? 'Hide Comments' : `${suggestion.comments.length > 0 ? `Show ${suggestion.comments.length}` : 'Add'} Comment${suggestion.comments.length !== 1 ? 's' : ''}`}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showComments ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Comments section */}
          {showComments && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-purdue-athletic-gold">
              {/* Existing comments */}
              {suggestion.comments.length > 0 && (
                <div className="space-y-2">
                  {suggestion.comments
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-lg border ${getCommentTypeStyles(comment.type)} relative group`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-purdue-black">
                              {comment.author}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getCommentTypeBadge(comment.type)}`}>
                              {comment.type}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete comment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-purdue-dark-gray text-sm">{comment.text}</p>
                        <span className="text-xs text-purdue-gray mt-1 block">
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="space-y-2 bg-purdue-athletic-gold/10 p-3 rounded-lg">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add your comment..."
                  className="w-full px-3 py-2 border border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-transparent outline-none resize-none"
                  rows={2}
                  disabled={isSubmittingComment}
                  maxLength={500}
                />

                <div className="flex items-center gap-2">
                  <select
                    value={commentType}
                    onChange={(e) => setCommentType(e.target.value)}
                    className="px-3 py-2 border border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-transparent outline-none text-sm"
                    disabled={isSubmittingComment}
                  >
                    <option value="neutral">Neutral</option>
                    <option value="pro">Pro</option>
                    <option value="con">Con</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isSubmittingComment || commentText.trim().length < 1}
                    className="bg-purdue-gold hover:bg-purdue-gold/90 disabled:bg-purdue-gray disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                  >
                    {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;

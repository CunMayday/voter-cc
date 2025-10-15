/**
 * Version: 5
 * Enhanced with gold and black backgrounds per Purdue guidelines
 */
import { useState } from 'react';

/**
 * SuggestionCard Component
 * Displays a single suggestion with voting buttons and comments
 */
const SuggestionCard = ({
  suggestion,
  currentUserId,
  onVote,
  onAddComment,
  onDeleteSuggestion,
  onDeleteComment,
  onEditSuggestion,
  onEditComment
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('neutral');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Edit suggestion state
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [editTitle, setEditTitle] = useState(suggestion.title || suggestion.text || '');
  const [editDescription, setEditDescription] = useState(suggestion.description || '');

  // Edit comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [editCommentType, setEditCommentType] = useState('neutral');

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

  const handleEditSuggestion = async () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle.length < 3) {
      alert('Title must be at least 3 characters');
      return;
    }

    try {
      await onEditSuggestion(suggestion.id, trimmedTitle, editDescription.trim());
      setIsEditingSuggestion(false);
    } catch (error) {
      console.error('Error editing suggestion:', error);
      alert('Failed to edit suggestion. Please try again.');
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
    setEditCommentType(comment.type);
  };

  const handleEditComment = async (commentId) => {
    const trimmedText = editCommentText.trim();
    if (trimmedText.length < 1) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      await onEditComment(suggestion.id, commentId, trimmedText, editCommentType);
      setEditingCommentId(null);
      setEditCommentText('');
      setEditCommentType('neutral');
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment. Please try again.');
    }
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
    setEditCommentType('neutral');
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
    <div className="bg-purdue-athletic-gold rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow border-4 border-purdue-gold">
      <div className="flex gap-4">
        {/* Voting buttons */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote('up')}
            className={`p-2 rounded-lg transition-colors border-2 ${
              userVote === 'up'
                ? 'bg-purdue-black text-purdue-gold border-purdue-gold'
                : 'bg-white text-purdue-dark-gray border-purdue-gray hover:bg-purdue-athletic-gold/30 hover:border-purdue-gold'
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
            className={`p-2 rounded-lg transition-colors border-2 ${
              userVote === 'down'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-white text-purdue-dark-gray border-purdue-gray hover:bg-red-50 hover:border-red-300 hover:text-red-600'
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
          {isEditingSuggestion ? (
            /* Edit mode */
            <div className="space-y-3 mb-4 bg-white p-4 rounded-lg border-2 border-purdue-black shadow-lg">
              <div>
                <label className="block text-sm font-bold text-purdue-black mb-1">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold outline-none"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-purdue-black mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold outline-none resize-none"
                  rows={3}
                  maxLength={1000}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditSuggestion}
                  className="bg-purdue-black text-purdue-gold border-2 border-purdue-gold px-4 py-2 rounded-lg font-bold hover:bg-purdue-dark-gray transition"
                >
                  ✓ Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditingSuggestion(false);
                    setEditTitle(suggestion.title || suggestion.text || '');
                    setEditDescription(suggestion.description || '');
                  }}
                  className="bg-white text-purdue-dark-gray border-2 border-purdue-gray px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div className="mb-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-purdue-black flex-1 drop-shadow-sm">
                  {suggestion.title || suggestion.text}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setIsEditingSuggestion(true)}
                    className="text-purdue-gold hover:text-purdue-black hover:bg-purdue-athletic-gold/30 p-2 rounded-lg transition-colors"
                    title="Edit suggestion"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDeleteSuggestion}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete suggestion"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {suggestion.description && (
                <p className="text-purdue-dark-gray text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {suggestion.description}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-purdue-gray mb-3">
            <span className="font-medium text-purdue-dark-gray">{suggestion.author}</span>
            <span>•</span>
            <span>{formatDate(suggestion.timestamp)}</span>
            <span>•</span>
            <span>{suggestion.upvotes} up, {suggestion.downvotes} down</span>
          </div>

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-purdue-athletic-gold/30 text-purdue-black rounded-lg transition-colors font-semibold text-sm border-2 border-purdue-gold"
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
                        {editingCommentId === comment.id ? (
                          /* Edit comment mode */
                          <div className="space-y-2">
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold outline-none resize-none"
                              rows={2}
                              maxLength={500}
                            />
                            <div className="flex items-center gap-2">
                              <select
                                value={editCommentType}
                                onChange={(e) => setEditCommentType(e.target.value)}
                                className="px-2 py-1 border-2 border-purdue-gray rounded text-xs"
                              >
                                <option value="neutral">Neutral</option>
                                <option value="pro">Pro</option>
                                <option value="con">Con</option>
                              </select>
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="bg-purdue-black text-purdue-gold border-2 border-purdue-gold px-3 py-1 rounded font-bold text-xs hover:bg-purdue-dark-gray"
                              >
                                ✓ Save
                              </button>
                              <button
                                onClick={cancelEditComment}
                                className="bg-white text-purdue-dark-gray border-2 border-purdue-gray px-3 py-1 rounded text-xs hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* View comment mode */
                          <>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-purdue-black">
                                  {comment.author}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getCommentTypeBadge(comment.type)}`}>
                                  {comment.type}
                                </span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditingComment(comment)}
                                  className="text-purdue-gold hover:text-purdue-black"
                                  title="Edit comment"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete comment"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <p className="text-purdue-dark-gray text-sm whitespace-pre-wrap">{comment.text}</p>
                            <span className="text-xs text-purdue-gray mt-1 block">
                              {formatDate(comment.timestamp)}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-white p-4 rounded-lg border-2 border-purdue-black shadow-lg">
                <label className="block">
                  <span className="text-sm font-semibold text-purdue-black mb-1 block">Write your comment:</span>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type your comment here..."
                    className="w-full px-3 py-2 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-purdue-gold outline-none resize-none"
                    rows={3}
                    disabled={isSubmittingComment}
                    maxLength={500}
                  />
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-shrink-0">
                    <label className="block">
                      <span className="text-sm font-semibold text-purdue-black mb-1 block">Type:</span>
                      <select
                        value={commentType}
                        onChange={(e) => setCommentType(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-purdue-gold outline-none text-sm font-medium"
                        disabled={isSubmittingComment}
                      >
                        <option value="neutral">Neutral</option>
                        <option value="pro">Pro (Positive)</option>
                        <option value="con">Con (Negative)</option>
                      </select>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingComment || commentText.trim().length < 1}
                    className="flex-1 sm:flex-initial bg-purdue-black hover:bg-purdue-dark-gray disabled:bg-purdue-gray disabled:cursor-not-allowed text-purdue-gold font-bold py-3 px-6 rounded-lg transition border-2 border-purdue-gold shadow-md hover:shadow-lg text-base"
                  >
                    {isSubmittingComment ? 'Submitting...' : '✓ Submit Comment'}
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

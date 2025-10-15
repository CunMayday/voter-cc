/**
 * Version: 3
 * Added edit functionality and support for title/description in suggestions
 */
import { useState, useEffect } from 'react';
import { ref, onValue, push, set, get, remove } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Custom hook to manage suggestions with real-time sync
 *
 * Data structure in Firebase:
 * /suggestions/{suggestionId}
 *   - id: string
 *   - title: string
 *   - description: string (optional)
 *   - author: string
 *   - timestamp: number
 *   - votes: { [userId]: 'up' | 'down' }
 *   - comments: { [commentId]: { text, author, type, timestamp } }
 */
export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const suggestionsRef = ref(database, 'suggestions');

    // Listen for real-time changes
    const unsubscribe = onValue(suggestionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and calculate scores
        const suggestionsArray = Object.entries(data).map(([id, suggestion]) => {
          const votes = suggestion.votes || {};
          const upvotes = Object.values(votes).filter(v => v === 'up').length;
          const downvotes = Object.values(votes).filter(v => v === 'down').length;
          const score = upvotes - downvotes;

          return {
            id,
            ...suggestion,
            score,
            upvotes,
            downvotes,
            comments: suggestion.comments ? Object.entries(suggestion.comments).map(([commentId, comment]) => ({
              id: commentId,
              ...comment
            })) : []
          };
        });

        // Sort by score (highest first)
        suggestionsArray.sort((a, b) => b.score - a.score);
        setSuggestions(suggestionsArray);
      } else {
        setSuggestions([]);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Add a new suggestion
   */
  const addSuggestion = async (title, description, author) => {
    const suggestionsRef = ref(database, 'suggestions');
    const newSuggestionRef = push(suggestionsRef);

    await set(newSuggestionRef, {
      title,
      description: description || '',
      author,
      timestamp: Date.now(),
      votes: {},
      comments: {}
    });
  };

  /**
   * Vote on a suggestion
   * @param {string} suggestionId
   * @param {string} userId
   * @param {'up' | 'down'} voteType
   */
  const vote = async (suggestionId, userId, voteType) => {
    const voteRef = ref(database, `suggestions/${suggestionId}/votes/${userId}`);

    // Check current vote
    const snapshot = await get(voteRef);
    const currentVote = snapshot.val();

    // If clicking the same vote, remove it; otherwise set new vote
    if (currentVote === voteType) {
      await set(voteRef, null);
    } else {
      await set(voteRef, voteType);
    }
  };

  /**
   * Add a comment to a suggestion
   */
  const addComment = async (suggestionId, text, author, type = 'neutral') => {
    const commentsRef = ref(database, `suggestions/${suggestionId}/comments`);
    const newCommentRef = push(commentsRef);

    await set(newCommentRef, {
      text,
      author,
      type, // 'pro', 'con', or 'neutral'
      timestamp: Date.now()
    });
  };

  /**
   * Delete a suggestion
   * @param {string} suggestionId
   */
  const deleteSuggestion = async (suggestionId) => {
    const suggestionRef = ref(database, `suggestions/${suggestionId}`);
    await remove(suggestionRef);
  };

  /**
   * Delete a comment from a suggestion
   * @param {string} suggestionId
   * @param {string} commentId
   */
  const deleteComment = async (suggestionId, commentId) => {
    const commentRef = ref(database, `suggestions/${suggestionId}/comments/${commentId}`);
    await remove(commentRef);
  };

  /**
   * Edit a suggestion
   * @param {string} suggestionId
   * @param {string} title
   * @param {string} description
   */
  const editSuggestion = async (suggestionId, title, description) => {
    const suggestionTitleRef = ref(database, `suggestions/${suggestionId}/title`);
    const suggestionDescRef = ref(database, `suggestions/${suggestionId}/description`);

    await set(suggestionTitleRef, title);
    await set(suggestionDescRef, description || '');
  };

  /**
   * Edit a comment
   * @param {string} suggestionId
   * @param {string} commentId
   * @param {string} text
   * @param {string} type
   */
  const editComment = async (suggestionId, commentId, text, type) => {
    const commentTextRef = ref(database, `suggestions/${suggestionId}/comments/${commentId}/text`);
    const commentTypeRef = ref(database, `suggestions/${suggestionId}/comments/${commentId}/type`);

    await set(commentTextRef, text);
    await set(commentTypeRef, type);
  };

  return {
    suggestions,
    loading,
    addSuggestion,
    vote,
    addComment,
    deleteSuggestion,
    deleteComment,
    editSuggestion,
    editComment
  };
};

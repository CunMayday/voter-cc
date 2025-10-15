/**
 * Version: 4
 * Added sorting by score/newest and edit functionality
 */
import { useState, useEffect, useMemo } from 'react';
import UserLogin from './components/UserLogin';
import SuggestionForm from './components/SuggestionForm';
import SuggestionCard from './components/SuggestionCard';
import { useSuggestions } from './hooks/useSuggestions';

/**
 * Main App Component
 * Manages user state and renders the voting interface
 */
function App() {
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('score'); // 'score' or 'newest'

  const {
    suggestions,
    loading,
    addSuggestion,
    vote,
    addComment,
    deleteSuggestion,
    deleteComment,
    editSuggestion,
    editComment
  } = useSuggestions();

  // Sort suggestions based on selected option
  const sortedSuggestions = useMemo(() => {
    const sorted = [...suggestions];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      // Default: sort by score (already sorted in hook, but re-sort to be safe)
      sorted.sort((a, b) => b.score - a.score);
    }
    return sorted;
  }, [suggestions, sortBy]);

  // Check for existing user in session storage (per-tab)
  useEffect(() => {
    const savedUser = sessionStorage.getItem('voter_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        sessionStorage.removeItem('voter_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('voter_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('voter_user');
  };

  // If user hasn't logged in, show login screen
  if (!user) {
    return <UserLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purdue-athletic-gold/20 to-purdue-gold/30">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purdue-gold">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-purdue-black">Teaching Innovation Suggestions</h1>
                <p className="text-purdue-dark-gray mt-1">
                  Welcome, <span className="font-medium text-purdue-gold">{user.displayName}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-purdue-gray hover:text-purdue-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-purdue-athletic-gold/20 transition border border-purdue-gray/30"
              >
                Change Name
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-purdue-athletic-gold/20 border-2 border-purdue-gold rounded-lg p-4 mt-4">
              <h2 className="font-bold text-purdue-black mb-3 flex items-center gap-2 text-lg">
                <svg className="w-6 h-6 text-purdue-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                How to Use This System
              </h2>
              <ul className="text-sm text-purdue-dark-gray space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-purdue-gold font-bold">•</span>
                  <span><strong>Add:</strong> Fill in the title (required) and optional description, then click "Add Suggestion"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purdue-gold font-bold">•</span>
                  <span><strong>Vote:</strong> Click the up arrow (↑) to upvote or down arrow (↓) to downvote suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purdue-gold font-bold">•</span>
                  <span><strong>Edit:</strong> Click the pencil icon to edit suggestions or hover over comments to edit/delete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purdue-gold font-bold">•</span>
                  <span><strong>Comments:</strong> Click "Show Comments" button to expand and view/add comments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purdue-gold font-bold">•</span>
                  <span><strong>Sort:</strong> Use the dropdown below to sort by highest score or newest first</span>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Add suggestion form */}
        <div className="mb-6">
          <SuggestionForm
            onSubmit={addSuggestion}
            author={user.displayName}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purdue-gold border-t-transparent"></div>
            <p className="mt-4 text-purdue-dark-gray">Loading suggestions...</p>
          </div>
        )}

        {/* Suggestions list */}
        {!loading && (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border-l-4 border-purdue-gold">
                <svg
                  className="w-16 h-16 mx-auto text-purdue-gray mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-purdue-black mb-2">
                  No suggestions yet
                </h3>
                <p className="text-purdue-dark-gray">
                  Be the first to share an idea!
                </p>
              </div>
            ) : (
              <>
                {/* Sorting and count */}
                <div className="flex items-center justify-between gap-4 flex-wrap bg-white rounded-lg shadow-md p-4 border-l-4 border-purdue-gold">
                  <div className="text-sm text-purdue-dark-gray font-medium">
                    {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="sortBy" className="text-sm font-bold text-purdue-black">
                      Sort by:
                    </label>
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-purdue-gold outline-none text-sm font-medium bg-white text-purdue-black"
                    >
                      <option value="score">Highest Score</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

                {/* Suggestions */}
                {sortedSuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    currentUserId={user.userId}
                    onVote={vote}
                    onAddComment={(suggestionId, text, type) =>
                      addComment(suggestionId, text, user.displayName, type)
                    }
                    onDeleteSuggestion={deleteSuggestion}
                    onDeleteComment={deleteComment}
                    onEditSuggestion={editSuggestion}
                    onEditComment={editComment}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-purdue-gray bg-white rounded-lg shadow-md p-4">
          <p>All changes sync in real-time across all users</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

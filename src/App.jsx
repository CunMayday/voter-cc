import { useState, useEffect } from 'react';
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
  const { suggestions, loading, addSuggestion, vote, addComment } = useSuggestions();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team Voting</h1>
                <p className="text-gray-600 mt-1">
                  Welcome, <span className="font-medium">{user.displayName}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Change Name
              </button>
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading suggestions...</p>
          </div>
        )}

        {/* Suggestions list */}
        {!loading && (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No suggestions yet
                </h3>
                <p className="text-gray-600">
                  Be the first to share an idea!
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-600 mb-2">
                  {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} • Sorted by score
                </div>
                {suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    currentUserId={user.userId}
                    onVote={vote}
                    onAddComment={(suggestionId, text, type) =>
                      addComment(suggestionId, text, user.displayName, type)
                    }
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>All changes sync in real-time across all users</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

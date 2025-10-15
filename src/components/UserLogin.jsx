/**
 * Version: 3
 * Improved button visibility with better color contrast
 */
import { useState } from 'react';

/**
 * UserLogin Component
 * Prompts users to enter their display name when they first visit
 */
const UserLogin = ({ onLogin }) => {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = displayName.trim();
    if (trimmedName.length < 2) {
      setError('Please enter a name with at least 2 characters');
      return;
    }

    if (trimmedName.length > 30) {
      setError('Name is too long (max 30 characters)');
      return;
    }

    // Generate a unique user ID (combination of name and timestamp)
    const userId = `${trimmedName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    onLogin({ userId, displayName: trimmedName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purdue-athletic-gold/20 to-purdue-gold/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-t-4 border-purdue-gold">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purdue-black mb-2">
            Teaching Innovation Suggestions
          </h1>
          <p className="text-purdue-dark-gray">
            Share ideas, vote, and collaborate
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-purdue-dark-gray mb-2"
            >
              Enter your display name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-transparent outline-none transition"
              placeholder="Your Name"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purdue-black hover:bg-purdue-dark-gray text-purdue-gold font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg border-2 border-purdue-gold"
          >
            Join Session
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-purdue-gray">
          <p>Your votes and suggestions will be visible to the team</p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

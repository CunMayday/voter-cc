import { useState } from 'react';

/**
 * SuggestionForm Component
 * Allows users to submit new suggestions/ideas
 */
const SuggestionForm = ({ onSubmit, author }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (trimmedText.length < 3) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedText, author);
      setText('');
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your idea or suggestion..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          disabled={isSubmitting}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={isSubmitting || text.trim().length < 3}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
        >
          {isSubmitting ? 'Submitting...' : 'Add Suggestion'}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {text.length}/500 characters
      </p>
    </form>
  );
};

export default SuggestionForm;

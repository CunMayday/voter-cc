/**
 * Version: 4
 * Added title and description fields for suggestions
 */
import { useState } from 'react';

/**
 * SuggestionForm Component
 * Allows users to submit new suggestions/ideas with title and description
 */
const SuggestionForm = ({ onSubmit, author }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedTitle, description.trim(), author);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purdue-gold space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-bold text-purdue-black mb-2">
          Suggestion Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title for your suggestion..."
          className="w-full px-4 py-3 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-purdue-gold outline-none transition font-medium"
          disabled={isSubmitting}
          maxLength={200}
        />
        <p className="mt-1 text-xs text-purdue-gray">
          {title.length}/200 characters
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-bold text-purdue-black mb-2">
          Description <span className="text-purdue-gray font-normal">(Optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional details about your suggestion (optional)..."
          className="w-full px-4 py-3 border-2 border-purdue-gray rounded-lg focus:ring-2 focus:ring-purdue-gold focus:border-purdue-gold outline-none transition resize-none"
          disabled={isSubmitting}
          maxLength={1000}
          rows={4}
        />
        <p className="mt-1 text-xs text-purdue-gray">
          {description.length}/1000 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || title.trim().length < 3}
        className="w-full bg-purdue-black hover:bg-purdue-dark-gray disabled:bg-purdue-gray disabled:cursor-not-allowed text-purdue-gold font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg border-2 border-purdue-gold"
      >
        {isSubmitting ? 'Submitting...' : '✓ Add Suggestion'}
      </button>
    </form>
  );
};

export default SuggestionForm;

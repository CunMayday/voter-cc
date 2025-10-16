/**
 * Export Utilities
 * Functions for exporting suggestions data in various formats
 */

/**
 * Format a timestamp to a readable date string
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generate a markdown report from suggestions data
 */
export const generateMarkdownReport = (suggestions) => {
  const exportDate = formatDate(Date.now());
  const totalSuggestions = suggestions.length;
  const totalComments = suggestions.reduce((sum, s) => sum + (s.comments?.length || 0), 0);
  const totalVotes = suggestions.reduce((sum, s) => sum + s.upvotes + s.downvotes, 0);

  // Sort suggestions by score (highest first)
  const sortedSuggestions = [...suggestions].sort((a, b) => b.score - a.score);

  let markdown = `# Teaching Innovation Suggestions Report\n\n`;
  markdown += `**Generated:** ${exportDate}\n\n`;
  markdown += `---\n\n`;

  // Summary Section
  markdown += `## Summary\n\n`;
  markdown += `- **Total Suggestions:** ${totalSuggestions}\n`;
  markdown += `- **Total Comments:** ${totalComments}\n`;
  markdown += `- **Total Votes Cast:** ${totalVotes}\n`;
  markdown += `\n---\n\n`;

  // Top Suggestions
  if (sortedSuggestions.length > 0) {
    const topThree = sortedSuggestions.slice(0, Math.min(3, sortedSuggestions.length));
    markdown += `## Top ${topThree.length} Suggestion${topThree.length !== 1 ? 's' : ''}\n\n`;
    topThree.forEach((suggestion, index) => {
      markdown += `${index + 1}. **${suggestion.title}** (Score: ${suggestion.score > 0 ? '+' : ''}${suggestion.score})\n`;
    });
    markdown += `\n---\n\n`;
  }

  // All Suggestions
  markdown += `## All Suggestions\n\n`;

  if (sortedSuggestions.length === 0) {
    markdown += `*No suggestions available.*\n\n`;
  } else {
    sortedSuggestions.forEach((suggestion, index) => {
      markdown += `### ${index + 1}. ${suggestion.title}\n\n`;

      // Metadata
      markdown += `**Author:** ${suggestion.author}  \n`;
      markdown += `**Submitted:** ${formatDate(suggestion.timestamp)}  \n`;
      markdown += `**Score:** ${suggestion.score > 0 ? '+' : ''}${suggestion.score} `;
      markdown += `(👍 ${suggestion.upvotes} / 👎 ${suggestion.downvotes})  \n\n`;

      // Description
      if (suggestion.description && suggestion.description.trim()) {
        markdown += `**Description:**\n\n`;
        markdown += `${suggestion.description}\n\n`;
      }

      // Comments Section
      if (suggestion.comments && suggestion.comments.length > 0) {
        markdown += `#### Comments (${suggestion.comments.length})\n\n`;

        // Sort comments by timestamp (oldest first)
        const sortedComments = [...suggestion.comments].sort((a, b) => a.timestamp - b.timestamp);

        sortedComments.forEach((comment, commentIndex) => {
          const typeEmoji = {
            pro: '✅',
            con: '❌',
            neutral: '💬'
          }[comment.type] || '💬';

          const typeLabel = {
            pro: 'Pro',
            con: 'Con',
            neutral: 'Neutral'
          }[comment.type] || 'Neutral';

          markdown += `${commentIndex + 1}. ${typeEmoji} **${typeLabel}** - *${comment.author}* (${formatDate(comment.timestamp)})\n`;
          markdown += `   > ${comment.text}\n\n`;
        });
      } else {
        markdown += `*No comments yet.*\n\n`;
      }

      markdown += `---\n\n`;
    });
  }

  // Footer
  markdown += `\n---\n\n`;
  markdown += `*This report was generated from the Teaching Innovation Suggestions application.*\n`;

  return markdown;
};

/**
 * Download content as a file
 */
export const downloadFile = (content, filename, mimeType = 'text/markdown') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Generate an HTML report from suggestions data
 */
export const generateHtmlReport = (suggestions) => {
  const exportDate = formatDate(Date.now());
  const totalSuggestions = suggestions.length;
  const totalComments = suggestions.reduce((sum, s) => sum + (s.comments?.length || 0), 0);
  const totalVotes = suggestions.reduce((sum, s) => sum + s.upvotes + s.downvotes, 0);

  // Sort suggestions by score (highest first)
  const sortedSuggestions = [...suggestions].sort((a, b) => b.score - a.score);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teaching Innovation Suggestions Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    h1 {
      color: #000;
      border-bottom: 4px solid #CFB991;
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-size: 2.5em;
    }
    h2 {
      color: #000;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.8em;
      border-left: 5px solid #CFB991;
      padding-left: 15px;
    }
    h3 {
      color: #333;
      margin-top: 25px;
      margin-bottom: 12px;
      font-size: 1.4em;
    }
    h4 {
      color: #555;
      margin-top: 15px;
      margin-bottom: 10px;
      font-size: 1.1em;
    }
    .meta-info {
      color: #666;
      font-size: 0.95em;
      margin-bottom: 20px;
    }
    .summary {
      background: #f9f9f9;
      border-left: 5px solid #CFB991;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .summary ul {
      list-style: none;
      padding: 0;
    }
    .summary li {
      padding: 8px 0;
      font-size: 1.1em;
    }
    .summary strong {
      color: #000;
    }
    .top-suggestions {
      background: #fffbf0;
      border: 2px solid #CFB991;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .top-suggestions ol {
      margin-left: 20px;
    }
    .top-suggestions li {
      padding: 5px 0;
      font-size: 1.05em;
    }
    .suggestion {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      page-break-inside: avoid;
    }
    .suggestion-header {
      margin-bottom: 15px;
    }
    .suggestion-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin: 15px 0;
      padding: 15px;
      background: white;
      border-radius: 6px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-weight: bold;
      color: #666;
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-value {
      color: #000;
      font-size: 1.1em;
      margin-top: 4px;
    }
    .score {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 1.1em;
    }
    .score.positive {
      background: #d4edda;
      color: #155724;
    }
    .score.negative {
      background: #f8d7da;
      color: #721c24;
    }
    .score.neutral {
      background: #e2e3e5;
      color: #383d41;
    }
    .description {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      white-space: pre-wrap;
      border-left: 3px solid #CFB991;
    }
    .comments {
      margin-top: 20px;
    }
    .comment {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #ddd;
    }
    .comment.pro {
      border-left-color: #28a745;
      background: #f0fdf4;
    }
    .comment.con {
      border-left-color: #dc3545;
      background: #fef2f2;
    }
    .comment.neutral {
      border-left-color: #6c757d;
      background: #f8f9fa;
    }
    .comment-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 0.9em;
      color: #666;
    }
    .comment-type {
      font-weight: bold;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.85em;
    }
    .comment-type.pro {
      background: #28a745;
      color: white;
    }
    .comment-type.con {
      background: #dc3545;
      color: white;
    }
    .comment-type.neutral {
      background: #6c757d;
      color: white;
    }
    .comment-text {
      color: #333;
      line-height: 1.5;
    }
    .divider {
      height: 2px;
      background: linear-gradient(to right, #CFB991, transparent);
      margin: 30px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-style: italic;
    }
    .no-suggestions {
      text-align: center;
      padding: 40px;
      color: #999;
      font-style: italic;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Teaching Innovation Suggestions Report</h1>
    <p class="meta-info"><strong>Generated:</strong> ${escapeHtml(exportDate)}</p>

    <div class="summary">
      <h2>Summary</h2>
      <ul>
        <li><strong>Total Suggestions:</strong> ${totalSuggestions}</li>
        <li><strong>Total Comments:</strong> ${totalComments}</li>
        <li><strong>Total Votes Cast:</strong> ${totalVotes}</li>
      </ul>
    </div>
`;

  // Top Suggestions
  if (sortedSuggestions.length > 0) {
    const topThree = sortedSuggestions.slice(0, Math.min(3, sortedSuggestions.length));
    html += `
    <div class="top-suggestions">
      <h2>Top ${topThree.length} Suggestion${topThree.length !== 1 ? 's' : ''}</h2>
      <ol>
`;
    topThree.forEach((suggestion) => {
      const scoreClass = suggestion.score > 0 ? 'positive' : suggestion.score < 0 ? 'negative' : 'neutral';
      html += `        <li><strong>${escapeHtml(suggestion.title)}</strong> <span class="score ${scoreClass}">${suggestion.score > 0 ? '+' : ''}${suggestion.score}</span></li>\n`;
    });
    html += `      </ol>
    </div>
`;
  }

  // All Suggestions
  html += `
    <h2>All Suggestions</h2>
`;

  if (sortedSuggestions.length === 0) {
    html += `    <p class="no-suggestions">No suggestions available.</p>\n`;
  } else {
    sortedSuggestions.forEach((suggestion, index) => {
      const scoreClass = suggestion.score > 0 ? 'positive' : suggestion.score < 0 ? 'negative' : 'neutral';

      html += `
    <div class="suggestion">
      <div class="suggestion-header">
        <h3>${index + 1}. ${escapeHtml(suggestion.title)}</h3>
      </div>

      <div class="suggestion-meta">
        <div class="meta-item">
          <span class="meta-label">Author</span>
          <span class="meta-value">${escapeHtml(suggestion.author)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Submitted</span>
          <span class="meta-value">${escapeHtml(formatDate(suggestion.timestamp))}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Score</span>
          <span class="meta-value">
            <span class="score ${scoreClass}">${suggestion.score > 0 ? '+' : ''}${suggestion.score}</span>
            <span style="margin-left: 8px; color: #666;">👍 ${suggestion.upvotes} / 👎 ${suggestion.downvotes}</span>
          </span>
        </div>
      </div>
`;

      // Description
      if (suggestion.description && suggestion.description.trim()) {
        html += `
      <div class="description">
        <strong>Description:</strong><br>
        ${escapeHtml(suggestion.description)}
      </div>
`;
      }

      // Comments Section
      if (suggestion.comments && suggestion.comments.length > 0) {
        html += `
      <div class="comments">
        <h4>Comments (${suggestion.comments.length})</h4>
`;

        // Sort comments by timestamp (oldest first)
        const sortedComments = [...suggestion.comments].sort((a, b) => a.timestamp - b.timestamp);

        sortedComments.forEach((comment) => {
          const typeClass = comment.type || 'neutral';
          const typeLabel = {
            pro: '✅ Pro',
            con: '❌ Con',
            neutral: '💬 Neutral'
          }[comment.type] || '💬 Neutral';

          html += `
        <div class="comment ${typeClass}">
          <div class="comment-header">
            <span class="comment-type ${typeClass}">${typeLabel}</span>
            <span>${escapeHtml(comment.author)}</span>
            <span>•</span>
            <span>${escapeHtml(formatDate(comment.timestamp))}</span>
          </div>
          <div class="comment-text">${escapeHtml(comment.text)}</div>
        </div>
`;
        });

        html += `      </div>\n`;
      } else {
        html += `      <p style="color: #999; font-style: italic; margin-top: 15px;">No comments yet.</p>\n`;
      }

      html += `    </div>\n`;

      if (index < sortedSuggestions.length - 1) {
        html += `    <div class="divider"></div>\n`;
      }
    });
  }

  // Footer
  html += `
    <div class="footer">
      <p>This report was generated from the Teaching Innovation Suggestions application.</p>
    </div>
  </div>
</body>
</html>`;

  return html;
};

/**
 * Export suggestions as a markdown file
 */
export const exportAsMarkdown = (suggestions) => {
  const markdown = generateMarkdownReport(suggestions);
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `teaching-innovation-report-${timestamp}.md`;
  downloadFile(markdown, filename, 'text/markdown');
};

/**
 * Export suggestions as an HTML file
 */
export const exportAsHtml = (suggestions) => {
  const html = generateHtmlReport(suggestions);
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `teaching-innovation-report-${timestamp}.html`;
  downloadFile(html, filename, 'text/html');
};

/**
 * Export suggestions in the specified format
 */
export const exportSuggestions = (suggestions, format = 'markdown') => {
  if (format === 'html') {
    exportAsHtml(suggestions);
  } else {
    exportAsMarkdown(suggestions);
  }
};

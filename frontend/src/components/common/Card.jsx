/**
 * Reusable Card Component
 * Uses CSS variables from global.css for theme-aware styling.
 * Drop-in wrapper for any dashboard content block.
 */
window.Card = ({ children, className = '', style = {}, ...props }) => {
    const cardStyle = {
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        ...style,
    };

    return React.createElement(
        'div',
        { className: `pps-card ${className}`.trim(), style: cardStyle, ...props },
        children
    );
};

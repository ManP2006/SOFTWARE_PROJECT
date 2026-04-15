// Initialize
const mountSystem = () => {
    const container = document.getElementById('payslip-react-root');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<window.App />);
    }
};

if (document.readyState === 'complete') mountSystem();
else window.addEventListener('load', mountSystem);

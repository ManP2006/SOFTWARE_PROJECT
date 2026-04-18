// --- Main System Component ---
window.App = () => {
    const { useState, useEffect } = React;
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Bridge for global integration — called from showPayslip() in script.js
        window.openPayslipSystemModal = (data) => {
            console.log('Opening professional payslip for:', data?.name);
            setSelectedPayslip(data);
            setIsModalOpen(true);
        };
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedPayslip(null);
    };

    // Only render modal portal when open — controls pointer-events on the root container
    useEffect(() => {
        const root = document.getElementById('payslip-react-root');
        if (root) {
            root.style.pointerEvents = isModalOpen ? 'auto' : 'none';
        }
    }, [isModalOpen]);

    const PayslipModal = window.PayslipModal;
    if (!PayslipModal) return null;

    return (
        <PayslipModal
            isOpen={isModalOpen}
            onClose={handleClose}
            data={selectedPayslip}
        />
    );
};

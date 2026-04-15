// --- Main System Component ---
window.App = () => {
    const { useState, useEffect } = React;
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Bridge for global integration
        window.openPayslipSystemModal = (data) => {
            console.log('Opening professional payslip for:', data?.name);
            setSelectedPayslip(data);
            setIsModalOpen(true);
        };
    }, []);

    return (
        <window.PayslipModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            data={selectedPayslip} 
        />
    );
};

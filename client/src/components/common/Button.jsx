import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

// Simple button with variants
export const Button = ({ children, onClick, variant = 'primary', className = '', ...rest }) => {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-soft disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';
  const variants = {
    primary: 'bg-[var(--success-green)] text-primary hover:bg-[var(--success-green)]/90 border border-[var(--success-green)]/20 focus:ring-2 ring-[var(--success-green)]/40',
    danger: 'bg-[var(--error-red)] text-primary hover:bg-[var(--error-red)]/90 focus:ring-2 ring-[var(--error-red)]/40',
    outline: 'border border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/10 focus:ring-2 ring-[var(--primary-blue)]/30',
  };
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...rest}>
      {children}
    </motion.button>
  );
};

export default Button;

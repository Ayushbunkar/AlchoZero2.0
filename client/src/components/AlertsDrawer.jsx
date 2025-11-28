import React, { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

export default function AlertsDrawer({ open, onClose, alerts = [], title = 'Alerts for device' }) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement;
    const t = setTimeout(() => {
      try { closeButtonRef.current?.focus(); } catch (e) { /* ignore */ }
    }, 0);

    return () => {
      clearTimeout(t);
      try { previousActiveRef.current?.focus(); } catch (e) { /* ignore */ }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <FocusTrap
        active={open}
        focusTrapOptions={{
          initialFocus: () => closeButtonRef.current || undefined,
          onDeactivate: onClose,
          escapeDeactivates: true,
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: true
        }}
      >
        <motion.aside
          ref={drawerRef}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="ml-auto w-full md:w-1/3 lg:w-1/4 bg-dark-bg p-6 overflow-y-auto"
          aria-modal="true"
          role="dialog"
          aria-labelledby="alerts-drawer-title"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="alerts-drawer-title" className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              {title}
            </h2>
            <button ref={closeButtonRef} onClick={onClose} className="p-2 rounded-md text-gray-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 && (
              <div className="text-gray-400">No alerts for this device.</div>
            )}

            {alerts.map((alert) => (
              <div key={alert.id || alert.timestamp} className="p-3 bg-dark-bg/30 rounded-lg flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'high' ? 'bg-orange-500' : alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                  <div>
                    <p className="text-white font-medium capitalize">{(alert.alertType || 'Alert').replace('_', ' ')}</p>
                    <p className="text-sm text-gray-400">{alert.message || ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </FocusTrap>
    </div>
  );
}

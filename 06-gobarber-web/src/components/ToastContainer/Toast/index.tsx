import React, { useEffect } from 'react';
import {
  FiInfo,
  FiXCircle,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';

import { Container } from './styles';
import { useToast, ToastMessage } from '../../../hooks/toast';

interface ToastProps {
  message: ToastMessage;
  style: React.CSSProperties;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      style={style}
      type={message.type}
      hasdescription={Number(!!message.description)}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;

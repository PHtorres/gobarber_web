import React from 'react';

import { ToastMessage} from '../../hooks/Toast';
import { Containner } from './styles';

import Toast from './Toast';

interface ToastContainerProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
    
    return (
        <Containner>
            {messages.map(message => (
                <Toast key={message.id} message={message} />
            ))}
        </Containner>
    );
}

export default ToastContainer;
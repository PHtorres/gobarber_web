import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../hooks/Toast';
import { Containner } from './styles';

import Toast from './Toast';

interface ToastContainerProps {
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {

    const messagesWithTransitions = useTransition(messages, message => message.id, {
        from: { right: '-120%', opacity: 0.5 },
        enter: { right: '0%', opacity: 1 },
        leave: { right: '-120%', opacity: 0.5 }
    });

    return (
        <Containner>
            {messagesWithTransitions.map(({item, key, props}) => (
                <Toast key={key} style={props} message={item} />
            ))}
        </Containner>
    );
}

export default ToastContainer;
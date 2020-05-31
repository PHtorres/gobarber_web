import styled, {css} from 'styled-components';

interface ToastProps {
    type: 'success' | 'error' | 'info';
    hasDescription:boolean;
}


const toastTypeVariations = {

    info: css`
    background: #ebf8ff;
    color: #3172b7;
    `,

    success:css`
    background: #e6fffa;
    color: #2e656a;
    `,

    error:css`
    background: #fddede;
    color: #e53030;
    `
}

export const ToastContainer = styled.div<ToastProps>`

width: 360px;
position: relative;
padding: 16px 30px 16px 16px;
border-radius: 10px;
box-shadow: 2px 2px 8px rgba(0,0,0, 0.2);

display: flex;

& + div{
    margin-top: 10px;
}

${props => toastTypeVariations[props.type]}

> svg{
    margin: 4px 12px 0 0;
}

div{
    flex: 1;

    p{
        margin-top: 4px;
        font-size: 14px;
        opacity: 0.7;
        line-height: 20px;
    }
}

button{
    position: absolute;
    top: 19px;
    right: 16px;
    opacity: 0.7;
    border: 0;
    background: transparent;
    color: inherit;
}
`;
import styled, {keyframes} from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
> header{
    height:144px;
    background:#28262e;
    display:flex;
    align-items:center;
    padding: 0 90px 0 90px;

    svg{
        width: 25px;
        height:25px;
        color:#999591;
    }
}
`;

export const Content = styled.div`
display: flex;
flex-direction: column;
align-items:center;
justify-content:center;
width: 100%;
margin: -175px 0 auto;


`;

const fromTheRight = keyframes`

from{
    opacity: 0;
    transform: translateX(50px);
}

to{
    opacity: 1;
    transform: translateX(0);
}

`;

export const AnimatedContainer = styled.div`


display: flex;
flex-direction: column;
align-items:center;
justify-content:center;

animation: ${fromTheRight} 1s;

form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1{
        margin-bottom: 24px;
        font-size:20px;
        text-align:left;
    }

    a{
        color: #f4ede8;
        display: block;
        margin-top: 24px;
        text-decoration: none;
        transition: color 0.2s;

        &:hover{
            color: ${shade(0.3, '#f4ede8')}
        }
    }
}

`;

export const AvatarInput = styled.div`
margin-bottom:32px;
position:relative;
display:flex;
align-items:center;
justify-content:center;

img{
    width:186px;
    height:186px;
    border-radius:50%;
}

button{
    position:absolute;
    width:48px;
    height:48px;
    background-color:#ff9000;
    border-radius:50%;
    border:0;
    bottom:0;
    left: 60%;

    svg{
        width:20px;
        height:20px;
        color:#312e38;
    }

    &:hover{
        background: ${shade(0.2, '#ff9000')};
    }
}

`;
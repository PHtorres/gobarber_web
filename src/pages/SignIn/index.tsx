import React, {useCallback, useRef} from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Container, Content, Background } from './styles';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import * as Yup from 'yup';

import Input from '../../components/input';
import Button from '../../components/button';

import getValidationErrors from '../../utils/getValidationErrors';

const SignIn: React.FC = () => {


    const formRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback(async (data: object) => {
        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('A senha é obrigatória')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

        } catch (error) {
            const errors = getValidationErrors(error);
            formRef.current?.setErrors(errors);
        }

    }, [])



    return (
        <Container>
            <Content>
                <img src={logoImg} alt="GoBarber" />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu logon</h1>
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                    <Button type="submit">Entrar</Button>
                    <a href="forgot">Esqueci minha senha</a>
                </Form>
                <a href="conta"> <FiLogIn /> Criar minha conta</a>
            </Content>
            <Background />
        </Container>
    )
};

export default SignIn;
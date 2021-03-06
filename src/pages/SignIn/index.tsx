import React, { useCallback, useRef } from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Container, Content, AnimationContainer, Background } from './styles';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import Input from '../../components/input';
import Button from '../../components/button';

import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {

    const { signIn } = useAuth();
    const { addToast } = useToast();

    const formRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('A senha é obrigatória')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password
            });

        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
            } else {
                addToast({
                    type: 'error',
                    title: 'Erro na autenticação',
                    description: 'Verifique e-mail e senha e tente novamente'
                });
            }
        }

    }, [signIn, addToast])



    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu logon</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Button type="submit">Entrar</Button>
                        <Link to="/forgot-password"> Esqueci minha senha</Link>
                    </Form>
                    <Link to="/SignUp"> <FiLogIn /> Criar minha conta</Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
};

export default SignIn;
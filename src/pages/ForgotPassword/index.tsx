import React, { useCallback, useRef, useState } from 'react'
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Container, Content, AnimationContainer, Background } from './styles';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import Input from '../../components/input';
import Button from '../../components/button';

import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {

    const { addToast } = useToast();
    const formRef = useRef<FormHandles>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        try {
            setLoading(true);
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/password/forgot', {
                email:data.email
            });

            addToast({
                type:'success',
                title:'Pronto!',
                description:'E-mail de recuperação de senha enviado'
            });

        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
            } else {
                addToast({
                    type: 'error',
                    title: 'Erro na recuperação de senha.',
                    description: 'Houve um erro ao tentar recuperar senha.'
                });
            }
        } finally{
            setLoading(false);
        }

    }, [addToast])



    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar senha</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Button loading={loading} type="submit">Recuperar</Button>
                        <a href="forgot">Esqueci minha senha</a>
                    </Form>
                    <Link to="/"> <FiLogIn /> Voltar para login</Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
};

export default ForgotPassword;
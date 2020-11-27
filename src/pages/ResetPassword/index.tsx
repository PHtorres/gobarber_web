import React, { useCallback, useRef } from 'react'
import { FiLock } from 'react-icons/fi';
import { Container, Content, AnimationContainer, Background } from './styles';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.svg';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import Input from '../../components/input';
import Button from '../../components/button';

import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {

    const { addToast } = useToast();
    const history = useHistory();
    const formRef = useRef<FormHandles>(null);
    const location = useLocation();

    const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                password: Yup.string().required('A senha é obrigatória'),
                password_confirmation:Yup.string().oneOf([Yup.ref('password')], 'Senhas não conferem.')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const token = location.search.replace('?token=', '');

            if(!token){
                throw new Error();
            }

            await api.post('/password/reset',{
                password:data.password,
                password_confirmation:data.password_confirmation,
                token
            })

            history.push('/')


        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
            } else {
                addToast({
                    type: 'error',
                    title: 'Erro ao recriar senha',
                    description: 'Houve um erro ao tentar recriar a senha. Tente novamente mais tarde.'
                });
            }
        }

    }, [addToast, history, location])



    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recriar senha</h1>
                        <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
                        <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar Senha" />
                        <Button type="submit">Recriar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
};

export default ResetPassword;
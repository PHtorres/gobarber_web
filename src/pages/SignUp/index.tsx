import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Container, Content, AnimatedContainer, Background } from './styles';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import Input from '../../components/input';
import Button from '../../components/button';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/Toast';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: SignUpFormData) => {

        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('O nome é obrigatório'),
                email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'Digite pelo menos 6 caracteres')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/users', data);

            history.push('/');

            addToast({
                type: 'success',
                title: 'Pronto!',
                description: 'Você já pode fazer seu Logon no GoBarber'
            });

        } catch (error) {

            if(error instanceof Yup.ValidationError){
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }

            addToast({
                type:'error',
                title:'Erro no cadastro',
                description:'Tente novamente depois...'
            });
            
        }

    }, [addToast, history]);

    return (
        <Container>
            <Background />
            <Content>
                <AnimatedContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit} initialData={{}}>
                        <h1>Faça seu Cadastro</h1>
                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Button type="submit">Cadastrar</Button>
                    </Form>
                    <Link to="/"> <FiArrowLeft /> Voltar para logon</Link>
                </AnimatedContainer>
            </Content>
        </Container>
    )

};

export default SignUp;
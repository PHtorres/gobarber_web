import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCamera } from 'react-icons/fi';
import { Container, Content, AnimatedContainer, AvatarInput } from './styles';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import Input from '../../components/input';
import Button from '../../components/button';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
    name: string;
    email: string;
    password: string;
}

const Profile: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const { user } = useAuth();

    const handleSubmit = useCallback(async (data: ProfileFormData) => {

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

            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }

            addToast({
                type: 'error',
                title: 'Erro no cadastro',
                description: 'Tente novamente depois...'
            });

        }

    }, [addToast, history]);

    return (
        <Container>
            <header>
                <Link to="/dashboard">
                    <FiArrowLeft />
                </Link>
            </header>
            <Content>
                <AnimatedContainer>
                    <Form ref={formRef} onSubmit={handleSubmit} initialData={{
                        name: user.name,
                        email: user.email
                    }}>
                        <AvatarInput>
                            <img src={user.avatar_url} alt={user.name} />
                            <button type="button">
                                <FiCamera />
                            </button>
                        </AvatarInput>
                        <h1>Meu perfil</h1>
                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input
                            containerStyle={{ marginTop: 24 }}
                            name="old_password"
                            icon={FiLock}
                            type="password"
                            placeholder="Senha atual" />
                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Nova senha" />
                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="Confirmar a senha" />

                        <Button type="submit">Confirmar mudanças</Button>
                    </Form>
                </AnimatedContainer>
            </Content>
        </Container>
    )

};

export default Profile;
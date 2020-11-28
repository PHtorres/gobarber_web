import React, { ChangeEvent, FormEvent, useCallback, useRef } from 'react'
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
    old_password:string;
    password: string;
    password_confirmation:string;
}

const Profile: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(async (data: ProfileFormData) => {

        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({

                name: Yup.string().required('O nome é obrigatório'),
                email: Yup.string().required('O e-mail é obrigatório').email('Digite um e-mail válido'),

                // old_password: Yup.string(),

                // passsword: Yup.string().when('old_password', {
                //     is: val => !!val.length,
                //     then: Yup.string().required('Digite a nova senha'),
                //     otherwise: Yup.string()
                // }),


                // password_confirmation:Yup.string().oneOf(
                //     [Yup.ref('password')],
                //     'Confirmação incorreta'
                // ),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const formData = Object.assign({
                name:data.name,
                email:data.email
            }, data.old_password? {
                old_password:data.old_password,
                password:data.password,
                password_confirmation:data.password_confirmation
            }:{});

            const response = await api.put('/profile', formData);

            updateUser(response.data);

            history.push('/');

            addToast({
                type: 'success',
                title: 'Pronto!',
                description: 'Perfil atualizado'
            });

        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }

            addToast({
                type: 'error',
                title: 'Erro na atualização',
                description: 'Tente novamente depois...'
            });

        }

    }, [addToast, history]);


    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const data = new FormData();
            data.append('avatar', e.target.files[0]);
            api.patch('/users/avatar', data).then((response) =>{
                updateUser(response.data);
                addToast({type:'success', title:'Avatar atualizado!', description:''})
            });
        }
    }, [addToast, updateUser]);


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
                            <label htmlFor="avatar">
                                <FiCamera />
                                <input type="file" id="avatar" onChange={handleAvatarChange} />
                            </label>
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
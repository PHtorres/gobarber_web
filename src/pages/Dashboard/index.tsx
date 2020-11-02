import React, { useCallback, useState } from 'react';
import { useAuth } from '../../hooks/Auth';
import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar
} from './styles';
import logoImg from '../../assets/logo.svg';
import { FiClock, FiPower } from 'react-icons/fi';

const Dashboard: React.FC = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());

    const { signOut, user } = useAuth();

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />
                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Bem-vindo,</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>
                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>
            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        <span>Hoje</span>
                        <span>Dia 06</span>
                        <span>Segunda-feira</span>
                    </p>
                    <NextAppointment>
                        <strong>Atendimento a seguir</strong>
                        <div>
                            <img src="https://avatars2.githubusercontent.com/u/7872329?s=460&u=f41fcb80dc9ce32a809caf9a6c4d9bf31c6ae11a&v=4"
                                alt="Foto do agendamento" />
                            <strong>Nome do usuário</strong>
                            <span>
                                <FiClock />
                            09:00
                        </span>
                        </div>
                    </NextAppointment>
                    <Section>
                        <strong>Manhã</strong>
                        <Appointment>
                            <span>
                                <FiClock />
                                11:00
                            </span>
                            <div>
                                <img src="https://avatars2.githubusercontent.com/u/7872329?s=460&u=f41fcb80dc9ce32a809caf9a6c4d9bf31c6ae11a&v=4"
                                    alt="Foto do agendamento" />
                                <strong>Nome do usuário 2</strong>
                            </div>
                        </Appointment>
                        <Appointment>
                            <span>
                                <FiClock />
                                08:00
                            </span>
                            <div>
                                <img src="https://avatars2.githubusercontent.com/u/7872329?s=460&u=f41fcb80dc9ce32a809caf9a6c4d9bf31c6ae11a&v=4"
                                    alt="Foto do agendamento" />
                                <strong>Nome do usuário</strong>
                            </div>
                        </Appointment>
                    </Section>
                    <Section>
                        <strong>Tarde</strong>
                        <Appointment>
                            <span>
                                <FiClock />
                                14:00
                            </span>
                            <div>
                                <img src="https://avatars2.githubusercontent.com/u/7872329?s=460&u=f41fcb80dc9ce32a809caf9a6c4d9bf31c6ae11a&v=4"
                                    alt="Foto do agendamento" />
                                <strong>Nome do usuário 3</strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>
                <Calendar></Calendar>
            </Content>
        </Container>
    )
}

export default Dashboard;
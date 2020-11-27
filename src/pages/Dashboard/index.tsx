import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth } from '../../hooks/Auth';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

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
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface Appointment {
    id: number,
    date: string,
    formattedHour: string,
    user: {
        name: string,
        avatar_url: string
    }
}

const Dashboard: React.FC = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const { signOut, user } = useAuth();

    const handleDayChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available && !modifiers.disabled) {
            setSelectedDate(day);
        }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1
            }
        }).then(response => {
            setMonthAvailability(response.data);
        })
    }, [currentMonth, user.id]);

    useEffect(() => {
        api.get<Appointment[]>('appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            }
        }).then(response => {
            const appointmentsFormated = response.data.map(item => {
                return {
                    ...item,
                    formattedHour: format(parseISO(item.date), 'HH:mm')
                }
            });
            console.log(appointmentsFormated);
            setAppointments(appointmentsFormated);
        })
    }, [selectedDate])

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), monthDay.day);
            });

        return dates;
    }, [currentMonth, monthAvailability]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc', { locale: ptBR });
    }, [selectedDate]);

    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => parseISO(appointment.date).getHours() < 12);
    }, [appointments]);

    const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => parseISO(appointment.date).getHours() >= 12);
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        return appointments.find(item => isAfter(parseISO(item.date), new Date()));
    }, [appointments]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />
                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Bem-vindo,</span>
                            <Link to="/profile"><strong>{user.name}</strong></Link>                         
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
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointment &&
                        <NextAppointment>
                            <strong>Agendamento a seguir</strong>
                            <div>
                                <img src={nextAppointment.user.avatar_url}
                                    alt={nextAppointment.user.name} />
                                <strong>{nextAppointment.user.name}</strong>
                                <span><FiClock />{nextAppointment.formattedHour}</span>
                            </div>
                        </NextAppointment>
                    }

                    <Section>
                        <strong>Manhã</strong>

                        {morningAppointments.length === 0 && 
                        <p>Nenhum agendamento neste período</p>}

                        {morningAppointments.map(item => (
                            <Appointment key={item.id}>
                                <span><FiClock />{item.formattedHour}</span>
                                <div>
                                    <img src={item.user.avatar_url}
                                        alt={item.user.name} />
                                    <strong>{item.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                    <Section>
                        <strong>Tarde</strong>

                        {afternoonAppointments.length === 0 && 
                        <p>Nenhum agendamento neste período</p>}

                        {afternoonAppointments.map(item => (
                            <Appointment key={item.id}>
                                <span><FiClock />{item.formattedHour}</span>
                                <div>
                                    <img src={item.user.avatar_url}
                                        alt={item.user.name} />
                                    <strong>{item.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker
                        selectedDays={selectedDate}
                        onDayClick={handleDayChange}
                        onMonthChange={handleMonthChange}
                        fromMonth={new Date()}
                        disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                        modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro']} />
                </Calendar>
            </Content>
        </Container>
    )
}

export default Dashboard;
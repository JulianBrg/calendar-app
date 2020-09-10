import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import { uiOpenModal } from '../../actions/ui'

import { Navbar } from '../ui/Navbar'
import { messages } from '../../helpers/calendar-messages-español'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CalendarEvent } from './CalendarEvent'
import { CalendarModal } from './CalendarModal'
import { useDispatch, useSelector } from 'react-redux'
import { eventSetActive, eventClearActiveEvent } from '../../actions/events'
import { AddNewFab } from '../ui/AddNewFab'
import { DeleteEventFab } from '../ui/DeleteEventFab'


//poner libreria moment en español
moment.locale('es');

const localizer = momentLocalizer(moment);

// const events = [{
//     title: 'Cumpleños del jefe',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgcolor: '#fafafa',
//     notes: 'Comprar el pastel',
//     user: {
//         _id: '123',
//         name: 'Julián'
//     }
// }];

export const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);

    //Mantener el estado y saber en que pantalla se quedo ejemp: mes, dia, semana
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    //Acciones que van a suceder
    const onDoubleClick = (e) => {
        // console.log(e);
        dispatch(uiOpenModal());
    }

    const onSelectEvent = (e) => {
        //SELECCIONAR Y ACTIVAR EN EL STATE EL EVENT
        dispatch(eventSetActive(e));
    }
    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        //TODO: puede servir para crear un evento nuevo en donde des click en el calendario
        // console.log(e);
        dispatch(eventClearActiveEvent());
    }

    //CONFIGURACION DEL USUARIO PARA CARD EN EL CALENDARIO
    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: '#BA46E8',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    }



    return (
        <div className="calendar-screen">
            <Navbar />


            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}

                onSelectSlot={onSelectSlot}
                selectable={true}
            />

            {
                (activeEvent) && <DeleteEventFab /> 
            }
            <AddNewFab />

            <CalendarModal />
        </div>
    )
}

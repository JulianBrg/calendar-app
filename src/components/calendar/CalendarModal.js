import React, { useState } from 'react'
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew } from '../../actions/events';


//ESTYLO para el modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');

//Primera fecha elegida
const now = moment().minutes(0).seconds(0).add(1, 'hours');
//Segunda fecha elegida(se clona la primera fecha)
const nowPuls1 = now.clone().add(1, 'hours');




export const CalendarModal = () => {

    const dispatch = useDispatch();

    //Leer algo del store de Redux
    const { modalOpen } = useSelector(state => state.ui)

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPuls1.toDate());
    //VALIDACION DEL TITULO
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState({
        // title: 'Evento',
        title: '',
        notes: '',
        start: now.toDate(),
        end: nowPuls1.toDate()
    })

    //EXTRAER LA INFO
    const { notes, title, start, end } = formValues;

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    }

    const closeModal = () => {
        //TODO: cerrar el modal
        dispatch(uiCloseModal());
    }

    const handleStartDateChange = (e) => {
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        });
    }

    const handleEndDateChange = (e) => {
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        });
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log(formValues);

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            // console.log('Fecha 2 debe de ser mayor');
            return Swal.fire('Error', 'La fecha FIN debe de ser mayor a la fecha de INICIO', 'error');
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        //TODO: realizar la grabacion en la base de datos
        //COMO EL FORMVALUES CONTIENE LOS DATOS, PERFECTAMENTE SE PUEDEN MANDAR AL DISPATCH
        dispatch(eventAddNew({
            ...formValues,
            id: new Date().getTime(),
            user: {
                _id: '123',
                name: 'Julian'
            }
        }));

        setTitleValid(true);
        closeModal();
    }

    return (
        <>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                closeTimeoutMS={300}
                className="modal"
                overlayClassName="modal-fondo"
            >
                {/* CONTENIDO DEL MODAL */}
                <h1> Nuevo evento </h1>
                <hr />
                <form className="container" onSubmit={handleSubmitForm}>

                    <div className="form-group">
                        <label>Fecha y hora inicio</label>
                        <DateTimePicker
                            onChange={handleStartDateChange}
                            value={dateStart}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha y hora fin</label>
                        <DateTimePicker
                            onChange={handleEndDateChange}
                            value={dateEnd}
                            minDate={dateStart}
                            className="form-control"
                        />
                    </div>

                    <hr />
                    <div className="form-group">
                        <label>Titulo y notas</label>
                        <input
                            type="text"
                            className={`form-control ${!titleValid && 'is-invalid'}`}
                            placeholder="Título del evento"
                            name="title"
                            value={title}
                            onChange={handleInputChange}
                            autoComplete="off"
                        />
                        <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                    </div>

                    <div className="form-group">
                        <textarea
                            type="text"
                            className="form-control"
                            placeholder="Notas"
                            rows="5"
                            name="notes"
                            onChange={handleInputChange}
                            value={notes}
                        ></textarea>
                        <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-outline-primary btn-block"
                    >
                        <i className="far fa-save"></i>
                        <span> Guardar</span>
                    </button>

                </form>
                {/* CLOSE CONTENIDO MODAL */}
            </Modal>
        </>
    )
}

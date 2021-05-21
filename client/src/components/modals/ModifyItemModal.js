import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { EMPTY_STRING, UNKNOWN_ERROR } from '../../utils/consts';

const ModifyItemModal = (props) => {
    const { onHide, show, 
            operationType, modifyingItemId,
            formConfig = [],
            handlers, titles } = props;
    const [value, setValue] = useState(EMPTY_STRING);
    const [errorMessage, setErrorMessage] = useState(EMPTY_STRING);

    const getDefaultValueObject = () => {
        let defaultValueObject = {};
        formConfig.forEach(item => defaultValueObject[item.field] = EMPTY_STRING);
        return defaultValueObject;
    }

    const [valueObject, setValueObject] = useState(getDefaultValueObject());

    const clearData = () => {
        setValue(EMPTY_STRING);
        setErrorMessage(EMPTY_STRING);
    }

    const hideModal = () => {
        clearData();
        onHide();
    }

    const changeValue = (e) => {
        const propertyName = e.target.dataset.id;
        const newObjectValue = { ...valueObject };
        newObjectValue[propertyName] = e.target.value;
        setValueObject(newObjectValue);
    }

    const confirm = () => {
        let item;
        
        switch (operationType) {
            case 'create': 
                item = valueObject;
                break;
            case 'delete':
                item = modifyingItemId;
                break;
            case 'update':
            default:
                item = { id: modifyingItemId, ...valueObject };
                break;
        }

        handlers.serverModifyItemHandler(item)
        .then((data) => {
            if (operationType === 'create') {
                handlers.contextModifyItemHandler(data);
            }
            else {
                handlers.contextModifyItemHandler(item);
            }

            hideModal();
        })
        .catch(error => { 
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message); 
            }
            else {
                console.log(`${error.message} ${error.stack}`);
                setErrorMessage(UNKNOWN_ERROR); 
            }
        });
    }

    useEffect(() => {
        if (!show) {
            return;
        }

        if (operationType === 'update' || operationType === 'delete') {
            const item = handlers.getItemHandler(modifyingItemId);
            const valueField = formConfig[0].field;
            setValue(item && item[valueField] ? item[valueField] : EMPTY_STRING);
            setValueObject({ ...item });
        }
    }, [show]);

    return operationType === 'delete' 
        ? (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {titles.headerTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Text>
                            Вы уверены, что хотите удалить элемент <strong>{value || EMPTY_STRING}</strong>?
                        </Form.Text>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger' onClick={onHide}>Нет</Button>
                    <Button variant='outline-success' onClick={confirm}>Да</Button>
                </Modal.Footer>
            </Modal>
        )
        : (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        { titles.headerTitle }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {
                            formConfig.map(item => 
                                (
                                    <Form.Group key={item.field}>
                                        <Form.Label>{item.label}</Form.Label>
                                        <Form.Control 
                                            data-id={item.field}
                                            type={item.type}
                                            readOnly={item.readOnly && item.readOnly[operationType]}
                                            value={ valueObject[item.field] || EMPTY_STRING }
                                            onChange={ changeValue }
                                            placeholder={item.control.placeholder}>
                                        </Form.Control>
                                    </Form.Group>
                                )
                            )
                        }
                    </Form>
                    <Alert className="mt-3"
                            variant="danger"
                            show={ errorMessage !== EMPTY_STRING }>{errorMessage}
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-danger' onClick={onHide}>Закрыть</Button>
                    <Button variant='outline-success' onClick={confirm}>{ titles.confirmButtonTitle }</Button>
                </Modal.Footer>
            </Modal>
        );
}

export default ModifyItemModal;
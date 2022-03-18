import React, { useState } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import FeatherIcon from "feather-icons-react"
import { useFormik } from 'formik'
import * as yup from "yup"
import axios from '../../../shared/plugins/axios'
import Alert, { msjConfirmacion, msjError, msjExito, titleConfirmacion, titleError, titleExito } from "../../../shared/plugins/alert"


export const CategoryFormUpdate = ({ isOpen2, setCategories, onClose, categorySelect }) => {
    console.log(isOpen2)
    const handleClose = () => {
        onClose();
        formik.resetForm();
        //resetear el formulario
    };


    const formik = useFormik({
        initialValues: {
            description: "",
            status: {
                id: 1,
                description: "Activo"
            }
        },
        validationSchema: yup.object().shape({
            description: yup.string().required("Campo obligatorio").min(3, "Minimo tres caracteres")
        }),
        onSubmit: (values) => {
            console.log(values)
            Alert.fire({
                title: titleConfirmacion,
                text: msjConfirmacion,
                icon: "warning",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "",
                cancelButtonText: "Cancelar",
                cancelButtonColor: "",
                reverseButtons: true,
                backdrop: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: !Alert.isLoading,
                preConfirm: () => {
                    let categoryUpdate = {...categorySelect, description: values.description}
                    console.log(categoryUpdate)
                    return axios({
                        url: "/category/",
                        method: "PUT", 
                        data: JSON.stringify(categoryUpdate) })
                        .then((response) => {
                            if (!response.error) {
                                setCategories(categories =>[
                                    categoryUpdate,
                                    ...categories.filter(it=>it.id != categorySelect.id)]
                                    );
                                    console.log(categorySelect)
                                Alert.fire({
                                    title: titleExito,
                                    text: msjExito,
                                    icon: "success",
                                    confirmButtonText: "Aceptar",
                                    confirmButtonColor: "",
                                })
                            }
                            return response
                        }).catch((error) =>{
                            console.log(error);
                            Alert.fire({
                                title: titleError,
                                text: msjError,
                                icon: "error",
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: "",
                            })
                            
                        })
                }
            })
        }
    })
    
    return (
        <Modal show={isOpen2} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className='mb-4'>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control name="description" placeholder='Gaming' value={formik.values.description} onChange={formik.handleChange}>
                        </Form.Control>
                    </Form.Group>         
                    <Row>
                        <Form.Group className='mb-4'>
                            <Col className='text-end'>
                                <Button variant='danger' onClick={handleClose} className='me-3'> <FeatherIcon icon={"x"} />Cerrar</Button>
                                <Button variant='success' type='submit'> <FeatherIcon icon={"check"} />Registrar</Button>
                            </Col>
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
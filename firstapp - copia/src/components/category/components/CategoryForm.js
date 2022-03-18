import React, { useState } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import FeatherIcon from "feather-icons-react"
import { useFormik } from 'formik'
import * as yup from "yup"
import axios from '../../../shared/plugins/axios'
import Alert, { msjConfirmacion, msjError, msjExito, titleConfirmacion, titleError, titleExito } from "../../../shared/plugins/alert"


export const CategoryForm = ({ isOpen, setCategories, onClose}) => {
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

                    return axios({
                        url: "/category/",
                        method: "POST", 
                        data: JSON.stringify(values) })
                        .then((response) => {
                            if (!response.error) {
                                console.log({values})
                                setCategories(categories => [...categories, response.data])
                                Alert.fire({
                                    title: titleExito,
                                    text: msjExito,
                                    icon: "success",
                                    confirmButtonText: "Aceptar",
                                    confirmButtonColor: "",
                                }).then((result) =>{
                                    if(result.isConfirmed){
                                        handleClose();
                                    }

                                })
                            }
                            return response
                        }).catch((error) =>{
                            Alert.fire({
                                title: titleError,
                                text: msjError,
                                icon: "error",
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: "",
                            }).then((result) =>{
                                if(result.isConfirmed){
                                    handleClose();
                                }

                            })
                        })
                }
            })
        }
    })
    
    return (
        <Modal show={isOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Categoria</Modal.Title>
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
import React, { useState, useEffect} from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import FeatherIcon from "feather-icons-react"
import { isInteger, useFormik } from 'formik'
import * as yup from "yup"
import axios from '../../../shared/plugins/axios'
import Alert, { msjConfirmacion, msjError, msjExito, titleConfirmacion, titleError, titleExito } from "../../../shared/plugins/alert"


export const SubcategoryFormUpdate = ({ isOpen, setSubcategories, onClose, categories, subcategorySelect }) => {
    
    const handleClose = () => {
        onClose();
        formik.resetForm();
    };
    useEffect(() => {
      formik.values.description = subcategorySelect.description;

    }, [])
    


    const formik = useFormik({
        initialValues: {
            description: "",
            category: "",
            status: {
                id: 1,
                description: "Activo"
            }
        },
        validationSchema: yup.object().shape({
            description: yup.string().required("Campo obligatorio").min(3, "Minimo tres caracteres"),
            category: yup.string().required("Campo obligatorio")
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
                    let category  = categories.find(it => it.id === parseInt(values.category));
                    let subcategory = {...values, category: category}
                    let subcategoryUpdate = {...subcategorySelect, description: subcategory.description, category: subcategory.category}
                    console.log(subcategoryUpdate)
                    return axios({
                        url: "/subcategory/",
                        method: "PUT",
                        data: JSON.stringify(subcategoryUpdate)
                    })
                        .then((response) => {
                            if (!response.error) {
                                console.log(response.data)
                                setSubcategories(categories => categories.filter((item) => item.id !== response.data.id))
                                setSubcategories(categories => [response.data, ...categories])
                                Alert.fire({
                                    title: titleExito,
                                    text: msjExito,
                                    icon: "success",
                                    confirmButtonText: "Aceptar",
                                    confirmButtonColor: "",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleClose();
                                    }

                                })
                            }
                            return response
                        }).catch((error) => {
                            Alert.fire({
                                title: titleError,
                                text: msjError,
                                icon: "error",
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: "",
                            }).then((result) => {
                                if (result.isConfirmed) {
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
                <Modal.Title>Actualizar Subcategoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className='mb-4'>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control name="description" placeholder='Gaming' value={formik.values.description} onChange={formik.handleChange}>
                        </Form.Control>
                        {
                            formik.errors.description != null ? (<span bg="danger"> {formik.errors.description} </span>) : null
                        }
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select name="category"  value={formik.values.category} onChange={formik.handleChange} >
                        <option value={""}> Seleccione...</option>
                        {
                            categories.map((category) =>{
                                return <option value={category.id} key={category.id} >{category.description}</option>
                            })
                        }
                        
                        </Form.Select>
                        {
                            formik.errors.category != null ? (<span color='blue'> {formik.errors.category} </span>) : null
                        }
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
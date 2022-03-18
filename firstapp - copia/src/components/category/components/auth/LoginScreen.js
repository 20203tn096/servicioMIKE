import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import axios from "../../../../shared/plugins/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Col, Row, Container, Figure, Form } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import img from "../../../../assets/img/marketplace.png";
import { Alert } from "../../../../shared/plugins/alert";

export const LoginScreen = () => {
  const navigation = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      username: yup.string().required("Campo obligatorio"),
      password: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: (values) => {
      axios({
        uri: "/auth/login",
        method: "POST",
        data: JSON.stringify(values),
      }).then((response) => {
        if (!response.error) {
            const action = {
                type: "LOGIN",
                payload: response.data
            };
            dispatch(action)
            navigation("/products", {replace: true});
            }
      });
    },
  });
  return <div>LoginScreen</div>;
};

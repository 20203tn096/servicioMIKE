import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import axios from "../../../shared/plugins/axios";
import { ButtonCircle } from "../../../shared/components/ButtonCircle";
import { CustomLoader } from "../../../shared/components/CustomLoader";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import Alert, {
  msjConfirmacion,
  msjError,
  msjExito,
  titleConfirmacion,
  titleError,
  titleExito,
} from "../../../shared/plugins/alert";
import { SubcategoryForm } from "./SubcategoryForm";
import {SubcategoryFormUpdate} from "./SubcategoryFormUpdate"


export const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [subcategorySelect, setSubcategorySelect] = useState({})
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const getSubcategories = () => {
    axios({ url: "/subcategory/", method: "GET" })
      .then((response) => {
        setSubcategories(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getCategories = () => {
    axios({ url: "/category/", method: "GET" })
        .then((response) => {
            setCategories(response.data);
            
        })
        .catch((error) => {
            console.log(error);
        });          
};
  
  useEffect(() => {
    setIsLoading(true);
    getCategories();
    getSubcategories();
  }, []);

  const filteredItems = subcategories.filter(
    (item) =>
      item.description &&
      item.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const headerComponent = React.useMemo(() => {
    const clearText = () => {
      if (filterText) {
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        filterText={filterText}
        onClear={clearText}
        onFilter={(e) => setFilterText(e.target.value)}
      />
    );
  }, [filterText]);

  
  const statusChage = (subcategory) => {
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
        let subcategoryUpdated = {};
        subcategory.status.description === "Activo"
          ? (subcategoryUpdated = {
            ...subcategory,
            status: { id: 2, description: "Inactivo" },
          })
          : (subcategoryUpdated = {
            ...subcategory,
            status: { id: 1, description: "Activo" },
          });
          console.log(subcategoryUpdated)
        return axios({
          url: "/subcategory/",
          method: "PUT",
          data: JSON.stringify(subcategoryUpdated),
        })
          .then((response) => {
            setSubcategories(categories => [
              subcategoryUpdated,
              ...categories.filter(it => it.id != subcategory.id)]
            );
            if (!response.error) {
              Alert.fire({
                title: titleExito,
                text: msjExito,
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "",
              });
            }
            return response;
          })
          .catch((error) => {
            Alert.fire({
              title: titleError,
              text: msjError,
              icon: "error",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "",
            });
          });
      },
    });
  };
  

  const columns = [
    {
      name: "#",
      cell: (row, index) => <span>{index + 1}</span>,
    },
    {
      name: "Descripción",
      cell: (row) => <span>{row.description}</span>,
    },
    {
      name: "Categoria",
      cell: (row) => <span>{row.category.description}</span>,
    },
    {
      name: "Estado",
      cell: (row) =>
        row.status.description === "Activo" ? (
          <Badge pill bg="success">
            {row.status.description}
          </Badge>
        ) : (
          <Badge pill bg="danger">
            {row.status.description}
          </Badge>
        ),
    },
    {
      name: "Acciones",
      cell: (row) =>
        <>
          <ButtonCircle
            type={"btn btn-warning btn-circle me-3"}
            onClickFunct={() => {
               setIsOpenUpdate(true);
               setSubcategorySelect(row)

            }}
            icon="edit"
            size={16}
          />
          {
            row.status.description === "Activo" ? (

              <ButtonCircle
                type={"btn btn-danger btn-circle"}
                onClickFunct={() => statusChage(row)}
                icon="trash-2"
                size={16}
                class="ml-3"
              />
            ) : (
              <ButtonCircle
                type={"btn btn-success btn-circle"}
                onClickFunct={() => statusChage(row)}
                icon="check-circle"
                size={16}
              />
              )
            }
        </>
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Row>
            <Col>Subcategorías</Col>
            <Col className="text-end">

            <SubcategoryFormUpdate
            isOpen={isOpenUpdate}
            setSubcategories={setSubcategories}
            onClose={() => setIsOpenUpdate(false)}
            categories = {categories}
            subcategorySelect = {subcategorySelect}           
            />
            <SubcategoryForm
                isOpen={isOpen}
                setSubcategories={setSubcategories}
                onClose={() => setOpen(false)}
                categories = {categories}

              />
              <ButtonCircle
                type={"btn btn-success btn-circle"}
                onClickFunct={() => setOpen(true)}
                icon="plus"
                size={20}
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent={"No hay registros"}
            progressPending={isLoading}
            progressComponent={<CustomLoader />}
            subHeader
            subHeaderComponent={headerComponent}
          />
        </Card.Body>
      </Card>
    </>
  );
};

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import axios from "../../../shared/plugins/axios";
import Alert, {
  msjConfirmacion,
  msjError,
  msjExito,
  titleConfirmacion,
  titleError,
  titleExito,
} from "../../../shared/plugins/alert";
import { ButtonCircle } from "../../../shared/components/ButtonCircle";
import { CustomLoader } from "../../../shared/components/CustomLoader";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import { CategoryForm } from "./CategoryForm";
import { CategoryFormUpdate } from "./CategoryFormUpdate"

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [categorySelect, setCategorySelect] = useState({});

  const getCategories = () => {
    axios({ url: "/category/", method: "GET" })
      .then((response) => {
        setCategories(response.data);
        console.log(categories)
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getCategories();
  }, []);

  const filteredItems = categories.filter(
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

  const statusChage = (category) => {
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
        let categoryUpdated = {};
        category.status.description === "Activo"
          ? (categoryUpdated = {
            ...category,
            status: { id: 2, description: "Inactivo" },
          })
          : (categoryUpdated = {
            ...category,
            status: { id: 1, description: "Activo" },
          });
        return axios({
          url: "/category/",
          method: "PUT",
          data: JSON.stringify(categoryUpdated),
        })
          .then((response) => {
            setCategories(categories => [
              categoryUpdated,
              ...categories.filter(it => it.id != category.id)]
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
      name: "Decripción",
      cell: (row) => <span>{row.description}</span>,
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
              setOpen2(true);
              setCategorySelect(row)
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
            <Col>Categorías</Col>
            <Col className="text-end">
              <CategoryForm
                isOpen={isOpen}
                setCategories={setCategories}
                onClose={() => setOpen(false)}


              />
              <CategoryFormUpdate
                isOpen2={isOpen2}
                setCategories={setCategories}
                onClose={() => setOpen2(false)}
                categorySelect={categorySelect}
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

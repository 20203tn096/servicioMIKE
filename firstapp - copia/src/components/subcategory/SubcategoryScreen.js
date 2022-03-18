import React from "react";
import { Col, Row } from "react-bootstrap";
import { SubcategoryList } from "./components/SubcategoryList";

export const SubcategoryScreen = () => {
  return (
    <Row className="mt-5">
      <Col>
        <SubcategoryList />
      </Col>
    </Row>
  );
};

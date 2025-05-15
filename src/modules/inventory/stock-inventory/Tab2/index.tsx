import React from "react";
import Table from "../Table";

const Products = () => {
  const dataSource = [
    {
      key: 1,
      name: "Sting (Giá thường)",
      unit: "Chai",
      minimumQuantity: "5",
      endingInventory: "47",
      ingredientStatus: "inStock",
    },
    {
      key: 2,
      name: "Nước suối (Giá thường)",
      unit: "Chai",
      minimumQuantity: "10",
      endingInventory: "0",
      ingredientStatus: "outOfStock",
    },
    {
      key: 3,
      name: "Bia Hà Nội (Giá thường)",
      unit: "Lon",
      minimumQuantity: "10000",
      endingInventory: "15000",
      ingredientStatus: "inStock",
    },
  ];

  return (
    <>
      <Table dataSource={dataSource} title="filterProducts" type="product" />
    </>
  );
};

export default Products;

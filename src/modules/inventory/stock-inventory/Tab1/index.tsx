import React from "react";
import Table from "../Table";

const Ingredients = () => {
  const dataSource = [
    {
      key: 1,
      name: "Tôm",
      unit: "kg",
      minimumQuantity: "0",
      endingInventory: "5",
      ingredientStatus: "inStock",
    },
    {
      key: 2,
      name: "Thịt lợn",
      unit: "kg",
      minimumQuantity: "0",
      endingInventory: "0",
      ingredientStatus: "outOfStock",
    },
    {
      key: 3,
      name: "Sữa",
      unit: "ml",
      minimumQuantity: "100",
      endingInventory: "1500",
      ingredientStatus: "inStock",
    },
  ];

  return (
    <>
      <Table
        dataSource={dataSource}
        title="filterIngredient"
        type="ingredient"
      />
    </>
  );
};

export default Ingredients;

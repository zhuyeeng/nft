import React, { useEffect } from "react";
import { fetchCollectionNFTData } from "../../data/categories_data";
import Collection_category_filter from "../collectrions/collection_category_filter";
import CategoryItem from "./categoryItem";
import { useDispatch } from "react-redux";
import { updateTrendingCategoryItemData } from "../../redux/counterSlice";

const FilterCategoryItem = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCollectionNFTData();
      dispatch(updateTrendingCategoryItemData(data.slice(0, 8)));
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* <!-- Filter --> */}
      <Collection_category_filter />
      <CategoryItem />
    </div>
  );
};

export default FilterCategoryItem;

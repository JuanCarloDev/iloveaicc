"use client";
// AppContext.js
import React, { createContext, useContext, useState } from "react";
import { fetchSubcategories } from "./agents/AgentSubCategorieslc";
import { fetchTopics } from "./agents/AgentTopicslc";

// Estado inicial
const initialState = {
  segmentSelected: "",
  subcategories: [],
  topics: [],
  topicsSelected: [],
  subcategoriesSelected: [],
  loading: false,
  step: 1,
  searchTerm: "",
  searchTermSubcategory: "",
  searchTermTopic: "",
};

// Criação do Contexto
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Funções de manipulação de estado
  const handleSegmentClick = async (segment) => {
    console.log("Segment Clicked:", segment);
    setState((prev) => ({ ...prev, loading: true }));
    console.log("Loading State:", state.loading); // Verifique se o loading está sendo ativado

    try {
      const subcategoriesList = await fetchSubcategories(segment.name);
      console.log("Subcategories List:", subcategoriesList);
      setState((prev) => ({
        ...prev,
        subcategories: subcategoriesList,
        step: 2,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSelection = (item, key, maxItems = 3) => {
    setState((prev) => {
      const selectedItems = prev[key];
      return key === "segmentSelected"
        ? { ...prev, [key]: item }
        : selectedItems.includes(item)
        ? { ...prev, [key]: selectedItems.filter((i) => i !== item) }
        : selectedItems.length < maxItems
        ? { ...prev, [key]: [...selectedItems, item] }
        : prev;
    });
  };

  const handleSubcategoriesSubmit = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      // Supondo que fetchTopics é uma função que retorna uma lista de tópicos
      const topicsArray = await fetchTopics(state.subcategoriesSelected);
      setState((prev) => ({
        ...prev,
        topics: topicsArray.topics,
        step: 3,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const filteredItems = (items, searchTerm, key) => {
    return items.filter((item) => {
      if (typeof item === "object" && key) {
        return (
          typeof item[key] === "string" &&
          item[key].toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (typeof item === "string") {
        return item.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        handleSegmentClick,
        handleSelection,
        handleSubcategoriesSubmit,
        filteredItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useAppContext = () => useContext(AppContext);

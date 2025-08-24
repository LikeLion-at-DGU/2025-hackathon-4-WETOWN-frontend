import React from "react";
import styled from "styled-components";

const categories = ["불편/민원", "동네 바람", "정보 공유", "자유 의견"];

const CategoryButtons = ({ selectedCategory, onClick }) => {
    return (
        <Wrapper>
            {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                    <Button
                        key={category}
                        $selected={isSelected}
                        onClick={() => onClick(isSelected ? null : category)} // 토글
                    >
                        {category}
                    </Button>
                );
            })}
        </Wrapper>
    );
};

export default CategoryButtons;

const Wrapper = styled.div`
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 10;
`;

const Button = styled.button`
  padding: 5px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  background: var(--bg1, #FFF);
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
  font-size: 12px;
  transition: 0.2s all;

  background: ${(p) => (p.$selected ? "#4B6BFB" : "#fff")};
  color: ${(p) => (p.$selected ? "#fff" : "#333")};

  &:hover {
    background: ${(p) => (p.$selected ? "#3a56d4" : "#f5f5f5")};
  }
`;

import styled from "styled-components";

const SearchBar = ({ value, onChange, onSearch }) => {
    const onKeyDown = (e) => {
        if (e.key === "Enter") onSearch?.();
    };

    return (
        <Wrap>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="오늘의 이슈를 검색해보세요"
            />
            <Btn type="button" onClick={onSearch}>검색</Btn>
        </Wrap>
    );
};

export default SearchBar;

const Wrap = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
`;

const Btn = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 20px;
  background: #4a6cf7;
  color: #fff;
  cursor: pointer;
`;

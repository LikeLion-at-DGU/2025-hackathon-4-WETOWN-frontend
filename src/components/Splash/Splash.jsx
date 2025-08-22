import React, { useEffect } from "react";
import * as S from "./styled";
import splash from "../../components/assets/splash.svg";

export default function Splash({ onDone, duration = 2000 }) {
  useEffect(() => {
    const id = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(id);
  }, [onDone, duration]);

  return (
    <S.Wrap role="dialog" aria-label="앱 로딩 중">
      <S.Logo src={splash} alt="WE:TOWN 로고" />
      <S.TextWrap>
        <S.Line1>함께 만드는 우리 동네,</S.Line1>
        <S.Line2>WE:TOWN</S.Line2>
      </S.TextWrap>
    </S.Wrap>
  );
}

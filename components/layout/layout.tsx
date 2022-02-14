import React from "react";
import styled from "styled-components";

export const Layout = (props: any) => {
  return (
    <HeaderContainer>
      <HeaderMenu />
      {props.children}
    </HeaderContainer>
  );
};

export const HeaderContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const HeaderMenu = styled.div`
  width: 100%;
  height: 5rem;
  background-color: grey;
`;

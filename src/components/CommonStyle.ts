import { css } from '@emotion/core';
import styled from '@emotion/styled';
import palette from '../style/palette';

export const LayoutContainer = styled.div`
  color: ${palette.gray[8]};

  a {
    text-decoration: none;
    color: ${palette.gray[8]};
  }
`;

export const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const CategoryContainer = styled.div`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;

  @media only screen and (max-width: 1440px) {
    flex-basis: 12%;
  }

  @media only screen and (max-width: 1200px) {
    flex-basis: 15%;
  }

  @media only screen and (max-width: 1024px) {
    flex-basis: 18%;
  }

  @media only screen and (max-width: 720px) {
    flex-basis: 0%;
    display: none;
  }
`;

export const ContentContainer = styled.div`
  flex-basis: 50%;

  @media only screen and (max-width: 1440px) {
    flex-basis: 60%;
  }

  @media only screen and (max-width: 1200px) {
    flex-basis: 70%;
  }

  @media only screen and (max-width: 1024px) {
    flex-basis: 80%;
  }

  @media only screen and (max-width: 720px) {
    flex-basis: 90%;
  }
`;

export const RightContentContainer = styled.div`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;

  @media only screen and (max-width: 1370px) {
    flex-basis: 0%;
    display: none;
  }
`;

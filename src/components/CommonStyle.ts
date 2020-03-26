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
`;

export const ContentContainer = styled.div`
  flex-basis: 50%;
`;

export const RightContentContainer = styled.div`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;
`;

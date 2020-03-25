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

  h2 {
    color: ${palette.main()[6]};
  }

  hr {
    border: 0.5px solid ${palette.gray[5]};
  }

  a {
    font-style: italic;
    color: ${palette.gray[6]};
    display: block;

    &:hover {
      transform: scale(1.075);
      transform-origin: 0 100%;
      color: ${palette.main()[5]};
    }
  }
`;

export const RightContentContainer = styled.div`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;
`;

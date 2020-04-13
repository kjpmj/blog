import React, { ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './header';
import Category from './Category';
import styled from '@emotion/styled';
import {
  BodyContainer,
  LayoutContainer,
  CategoryContainer,
  RightContentContainer,
  ContentContainer,
} from './CommonStyle';
import { css } from '@emotion/core';
import palette from '../style/palette';

type PostListLayoutProps = {
  children: ReactNode;
  path: string;
};

const HeaderStlye = css`
  display: flex;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  max-height: 3rem;
  height: 3rem;
`;

const PostListVoidWrapStyle = styled(RightContentContainer)``;

const PostListLayout = ({ children, path }: PostListLayoutProps) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <LayoutContainer>
      <Header
        siteTitle={data.site.siteMetadata.title}
        style={HeaderStlye}
        visible={false}
        wrapperStyle={css`
          position: absolute;
        `}
      />
      <BodyContainer>
        <CategoryContainer>
          <Category path={path} visible={false} />
        </CategoryContainer>
        <ContentContainer>
          <main>{children}</main>
        </ContentContainer>
        <PostListVoidWrapStyle />
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostListLayout;

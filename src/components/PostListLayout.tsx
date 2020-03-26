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

type PostListLayoutProps = {
  children: ReactNode;
};

const PostListVoidWrapStyle = styled(RightContentContainer)``;

const PostListLayout = ({ children }: PostListLayoutProps) => {
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
      <Header siteTitle={data.site.siteMetadata.title} />
      <BodyContainer>
        <CategoryContainer>
          <Category />
        </CategoryContainer>
        <ContentContainer>
          <main>{children}</main>
        </ContentContainer>
        <PostListVoidWrapStyle></PostListVoidWrapStyle>
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostListLayout;

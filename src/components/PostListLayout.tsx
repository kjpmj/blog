import React, { ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './header';
import styled from '@emotion/styled';
import {
  BodyContainer,
  LayoutContainer,
  RightContentContainer,
  ContentContainer,
  LeftContentContainer,
} from './CommonStyle';
import '../style/index.css';

type PostListLayoutProps = {
  children: ReactNode;
  path: string;
};

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
      <Header siteTitle={data.site.siteMetadata.title} path={path} />
      <BodyContainer>
        <LeftContentContainer />
        <ContentContainer>
          <main>{children}</main>
        </ContentContainer>
        <PostListVoidWrapStyle />
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostListLayout;

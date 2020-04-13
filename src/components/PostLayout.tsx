import React, { ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './header';
import Category from './Category';
import { MarkdownHeading } from '../../types/graphql-types';
import styled from '@emotion/styled';
import {
  LayoutContainer,
  ContentContainer,
  BodyContainer,
  CategoryContainer,
} from './CommonStyle';
import palette from '../style/palette';
import SubTitle from './SubTitle';
import { css } from '@emotion/core';

type PostLayoutProps = {
  children: ReactNode;
  headings: MarkdownHeading[];
  path: string;
};

const PostContentWarpper = styled(ContentContainer)`
  main > h1:first-of-type {
    color: ${palette.main()[5]};
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

const HeaderStlye = css`
  box-shadow: 0 1px 1px 0 rgba(134, 142, 150, 0.05),
    0 5px 10px 0 rgba(134, 142, 150, 0.1);
  display: flex;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  max-height: 3rem;
  height: 3rem;
`;

const PostLayout = ({ children, headings, path }: PostLayoutProps) => {
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
        visible
        wrapperStyle={css`
          position: fixed;
        `}
      />
      <BodyContainer>
        <CategoryContainer>
          <Category path={path} visible />
        </CategoryContainer>
        <PostContentWarpper>
          <main>{children}</main>
        </PostContentWarpper>
        <SubTitle headings={headings} />
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostLayout;

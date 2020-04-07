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
      <Header siteTitle={data.site.siteMetadata.title} />
      <BodyContainer>
        <CategoryContainer>
          <Category path={path} />
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

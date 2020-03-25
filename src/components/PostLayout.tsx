import React, { ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { css } from '@emotion/core';

import Header from './header';
import Category from './Category';
import { MarkdownHeading } from '../../types/graphql-types';
import styled from '@emotion/styled';
import {
  LayoutContainer,
  ContentContainer,
  BodyContainer,
  CategoryContainer,
  RightContentContainer,
} from './CommonStyle';
import palette from '../style/palette';

type PostLayoutProps = {
  children: ReactNode;
  headings: MarkdownHeading[];
};

const PostIndexWrapStyle = styled(RightContentContainer)`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  > div + div {
    /* border-top: 1px dotted black; */
  }

  > div {
    padding: 0.4rem 0 0.4rem 0;
  }

  a {
    display: block;
    text-decoration: none;
    color: ${palette.gray[6]};

    &:hover {
      transform: scale(1.075);
      transform-origin: 0 100%;
      color: ${palette.main()[5]};
    }
  }
`;

const PostLayout = ({ children, headings }: PostLayoutProps) => {
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
        <PostIndexWrapStyle>
          {headings &&
            headings.map(heading => {
              const value: string = heading.value.replace(/\s/g, '-');

              return (
                <div key={heading.value}>
                  <a href={`#${value}`}>{heading.value}</a>
                </div>
              );
            })}
        </PostIndexWrapStyle>
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostLayout;

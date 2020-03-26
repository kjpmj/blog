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
  RightContentContainer,
} from './CommonStyle';
import palette from '../style/palette';

type PostLayoutProps = {
  children: ReactNode;
  headings: MarkdownHeading[];
};

const PostContentWarpper = styled(ContentContainer)`
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

const PostIndexWrapper = styled(RightContentContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  > div {
    position: fixed;
    max-width: 10%;
    top: 10rem;

    > div > div {
      padding: 0.3rem 0 0.3rem 0;
    }
  }

  a {
    display: block;
    text-decoration: none;
    color: ${palette.gray[6]};
    word-break: break-all;

    &:hover {
      transform: scale(1.075);
      transform-origin: 0 100%;
      color: ${palette.main()[5]};
    }
  }
`;

const SubTitle = styled.div`
  font-family: NanumSquareRoundEB, sans-serif;
  font-size: 1.618rem;
  padding-bottom: 1rem;
  word-break: break-all;
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
        <PostContentWarpper>
          <main>{children}</main>
        </PostContentWarpper>
        <PostIndexWrapper>
          <div>
            <SubTitle>Sub Title</SubTitle>
            <div>
              {headings &&
                headings.map(heading => {
                  const value: string = heading.value.replace(/\s/g, '-');

                  return (
                    <div key={heading.value}>
                      <a href={`#${value}`}>{heading.value}</a>
                    </div>
                  );
                })}
            </div>
          </div>
        </PostIndexWrapper>
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostLayout;

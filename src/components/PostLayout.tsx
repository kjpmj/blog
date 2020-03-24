import React, { ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { css } from '@emotion/core';

import Header from './header';
import Category from './Category';
import { MarkdownHeading } from '../../types/graphql-types';

type PostLayoutProps = {
  children: ReactNode;
  headings: MarkdownHeading[];
};

const PostLayoutWrapStyle = css`
  display: flex;
  justify-content: center;
`;

const CategoryWrapStyle = css`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;
`;

const PostWrapStyle = css`
  flex-basis: 50%;
`;

const PostIndexWrapStyle = css`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  > div + div {
    border-top: 1px solid black;
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
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div css={PostLayoutWrapStyle}>
        <div css={CategoryWrapStyle}>
          <Category />
        </div>
        <div css={PostWrapStyle}>
          <main>{children}</main>
        </div>
        <div css={PostIndexWrapStyle}>
          {headings.map(heading => (
            <div key={heading.value}>
              <a href={`#${heading.value}`}>{heading.value}</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostLayout;

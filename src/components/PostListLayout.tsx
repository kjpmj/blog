import React, { ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { css } from '@emotion/core';

import Header from './header';
import Category from './Category';

type PostListLayoutProps = {
  children: ReactNode;
};

const PostListLayoutWrapStyle = css`
  display: flex;
  justify-content: center;
`;

const CategoryWrapStyle = css`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;
`;

const PostListWrapStyle = css`
  flex-basis: 50%;
`;

const PostListVoidWrapStyle = css`
  flex-basis: 10%;
  padding: 0 1.5rem 0 1.5rem;
`;

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
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div css={PostListLayoutWrapStyle}>
        <div css={CategoryWrapStyle}>
          <Category />
        </div>
        <div css={PostListWrapStyle}>
          <main>{children}</main>
        </div>
        <div css={PostListVoidWrapStyle}></div>
      </div>
    </>
  );
};

export default PostListLayout;

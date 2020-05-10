import React, { ReactNode, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './header';
import { MarkdownHeading, Query } from '../../types/graphql-types';
import styled from '@emotion/styled';
import {
  LayoutContainer,
  ContentContainer,
  BodyContainer,
  LeftContentContainer,
} from './CommonStyle';
import palette from '../style/palette';
import SubTitle from './SubTitle';
import '../style/index.css';

type PostLayoutProps = {
  children: ReactNode;
  headings: MarkdownHeading[];
  path: string;
};

const PostContentWarpper = styled(ContentContainer)`
  main > h1:first-of-type > title {
    color: ${palette.main()[5]};
    display: block;
  }

  blockquote {
    margin-top: 2rem;
    margin-bottom: 2rem;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-left: 0px;
    margin-right: 0px;
    border-left: 4px solid ${palette.main()[4]};
    background: rgb(248, 249, 250, 0.8);
    padding: 1rem 1rem 1rem 2rem;
  }

  code {
    background-color: ${palette.main()[1]};
    font-size: 0.9rem;
    padding: 0.1rem 0.2rem 0.1rem 0.2rem;
  }

  h2 {
    margin-top: 2.5rem;
  }

  p {
    line-height: 1.3rem;
  }

  hr {
    border: 0.5px solid ${palette.gray[5]};
  }

  a {
    font-style: italic;
    color: ${palette.gray[6]};

    &:hover {
      color: ${palette.main()[5]};
    }
  }
`;

const PostLayout = ({ children, headings, path }: PostLayoutProps) => {
  const data = useStaticQuery<Query>(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  useEffect(() => {
    const anchors = document.querySelectorAll('div#post-block a:not(.anchor)');
    anchors.forEach(anchor => {
      anchor.setAttribute('target', '_sub');
    });
  }, []);

  return (
    <LayoutContainer>
      <Header siteTitle={data.site.siteMetadata.title} path={path} />
      <BodyContainer>
        <LeftContentContainer />
        <PostContentWarpper>
          <main>{children}</main>
        </PostContentWarpper>
        <SubTitle headings={headings} />
      </BodyContainer>
    </LayoutContainer>
  );
};

export default PostLayout;

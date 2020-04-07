import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { Query } from '../../types/graphql-types';

import PostListLayout from '../components/PostListLayout';
import './index.css';
import 'normalize.css';
import palette from '../style/palette';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const PostRowListWrapper = styled.div`
  > a {
    display: block;
    padding: 1rem 0.25rem 1rem 0.25rem;
    border-bottom: 1px solid ${palette.gray[5]};
  }
`;

const PostRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  height: 10rem;

  &:hover {
    > div:first-of-type {
      > div:nth-of-type(2) {
        color: ${palette.main()[5]};
      }
    }
  }
`;

const mainImageWrapper = css`
  height: 10rem;
  width: 10rem;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 90%;
    height: 90%;
  }
`;

const titleStyle = css`
  font-size: 2rem;
  font-family: NanumSquareRoundB, sans-serif;
  margin-bottom: 1rem;
`;

const postRowColWrpper = css`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const categoryStyle = css`
  > span {
    color: ${palette.white};
    background-color: ${palette.violet[4]};
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  }
`;

const timeCategoryWrapper = css`
  display: flex;
  margin-bottom: 1rem;
`;

const timeStyle = css`
  > span {
    color: ${palette.white};
    background-color: ${palette.teal[4]};
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  }
`;

const IndexPage: React.FC = () => {
  const LatestPostListQuery = graphql`
    {
      allFile(
        filter: { extension: { eq: "md" } }
        sort: {
          order: DESC
          fields: childMarkdownRemark___frontmatter___createAt
        }
      ) {
        nodes {
          childMarkdownRemark {
            frontmatter {
              title
              mainImage {
                childImageSharp {
                  fluid {
                    src
                  }
                }
              }
              createAt(formatString: "DD MMMM, YYYY")
            }
            excerpt(pruneLength: 200)
          }
          relativeDirectory
        }
      }
    }
  `;

  const { allFile } = useStaticQuery<Query>(LatestPostListQuery);

  return (
    <PostListLayout path="/">
      <PostRowListWrapper>
        {allFile.nodes.map(({ childMarkdownRemark, relativeDirectory }) => {
          const title = childMarkdownRemark.frontmatter.title;
          const html = childMarkdownRemark.excerpt;
          const mainImage =
            childMarkdownRemark.frontmatter.mainImage &&
            childMarkdownRemark.frontmatter.mainImage.childImageSharp.fluid.src;
          const createAt = childMarkdownRemark.frontmatter.createAt;

          return (
            <Link key={title} to={`/${relativeDirectory}/${title}`}>
              <PostRowWrapper>
                <div css={postRowColWrpper}>
                  <div css={timeCategoryWrapper}>
                    <div css={timeStyle}>
                      <span>{createAt}</span>
                    </div>
                    <div css={categoryStyle}>
                      <span>{relativeDirectory}</span>
                    </div>
                  </div>
                  <div css={titleStyle}>{title}</div>
                  <div>{html}</div>
                </div>
                {mainImage && (
                  <div css={mainImageWrapper}>
                    <img src={mainImage}></img>
                  </div>
                )}
              </PostRowWrapper>
            </Link>
          );
        })}
      </PostRowListWrapper>
    </PostListLayout>
  );
};

export default IndexPage;

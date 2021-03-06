import React from 'react';
import palette from '../style/palette';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import SEO from './seo';
import font from '../style/font';

export type PostListProps = {
  postDataList: Array<{
    title: string;
    relativeDirectory: string;
    name: string;
    mainImage: string;
    html: string;
    createAt: string;
  }>;
  category: string;
};

const PostRowListWrapper = styled.div`
  margin-bottom: 5rem;

  > a {
    display: block;
    padding: 1rem 0.25rem 1rem 0.25rem;
    border-bottom: 0.5px solid ${palette.gray[4]};
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
  height: 100%;
  width: 20%;
  text-align: right;
  img {
    height: 100%;
  }
`;

const titleStyle = css`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;

  title {
    display: block;
  }
`;

const postRowColWrpper = css`
  display: flex;
  flex-direction: column;
`;

const categoryStyle = css`
  > span {
    color: ${palette.white};
    background-color: ${palette.main()[4]};
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

const htmlStyle = css`
  padding: 0 0.5rem 0 0.5rem;
`;

function PostList({ postDataList, category }: PostListProps) {
  return (
    <PostRowListWrapper>
      <SEO title={category} lang="ko" />
      {postDataList.map(
        ({ title, relativeDirectory, name, mainImage, html, createAt }) => {
          return (
            <Link
              key={`/${relativeDirectory}/${name}`}
              to={`/${relativeDirectory}/${name}`}
            >
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
                  <div css={titleStyle}>
                    <title>{title}</title>
                  </div>
                  <div css={htmlStyle}>{html}</div>
                </div>
                {mainImage && (
                  <div css={mainImageWrapper}>
                    <img src={mainImage}></img>
                  </div>
                )}
              </PostRowWrapper>
            </Link>
          );
        },
      )}
    </PostRowListWrapper>
  );
}

export default PostList;

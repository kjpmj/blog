import React from 'react';
import palette from '../style/palette';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export type PostListProps = {
  postDataList: Array<{
    title: string;
    relativeDirectory: string;
    mainImage: string;
    html: string;
    createAt: string;
  }>;
};

const PostRowListWrapper = styled.div`
  margin-bottom: 5rem;

  > a {
    display: block;
    padding: 1rem 0.25rem 1rem 0.25rem;
    border-bottom: 0.5px solid ${palette.gray[4]};

    /* &:hover {
      transition: all 0.1s linear;
      transform: translateY(-0.5rem);
      box-shadow: 0 0 0 0 rgba(134, 142, 150, 0.05),
        0 5px 10px 0 rgba(134, 142, 150, 0.1);
    } */
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
  font-family: NanumSquareRoundB, sans-serif;
  margin-bottom: 1rem;
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

function PostList({ postDataList }: PostListProps) {
  return (
    <PostRowListWrapper>
      {postDataList.map(
        ({ title, relativeDirectory, mainImage, html, createAt }) => {
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

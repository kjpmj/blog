import React from 'react';
import { ITemplateProps } from '../interface';
import { Link } from 'gatsby';
import PostListLayout from '../components/PostListLayout';
import styled from '@emotion/styled';
import palette from '../style/palette';
import { css } from '@emotion/core';

type IPostListTemplateProps = ITemplateProps<{
  postDataList: Array<{
    title: string;
    relativeDirectory: string;
    mainImage: string;
    html: string;
    createAt: string;
  }>;
}>;

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

function PostListTemplate(props: IPostListTemplateProps) {
  const { postDataList } = props.pageContext;

  return (
    <PostListLayout path={props.path}>
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
          },
        )}
      </PostRowListWrapper>
    </PostListLayout>
  );
}

export default React.memo(PostListTemplate);

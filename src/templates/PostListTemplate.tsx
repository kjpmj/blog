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
      color: ${palette.main()[5]};
    }
  }
`;

const MainImageWrapper = styled.div`
  height: 100%;
  img {
    height: 100%;
  }
`;

const titleStyle = css`
  font-size: 2rem;
  font-family: NanumSquareRoundB, sans-serif;
`;

const postRowColWrpper = css`
  display: flex;
  flex-direction: column;

  div + div {
    padding-top: 1rem;
  }
`;

function PostListTemplate(props: IPostListTemplateProps) {
  const { postDataList } = props.pageContext;

  return (
    <PostListLayout path={props.path}>
      <PostRowListWrapper>
        {postDataList.map(({ title, relativeDirectory, mainImage, html }) => {
          return (
            <Link key={title} to={`/${relativeDirectory}/${title}`}>
              <PostRowWrapper>
                <div css={postRowColWrpper}>
                  <div css={titleStyle}>{title}</div>
                  <div>{html}</div>
                </div>
                {mainImage && (
                  <MainImageWrapper>
                    <img src={mainImage}></img>
                  </MainImageWrapper>
                )}
              </PostRowWrapper>
            </Link>
          );
        })}
      </PostRowListWrapper>
    </PostListLayout>
  );
}

export default React.memo(PostListTemplate);

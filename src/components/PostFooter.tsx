import React from 'react';
import { css } from '@emotion/core';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import { IconContext } from 'react-icons';
import { Link } from 'gatsby';
import palette from '../style/palette';

type PostFooterProps = {
  nextPost: {
    title: string;
    path: string;
  } | null;
  prevPost: {
    title: string;
    path: string;
  } | null;
};

const PostFooterWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  height: 5rem;
  border-top: 1px solid ${palette.gray[5]};
  padding-top: 2rem;
  padding-bottom: 2rem;
  margin-top: 5rem;
  font-size: 1.2rem;
  font-family: 'NanumSquareRoundB';

  a {
    color: ${palette.gray[8]};
    font-style: normal;
    display: flex;

    > div:first-of-type {
      margin-right: 1rem;
    }

    &:hover {
      transform: none;
    }
  }
`;

const prevPostStyle = css`
  padding-left: 0.5rem;
  max-width: 50%;
  text-align: left;

  &:hover {
    a {
      > div:first-of-type {
        transition: transform 0.1s linear;
        transform: translateX(-0.5rem);
      }
    }
  }
`;

const nextPostStlye = css`
  padding-right: 0.5rem;
  max-width: 50%;
  text-align: right;

  &:hover {
    a {
      > div:nth-of-type(2) {
        transition: transform 0.1s linear;
        transform: translateX(0.5rem);
      }
    }
  }
`;

const postTitleStyle = css`
  line-height: 2rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

function PostFooter({ nextPost, prevPost }: PostFooterProps) {
  return (
    <div css={PostFooterWrapperStyle}>
      <div css={prevPostStyle}>
        {prevPost ? (
          <IconContext.Provider value={{ size: '2rem' }}>
            <Link to={prevPost.path}>
              <div>
                <IoIosArrowDropleftCircle />
              </div>
              <div css={postTitleStyle}>{prevPost.title}</div>
            </Link>
          </IconContext.Provider>
        ) : (
          <div css={postTitleStyle}>이전 글 없음</div>
        )}
      </div>
      <div css={nextPostStlye}>
        {nextPost ? (
          <IconContext.Provider value={{ size: '2rem' }}>
            <Link to={nextPost.path}>
              <div css={postTitleStyle}>{nextPost.title}</div>
              <div>
                <IoIosArrowDroprightCircle />
              </div>
            </Link>
          </IconContext.Provider>
        ) : (
          <div css={postTitleStyle}>다음 글 없음</div>
        )}
      </div>
    </div>
  );
}

export default React.memo(PostFooter);

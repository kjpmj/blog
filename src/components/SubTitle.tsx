import React, { useEffect, useState } from 'react';
import { MarkdownHeading } from '../../types/graphql-types';
import { css } from '@emotion/core';
import palette from '../style/palette';
import { RightContentContainer } from './CommonStyle';
import styled from '@emotion/styled';
import _ from 'lodash';
import font from '../style/font';

type SubTitleProps = {
  headings: MarkdownHeading[];
};

const PostIndexWrapper = styled(RightContentContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  > div {
    position: fixed;
    max-width: 15%;
    top: 10rem;

    > div > div {
      padding-top: 0.3rem;
      padding-bottom: 0.3rem;
    }
  }
`;

const SubTitleStyle = css`
  font-weight: 600;
  font-size: 1.618rem;
  padding-bottom: 1rem;
  word-break: break-all;
`;

function SubTitle({ headings }: SubTitleProps) {
  const [curHeading, setCurHeading] = useState('');

  const throttle = _.throttle(() => {
    const hList = document.querySelectorAll<HTMLHeadingElement>(
      '#post-block > h1, h2, h3, h4, h5',
    );

    const hArray = Array.from<HTMLHeadingElement>(hList);

    const curH = _.find<HTMLHeadingElement>(
      _.reverse(hArray),
      (h: HTMLHeadingElement) =>
        h.getBoundingClientRect().top - h.getBoundingClientRect().height < 0,
    );

    if (curH) {
      setCurHeading(curH.getAttribute('id'));
    } else {
      setCurHeading('');
    }
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttle);

    return () => {
      window.removeEventListener('scroll', throttle);
      setCurHeading('');
    };
  }, []);

  const regexp = /[\.\?\<\>\!\@\#\$\%\^\&\*\(\)\_\+\=\\\|]/g;

  return (
    <PostIndexWrapper>
      <div>
        <div css={SubTitleStyle}>Sub Title</div>
        <div>
          {headings &&
            headings.map(heading => {
              const value: string = heading.value
                .replace(/\s/g, '-')
                .replace(regexp, '');
              // .replace(/\?/g, '');

              const subTtitleWrapper = css`
                padding-left: ${0.6 * (heading.depth - 1)}rem;

                a {
                  display: block;
                  word-break: break-all;
                  font-size: 0.95rem;

                  &:hover {
                    transform: scale(1.05);
                    transform-origin: 0 100%;
                    color: ${palette.main()[5]};
                  }
                }
              `;

              const curSubTitleStyle = css`
                a {
                  color: ${palette.main()[5]};
                  transform: scale(1.05);
                  transform-origin: 0 100%;
                  transition: transform 0.2s linear;
                }
              `;

              const subTitleStyle = css`
                a {
                  color: ${palette.gray[6]};
                }
              `;

              const isCurHeading: boolean =
                curHeading.replace(/\s/g, '-').replace(regexp, '') ===
                heading.value.replace(/\s/g, '-').replace(regexp, '');

              return (
                <div
                  key={heading.value}
                  css={[
                    subTtitleWrapper,
                    isCurHeading ? curSubTitleStyle : subTitleStyle,
                  ]}
                >
                  <a href={`#${value}`}>{heading.value}</a>
                </div>
              );
            })}
        </div>
      </div>
    </PostIndexWrapper>
  );
}

export default SubTitle;

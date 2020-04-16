import { Link } from 'gatsby';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';
import { useScrollPosition } from '../hooks/useScrollPosition';

type HeaderProps = {
  siteTitle: string;
  style: SerializedStyles;
  visible: boolean;
  wrapperStyle: SerializedStyles;
};

const HeaderWrapper = styled.div`
  width: 100%;
  z-index: 1000;
  background-color: ${palette.white};
`;

const HeaderContentStyle = css`
  max-width: 50%;
  width: 50%;
`;

const backgroundStyle = css`
  height: 5rem;
`;

const hiddenStyle = css`
  transition: transform 0.2s linear;
  transform: translateY(-6rem);
`;

const visibleStyle = css`
  transition: transform 0.2s linear;
  transform: translateY(0);
`;

const Header = ({ siteTitle, style, visible, wrapperStyle }: HeaderProps) => {
  const [display, setDisplay] = useState(true);
  let curPosition = 0;

  useScrollPosition(({ prevPos, currPos }) => {
    console.log(prevPos);
    console.log(currPos);
  }, []);

  useEffect(() => {
    const throttle = _.throttle(() => {
      setDisplay(() => window.scrollY <= curPosition);
      curPosition = window.scrollY;
    }, 100);

    window.addEventListener('scroll', throttle);

    return () => {
      window.removeEventListener('scroll', throttle);
    };
  }, []);

  console.log(window.scrollY);

  return (
    <>
      <HeaderWrapper
        css={[
          visible
            ? display
              ? ''
              : css`
                  visibility: hidden;
                `
            : '',
          wrapperStyle,
        ]}
      >
        <header css={style}>
          <div css={HeaderContentStyle}>
            <h1 style={{ margin: 0 }}>
              <Link to="/">{siteTitle}</Link>
            </h1>
          </div>
        </header>
      </HeaderWrapper>
      <div css={backgroundStyle}></div>
    </>
  );
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;

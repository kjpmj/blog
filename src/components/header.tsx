import { Link } from 'gatsby';
import React, { useState, useEffect } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';

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
  const [curPosition, setCurPosition] = useState(0);
  const [display, setDisplay] = useState(false);
  const [scrollZero, setScrollZero] = useState(() => {
    return window.scrollY !== 0;
  });

  const throttle = _.throttle(() => {
    if (window.scrollY > curPosition) {
      setDisplay(false);
    } else {
      setDisplay(true);
    }
    setCurPosition(window.scrollY);
  }, 100);

  useEffect(() => {
    setScrollZero(() => {
      return window.scrollY !== 0;
    });

    window.addEventListener('scroll', throttle);

    return () => {
      window.removeEventListener('scroll', throttle);
    };
  }, [curPosition]);

  return (
    <>
      <HeaderWrapper
        css={[
          visible
            ? scrollZero
              ? display
                ? visibleStyle
                : hiddenStyle
              : ''
            : '',
          ,
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

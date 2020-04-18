import { Link } from 'gatsby';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { useLocation, createHistory, LocationProps } from '@reach/router';
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
  transition: transform 0.2s ease-out;
  transform: translateY(-6rem);
`;

const visibleStyle = css`
  transition: transform 0.2s ease-out;
  transform: translateY(0);
`;

const Header = ({ siteTitle, style, visible, wrapperStyle }: HeaderProps) => {
  const location = useLocation();
  const [display, setDisplay] = useState(() => {
    let scrollPosition = 0;

    if (location.state) {
      scrollPosition = location.state.scrollPosition;
    }
    return scrollPosition === 0;
  });

  let curPosition = 0;

  useEffect(() => {
    const beforeUnloadCallback = () => {
      history.replaceState(
        _.assignIn(history.state, { scrollPosition: 0 }),
        '',
      );
    };

    const throttle = _.throttle(() => {
      setDisplay(() => window.scrollY <= curPosition);
      curPosition = window.scrollY;
      history.replaceState(
        _.assignIn(history.state, { scrollPosition: window.scrollY }),
        '',
      );
    }, 100);

    window.addEventListener('scroll', throttle);
    window.addEventListener('beforeunload', beforeUnloadCallback);

    return () => {
      window.removeEventListener('scroll', throttle);
      window.removeEventListener('beforeunload', beforeUnloadCallback);
    };
  }, []);

  return (
    <>
      <HeaderWrapper
        css={[
          visible ? (display ? visibleStyle : hiddenStyle) : '',
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

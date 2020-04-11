import { Link } from 'gatsby';
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';

type HeaderProps = {
  siteTitle: string;
};

const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  z-index: 1000;
  background-color: ${palette.white};
`;

const HeaderStlye = css`
  box-shadow: 0 1px 1px 0 rgba(134, 142, 150, 0.05),
    0 5px 10px 0 rgba(134, 142, 150, 0.1);
  display: flex;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  max-height: 3rem;
  height: 3rem;
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

const Header = ({ siteTitle }: HeaderProps) => {
  const [curPosition, setCurPosition] = useState(0);
  const [display, setDisplay] = useState(true);

  const throttle = _.throttle(() => {
    if (window.scrollY > curPosition) {
      setDisplay(false);
    } else {
      setDisplay(true);
    }
    setCurPosition(window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttle);

    return () => {
      window.removeEventListener('scroll', throttle);
    };
  }, [curPosition]);

  return (
    <>
      <HeaderWrapper css={display ? visibleStyle : hiddenStyle}>
        <header css={HeaderStlye}>
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

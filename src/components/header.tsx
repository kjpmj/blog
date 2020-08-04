import { Link } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/core';
import { useLocation, WindowLocation } from '@reach/router';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';
import { IoMdHome, IoIosList } from 'react-icons/io';
import { IconContext } from 'react-icons';
import Category from './Category';
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import Search from './Search';
import font from '../style/font';

type HeaderProps = {
  siteTitle: string;
  path: string;
};

type HistoryStateProps = {
  scrollPosition?: number;
};

const HeaderWrapper = styled.div`
  position: fixed;
  width: 100%;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
`;

const HeaderStlye = css`
  display: flex;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  max-height: 3rem;
  height: 3rem;
  transition: all 1s ease-out;
`;

const HeaderContentStyle = css`
  max-width: 90%;
  width: 90%;
  display: flex;

  > div {
    height: 3rem;
    line-height: 4rem;
    margin-right: 1.5%;
    font-size: 1.2rem;

    > span {
    }
  }

  .icon {
    cursor: pointer;

    &:hover {
      color: ${palette.main()[5]};
    }
  }
`;

const searchStyle = css`
  display: flex;
  justify-content: flex-end;
`;

const backgroundStyle = css`
  height: 5rem;
`;

const hiddenStyle = css`
  transition: transform 0.1s ease-out;
  transform: translateY(-6rem);
`;

const visibleStyle = css`
  transition: transform 0.1s ease-out;
  transform: translateY(0);
`;

const Header = ({ path }: HeaderProps) => {
  const location: WindowLocation = useLocation();
  const headerRef: React.MutableRefObject<HTMLHeadElement> = useRef(null);
  const categoryRef: React.MutableRefObject<HTMLDivElement> = useRef(null);
  const [display, setDisplay] = useState(() => {
    let scrollPosition = 0;

    if (location.state) {
      const state: HistoryStateProps = location.state;
      scrollPosition = state.scrollPosition || 0;
    }
    return scrollPosition === 0;
  });
  const [categoryDisplay, setCategoryDisplay] = useState(false);

  useOutsideAlerter(categoryRef, () => setCategoryDisplay(false));

  let curPosition = 0;

  useEffect(() => {
    const beforeUnloadCallback = () => {
      history.replaceState(
        _.assignIn(history.state, { scrollPosition: 0 }),
        '',
      );
    };

    const throttle = _.throttle(() => {
      setCategoryDisplay(false);
      if (window.scrollY !== 0) {
        headerRef.current.style.boxShadow =
          ' 0 1px 1px 0 rgba(134, 142, 150, 0.05), 0 5px 10px 0 rgba(134, 142, 150, 0.1)';
      } else {
        headerRef.current.style.boxShadow = 'none';
      }

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
      <HeaderWrapper css={display ? visibleStyle : hiddenStyle}>
        <header css={HeaderStlye} ref={headerRef}>
          <div css={HeaderContentStyle}>
            <div
              onClick={() => setCategoryDisplay(!categoryDisplay)}
              ref={categoryRef}
            >
              <IconContext.Provider
                value={{
                  size: '3rem',
                  className: 'icon',
                }}
              >
                <IoIosList />
              </IconContext.Provider>
              {<Category path={path} visible={categoryDisplay} />}
            </div>
            <div>
              <IconContext.Provider value={{ size: '3rem', className: 'icon' }}>
                <Link to="/">
                  <IoMdHome />
                </Link>
              </IconContext.Provider>
            </div>
            <div css={searchStyle}>
              <Search />
            </div>
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

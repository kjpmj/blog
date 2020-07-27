import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/core';
import palette from '../style/palette';
import SearchResult from './SearchResult';
import _ from 'lodash';
import useOutsideAlerter from '../hooks/useOutsideAlerter';

const searchContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const searchWrapperStyle = css`
  display: flex;
  justify-content: end;
`;

const inputWrapperStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const inputStyle = css`
  height: 2.5rem;
  font-family: 'NanumSquareRound';
  font-size: 1rem;
  width: 200%;
  outline: none;
  border: none;
  background: none;
  border-bottom: 1.5px solid ${palette.gray[6]};

  &:focus {
    border-bottom: 1.5px solid ${palette.main()[5]};
  }
`;

function Search() {
  const [visible, setVisible] = useState('');
  const inputRef: React.MutableRefObject<HTMLInputElement> = useRef(null);
  const searchRef: React.MutableRefObject<HTMLDivElement> = useRef(null);

  let curPosition = 0;

  useEffect(() => {
    const throttle = _.throttle(() => {
      if (window.scrollY > curPosition) {
        setVisible('');
      }
      curPosition = window.scrollY;
    }, 100);

    window.addEventListener('scroll', throttle);

    return () => {
      window.removeEventListener('scroll', throttle);
    };
  }, []);

  useOutsideAlerter(searchRef, () => setVisible(''));

  const onDebounceChange = _.debounce((target: HTMLInputElement) => {
    setVisible(target.value);
  }, 200);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDebounceChange(e.target);
  };

  const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setVisible('1');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 아래 방향키 버튼 입력 시
    // if (e.keyCode === 40) {
    console.log(e.keyCode);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '9' }));
    // }
  };

  return (
    <div css={searchContainerStyle} ref={searchRef}>
      <div css={searchWrapperStyle}>
        <div css={inputWrapperStyle}>
          <input
            css={inputStyle}
            placeholder="Search Post..."
            onChange={onChange}
            onClick={onClick}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
        </div>
      </div>
      {visible && (
        <SearchResult text={inputRef.current.value} inputRef={inputRef} />
      )}
    </div>
  );
}

export default Search;

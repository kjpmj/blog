import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IconContext } from 'react-icons/lib';
import { IoMdSearch } from 'react-icons/io';
import { css } from '@emotion/core';
import palette from '../style/palette';
import SearchResult from './SearchResult';
import _ from 'lodash';

type SearchProps = {};

const searchContainerStyle = css`
  display: flex;
  flex-direction: column;
  line-height: 1rem;
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
  height: 2rem;
  font-family: 'NanumSquareRound';
  font-size: 1rem;
  width: 16rem;
  outline: none;
  border-radius: 0.2rem;
  border: 1.5px solid ${palette.gray[6]};

  &:focus {
    border: 1.5px solid ${palette.main()[5]};
  }
`;

const iconWrapperStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 0.5rem;
  cursor: auto;
`;

function Search() {
  const [visible, setVisible] = useState('');
  const inputRef: React.MutableRefObject<HTMLInputElement> = useRef(null);

  const onDebounceChange = _.debounce((target: HTMLInputElement) => {
    setVisible(target.value);
  }, 200);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDebounceChange(e.target);
  };

  return (
    <div css={searchContainerStyle}>
      <div css={searchWrapperStyle}>
        <div css={iconWrapperStyle}>
          <IconContext.Provider
            value={{
              size: '2rem',
            }}
          >
            <IoMdSearch />
          </IconContext.Provider>
        </div>
        <div css={inputWrapperStyle}>
          <input
            css={inputStyle}
            placeholder="Search Post..."
            onChange={onChange}
            ref={inputRef}
          />
        </div>
      </div>
      {visible && <SearchResult text={inputRef.current.value} />}
    </div>
  );
}

export default Search;

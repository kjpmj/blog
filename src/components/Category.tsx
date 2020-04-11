import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { Query } from '../../types/graphql-types';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';
import { css } from '@emotion/core';

const CategoryWrapper = styled.div`
  position: fixed;
  max-width: 10%;
  top: 10rem;

  @media only screen and (max-width: 1440px) {
    max-width: 12%;
  }

  @media only screen and (max-width: 1200px) {
    max-width: 15%;
  }

  @media only screen and (max-width: 1024px) {
    max-width: 18%;
  }
`;

const CategoryTitle = styled.div`
  font-family: NanumSquareRoundEB, sans-serif;
  font-size: 2rem;
  padding-bottom: 1rem;
  word-break: break-all;
`;

const CategoryLinkWrapper = styled.div`
  padding: 0.3rem 0 0.3rem 0;

  a {
    font-size: 1.1rem;
    word-break: break-all;
    display: block;

    &:hover {
      transform: scale(1.1);
      transform-origin: 0 100%;
      color: ${palette.main()[5]};
    }
  }
`;

const CurrentCategoryStyle = css`
  a {
    font-family: 'NanumSquareRoundB';
    color: ${palette.main()[5]};
    transform: scale(1.1);
    transform-origin: 0 100%;
  }
`;

const scroll0Style = css`
  position: absolute;
`;

const hiddenStyle = css`
  visibility: hidden;
  transition: all 0.2s;
  animation: fadeout 0.2s;

  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const visibleStyle = css`
  visibility: visible;
  transition: all 0.2s;
  animation: fadein 0.2s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

type CategoryProps = {
  path: string;
};

function Category({ path }: CategoryProps) {
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

  const data = useStaticQuery<Query>(graphql`
    {
      allFile(filter: { extension: { eq: "md" } }) {
        nodes {
          relativeDirectory
        }
      }
    }
  `);

  const { allFile } = data;

  const dirList: string[] = allFile.nodes.map(
    ({ relativeDirectory }) => relativeDirectory,
  );
  const dirObj: Object = _.groupBy(dirList);
  const dirKeys: string[] = _.keys(dirObj).sort();

  const categoryPath: string = decodeURI(path).split('/')[1];

  return (
    <CategoryWrapper css={display ? visibleStyle : hiddenStyle}>
      <CategoryTitle>Category</CategoryTitle>
      <div>
        {dirKeys.map(dir => (
          <CategoryLinkWrapper
            key={dir}
            css={categoryPath === dir ? CurrentCategoryStyle : ''}
          >
            <Link to={`/${dir}`}>
              {dir} ({dirObj[dir].length})
            </Link>
          </CategoryLinkWrapper>
        ))}
      </div>
    </CategoryWrapper>
  );
}

export default Category;

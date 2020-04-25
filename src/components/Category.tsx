import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { Query } from '../../types/graphql-types';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';
import { css } from '@emotion/core';

const CategoryWrapper = styled.div`
  z-index: 1100;
  max-width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
`;

const CategoryLinkWrapper = styled.div`
  padding: 0.6rem 0.5rem 0.6rem 0.5rem;
  line-height: 1.5rem;

  a {
    font-size: 1.15rem;
    word-break: break-all;
    display: block;

    &:hover {
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

type CategoryProps = {
  path: string;
  visible: boolean;
};

type CategoryLinkProps = {
  dir: string;
  fullName: string;
  delay: number;
  style: any;
  visible: boolean;
};

function CategoryLink({
  dir,
  fullName,
  delay,
  style,
  visible,
}: CategoryLinkProps) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const timeoutFunc = setTimeout(() => {
      setDisplay(visible);
    }, delay);

    return () => {
      clearTimeout(timeoutFunc);
    };
  }, [visible]);

  return (
    display && (
      <CategoryLinkWrapper css={style}>
        {' '}
        <Link to={`/${dir}`}>{fullName}</Link>
      </CategoryLinkWrapper>
    )
  );
}

function Category({ path, visible }: CategoryProps) {
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
    <CategoryWrapper>
      <div>
        {dirKeys.map((dir, index) => (
          <CategoryLink
            key={dir}
            dir={dir}
            fullName={`${dir} (${dirObj[dir].length})`}
            delay={visible ? index * 30 : (dirKeys.length - 1 - index) * 30}
            style={categoryPath === dir ? CurrentCategoryStyle : ''}
            visible={visible}
          />
        ))}
      </div>
    </CategoryWrapper>
  );
}

export default Category;

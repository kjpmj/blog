import React from 'react';
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

type CategoryProps = {
  path: string;
};

function Category({ path }: CategoryProps) {
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
  const dirKeys: string[] = _.keys(dirObj);

  const categoryPath: string = decodeURI(path).split('/')[1];

  return (
    <CategoryWrapper>
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

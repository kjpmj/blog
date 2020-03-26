import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Query } from '../../types/graphql-types';
import styled from '@emotion/styled';
import _ from 'lodash';
import palette from '../style/palette';

const CategoryWrapper = styled.div`
  position: fixed;
  max-width: 10%;
  top: 18.5%;
`;

const CategoryTitle = styled.div`
  font-family: NanumSquareRoundEB, sans-serif;
  font-size: 2rem;
  padding-bottom: 1rem;
`;

const CategoryLinkWrapper = styled.div`
  padding: 0.3rem 0 0.3rem 0;

  a {
    font-size: 1.1rem;
    word-break: break-all;
    &:hover {
      font-family: NanumSquareRoundB, sans-serif;
    }
  }
`;

function Category() {
  const data = useStaticQuery<Query>(graphql`
    query {
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

  return (
    <CategoryWrapper>
      <CategoryTitle>Category</CategoryTitle>
      <div>
        {dirKeys.map(dir => (
          <CategoryLinkWrapper key={dir}>
            <a href={dir}>
              {dir} ({dirObj[dir].length})
            </a>
          </CategoryLinkWrapper>
        ))}
      </div>
    </CategoryWrapper>
  );
}

export default Category;

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Query } from '../../types/graphql-types';
import { css } from '@emotion/core';
import _ from 'lodash';

const categoryWrapStyle = css`
  /* position: fixed; */

  /* @media (max-width: 1200px) {
    display: none;
  } */
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
    <div css={categoryWrapStyle}>
      <h2>Category</h2>
      <div>
        {dirKeys.map(dir => (
          <div key={dir}>
            {dir}({dirObj[dir].length})
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;

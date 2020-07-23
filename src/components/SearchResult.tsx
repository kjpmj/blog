import React from 'react';
import { Query } from '../../types/graphql-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { css } from '@emotion/core';
import palette from '../style/palette';

const searchResultContainerStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid ${palette.gray[6]};
  background-color: white;
`;

const categoryStyle = css`
  font-size: 1rem;
`;

const titleStyle = css`
  font-size: 1rem;
`;

type SearchResultProps = {
  text: string;
};

function SearchResult({ text }: SearchResultProps) {
  if (!text) return null;

  const queryResult = graphql`
    {
      allFile(
        sort: {
          order: DESC
          fields: childMarkdownRemark___frontmatter___createAt
        }
        filter: { extension: { eq: "md" } }
      ) {
        nodes {
          childMarkdownRemark {
            frontmatter {
              title
              mainImage {
                childImageSharp {
                  fluid {
                    src
                  }
                }
              }
              createAt(formatString: "YYYY-MM-DD")
            }
            excerpt(pruneLength: 200)
          }
          relativeDirectory
          name
        }
      }
    }
  `;

  const { allFile } = useStaticQuery<Query>(queryResult);
  const filteredData = allFile.nodes.filter(node =>
    node.childMarkdownRemark.frontmatter.title
      .toUpperCase()
      .includes(text.toUpperCase()),
  );

  if (filteredData.length === 0) return null;

  return (
    <div css={searchResultContainerStyle}>
      {filteredData.map(({ childMarkdownRemark, relativeDirectory, name }) => (
        <Link
          key={`/${relativeDirectory}/${name}`}
          to={`/${relativeDirectory}/${name}`}
        >
          <div css={categoryStyle}>{relativeDirectory}</div>
          <div css={titleStyle}>{childMarkdownRemark.frontmatter.title}</div>
        </Link>
      ))}
    </div>
  );
}

export default React.memo(SearchResult);

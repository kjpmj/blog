import React from 'react';
import { Query } from '../../types/graphql-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { css } from '@emotion/core';
import palette from '../style/palette';

const searchResultContainerStyle = css`
  display: flex;
  flex-direction: column;
  /* border: 1px solid ${palette.gray[6]}; */
  background-color: white;
  min-width: 30.3rem;
  max-height: 300px;
  position: absolute;
  top: 4rem;
  overflow-y: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding-left: 0.5rem;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${palette.gray[6]};
  }

  ::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
`;

const searchRowStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 3.5rem;
  line-height: 1rem;

  &:hover {
    color: ${palette.main()[5]};
  }
`;

const categoryStyle = css`
  font-size: 1rem;
  width: fit-content;
  color: ${palette.white};
  background-color: ${palette.main()[4]};
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  margin-bottom: 0.25rem;
`;

const titleStyle = css`
  font-size: 1.1rem;
`;

const noResultStyle = css`
  text-align: center;
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

  if (filteredData.length === 0)
    return (
      <div css={searchResultContainerStyle}>
        <div css={noResultStyle}>검색 결과 없음</div>
      </div>
    );

  return (
    <div css={searchResultContainerStyle}>
      {filteredData.map(({ childMarkdownRemark, relativeDirectory, name }) => (
        <Link
          key={`/${relativeDirectory}/${name}`}
          to={`/${relativeDirectory}/${name}`}
          css={searchRowStyle}
        >
          <div css={categoryStyle}>{relativeDirectory}</div>
          <div css={titleStyle}>{childMarkdownRemark.frontmatter.title}</div>
        </Link>
      ))}
    </div>
  );
}

export default React.memo(SearchResult);

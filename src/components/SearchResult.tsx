import React, { useRef, useEffect } from 'react';
import { Query } from '../../types/graphql-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { css } from '@emotion/core';
import palette from '../style/palette';
import _ from 'lodash';
import font from '../style/font';

const searchResultContainerStyle = css`
  display: flex;
  flex-direction: column;
  background-color: white;
  min-width: 20rem;
  max-height: 30rem;
  position: absolute;
  top: 4rem;
  overflow-y: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
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
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  &:hover {
    color: ${palette.main()[5]};
  }

  &:focus {
    background-color: ${palette.gray[1]};
    outline: none;
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
  inputRef: React.MutableRefObject<HTMLInputElement>;
};

function SearchResult({ text, inputRef }: SearchResultProps, ref) {
  if (!text) return null;
  const linkRef = useRef([]);

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

  useEffect(() => {
    ref.current = _.find(linkRef.current, el => el !== null);
  }, [text]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    const targetIndex = linkRef.current.findIndex(
      (el: HTMLAnchorElement) => el === e.target,
    );

    // 아래 방향키
    if (e.keyCode === 40) {
      e.preventDefault();

      if (targetIndex < linkRef.current.length - 1) {
        const target = _.find(
          linkRef.current,
          el => el !== null,
          targetIndex + 1,
        );

        if (target) target.focus();
      }
    }

    // 위 방향키
    if (e.keyCode === 38) {
      e.preventDefault();

      if (ref.current === e.target) {
        inputRef.current.focus();
      } else {
        const target = _.findLast(
          linkRef.current,
          el => el !== null,
          targetIndex - 1,
        );

        if (target) target.focus();
      }
    }
  };

  if (filteredData.length === 0)
    return (
      <div css={searchResultContainerStyle}>
        <div css={noResultStyle}>검색 결과 없음</div>
      </div>
    );

  return (
    <div css={searchResultContainerStyle}>
      {filteredData.map(
        ({ childMarkdownRemark, relativeDirectory, name }, i) => (
          <Link
            key={`/${relativeDirectory}/${name}`}
            to={`/${relativeDirectory}/${name}`}
            css={searchRowStyle}
            onKeyDown={onKeyDown}
            ref={el => {
              linkRef.current[i] = el;
            }}
          >
            <div css={categoryStyle}>{relativeDirectory}</div>
            <div css={titleStyle}>{childMarkdownRemark.frontmatter.title}</div>
          </Link>
        ),
      )}
    </div>
  );
}

export default React.memo(React.forwardRef(SearchResult));

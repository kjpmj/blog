import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { Query } from '../../types/graphql-types';

import PostListLayout from '../components/PostListLayout';
import SEO from '../components/seo';
import './index.css';
import 'normalize.css';

const IndexPage: React.FC = () => {
  const LatestPostListQuery = graphql`
    {
      allFile(
        filter: { extension: { eq: "md" } }
        sort: { fields: birthTime, order: DESC }
      ) {
        edges {
          node {
            name
            relativeDirectory
            base
            childMarkdownRemark {
              excerpt(truncate: false, pruneLength: 100)
              frontmatter {
                title
              }
            }
            birthTime(fromNow: true, locale: "ko")
          }
        }
      }
    }
  `;

  const { allFile } = useStaticQuery<Query>(LatestPostListQuery);

  return (
    <PostListLayout path="/">
      <SEO title="Home" />
      <h2>최근 작성한 게시글 목록</h2>
      <ul>
        {allFile.edges.map(({ node }) => (
          <li key={node.id}>
            <h2>
              <Link
                to={`/${node.relativeDirectory}/${node.childMarkdownRemark.frontmatter.title}`}
              >
                {node.childMarkdownRemark.frontmatter.title}
              </Link>
            </h2>
            <h4>{node.birthTime}</h4>
            <p>{node.childMarkdownRemark.excerpt}</p>
          </li>
        ))}
      </ul>
    </PostListLayout>
  );
};

export default IndexPage;

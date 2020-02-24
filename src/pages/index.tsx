import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { Query } from '../../types/graphql-types';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { Button, Input } from 'react-uikit-kjpmj';

const LatestPostListQuery = graphql`
  {
    allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            path
            date(formatString: "YYYY-MM-DD HH:mm:ss")
          }
          html
          excerpt(pruneLength: 200, truncate: false)
        }
      }
    }
  }
`;

const IndexPage: React.FC = () => {
  const { allMarkdownRemark } = useStaticQuery<Query>(LatestPostListQuery);

  return (
    <Layout>
      <SEO title="Home" />
      <h1>최근 작성한 게시글 목록</h1>
      <ul>
        {allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <h2>
              <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
            </h2>
            <h3>{node.frontmatter.date}</h3>
            <p>{node.excerpt}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;

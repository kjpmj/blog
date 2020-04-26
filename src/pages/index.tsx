import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Query } from '../../types/graphql-types';
import '../style/index.css';
import 'normalize.css';
import PostList from '../components/PostList';
import PostListLayout from '../components/PostListLayout';

const IndexPage: React.FC = () => {
  const LatestPostListQuery = graphql`
    {
      allFile(
        filter: { extension: { eq: "md" } }
        sort: {
          order: DESC
          fields: childMarkdownRemark___frontmatter___createAt
        }
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
        }
      }
    }
  `;

  const { allFile } = useStaticQuery<Query>(LatestPostListQuery);

  const postDataList = allFile.nodes.map(
    ({ childMarkdownRemark, relativeDirectory }) => ({
      title: childMarkdownRemark.frontmatter.title,
      relativeDirectory,
      html: childMarkdownRemark.excerpt,
      mainImage:
        childMarkdownRemark.frontmatter.mainImage &&
        childMarkdownRemark.frontmatter.mainImage.childImageSharp.fluid.src,
      createAt: childMarkdownRemark.frontmatter.createAt,
    }),
  );

  return (
    <PostListLayout path="/">
      <PostList postDataList={postDataList} />
    </PostListLayout>
  );
};

export default IndexPage;

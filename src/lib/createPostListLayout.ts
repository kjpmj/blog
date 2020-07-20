import path from 'path';
import { Query } from '../../types/graphql-types';
import { createPagesType } from './createPages';
import _ from 'lodash';

export async function createPostListLayout({
  actions,
  graphql,
}: createPagesType) {
  const { createPage } = actions;
  const { data, errors } = await graphql<Query>(`
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
          name
        }
      }
    }
  `);

  if (errors) {
    throw errors;
  }

  const { allFile } = data;

  const postList: Object[] = allFile.nodes.map(
    ({ childMarkdownRemark, relativeDirectory, name }) => ({
      title: childMarkdownRemark.frontmatter.title,
      mainImage:
        childMarkdownRemark.frontmatter.mainImage &&
        childMarkdownRemark.frontmatter.mainImage.childImageSharp.fluid.src,
      relativeDirectory,
      name,
      html: childMarkdownRemark.excerpt,
      createAt: childMarkdownRemark.frontmatter.createAt,
    }),
  );

  const postListObj: Object = _.groupBy(postList, 'relativeDirectory');
  const postDirKeys: string[] = _.keys(postListObj);

  postDirKeys.forEach(dirName => {
    createPage({
      path: dirName,
      context: {
        category: dirName,
        postDataList: postListObj[dirName],
      },
      component: path.resolve(__dirname, '../templates/PostListTemplate.tsx'),
    });
  });
}

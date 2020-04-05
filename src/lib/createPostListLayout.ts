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
        sort: { order: DESC, fields: birthTime }
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
            }
            excerpt(pruneLength: 200)
          }
          relativeDirectory
          birthTime(formatString: "DD MMMM, YYYY")
        }
      }
    }
  `);

  const { allFile } = data;

  const postList: Object[] = allFile.nodes.map(
    ({ childMarkdownRemark, relativeDirectory, birthTime }) => ({
      title: childMarkdownRemark.frontmatter.title,
      mainImage:
        childMarkdownRemark.frontmatter.mainImage &&
        childMarkdownRemark.frontmatter.mainImage.childImageSharp.fluid.src,
      relativeDirectory,
      html: childMarkdownRemark.excerpt,
      birthTime,
    }),
  );

  const postListObj: Object = _.groupBy(postList, 'relativeDirectory');
  const postDirKeys: string[] = _.keys(postListObj);

  if (errors) {
    throw errors;
  }

  postDirKeys.forEach(dirName => {
    createPage({
      path: dirName,
      context: {
        postDataList: postListObj[dirName],
      },
      component: path.resolve(__dirname, '../templates/PostListTemplate.tsx'),
    });
  });
}

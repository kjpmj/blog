import path from 'path';
import { Query } from '../../types/graphql-types';
import { createPagesType } from './createPages';

export async function createPostLayout({ actions, graphql }: createPagesType) {
  const { createPage } = actions;

  const { data, errors } = await graphql<Query>(`
    {
      allFile(filter: { extension: { eq: "md" } }) {
        nodes {
          childMarkdownRemark {
            frontmatter {
              title
            }
            headings(depth: h2) {
              value
            }
            html
          }
          relativeDirectory
        }
      }
    }
  `);

  if (errors) {
    throw errors;
  }

  data.allFile.nodes.forEach(({ childMarkdownRemark, relativeDirectory }) => {
    createPage({
      path: relativeDirectory + '/' + childMarkdownRemark.frontmatter.title,
      context: {
        html: childMarkdownRemark.html,
        title: childMarkdownRemark.frontmatter.title,
        headings: childMarkdownRemark.headings,
      },
      component: path.resolve(__dirname, '../templates/PostTemplate.tsx'),
    });
  });
}

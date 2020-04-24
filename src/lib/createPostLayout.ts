import path from 'path';
import { Query } from '../../types/graphql-types';
import { createPagesType } from './createPages';

export async function createPostLayout({ actions, graphql }: createPagesType) {
  const { createPage } = actions;

  const categorys = await graphql<Query>(`
    {
      allDirectory(
        filter: {
          sourceInstanceName: { eq: "posts" }
          relativePath: { ne: "" }
        }
        sort: { order: ASC, fields: relativePath }
      ) {
        edges {
          node {
            relativePath
            sourceInstanceName
          }
        }
      }
    }
  `);

  await Promise.all(
    categorys.data.allDirectory.edges.map(async ({ node }) => {
      const { data, errors } = await graphql<Query>(
        `
          query($category: String!) {
            allFile(
              filter: {
                extension: { eq: "md" }
                relativeDirectory: { eq: $category }
              }
            ) {
              edges {
                next {
                  childMarkdownRemark {
                    frontmatter {
                      title
                    }
                  }
                }
                node {
                  childMarkdownRemark {
                    headings {
                      depth
                      value
                    }
                    html
                    frontmatter {
                      title
                      createAt(formatString: "YYYY-MM-DD HH:mm")
                    }
                  }
                  relativeDirectory
                }
                previous {
                  childMarkdownRemark {
                    frontmatter {
                      title
                    }
                  }
                }
              }
            }
          }
        `,
        {
          category: node.relativePath,
        },
      );

      if (errors) {
        throw errors;
      }

      data.allFile.edges.forEach(({ node, next, previous }) => {
        createPage({
          path: `${node.relativeDirectory}/${node.childMarkdownRemark.frontmatter.title}`,
          context: {
            html: node.childMarkdownRemark.html,
            title: node.childMarkdownRemark.frontmatter.title,
            headings: node.childMarkdownRemark.headings,
            nextPost: next
              ? {
                  title: next.childMarkdownRemark.frontmatter.title,
                  path: `${node.relativeDirectory}/${next.childMarkdownRemark.frontmatter.title}`,
                }
              : null,
            prevPost: previous
              ? {
                  title: previous.childMarkdownRemark.frontmatter.title,
                  path: `${node.relativeDirectory}/${previous.childMarkdownRemark.frontmatter.title}`,
                }
              : null,
          },
          component: path.resolve(__dirname, '../templates/PostTemplate.tsx'),
        });
      });
    }),
  );
}

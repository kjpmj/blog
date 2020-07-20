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
              sort: {
                fields: childMarkdownRemark___frontmatter___createAt
                order: ASC
              }
            ) {
              edges {
                next {
                  childMarkdownRemark {
                    frontmatter {
                      title
                    }
                  }
                  name
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
                      issueNumber
                      description
                    }
                  }
                  relativeDirectory
                  name
                }
                previous {
                  childMarkdownRemark {
                    frontmatter {
                      title
                    }
                  }
                  name
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
          path: `${node.relativeDirectory}/${node.name}`,
          context: {
            html: node.childMarkdownRemark.html,
            title: node.childMarkdownRemark.frontmatter.title,
            description: node.childMarkdownRemark.frontmatter.description,
            relativeDirectory: node.relativeDirectory,
            name: node.name,
            createAt: node.childMarkdownRemark.frontmatter.createAt,
            headings: node.childMarkdownRemark.headings,
            issueNumber: node.childMarkdownRemark.frontmatter.issueNumber,
            nextPost: next
              ? {
                  title: next.childMarkdownRemark.frontmatter.title,
                  path: `${node.relativeDirectory}/${next.name}`,
                }
              : null,
            prevPost: previous
              ? {
                  title: previous.childMarkdownRemark.frontmatter.title,
                  path: `${node.relativeDirectory}/${previous.name}`,
                }
              : null,
          },
          component: path.resolve(__dirname, '../templates/PostTemplate.tsx'),
        });
      });
    }),
  );
}

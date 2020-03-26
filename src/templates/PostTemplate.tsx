import React from 'react';
import PostLayout from '../components/PostLayout';
import { ITemplateProps } from '../interface';
import { MarkdownHeading } from '../../types/graphql-types';

type IPostTemplateProps = ITemplateProps<{
  html: string;
  title: string;
  headings: MarkdownHeading[];
}>;

const PostTemplate: React.FC<IPostTemplateProps> = React.memo(props => {
  const { title, html, headings } = props.pageContext;

  return (
    <PostLayout headings={headings}>
      <h1>{title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </PostLayout>
  );
});

PostTemplate.displayName = 'PostTemplate';

export default PostTemplate;

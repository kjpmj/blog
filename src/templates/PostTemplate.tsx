import React from 'react';
import PostLayout from '../components/PostLayout';
import { ITemplateProps } from '../interface';
import { MarkdownHeading } from '../../types/graphql-types';

type IPostTemplatePorps = ITemplateProps<{
  html: string;
  title: string;
  headings: MarkdownHeading[];
}>;

const PostTemplate: React.FC<IPostTemplatePorps> = React.memo(props => {
  const { title, html, headings } = props.pageContext;

  return (
    <PostLayout headings={headings}>
      <h2>{title}</h2>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </PostLayout>
  );
});

PostTemplate.displayName = 'PostTemplate';

export default PostTemplate;

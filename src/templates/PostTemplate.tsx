import React from 'react';
import PostLayout from '../components/PostLayout';
import { ITemplateProps } from '../interface';
import { MarkdownHeading } from '../../types/graphql-types';
import PostFooter from '../components/PostFooter';

type IPostTemplateProps = ITemplateProps<{
  html: string;
  title: string;
  headings: MarkdownHeading[];
  nextPost: {
    title: string;
    path: string;
  } | null;
  prevPost: {
    title: string;
    path: string;
  } | null;
}>;

const PostTemplate: React.FC<IPostTemplateProps> = React.memo(props => {
  const { title, html, headings, nextPost, prevPost } = props.pageContext;

  return (
    <PostLayout headings={headings} path={props.path}>
      <h1>{title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }} id="post-block"></div>
      <PostFooter nextPost={nextPost} prevPost={prevPost} />
    </PostLayout>
  );
});

PostTemplate.displayName = 'PostTemplate';

export default PostTemplate;

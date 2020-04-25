import React from 'react';
import PostLayout from '../components/PostLayout';
import { ITemplateProps } from '../interface';
import { MarkdownHeading } from '../../types/graphql-types';
import PostFooter from '../components/PostFooter';
import Utterances from '../components/Utterances';

type IPostTemplateProps = ITemplateProps<{
  html: string;
  title: string;
  issueNumber: string;
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
  const {
    title,
    issueNumber,
    html,
    headings,
    nextPost,
    prevPost,
  } = props.pageContext;

  return (
    <PostLayout headings={headings} path={props.path}>
      <h1>{title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: html }} id="post-block"></div>
      <PostFooter nextPost={nextPost} prevPost={prevPost} />
      {issueNumber && (
        <Utterances repo="kjpmj/blog" issueNumber={issueNumber} />
      )}
    </PostLayout>
  );
});

PostTemplate.displayName = 'PostTemplate';

export default PostTemplate;

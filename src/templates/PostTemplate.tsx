import React from 'react';
import PostLayout from '../components/PostLayout';
import { ITemplateProps } from '../interface';
import { MarkdownHeading } from '../../types/graphql-types';
import PostFooter from '../components/PostFooter';
import Utterances from '../components/Utterances';
import { css } from '@emotion/core';
import palette from '../style/palette';

type IPostTemplateProps = ITemplateProps<{
  html: string;
  title: string;
  createAt: string;
  relativeDirectory: string;
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

const categoryTimeInfoStyle = css`
  > span {
    background-color: ${palette.teal[4]};
    color: ${palette.white};
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    line-height: 2rem;

    &:nth-of-type(2) {
      background-color: ${palette.main()[4]};
    }
  }
`;

const PostTemplate: React.FC<IPostTemplateProps> = React.memo(props => {
  const {
    title,
    relativeDirectory,
    createAt,
    issueNumber,
    html,
    headings,
    nextPost,
    prevPost,
  } = props.pageContext;

  return (
    <PostLayout headings={headings} path={props.path}>
      <div css={categoryTimeInfoStyle}>
        <span>{createAt}</span>
        <span>{relativeDirectory}</span>
      </div>
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

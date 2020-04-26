import React from 'react';
import { ITemplateProps } from '../interface';
import PostListLayout from '../components/PostListLayout';
import PostList, { PostListProps } from '../components/PostList';

type IPostListTemplateProps = ITemplateProps<PostListProps>;

function PostListTemplate(props: IPostListTemplateProps) {
  const { postDataList } = props.pageContext;

  return (
    <PostListLayout path={props.path}>
      <PostList postDataList={postDataList} />
    </PostListLayout>
  );
}

export default React.memo(PostListTemplate);

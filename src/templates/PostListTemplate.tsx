import React from 'react';
import { ITemplateProps } from '../interface';
import PostListLayout from '../components/PostListLayout';
import PostList, { PostListProps } from '../components/PostList';

type IPostListTemplateProps = ITemplateProps<PostListProps>;

function PostListTemplate(props: IPostListTemplateProps) {
  const { postDataList, category } = props.pageContext;

  return (
    <PostListLayout path={props.path}>
      <PostList postDataList={postDataList} category={category} />
    </PostListLayout>
  );
}

export default React.memo(PostListTemplate);

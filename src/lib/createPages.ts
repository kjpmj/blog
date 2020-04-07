import { CreatePagesArgs, Actions } from 'gatsby';
import { createPostLayout } from './createPostLayout';
import { createPostListLayout } from './createPostListLayout';

export type createPagesType = {
  actions: Actions;
  graphql: <TData, TVariables = any>(
    query: string,
    variables?: TVariables,
  ) => Promise<{
    errors?: any;
    data?: TData;
  }>;
};

export async function createPages({ actions, graphql }: CreatePagesArgs) {
  const params = {
    actions,
    graphql,
  };

  // 포스트 레이아웃 페이지
  await createPostLayout(params);

  // 포스트 리스트 레이아웃 페이지
  await createPostListLayout(params);
}

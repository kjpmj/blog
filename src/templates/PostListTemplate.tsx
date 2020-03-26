import React from 'react';
import { ITemplateProps } from '../interface';
import { Link } from 'gatsby';
import PostListLayout from '../components/PostListLayout';
import styled from '@emotion/styled';
import palette from '../style/palette';

type IPostListTemplateProps = ITemplateProps<{
  postDataList: Array<{
    title: string;
    relativeDirectory: string;
    mainImage: string;
  }>;
}>;

const PostRowListWrapper = styled.div`
  > a {
    display: block;
    padding: 1rem 0.25rem 1rem 0.25rem;
  }

  > a + a {
    border-top: 1px solid ${palette.gray[5]};
  }
`;

const PostRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  height: 10rem;

  &:hover {
    > div:first-child {
      color: ${palette.main()[5]};
    }
  }
`;

const MainImageWrapper = styled.div`
  height: 100%;
  img {
    height: 100%;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-family: NanumSquareRoundB, sans-serif;
`;

function PostListTemplate(props: IPostListTemplateProps) {
  const { postDataList } = props.pageContext;

  return (
    <PostListLayout>
      <PostRowListWrapper>
        {postDataList.map(({ title, relativeDirectory, mainImage }) => {
          return (
            <Link key={title} to={`/${relativeDirectory}/${title}`}>
              <PostRowWrapper>
                <Title>{title}</Title>
                {mainImage && (
                  <MainImageWrapper>
                    <img src={mainImage}></img>
                  </MainImageWrapper>
                )}
              </PostRowWrapper>
            </Link>
          );
        })}
      </PostRowListWrapper>
    </PostListLayout>
  );
}

export default React.memo(PostListTemplate);

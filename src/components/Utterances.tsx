import React, { useRef, useLayoutEffect } from 'react';
import { css } from '@emotion/core';

type UtterancesProps = {
  repo: string;
  issueNumber?: string;
};

const utterancesWrapperStyle = css`
  margin-bottom: 10rem;
`;

function Utterances({ repo, issueNumber }: UtterancesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const utterances = document.createElement('script');

    const attributes = {
      src: 'https://utteranc.es/client.js',
      repo,
      'issue-number': issueNumber,
      theme: 'github-light',
      crossorigin: 'anonymous',
      async: 'true',
    };

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    containerRef.current.appendChild(utterances);
  });

  return <div ref={containerRef} css={utterancesWrapperStyle} />;
}

export default React.memo(Utterances);

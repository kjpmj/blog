import { Link } from 'gatsby';
import React from 'react';

type HeaderProps = {
  siteTitle: string;
};

const Header = ({ siteTitle }: HeaderProps) => {
  return (
    <>
      <header
        style={{
          background: `white`,
          marginBottom: `1.45rem`,
        }}
      >
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `1.45rem 1.0875rem`,
          }}
        >
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                textDecoration: `none`,
              }}
            >
              {siteTitle}
            </Link>
          </h1>
        </div>
      </header>
      <hr />
    </>
  );
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;

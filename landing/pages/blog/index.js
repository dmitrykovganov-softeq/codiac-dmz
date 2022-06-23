import React, { Component } from 'react';

import Link from 'next/link';
import Image from 'next/image';

const BLOG_POSTS_PATH = '../../content/blogPosts';

const importBlogPosts = async () => {
  // https://medium.com/@shawnstern/importing-multiple-markdown-files-into-a-react-component-with-webpack-7548559fce6f
  // second flag in require.context function is if subdirectories should be searched
  const markdownFiles = require
    .context('../../content/blogPosts', false, /\.md$/)
    .keys()
    .map(relativePath => relativePath.substring(2));
  return Promise.all(
    markdownFiles.map(async path => {
      const markdown = await import(`../../content/blogPosts/${path}`);
      return { ...markdown, slug: path.substring(0, path.length - 3) };
    })
  );
};

export default class Blog extends Component {
  static async getInitialProps() {
    const postsList = await importBlogPosts();

    return { postsList };
  }
  render() {
    const { postsList } = this.props;
    return (
      <div className="blog-list">
        {postsList.map(post => {
          return (
            <Link key={post.slug} href={`blog/post/${post.slug}`}>
              <a>
                <Image src={post.attributes.thumbnail} alt="me" width="64" height="64" />
                <h2>{post.attributes.title}</h2>
              </a>
            </Link>
          );
        })}
        <style jsx>{`
          .blog-list a {
            display: block;
            text-align: center;
          }
          .blog-list img {
            max-width: 100%;

            max-height: 300px;
          }
        `}</style>
      </div>
    );
  }
}

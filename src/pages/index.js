import React from 'react'

import Layout from '../components/Layout'
import BlogRoll from '../components/BlogRoll'

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <div
          className="full-width-image-container margin-top-0"
          style={{
            backgroundImage: `url('/img/board.jpg')`,
            backgroundPosition: '0%',
            backgroundSize: 'cover'
          }}
        >
          <h1
            className="is-size-1"
            style={{
              color: 'white',
              fontSize: '2rem',
              textAlign: 'center',
              padding: '0.5rem 0.3rem'
            }}
          >
            Nosso <strong style={{color: 'white'}}>hub</strong> de conteúdos relevantes
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <BlogRoll />
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

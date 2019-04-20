import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'

class BlogRoll extends React.Component {
  constructor() {
    super()
    this.state = {
      currentPosts: [],
      tags: [],
      currentTag: 'todos'
    }

    this.filterPosts = this.filterPosts.bind(this)
  }

  componentDidMount() {
    const { data } = this.props
    const { edges: apiPosts } = data.allMarkdownRemark
    let tags = [];

    const tagsList = apiPosts.map(post => {
      post.node.frontmatter.tags.map(tag => {
        if (!tags.includes(tag))
          tags.push(tag)
      })
    })

    tags.push('todos')

    this.setState({
      tags
    })
  }

  filterPosts(tag) {
    const { data } = this.props
    const { edges: apiPosts } = data.allMarkdownRemark

    if(tag === 'all') {
      this.setState({
        currentPosts: [],
        currentTag: 'all'
      })

      return
    }

    const currentPosts = apiPosts.filter(post => {
      return post.node.frontmatter.tags.includes(tag)
    })

    this.setState({
      currentPosts,
      currentTag: tag
    })
  }

  render() {
    const { currentPosts: statePosts, currentTag, tags } = this.state
    const { data } = this.props
    const { edges: apiPosts } = data.allMarkdownRemark

    const currentPosts = statePosts.length > 0 ? statePosts : apiPosts

    return (
      <Fragment>
        <div className="tags">
          {tags &&
            tags.map(tag => {
              return <span className={currentTag === tag ? 'is-active' : ''} onClick={() => this.filterPosts(tag)}>{tag}</span>
            })
          }
        </div>
        <div className="columns is-multiline">
          {currentPosts &&
            currentPosts.map(({ node: post }) => (
              <div className="is-parent column is-6" key={post.id}>
                <article className="tile is-child box notification">
                  <p>
                    <Link
                      className="title has-text-primary is-size-4"
                      to={post.fields.slug}
                    >
                      {post.frontmatter.title}
                    </Link>
                    <span> &bull; </span>
                    <span className="subtitle is-size-5 is-block">
                      {post.frontmatter.date}
                    </span>
                  </p>
                  <p>
                    {post.excerpt}
                    <br />
                    <br />
                    <Link className="button" to={post.fields.slug}>
                      Continue lendo →
                    </Link>
                  </p>
                </article>
              </div>
            ))}
        </div>
      </Fragment>
    )
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                tags
                date(formatString: "MMMM DD, YYYY")
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
)

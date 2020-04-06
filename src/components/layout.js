/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Container } from 'semantic-ui-react'
import "./layout.css"
import 'semantic-ui-css/semantic.min.css'
import  Footer from './footer';
const Layout = ({ children }) => {
  return (
    <>
      <Container>
        {children}
      </Container>
      <Footer/>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
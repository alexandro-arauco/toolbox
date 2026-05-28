import { Navbar, Container } from 'react-bootstrap'

function AppNavbar () {
  return (
    <Navbar bg='danger' variant='dark'>
      <Container>
        <Navbar.Brand>React Test App</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default AppNavbar

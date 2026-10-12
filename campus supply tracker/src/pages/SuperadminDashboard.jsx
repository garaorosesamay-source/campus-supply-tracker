import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.jsx'

export default function Display() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')

  const api_url = 'http://localhost:8080/api/product'

  const { logout } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  async function formSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          lastname: lastname
        })
      })

      const newProduct = await response.json()

      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct
      ])

      setName('')
      setLastname('')
    } catch (err) {
      console.log(err)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div
      className="bg-primary-subtle"
      style={{ minHeight: '100vh' }}
    >
      <div className="text-center d-flex justify-content-center flex-column bg-primary-subtle">
        <header className="fw-bold text-primary text-start bg-dark m-2 p-4 mx-1">
          School Supply Tracker
          <i className="bi bi-clipboard-fill text-primary m-1"></i>
        </header>

        <h1
          className="fw-bold text-primary"
          style={{ fontFamily: 'monospace' }}
        >
          Superadmin Dashboard
        </h1>

        <form onSubmit={formSubmit}>
          <label
            className="fw-light"
            htmlFor="name"
          >
            Name:
          </label>

          <input
            type="text"
            className="form-control"
            style={{
              width: '300px',
              margin: 'auto'
            }}
            id="name"
            placeholder="Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />

          <label
            className="fw-light"
            htmlFor="lastname"
          >
            Last Name:
          </label>

          <input
            type="text"
            className="form-control"
            style={{
              width: '300px',
              margin: 'auto'
            }}
            id="lastname"
            placeholder="Last Name"
            value={lastname}
            onChange={(event) =>
              setLastname(event.target.value)
            }
          />

          <button
            type="submit"
            className="btn btn-primary mt-3"
          >
            Add
          </button>
        </form>

        <table
          className="table table-striped mt-3"
          style={{ border: '1px solid black' }}
        >
          <thead className="table-dark">
            <tr>
              <td>Name</td>
              <td>Last Name</td>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.lastname}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fixed-bottom">
          <button
            type="button"
            className="btn btn-outline-primary btn-lg my-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
import { render, screen, cleanup } from '@testing-library/react'
import App from '../App'
import { describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

describe('App component', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByText('Vixela')).toBeInTheDocument()
  })

  it('renders the tagline text', () => {
    render(<App />)
    expect(screen.getByText('Share your feedback, shape the future')).toBeInTheDocument()
  })

  it('renders the Get Started button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })
})
